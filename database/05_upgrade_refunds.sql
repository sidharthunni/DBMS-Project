-- TripNest upgrade 4: booking cancellation + refund records. OKKA SARI matrame run cheyandi.
USE tripnest;

ALTER TABLE bookings ADD COLUMN cancelled_at TIMESTAMP NULL, ADD COLUMN cancel_reason VARCHAR(200);

CREATE TABLE refunds (
  refund_id        INT AUTO_INCREMENT PRIMARY KEY,
  booking_id       INT NOT NULL,
  payment_id       INT NULL,
  amount           DECIMAL(10,2) NOT NULL,
  percent_refunded INT NOT NULL,
  reason           VARCHAR(200),
  refund_ref       VARCHAR(40) NOT NULL UNIQUE,
  status           ENUM('pending','processed') NOT NULL DEFAULT 'processed',
  refunded_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
  FOREIGN KEY (payment_id) REFERENCES payments(payment_id) ON DELETE SET NULL
);

DELIMITER //

-- Booking cancel ayinappudu cancelled_at time automatic ga set avthundi
CREATE TRIGGER trg_booking_cancelled_at BEFORE UPDATE ON bookings
FOR EACH ROW
BEGIN
  IF NEW.status = 'cancelled' AND OLD.status <> 'cancelled' THEN
    SET NEW.cancelled_at = NOW();
  END IF;
END//

-- Cancellation + refund oke transaction lo.
-- Policy: travel ki 7+ rojulu undi = 100%, 2 nunchi 6 rojulu = 50%, 2 kante takkuva = refund ledu. Paid kani booking ki refund undadu.
CREATE PROCEDURE sp_cancel_booking(IN p_booking INT, IN p_user INT, IN p_reason VARCHAR(200))
BEGIN
  DECLARE v_status  VARCHAR(20);
  DECLARE v_total   DECIMAL(10,2);
  DECLARE v_date    DATE;
  DECLARE v_payment INT DEFAULT NULL;
  DECLARE v_days    INT;
  DECLARE v_pct     INT DEFAULT 0;
  DECLARE v_refund  DECIMAL(10,2) DEFAULT 0;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;

  SELECT status, total_price, travel_date INTO v_status, v_total, v_date
  FROM bookings WHERE booking_id = p_booking AND user_id = p_user FOR UPDATE;

  IF v_status IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Booking not found';
  END IF;
  IF v_status = 'cancelled' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Booking is already cancelled';
  END IF;

  SET v_days = DATEDIFF(v_date, CURDATE());
  IF v_days < 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Travel date has passed, so this booking cannot be cancelled';
  END IF;

  SELECT payment_id INTO v_payment FROM payments
  WHERE booking_id = p_booking AND status = 'success' ORDER BY payment_id DESC LIMIT 1;

  IF v_status = 'confirmed' AND v_payment IS NOT NULL THEN
    SET v_pct = CASE WHEN v_days >= 7 THEN 100 WHEN v_days >= 2 THEN 50 ELSE 0 END;
    SET v_refund = ROUND(v_total * v_pct / 100, 2);
  END IF;

  UPDATE bookings SET status = 'cancelled', cancel_reason = p_reason WHERE booking_id = p_booking;

  IF v_refund > 0 THEN
    INSERT INTO refunds (booking_id, payment_id, amount, percent_refunded, reason, refund_ref, status)
    VALUES (p_booking, v_payment, v_refund, v_pct, p_reason,
            CONCAT('RF', UNIX_TIMESTAMP(), LPAD(p_booking, 4, '0')), 'processed');
  END IF;

  INSERT INTO email_log (user_id, to_email, subject, body)
  SELECT u.user_id, u.email, 'TripNest booking cancelled',
         CONCAT('Your booking #', p_booking, ' was cancelled. Refund: $', v_refund, ' (', v_pct, '%).')
  FROM users u WHERE u.user_id = p_user;

  COMMIT;

  SELECT p_booking AS booking_id, 'cancelled' AS status, v_pct AS refund_percent,
         v_refund AS refund_amount, v_days AS days_before_travel;
END//

DELIMITER ;

SHOW TRIGGERS;
