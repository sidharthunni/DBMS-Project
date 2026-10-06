-- TripNest upgrade (Part 1). Data delete cheyadu. Okka sari matrame run cheyandi (schema.sql malli run cheyakandi).
USE tripnest;

-- Role-based login: oka user ni admin cheyadam (email marchukovachu)
ALTER TABLE users ADD COLUMN role ENUM('customer','admin') NOT NULL DEFAULT 'customer';
UPDATE users SET role = 'admin' WHERE email = 'your-admin-email@example.com';

-- Search / filter kosam indexes
CREATE INDEX idx_dest_continent ON destinations(continent);
CREATE INDEX idx_dest_price     ON destinations(price);
CREATE INDEX idx_dest_rating    ON destinations(rating);
CREATE INDEX idx_hotels_price   ON hotels(price_per_night);
CREATE INDEX idx_pkg_price      ON packages(price);

-- Payments (simulated gateway) + email log
CREATE TABLE payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  amount     DECIMAL(10,2) NOT NULL,
  method     ENUM('card','upi','netbanking') NOT NULL,
  status     ENUM('success','failed') NOT NULL DEFAULT 'success',
  txn_ref    VARCHAR(40) NOT NULL UNIQUE,
  paid_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);
CREATE TABLE email_log (
  email_id   INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  to_email   VARCHAR(100) NOT NULL,
  subject    VARCHAR(150) NOT NULL,
  body       TEXT,
  status     ENUM('queued','sent') NOT NULL DEFAULT 'sent',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Trigger: payment success ayite booking auto ga confirmed
DELIMITER //
CREATE TRIGGER trg_payment_confirm AFTER INSERT ON payments
FOR EACH ROW
BEGIN
  IF NEW.status = 'success' THEN
    UPDATE bookings SET status = 'confirmed' WHERE booking_id = NEW.booking_id;
  END IF;
END//
DELIMITER ;
