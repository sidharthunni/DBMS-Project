-- =============================================================================
-- TripNest DBMS Mini-Project - PostgreSQL 12+ / pgAdmin Schema & Seed Script
-- Database Name: tripnest
-- Architecture: 3NF Relational Model, 24 Tables, 3 Triggers (plpgsql functions),
--               2 Stored Procedures, 1 View, Constraints, Generated Columns, Indexes.
-- =============================================================================

-- Drop tables in reverse dependency order if re-running
DROP VIEW IF EXISTS v_trip_details CASCADE;
DROP TABLE IF EXISTS hotel_faqs CASCADE;
DROP TABLE IF EXISTS hotel_attractions CASCADE;
DROP TABLE IF EXISTS hotel_rules CASCADE;
DROP TABLE IF EXISTS hotel_policies CASCADE;
DROP TABLE IF EXISTS room_images CASCADE;
DROP TABLE IF EXISTS room_features CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS hotel_badges CASCADE;
DROP TABLE IF EXISTS hotel_images CASCADE;
DROP TABLE IF EXISTS hotel_amenities CASCADE;
DROP TABLE IF EXISTS amenities CASCADE;
DROP TABLE IF EXISTS email_log CASCADE;
DROP TABLE IF EXISTS refunds CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS wishlist CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS package_includes CASCADE;
DROP TABLE IF EXISTS packages CASCADE;
DROP TABLE IF EXISTS hotels CASCADE;
DROP TABLE IF EXISTS destinations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =============================================================================
-- SECTION 1: RELATIONAL TABLES (24 TABLES IN DEPENDENCY ORDER)
-- =============================================================================

-- Table 1: users
CREATE TABLE users (
  user_id       SERIAL PRIMARY KEY,
  full_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(100) NOT NULL UNIQUE,
  phone         VARCHAR(20),
  country       VARCHAR(60),
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: destinations
CREATE TABLE destinations (
  dest_id       SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  country       VARCHAR(60)  NOT NULL,
  continent     VARCHAR(30),
  style         VARCHAR(30),
  price         NUMERIC(10,2) DEFAULT 0,
  rating        NUMERIC(2,1) CHECK (rating BETWEEN 0 AND 5),
  reviews_count INT DEFAULT 0,
  best_season   VARCHAR(30),
  description   TEXT,
  img_url       VARCHAR(500),
  flag          VARCHAR(10),
  weather       VARCHAR(60),
  duration      VARCHAR(40)
);

-- Table 3: hotels
CREATE TABLE hotels (
  hotel_id        SERIAL PRIMARY KEY,
  dest_id         INT NOT NULL REFERENCES destinations(dest_id) ON DELETE CASCADE,
  name            VARCHAR(120) NOT NULL,
  stars           SMALLINT CHECK (stars BETWEEN 1 AND 5),
  price_per_night NUMERIC(10,2) NOT NULL,
  rating          NUMERIC(2,1),
  location        VARCHAR(150),
  address         VARCHAR(255),
  description     TEXT,
  latitude        NUMERIC(9,6),
  longitude       NUMERIC(9,6),
  video_url       VARCHAR(500),
  panorama_url    VARCHAR(500)
);

-- Table 4: packages
CREATE TABLE packages (
  package_id SERIAL PRIMARY KEY,
  name       VARCHAR(120) NOT NULL,
  days       INT NOT NULL,
  countries  INT DEFAULT 1,
  rating     NUMERIC(2,1),
  price      NUMERIC(10,2) NOT NULL,
  tag        VARCHAR(30),
  category   VARCHAR(30),
  img_url    VARCHAR(500)
);

-- Table 5: package_includes (1NF Normalization)
CREATE TABLE package_includes (
  package_id INT NOT NULL REFERENCES packages(package_id) ON DELETE CASCADE,
  item       VARCHAR(50) NOT NULL,
  PRIMARY KEY (package_id, item)
);

-- Table 6: trips (Generated Column & Check Constraint)
CREATE TABLE trips (
  trip_id       SERIAL PRIMARY KEY,
  user_id       INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  dest_id       INT NOT NULL REFERENCES destinations(dest_id),
  hotel_id      INT REFERENCES hotels(hotel_id) ON DELETE SET NULL,
  package_tier  VARCHAR(30),
  travelers     INT NOT NULL DEFAULT 1 CHECK (travelers > 0),
  budget        NUMERIC(10,2),
  start_date    DATE NOT NULL,
  end_date      DATE NOT NULL,
  duration_days INT GENERATED ALWAYS AS (end_date - start_date) STORED,
  status        VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'confirmed', 'cancelled')),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (end_date >= start_date)
);

-- Table 7: bookings
CREATE TABLE bookings (
  booking_id    SERIAL PRIMARY KEY,
  user_id       INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  package_id    INT NOT NULL REFERENCES packages(package_id),
  travel_date   DATE NOT NULL,
  travelers     INT NOT NULL DEFAULT 1 CHECK (travelers > 0),
  total_price   NUMERIC(10,2),
  status        VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  cancelled_at  TIMESTAMP NULL,
  cancel_reason VARCHAR(200),
  booked_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 8: reviews
CREATE TABLE reviews (
  review_id     SERIAL PRIMARY KEY,
  user_id       INT REFERENCES users(user_id) ON DELETE CASCADE,
  hotel_id      INT NOT NULL REFERENCES hotels(hotel_id) ON DELETE CASCADE,
  rating        SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT,
  reviewer_name VARCHAR(100),
  helpful       INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 9: wishlist (Many-to-Many)
CREATE TABLE wishlist (
  user_id  INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  dest_id  INT NOT NULL REFERENCES destinations(dest_id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, dest_id)
);

-- Table 10: contact_messages
CREATE TABLE contact_messages (
  msg_id     SERIAL PRIMARY KEY,
  full_name  VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL,
  phone      VARCHAR(20),
  subject    VARCHAR(150),
  message    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 11: payments
CREATE TABLE payments (
  payment_id SERIAL PRIMARY KEY,
  booking_id INT NOT NULL REFERENCES bookings(booking_id) ON DELETE CASCADE,
  amount     NUMERIC(10,2) NOT NULL,
  method     VARCHAR(20) NOT NULL CHECK (method IN ('card', 'upi', 'netbanking')),
  status     VARCHAR(20) NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failed')),
  txn_ref    VARCHAR(40) NOT NULL UNIQUE,
  paid_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 12: refunds
CREATE TABLE refunds (
  refund_id        SERIAL PRIMARY KEY,
  booking_id       INT NOT NULL REFERENCES bookings(booking_id) ON DELETE CASCADE,
  payment_id       INT REFERENCES payments(payment_id) ON DELETE SET NULL,
  amount           NUMERIC(10,2) NOT NULL,
  percent_refunded INT NOT NULL,
  reason           VARCHAR(200),
  refund_ref       VARCHAR(40) NOT NULL UNIQUE,
  status           VARCHAR(20) NOT NULL DEFAULT 'processed' CHECK (status IN ('pending', 'processed')),
  refunded_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 13: email_log
CREATE TABLE email_log (
  email_id   SERIAL PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  to_email   VARCHAR(100) NOT NULL,
  subject    VARCHAR(150) NOT NULL,
  body       TEXT,
  status     VARCHAR(20) NOT NULL DEFAULT 'sent' CHECK (status IN ('queued', 'sent')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 14: amenities
CREATE TABLE amenities (
  amenity_id SERIAL PRIMARY KEY,
  code       VARCHAR(30) NOT NULL,
  label      VARCHAR(60) NOT NULL UNIQUE
);

-- Table 15: hotel_amenities
CREATE TABLE hotel_amenities (
  hotel_id   INT NOT NULL REFERENCES hotels(hotel_id) ON DELETE CASCADE,
  amenity_id INT NOT NULL REFERENCES amenities(amenity_id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (hotel_id, amenity_id)
);

-- Table 16: hotel_images
CREATE TABLE hotel_images (
  image_id   SERIAL PRIMARY KEY,
  hotel_id   INT NOT NULL REFERENCES hotels(hotel_id) ON DELETE CASCADE,
  url        VARCHAR(500) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

-- Table 17: hotel_badges
CREATE TABLE hotel_badges (
  hotel_id   INT NOT NULL REFERENCES hotels(hotel_id) ON DELETE CASCADE,
  badge      VARCHAR(40) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (hotel_id, badge)
);

-- Table 18: rooms
CREATE TABLE rooms (
  room_id        INT PRIMARY KEY,
  hotel_id       INT NOT NULL REFERENCES hotels(hotel_id) ON DELETE CASCADE,
  name           VARCHAR(100) NOT NULL,
  size_label     VARCHAR(20),
  capacity_label VARCHAR(30),
  bed            VARCHAR(60),
  price          NUMERIC(10,2) NOT NULL,
  cancellation   VARCHAR(120),
  sort_order     INT NOT NULL DEFAULT 0
);

-- Table 19: room_features
CREATE TABLE room_features (
  room_id    INT NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
  feature    VARCHAR(60) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (room_id, feature)
);

-- Table 20: room_images
CREATE TABLE room_images (
  image_id   SERIAL PRIMARY KEY,
  room_id    INT NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
  url        VARCHAR(500) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

-- Table 21: hotel_policies
CREATE TABLE hotel_policies (
  policy_id    SERIAL PRIMARY KEY,
  hotel_id     INT NOT NULL REFERENCES hotels(hotel_id) ON DELETE CASCADE,
  label        VARCHAR(40) NOT NULL,
  policy_value VARCHAR(80) NOT NULL,
  sort_order   INT NOT NULL DEFAULT 0
);

-- Table 22: hotel_rules
CREATE TABLE hotel_rules (
  rule_id    SERIAL PRIMARY KEY,
  hotel_id   INT NOT NULL REFERENCES hotels(hotel_id) ON DELETE CASCADE,
  rule_text  VARCHAR(200) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

-- Table 23: hotel_attractions
CREATE TABLE hotel_attractions (
  attraction_id SERIAL PRIMARY KEY,
  hotel_id      INT NOT NULL REFERENCES hotels(hotel_id) ON DELETE CASCADE,
  icon          VARCHAR(30) NOT NULL,
  name          VARCHAR(100) NOT NULL,
  distance      VARCHAR(30) NOT NULL,
  sort_order    INT NOT NULL DEFAULT 0
);

-- Table 24: hotel_faqs
CREATE TABLE hotel_faqs (
  faq_id     SERIAL PRIMARY KEY,
  hotel_id   INT NOT NULL REFERENCES hotels(hotel_id) ON DELETE CASCADE,
  question   VARCHAR(200) NOT NULL,
  answer     TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

-- =============================================================================
-- SECTION 2: INDEXES
-- =============================================================================

CREATE INDEX idx_pg_dest_continent ON destinations(continent);
CREATE INDEX idx_pg_dest_price     ON destinations(price);
CREATE INDEX idx_pg_dest_rating    ON destinations(rating);
CREATE INDEX idx_pg_hotels_price   ON hotels(price_per_night);
CREATE INDEX idx_pg_pkg_price      ON packages(price);

-- =============================================================================
-- SECTION 3: TRIGGERS (PL/PGSQL)
-- =============================================================================

-- Trigger 1: Auto Calculate Booking Total Price
CREATE OR REPLACE FUNCTION fn_trg_booking_total() RETURNS TRIGGER AS 30
BEGIN
  SELECT price * NEW.travelers INTO NEW.total_price
  FROM packages WHERE package_id = NEW.package_id;
  RETURN NEW;
END;
30 LANGUAGE plpgsql;

CREATE TRIGGER trg_booking_total
BEFORE INSERT ON bookings
FOR EACH ROW
EXECUTE FUNCTION fn_trg_booking_total();

-- Trigger 2: Auto Confirm Booking on Payment
CREATE OR REPLACE FUNCTION fn_trg_payment_confirm() RETURNS TRIGGER AS 30
BEGIN
  IF NEW.status = 'success' THEN
    UPDATE bookings SET status = 'confirmed' WHERE booking_id = NEW.booking_id;
  END IF;
  RETURN NEW;
END;
30 LANGUAGE plpgsql;

CREATE TRIGGER trg_payment_confirm
AFTER INSERT ON payments
FOR EACH ROW
EXECUTE FUNCTION fn_trg_payment_confirm();

-- Trigger 3: Track Cancellation Timestamp
CREATE OR REPLACE FUNCTION fn_trg_booking_cancelled_at() RETURNS TRIGGER AS 30
BEGIN
  IF NEW.status = 'cancelled' AND OLD.status <> 'cancelled' THEN
    NEW.cancelled_at := CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
30 LANGUAGE plpgsql;

CREATE TRIGGER trg_booking_cancelled_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION fn_trg_booking_cancelled_at();

-- =============================================================================
-- SECTION 4: STORED PROCEDURES (TRANSACTION CONTROL)
-- =============================================================================

-- Procedure 1: Package Booking
CREATE OR REPLACE PROCEDURE sp_book_package(
  p_user INT,
  p_package INT,
  p_date DATE,
  p_travelers INT
)
LANGUAGE plpgsql
AS 30
BEGIN
  INSERT INTO bookings (user_id, package_id, travel_date, travelers)
  VALUES (p_user, p_package, p_date, p_travelers);
END;
30;

-- Procedure 2: Cancel Booking with Dynamic Refund Policy
CREATE OR REPLACE PROCEDURE sp_cancel_booking(
  p_booking INT,
  p_user INT,
  p_reason VARCHAR(200)
)
LANGUAGE plpgsql
AS 30
DECLARE
  v_status  VARCHAR(20);
  v_total   NUMERIC(10,2);
  v_date    DATE;
  v_payment INT := NULL;
  v_days    INT;
  v_pct     INT := 0;
  v_refund  NUMERIC(10,2) := 0;
BEGIN
  SELECT status, total_price, travel_date INTO v_status, v_total, v_date
  FROM bookings
  WHERE booking_id = p_booking AND user_id = p_user
  FOR UPDATE;

  IF v_status IS NULL THEN
    RAISE EXCEPTION 'Booking not found';
  END IF;

  IF v_status = 'cancelled' THEN
    RAISE EXCEPTION 'Booking is already cancelled';
  END IF;

  v_days := v_date - CURRENT_DATE;
  IF v_days < 0 THEN
    RAISE EXCEPTION 'Travel date has passed, so this booking cannot be cancelled';
  END IF;

  SELECT payment_id INTO v_payment FROM payments
  WHERE booking_id = p_booking AND status = 'success'
  ORDER BY payment_id DESC LIMIT 1;

  IF v_status = 'confirmed' AND v_payment IS NOT NULL THEN
    IF v_days >= 7 THEN
      v_pct := 100;
    ELSIF v_days >= 2 THEN
      v_pct := 50;
    ELSE
      v_pct := 0;
    END IF;
    v_refund := ROUND(v_total * v_pct / 100.0, 2);
  END IF;

  UPDATE bookings
  SET status = 'cancelled', cancel_reason = p_reason
  WHERE booking_id = p_booking;

  IF v_refund > 0 THEN
    INSERT INTO refunds (booking_id, payment_id, amount, percent_refunded, reason, refund_ref, status)
    VALUES (p_booking, v_payment, v_refund, v_pct, p_reason,
            'RF' || EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::BIGINT || LPAD(p_booking::TEXT, 4, '0'), 'processed');
  END IF;

  INSERT INTO email_log (user_id, to_email, subject, body)
  SELECT u.user_id, u.email, 'TripNest booking cancelled',
         'Your booking #' || p_booking || ' was cancelled. Refund: $' || v_refund || ' (' || v_pct || '%).'
  FROM users u WHERE u.user_id = p_user;
END;
30;

-- =============================================================================
-- SECTION 5: VIEW
-- =============================================================================

CREATE VIEW v_trip_details AS
SELECT t.trip_id, u.full_name, d.name AS destination, d.country,
       h.name AS hotel, t.package_tier AS package_name,
       t.travelers, t.budget, t.start_date, t.end_date,
       t.duration_days, t.status
FROM trips t
JOIN users u        ON t.user_id = u.user_id
JOIN destinations d ON t.dest_id = d.dest_id
LEFT JOIN hotels h  ON t.hotel_id = h.hotel_id;

-- =============================================================================
-- SECTION 6: INITIAL SEED DATA
-- =============================================================================

INSERT INTO users (full_name, email, phone, country, password_hash, role) VALUES
('System Administrator', 'admin@tripnest.com', '+1-555-0100', 'USA', 'b0', 'admin'),
('John Doe', 'john@example.com', '+1-555-0199', 'USA', 'b0/lb2zOs6wznehHaTRD8fHm', 'customer');

INSERT INTO destinations (name, country, continent, style, price, rating, reviews_count, best_season, description, img_url, flag, weather, duration) VALUES
('Paris','France','europe','Luxury',850,4.9,1240,'Apr - Oct','The City of Light with romantic Eiffel views, Louvre art, and fine gastronomy.','https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80','FR','18C Mild','5 Days'),
('Rome','Italy','europe','Historical',780,4.8,980,'May - Sep','Eternal city filled with ancient Colosseum ruins, Vatican treasures, and gelato.','https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80','IT','24C Warm','4 Days'),
('Santorini','Greece','europe','Honeymoon',1100,4.9,1510,'May - Oct','Whitewashed cliffside villas overlooking deep blue Aegean caldera waters.','https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80','GR','26C Sunny','6 Days'),
('Swiss Alps','Switzerland','europe','Mountains',1299,5.0,890,'Dec - Mar','Snow-capped alpine peaks, luxury ski chalets, and scenic mountain trains.','https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80','CH','-2C Snow','7 Days'),
('Venice','Italy','europe','Honeymoon',820,4.8,760,'Apr - Jun','Enchanting waterways, historic gondola rides, and grand Italian palaces.','https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=600&q=80','IT','21C Mild','3 Days'),
('Florence','Italy','europe','Historical',760,4.8,620,'May - Sep','Cradle of Renaissance art featuring Michelangelo Duomo and Tuscan winelands.','https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=600&q=80','IT','23C Sunny','4 Days'),
('London','United Kingdom','europe','Historical',890,4.8,1100,'May - Sep','Royal palaces, Big Ben, West End theatre shows, and world-class museums.','https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80','UK','19C Mild','5 Days'),
('Barcelona','Spain','europe','Beach',740,4.8,930,'May - Oct','Mediterranean coast city famed for Gaudi architecture, beaches, and tapas bars.','https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=600&q=80','ES','25C Sunny','5 Days'),
('Bali','Indonesia','asia','Honeymoon',620,4.9,1850,'Apr - Oct','Island of the Gods featuring jungle Ubud villas, rice terraces, and surf beaches.','https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80','ID','28C Warm','7 Days'),
('Kyoto','Japan','asia','Historical',940,4.9,1310,'Mar - May','Japan cultural heart with thousand-year temples, geishas, and cherry blossoms.','https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80','JP','19C Spring','5 Days'),
('Tokyo','Japan','asia','Luxury',990,4.9,1620,'Oct - Dec','Futuristic neon skyline met with serene ancient Shinto shrines and sushi spots.','https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80','JP','16C Clear','6 Days'),
('Maldives','Maldives','asia','Luxury',1850,5.0,1420,'Nov - Apr','Private overwater bungalows suspended over crystal bioluminescent ocean lagoons.','https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80','MV','29C Sunny','5 Days'),
('Dubai','UAE','asia','Luxury',920,4.9,1180,'Nov - Mar','Ultramodern skyscrapers, luxury desert glamping safaris, and high-end shopping.','https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80','AE','27C Sunny','5 Days'),
('New York','USA','north-america','Luxury',890,4.8,1400,'Apr - Jun','Times Square lights, Broadway shows, Central Park strolls, and world-class dining.','https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80','US','22C Clear','5 Days'),
('Banff','Canada','north-america','Nature',890,4.9,920,'Jun - Aug','Turquoise glacial lakes, Canadian Rocky mountain wilderness, and pine forests.','https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80','CA','20C Fresh','6 Days'),
('Machu Picchu','Peru','south-america','Historical',950,5.0,1120,'Apr - Oct','Ancient Incan sanctuary resting high among Andes cloud forest peaks.','https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=600&q=80','PE','18C Mild','5 Days'),
('Rio de Janeiro','Brazil','south-america','Beach',790,4.8,880,'Dec - Mar','Christ the Redeemer mountain views, Copacabana sands, and Carnival rhythm.','https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=600&q=80','BR','29C Sunny','6 Days'),
('Serengeti','Tanzania','africa','Wildlife',1350,5.0,790,'Jun - Oct','Great Wildebeest Migration safari with Big Five game drives and luxury lodges.','https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80','TZ','26C Dry','7 Days'),
('Sydney','Australia','oceania','Beach',980,4.9,1150,'Sep - Nov','Harbour Opera House vistas, Bondi surf breaks, and coastal cliffwalks.','https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80','AU','23C Sunny','6 Days');

INSERT INTO packages (name, days, countries, rating, price, tag, category, img_url) VALUES
('Santorini Sunset Escape',7,1,4.9,2450,'Best Seller','beach','https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80'),
('Swiss Alps Summit Trail',9,1,4.8,3200,'Adventure','mountain','https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80'),
('Serengeti Safari Trail',6,2,4.9,3400,'Wildlife','safari','https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80'),
('Bali Wellness Retreat',8,1,4.7,1320,'Relax','honeymoon','https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80'),
('Maldives Overwater Bliss',5,1,5.0,4100,'Luxury','luxury','https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80'),
('Kyoto Cultural Journey',10,1,4.8,2680,'Culture','family','https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80'),
('Patagonia Trekking Expedition',12,2,4.9,3850,'Adventure','adventure','https://images.unsplash.com/photo-1478827387698-1527781a4887?w=600&q=80'),
('Amalfi Coast Getaway',6,1,4.7,2200,'Romantic','honeymoon','https://images.unsplash.com/photo-1533105045747-b17aacd6d0ea?w=600&q=80'),
('Great Barrier Reef Cruise',8,1,4.8,2780,'Cruise','cruise','https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80');

INSERT INTO package_includes (package_id, item) VALUES
(1,'Flights'), (1,'Hotel'), (1,'Meals'),
(2,'Flights'), (2,'Guide'), (2,'Transfers'),
(3,'Flights'), (3,'Guide'), (3,'Meals'),
(4,'Hotel'), (4,'Meals'), (4,'Spa'),
(5,'Flights'), (5,'Villa'), (5,'Meals'),
(6,'Flights'), (6,'Guide'), (6,'Hotel'),
(7,'Flights'), (7,'Guide'), (7,'Camp Gear'),
(8,'Hotel'), (8,'Meals'), (8,'Transfers'),
(9,'Flights'), (9,'Cabin'), (9,'Meals');

INSERT INTO amenities (code, label) VALUES
('wifi', 'Free Wi-Fi'),
('pool', 'Swimming Pool'),
('spa', 'Spa & Wellness'),
('restaurant', 'Restaurant & Bar'),
('gym', 'Fitness Centre'),
('parking', 'Free Parking');

INSERT INTO hotels (dest_id, name, stars, price_per_night, rating, location, address, description, latitude, longitude, video_url, panorama_url)
SELECT dest_id, 'Azure Cliff Resort', 5, 310, 4.9,
  'Oia, Santorini, Greece', 'Oia, Santorini, Greece - guest entrance on main road',
  'Azure Cliff Resort offers a memorable stay in Oia, Santorini, Greece, with comfortable rooms, friendly service and easy access to the best local sights.',
  36.4618, 25.3753, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=2400&q=80'
FROM destinations WHERE name = 'Santorini' LIMIT 1;

INSERT INTO hotels (dest_id, name, stars, price_per_night, rating, location, address, description, latitude, longitude, video_url, panorama_url)
SELECT dest_id, 'The Nest Boutique Hotel', 4, 190, 4.7,
  'Trastevere, Rome, Italy', 'Trastevere, Rome, Italy - guest entrance on main road',
  'The Nest Boutique Hotel offers a memorable stay in Trastevere, Rome, Italy, with comfortable rooms, friendly service and easy access to the best local sights.',
  41.8894, 12.4700, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=2400&q=80'
FROM destinations WHERE name = 'Rome' LIMIT 1;

INSERT INTO hotels (dest_id, name, stars, price_per_night, rating, location, address, description, latitude, longitude, video_url, panorama_url)
SELECT dest_id, 'Harbor View Suites', 4, 245, 4.6,
  'Le Marais, Paris, France', 'Le Marais, Paris, France - guest entrance on main road',
  'Harbor View Suites offers a memorable stay in Le Marais, Paris, France, with comfortable rooms, friendly service and easy access to the best local sights.',
  48.8566, 2.3522, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2400&q=80'
FROM destinations WHERE name = 'Paris' LIMIT 1;

INSERT INTO hotels (dest_id, name, stars, price_per_night, rating, location, address, description, latitude, longitude, video_url, panorama_url)
SELECT dest_id, 'Alpine Summit Lodge', 4, 260, 4.8,
  'Zermatt, Switzerland', 'Zermatt, Switzerland - guest entrance on main road',
  'Alpine Summit Lodge offers a memorable stay in Zermatt, Switzerland, with comfortable rooms, friendly service and easy access to the best local sights.',
  46.0207, 7.7491, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=2400&q=80'
FROM destinations WHERE name = 'Swiss Alps' LIMIT 1;

INSERT INTO hotels (dest_id, name, stars, price_per_night, rating, location, address, description, latitude, longitude, video_url, panorama_url)
SELECT dest_id, 'Bali Jungle Villas', 4, 150, 4.7,
  'Ubud, Bali, Indonesia', 'Ubud, Bali, Indonesia - guest entrance on main road',
  'Bali Jungle Villas offers a memorable stay in Ubud, Bali, Indonesia, with comfortable rooms, friendly service and easy access to the best local sights.',
  -8.5069, 115.2625, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2400&q=80'
FROM destinations WHERE name LIKE 'Bali%' LIMIT 1;

INSERT INTO hotels (dest_id, name, stars, price_per_night, rating, location, address, description, latitude, longitude, video_url, panorama_url)
SELECT dest_id, 'Maldives Coral Retreat', 5, 520, 5.0,
  'Baa Atoll, Maldives', 'Baa Atoll, Maldives - guest entrance on main road',
  'Maldives Coral Retreat offers a memorable stay in Baa Atoll, Maldives, with comfortable rooms, friendly service and easy access to the best local sights.',
  5.1667, 73.0000, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=2400&q=80'
FROM destinations WHERE name LIKE 'Maldives%' LIMIT 1;

-- Seed Hotel Metadata
INSERT INTO hotel_images (hotel_id, url, sort_order) VALUES (1, 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80', 0), (1, 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80', 1), (1, 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80', 2), (1, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80', 3);
INSERT INTO hotel_badges (hotel_id, badge, sort_order) VALUES (1, 'Cliffside', 0), (1, 'Infinity Pool', 1), (1, 'Top Rated', 2);
INSERT INTO hotel_amenities (hotel_id, amenity_id, sort_order) VALUES (1, (SELECT amenity_id FROM amenities WHERE label = 'Free Wi-Fi'), 0), (1, (SELECT amenity_id FROM amenities WHERE label = 'Swimming Pool'), 1), (1, (SELECT amenity_id FROM amenities WHERE label = 'Spa & Wellness'), 2), (1, (SELECT amenity_id FROM amenities WHERE label = 'Restaurant & Bar'), 3), (1, (SELECT amenity_id FROM amenities WHERE label = 'Fitness Centre'), 4), (1, (SELECT amenity_id FROM amenities WHERE label = 'Free Parking'), 5);
INSERT INTO rooms (room_id, hotel_id, name, size_label, capacity_label, bed, price, cancellation, sort_order) VALUES (11, 1, 'Deluxe Room', '32 m²', '2 guests', '1 King bed', 310, 'Free cancellation until 48h before', 0);
INSERT INTO room_features (room_id, feature, sort_order) VALUES (11, 'Free Wi-Fi', 0), (11, 'Air conditioning', 1), (11, 'Breakfast option', 2);
INSERT INTO room_images (room_id, url, sort_order) VALUES (11, 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80', 0), (11, 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80', 1);
INSERT INTO rooms (room_id, hotel_id, name, size_label, capacity_label, bed, price, cancellation, sort_order) VALUES (12, 1, 'Premium Suite', '48 m²', '3 guests', '1 King + Sofa bed', 496, 'Free cancellation until 72h before', 1);
INSERT INTO room_features (room_id, feature, sort_order) VALUES (12, 'Free Wi-Fi', 0), (12, 'Air conditioning', 1), (12, 'Breakfast option', 2);
INSERT INTO room_images (room_id, url, sort_order) VALUES (12, 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80', 0), (12, 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80', 1);
INSERT INTO rooms (room_id, hotel_id, name, size_label, capacity_label, bed, price, cancellation, sort_order) VALUES (13, 1, 'Family Villa', '70 m²', '5 guests', '2 Queen beds', 682, 'Non-refundable', 2);
INSERT INTO room_features (room_id, feature, sort_order) VALUES (13, 'Free Wi-Fi', 0), (13, 'Air conditioning', 1), (13, 'Breakfast option', 2);
INSERT INTO room_images (room_id, url, sort_order) VALUES (13, 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80', 0), (13, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80', 1);
INSERT INTO hotel_policies (hotel_id, label, policy_value, sort_order) VALUES (1, 'Check-in', '2:00 PM', 0), (1, 'Check-out', '11:00 AM', 1), (1, 'Pets', 'On request', 2);
INSERT INTO hotel_rules (hotel_id, rule_text, sort_order) VALUES (1, 'No smoking inside rooms', 0), (1, 'Quiet hours 10 PM – 7 AM', 1), (1, 'Valid photo ID required at check-in', 2);
INSERT INTO hotel_attractions (hotel_id, icon, name, distance, sort_order) VALUES (1, 'pin', 'City Centre', '1.2 km', 0), (1, 'beach', 'Main Viewpoint', '2.5 km', 1), (1, 'airport', 'Nearest Airport', '18 km', 2);
INSERT INTO hotel_faqs (hotel_id, question, answer, sort_order) VALUES (1, 'Is breakfast included?', 'Breakfast is available and can be added to any room at booking.', 0), (1, 'Is airport pickup available?', 'Yes, airport transfers can be arranged on request for an extra charge.', 1), (1, 'Can I cancel my booking?', 'Most rooms allow free cancellation. Check the policy shown on each room.', 2);
INSERT INTO reviews (user_id, hotel_id, rating, comment, reviewer_name, helpful, created_at) VALUES (NULL, 1, 5, 'Stunning stay. Staff went out of their way and the views were unreal.', 'Ananya R.', 3, (CURRENT_TIMESTAMP - INTERVAL '1 month')), (NULL, 1, 5, 'Spotless rooms, great breakfast and a perfect location.', 'Michael T.', 5, (CURRENT_TIMESTAMP - INTERVAL '2 month')), (NULL, 1, 4, 'Lovely hotel overall. Check-in was slow but everything else was great.', 'Sofia L.', 7, (CURRENT_TIMESTAMP - INTERVAL '3 month')), (NULL, 1, 4, 'Good value for money and very comfortable beds.', 'Rahul K.', 9, (CURRENT_TIMESTAMP - INTERVAL '4 month')), (NULL, 1, 5, 'One of the best hotels we have stayed at. Will be back.', 'Emma W.', 11, (CURRENT_TIMESTAMP - INTERVAL '5 month')), (NULL, 1, 3, 'Nice property but a bit noisy in the evenings.', 'David P.', 13, (CURRENT_TIMESTAMP - INTERVAL '6 month'));

-- ===== Hotel 2: The Nest Boutique Hotel =====
INSERT INTO hotel_images (hotel_id, url, sort_order) VALUES (2, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80', 0), (2, 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80', 1), (2, 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80', 2), (2, 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80', 3);
INSERT INTO hotel_badges (hotel_id, badge, sort_order) VALUES (2, 'Boutique', 0), (2, 'City Centre', 1);
INSERT INTO hotel_amenities (hotel_id, amenity_id, sort_order) VALUES (2, (SELECT amenity_id FROM amenities WHERE label = 'Free Wi-Fi'), 0), (2, (SELECT amenity_id FROM amenities WHERE label = 'Swimming Pool'), 1), (2, (SELECT amenity_id FROM amenities WHERE label = 'Spa & Wellness'), 2), (2, (SELECT amenity_id FROM amenities WHERE label = 'Restaurant & Bar'), 3), (2, (SELECT amenity_id FROM amenities WHERE label = 'Fitness Centre'), 4), (2, (SELECT amenity_id FROM amenities WHERE label = 'Free Parking'), 5);
INSERT INTO rooms (room_id, hotel_id, name, size_label, capacity_label, bed, price, cancellation, sort_order) VALUES (21, 2, 'Deluxe Room', '32 m²', '2 guests', '1 King bed', 190, 'Free cancellation until 48h before', 0);
INSERT INTO room_features (room_id, feature, sort_order) VALUES (21, 'Free Wi-Fi', 0), (21, 'Air conditioning', 1), (21, 'Breakfast option', 2);
INSERT INTO room_images (room_id, url, sort_order) VALUES (21, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80', 0), (21, 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80', 1);
INSERT INTO rooms (room_id, hotel_id, name, size_label, capacity_label, bed, price, cancellation, sort_order) VALUES (22, 2, 'Premium Suite', '48 m²', '3 guests', '1 King + Sofa bed', 304, 'Free cancellation until 72h before', 1);
INSERT INTO room_features (room_id, feature, sort_order) VALUES (22, 'Free Wi-Fi', 0), (22, 'Air conditioning', 1), (22, 'Breakfast option', 2);
INSERT INTO room_images (room_id, url, sort_order) VALUES (22, 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80', 0), (22, 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80', 1);
INSERT INTO rooms (room_id, hotel_id, name, size_label, capacity_label, bed, price, cancellation, sort_order) VALUES (23, 2, 'Family Villa', '70 m²', '5 guests', '2 Queen beds', 418, 'Non-refundable', 2);
INSERT INTO room_features (room_id, feature, sort_order) VALUES (23, 'Free Wi-Fi', 0), (23, 'Air conditioning', 1), (23, 'Breakfast option', 2);
INSERT INTO room_images (room_id, url, sort_order) VALUES (23, 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80', 0), (23, 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80', 1);
INSERT INTO hotel_policies (hotel_id, label, policy_value, sort_order) VALUES (2, 'Check-in', '2:00 PM', 0), (2, 'Check-out', '11:00 AM', 1), (2, 'Pets', 'On request', 2);
INSERT INTO hotel_rules (hotel_id, rule_text, sort_order) VALUES (2, 'No smoking inside rooms', 0), (2, 'Quiet hours 10 PM – 7 AM', 1), (2, 'Valid photo ID required at check-in', 2);
INSERT INTO hotel_attractions (hotel_id, icon, name, distance, sort_order) VALUES (2, 'pin', 'City Centre', '1.2 km', 0), (2, 'beach', 'Main Viewpoint', '2.5 km', 1), (2, 'airport', 'Nearest Airport', '18 km', 2);
INSERT INTO hotel_faqs (hotel_id, question, answer, sort_order) VALUES (2, 'Is breakfast included?', 'Breakfast is available and can be added to any room at booking.', 0), (2, 'Is airport pickup available?', 'Yes, airport transfers can be arranged on request for an extra charge.', 1), (2, 'Can I cancel my booking?', 'Most rooms allow free cancellation. Check the policy shown on each room.', 2);
INSERT INTO reviews (user_id, hotel_id, rating, comment, reviewer_name, helpful, created_at) VALUES (NULL, 2, 5, 'Stunning stay. Staff went out of their way and the views were unreal.', 'Ananya R.', 3, (CURRENT_TIMESTAMP - INTERVAL '1 month')), (NULL, 2, 5, 'Spotless rooms, great breakfast and a perfect location.', 'Michael T.', 5, (CURRENT_TIMESTAMP - INTERVAL '2 month')), (NULL, 2, 4, 'Lovely hotel overall. Check-in was slow but everything else was great.', 'Sofia L.', 7, (CURRENT_TIMESTAMP - INTERVAL '3 month')), (NULL, 2, 4, 'Good value for money and very comfortable beds.', 'Rahul K.', 9, (CURRENT_TIMESTAMP - INTERVAL '4 month')), (NULL, 2, 5, 'One of the best hotels we have stayed at. Will be back.', 'Emma W.', 11, (CURRENT_TIMESTAMP - INTERVAL '5 month')), (NULL, 2, 3, 'Nice property but a bit noisy in the evenings.', 'David P.', 13, (CURRENT_TIMESTAMP - INTERVAL '6 month'));

-- ===== Hotel 3: Harbor View Suites =====
INSERT INTO hotel_images (hotel_id, url, sort_order) VALUES (3, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80', 0), (3, 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80', 1), (3, 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80', 2), (3, 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80', 3);
INSERT INTO hotel_badges (hotel_id, badge, sort_order) VALUES (3, 'Suites', 0), (3, 'Romantic', 1);
INSERT INTO hotel_amenities (hotel_id, amenity_id, sort_order) VALUES (3, (SELECT amenity_id FROM amenities WHERE label = 'Free Wi-Fi'), 0), (3, (SELECT amenity_id FROM amenities WHERE label = 'Swimming Pool'), 1), (3, (SELECT amenity_id FROM amenities WHERE label = 'Spa & Wellness'), 2), (3, (SELECT amenity_id FROM amenities WHERE label = 'Restaurant & Bar'), 3), (3, (SELECT amenity_id FROM amenities WHERE label = 'Fitness Centre'), 4), (3, (SELECT amenity_id FROM amenities WHERE label = 'Free Parking'), 5);
INSERT INTO rooms (room_id, hotel_id, name, size_label, capacity_label, bed, price, cancellation, sort_order) VALUES (31, 3, 'Deluxe Room', '32 m²', '2 guests', '1 King bed', 245, 'Free cancellation until 48h before', 0);
INSERT INTO room_features (room_id, feature, sort_order) VALUES (31, 'Free Wi-Fi', 0), (31, 'Air conditioning', 1), (31, 'Breakfast option', 2);
INSERT INTO room_images (room_id, url, sort_order) VALUES (31, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80', 0), (31, 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80', 1);
INSERT INTO rooms (room_id, hotel_id, name, size_label, capacity_label, bed, price, cancellation, sort_order) VALUES (32, 3, 'Premium Suite', '48 m²', '3 guests', '1 King + Sofa bed', 392, 'Free cancellation until 72h before', 1);
INSERT INTO room_features (room_id, feature, sort_order) VALUES (32, 'Free Wi-Fi', 0), (32, 'Air conditioning', 1), (32, 'Breakfast option', 2);
INSERT INTO room_images (room_id, url, sort_order) VALUES (32, 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80', 0), (32, 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80', 1);
INSERT INTO rooms (room_id, hotel_id, name, size_label, capacity_label, bed, price, cancellation, sort_order) VALUES (33, 3, 'Family Villa', '70 m²', '5 guests', '2 Queen beds', 539, 'Non-refundable', 2);
INSERT INTO room_features (room_id, feature, sort_order) VALUES (33, 'Free Wi-Fi', 0), (33, 'Air conditioning', 1), (33, 'Breakfast option', 2);
INSERT INTO room_images (room_id, url, sort_order) VALUES (33, 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80', 0), (33, 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80', 1);
INSERT INTO hotel_policies (hotel_id, label, policy_value, sort_order) VALUES (3, 'Check-in', '2:00 PM', 0), (3, 'Check-out', '11:00 AM', 1), (3, 'Pets', 'On request', 2);
INSERT INTO hotel_rules (hotel_id, rule_text, sort_order) VALUES (3, 'No smoking inside rooms', 0), (3, 'Quiet hours 10 PM – 7 AM', 1), (3, 'Valid photo ID required at check-in', 2);
INSERT INTO hotel_attractions (hotel_id, icon, name, distance, sort_order) VALUES (3, 'pin', 'City Centre', '1.2 km', 0), (3, 'beach', 'Main Viewpoint', '2.5 km', 1), (3, 'airport', 'Nearest Airport', '18 km', 2);
INSERT INTO hotel_faqs (hotel_id, question, answer, sort_order) VALUES (3, 'Is breakfast included?', 'Breakfast is available and can be added to any room at booking.', 0), (3, 'Is airport pickup available?', 'Yes, airport transfers can be arranged on request for an extra charge.', 1), (3, 'Can I cancel my booking?', 'Most rooms allow free cancellation. Check the policy shown on each room.', 2);
INSERT INTO reviews (user_id, hotel_id, rating, comment, reviewer_name, helpful, created_at) VALUES (NULL, 3, 5, 'Stunning stay. Staff went out of their way and the views were unreal.', 'Ananya R.', 3, (CURRENT_TIMESTAMP - INTERVAL '1 month')), (NULL, 3, 5, 'Spotless rooms, great breakfast and a perfect location.', 'Michael T.', 5, (CURRENT_TIMESTAMP - INTERVAL '2 month')), (NULL, 3, 4, 'Lovely hotel overall. Check-in was slow but everything else was great.', 'Sofia L.', 7, (CURRENT_TIMESTAMP - INTERVAL '3 month')), (NULL, 3, 4, 'Good value for money and very comfortable beds.', 'Rahul K.', 9, (CURRENT_TIMESTAMP - INTERVAL '4 month')), (NULL, 3, 5, 'One of the best hotels we have stayed at. Will be back.', 'Emma W.', 11, (CURRENT_TIMESTAMP - INTERVAL '5 month')), (NULL, 3, 3, 'Nice property but a bit noisy in the evenings.', 'David P.', 13, (CURRENT_TIMESTAMP - INTERVAL '6 month'));

-- ===== Hotel 4: Alpine Summit Lodge =====
INSERT INTO hotel_images (hotel_id, url, sort_order) VALUES (4, 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80', 0), (4, 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80', 1), (4, 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80', 2), (4, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80', 3);
INSERT INTO hotel_badges (hotel_id, badge, sort_order) VALUES (4, 'Ski-in Ski-out', 0), (4, 'Mountain View', 1);
INSERT INTO hotel_amenities (hotel_id, amenity_id, sort_order) VALUES (4, (SELECT amenity_id FROM amenities WHERE label = 'Free Wi-Fi'), 0), (4, (SELECT amenity_id FROM amenities WHERE label = 'Swimming Pool'), 1), (4, (SELECT amenity_id FROM amenities WHERE label = 'Spa & Wellness'), 2), (4, (SELECT amenity_id FROM amenities WHERE label = 'Restaurant & Bar'), 3), (4, (SELECT amenity_id FROM amenities WHERE label = 'Fitness Centre'), 4), (4, (SELECT amenity_id FROM amenities WHERE label = 'Free Parking'), 5);
INSERT INTO rooms (room_id, hotel_id, name, size_label, capacity_label, bed, price, cancellation, sort_order) VALUES (41, 4, 'Deluxe Room', '32 m²', '2 guests', '1 King bed', 260, 'Free cancellation until 48h before', 0);
INSERT INTO room_features (room_id, feature, sort_order) VALUES (41, 'Free Wi-Fi', 0), (41, 'Air conditioning', 1), (41, 'Breakfast option', 2);
INSERT INTO room_images (room_id, url, sort_order) VALUES (41, 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80', 0), (41, 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80', 1);
INSERT INTO rooms (room_id, hotel_id, name, size_label, capacity_label, bed, price, cancellation, sort_order) VALUES (42, 4, 'Premium Suite', '48 m²', '3 guests', '1 King + Sofa bed', 416, 'Free cancellation until 72h before', 1);
INSERT INTO room_features (room_id, feature, sort_order) VALUES (42, 'Free Wi-Fi', 0), (42, 'Air conditioning', 1), (42, 'Breakfast option', 2);
INSERT INTO room_images (room_id, url, sort_order) VALUES (42, 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80', 0), (42, 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80', 1);
INSERT INTO rooms (room_id, hotel_id, name, size_label, capacity_label, bed, price, cancellation, sort_order) VALUES (43, 4, 'Family Villa', '70 m²', '5 guests', '2 Queen beds', 572, 'Non-refundable', 2);
INSERT INTO room_features (room_id, feature, sort_order) VALUES (43, 'Free Wi-Fi', 0), (43, 'Air conditioning', 1), (43, 'Breakfast option', 2);
INSERT INTO room_images (room_id, url, sort_order) VALUES (43, 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80', 0), (43, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80', 1);
INSERT INTO hotel_policies (hotel_id, label, policy_value, sort_order) VALUES (4, 'Check-in', '2:00 PM', 0), (4, 'Check-out', '11:00 AM', 1), (4, 'Pets', 'On request', 2);
INSERT INTO hotel_rules (hotel_id, rule_text, sort_order) VALUES (4, 'No smoking inside rooms', 0), (4, 'Quiet hours 10 PM – 7 AM', 1), (4, 'Valid photo ID required at check-in', 2);
INSERT INTO hotel_attractions (hotel_id, icon, name, distance, sort_order) VALUES (4, 'pin', 'City Centre', '1.2 km', 0), (4, 'beach', 'Main Viewpoint', '2.5 km', 1), (4, 'airport', 'Nearest Airport', '18 km', 2);
INSERT INTO hotel_faqs (hotel_id, question, answer, sort_order) VALUES (4, 'Is breakfast included?', 'Breakfast is available and can be added to any room at booking.', 0), (4, 'Is airport pickup available?', 'Yes, airport transfers can be arranged on request for an extra charge.', 1), (4, 'Can I cancel my booking?', 'Most rooms allow free cancellation. Check the policy shown on each room.', 2);
INSERT INTO reviews (user_id, hotel_id, rating, comment, reviewer_name, helpful, created_at) VALUES (NULL, 4, 5, 'Stunning stay. Staff went out of their way and the views were unreal.', 'Ananya R.', 3, (CURRENT_TIMESTAMP - INTERVAL '1 month')), (NULL, 4, 5, 'Spotless rooms, great breakfast and a perfect location.', 'Michael T.', 5, (CURRENT_TIMESTAMP - INTERVAL '2 month')), (NULL, 4, 4, 'Lovely hotel overall. Check-in was slow but everything else was great.', 'Sofia L.', 7, (CURRENT_TIMESTAMP - INTERVAL '3 month')), (NULL, 4, 4, 'Good value for money and very comfortable beds.', 'Rahul K.', 9, (CURRENT_TIMESTAMP - INTERVAL '4 month')), (NULL, 4, 5, 'One of the best hotels we have stayed at. Will be back.', 'Emma W.', 11, (CURRENT_TIMESTAMP - INTERVAL '5 month')), (NULL, 4, 3, 'Nice property but a bit noisy in the evenings.', 'David P.', 13, (CURRENT_TIMESTAMP - INTERVAL '6 month'));

-- ===== Hotel 5: Bali Jungle Villas =====
INSERT INTO hotel_images (hotel_id, url, sort_order) VALUES (5, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80', 0), (5, 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80', 1), (5, 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80', 2), (5, 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80', 3);
INSERT INTO hotel_badges (hotel_id, badge, sort_order) VALUES (5, 'Private Pool', 0), (5, 'Wellness', 1);
INSERT INTO hotel_amenities (hotel_id, amenity_id, sort_order) VALUES (5, (SELECT amenity_id FROM amenities WHERE label = 'Free Wi-Fi'), 0), (5, (SELECT amenity_id FROM amenities WHERE label = 'Swimming Pool'), 1), (5, (SELECT amenity_id FROM amenities WHERE label = 'Spa & Wellness'), 2), (5, (SELECT amenity_id FROM amenities WHERE label = 'Restaurant & Bar'), 3), (5, (SELECT amenity_id FROM amenities WHERE label = 'Fitness Centre'), 4), (5, (SELECT amenity_id FROM amenities WHERE label = 'Free Parking'), 5);
INSERT INTO rooms (room_id, hotel_id, name, size_label, capacity_label, bed, price, cancellation, sort_order) VALUES (51, 5, 'Deluxe Room', '32 m²', '2 guests', '1 King bed', 150, 'Free cancellation until 48h before', 0);
INSERT INTO room_features (room_id, feature, sort_order) VALUES (51, 'Free Wi-Fi', 0), (51, 'Air conditioning', 1), (51, 'Breakfast option', 2);
INSERT INTO room_images (room_id, url, sort_order) VALUES (51, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80', 0), (51, 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80', 1);
INSERT INTO rooms (room_id, hotel_id, name, size_label, capacity_label, bed, price, cancellation, sort_order) VALUES (52, 5, 'Premium Suite', '48 m²', '3 guests', '1 King + Sofa bed', 240, 'Free cancellation until 72h before', 1);
INSERT INTO room_features (room_id, feature, sort_order) VALUES (52, 'Free Wi-Fi', 0), (52, 'Air conditioning', 1), (52, 'Breakfast option', 2);
INSERT INTO room_images (room_id, url, sort_order) VALUES (52, 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80', 0), (52, 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80', 1);
INSERT INTO rooms (room_id, hotel_id, name, size_label, capacity_label, bed, price, cancellation, sort_order) VALUES (53, 5, 'Family Villa', '70 m²', '5 guests', '2 Queen beds', 330, 'Non-refundable', 2);
INSERT INTO room_features (room_id, feature, sort_order) VALUES (53, 'Free Wi-Fi', 0), (53, 'Air conditioning', 1), (53, 'Breakfast option', 2);
INSERT INTO room_images (room_id, url, sort_order) VALUES (53, 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80', 0), (53, 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80', 1);
INSERT INTO hotel_policies (hotel_id, label, policy_value, sort_order) VALUES (5, 'Check-in', '2:00 PM', 0), (5, 'Check-out', '11:00 AM', 1), (5, 'Pets', 'On request', 2);
INSERT INTO hotel_rules (hotel_id, rule_text, sort_order) VALUES (5, 'No smoking inside rooms', 0), (5, 'Quiet hours 10 PM – 7 AM', 1), (5, 'Valid photo ID required at check-in', 2);
INSERT INTO hotel_attractions (hotel_id, icon, name, distance, sort_order) VALUES (5, 'pin', 'City Centre', '1.2 km', 0), (5, 'beach', 'Main Viewpoint', '2.5 km', 1), (5, 'airport', 'Nearest Airport', '18 km', 2);
INSERT INTO hotel_faqs (hotel_id, question, answer, sort_order) VALUES (5, 'Is breakfast included?', 'Breakfast is available and can be added to any room at booking.', 0), (5, 'Is airport pickup available?', 'Yes, airport transfers can be arranged on request for an extra charge.', 1), (5, 'Can I cancel my booking?', 'Most rooms allow free cancellation. Check the policy shown on each room.', 2);
INSERT INTO reviews (user_id, hotel_id, rating, comment, reviewer_name, helpful, created_at) VALUES (NULL, 5, 5, 'Stunning stay. Staff went out of their way and the views were unreal.', 'Ananya R.', 3, (CURRENT_TIMESTAMP - INTERVAL '1 month')), (NULL, 5, 5, 'Spotless rooms, great breakfast and a perfect location.', 'Michael T.', 5, (CURRENT_TIMESTAMP - INTERVAL '2 month')), (NULL, 5, 4, 'Lovely hotel overall. Check-in was slow but everything else was great.', 'Sofia L.', 7, (CURRENT_TIMESTAMP - INTERVAL '3 month')), (NULL, 5, 4, 'Good value for money and very comfortable beds.', 'Rahul K.', 9, (CURRENT_TIMESTAMP - INTERVAL '4 month')), (NULL, 5, 5, 'One of the best hotels we have stayed at. Will be back.', 'Emma W.', 11, (CURRENT_TIMESTAMP - INTERVAL '5 month')), (NULL, 5, 3, 'Nice property but a bit noisy in the evenings.', 'David P.', 13, (CURRENT_TIMESTAMP - INTERVAL '6 month'));

-- ===== Hotel 6: Maldives Coral Retreat =====
INSERT INTO hotel_images (hotel_id, url, sort_order) VALUES (6, 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80', 0), (6, 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80', 1), (6, 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80', 2), (6, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80', 3);
INSERT INTO hotel_badges (hotel_id, badge, sort_order) VALUES (6, 'Overwater Villa', 0), (6, 'Luxury', 1);
INSERT INTO hotel_amenities (hotel_id, amenity_id, sort_order) VALUES (6, (SELECT amenity_id FROM amenities WHERE label = 'Free Wi-Fi'), 0), (6, (SELECT amenity_id FROM amenities WHERE label = 'Swimming Pool'), 1), (6, (SELECT amenity_id FROM amenities WHERE label = 'Spa & Wellness'), 2), (6, (SELECT amenity_id FROM amenities WHERE label = 'Restaurant & Bar'), 3), (6, (SELECT amenity_id FROM amenities WHERE label = 'Fitness Centre'), 4), (6, (SELECT amenity_id FROM amenities WHERE label = 'Free Parking'), 5);
INSERT INTO rooms (room_id, hotel_id, name, size_label, capacity_label, bed, price, cancellation, sort_order) VALUES (61, 6, 'Deluxe Room', '32 m²', '2 guests', '1 King bed', 520, 'Free cancellation until 48h before', 0);
INSERT INTO room_features (room_id, feature, sort_order) VALUES (61, 'Free Wi-Fi', 0), (61, 'Air conditioning', 1), (61, 'Breakfast option', 2);
INSERT INTO room_images (room_id, url, sort_order) VALUES (61, 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80', 0), (61, 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80', 1);
INSERT INTO rooms (room_id, hotel_id, name, size_label, capacity_label, bed, price, cancellation, sort_order) VALUES (62, 6, 'Premium Suite', '48 m²', '3 guests', '1 King + Sofa bed', 832, 'Free cancellation until 72h before', 1);
INSERT INTO room_features (room_id, feature, sort_order) VALUES (62, 'Free Wi-Fi', 0), (62, 'Air conditioning', 1), (62, 'Breakfast option', 2);
INSERT INTO room_images (room_id, url, sort_order) VALUES (62, 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80', 0), (62, 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80', 1);
INSERT INTO rooms (room_id, hotel_id, name, size_label, capacity_label, bed, price, cancellation, sort_order) VALUES (63, 6, 'Family Villa', '70 m²', '5 guests', '2 Queen beds', 1144, 'Non-refundable', 2);
INSERT INTO room_features (room_id, feature, sort_order) VALUES (63, 'Free Wi-Fi', 0), (63, 'Air conditioning', 1), (63, 'Breakfast option', 2);
INSERT INTO room_images (room_id, url, sort_order) VALUES (63, 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80', 0), (63, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80', 1);
INSERT INTO hotel_policies (hotel_id, label, policy_value, sort_order) VALUES (6, 'Check-in', '2:00 PM', 0), (6, 'Check-out', '11:00 AM', 1), (6, 'Pets', 'On request', 2);
INSERT INTO hotel_rules (hotel_id, rule_text, sort_order) VALUES (6, 'No smoking inside rooms', 0), (6, 'Quiet hours 10 PM – 7 AM', 1), (6, 'Valid photo ID required at check-in', 2);
INSERT INTO hotel_attractions (hotel_id, icon, name, distance, sort_order) VALUES (6, 'pin', 'City Centre', '1.2 km', 0), (6, 'beach', 'Main Viewpoint', '2.5 km', 1), (6, 'airport', 'Nearest Airport', '18 km', 2);
INSERT INTO hotel_faqs (hotel_id, question, answer, sort_order) VALUES (6, 'Is breakfast included?', 'Breakfast is available and can be added to any room at booking.', 0), (6, 'Is airport pickup available?', 'Yes, airport transfers can be arranged on request for an extra charge.', 1), (6, 'Can I cancel my booking?', 'Most rooms allow free cancellation. Check the policy shown on each room.', 2);
INSERT INTO reviews (user_id, hotel_id, rating, comment, reviewer_name, helpful, created_at) VALUES (NULL, 6, 5, 'Stunning stay. Staff went out of their way and the views were unreal.', 'Ananya R.', 3, (CURRENT_TIMESTAMP - INTERVAL '1 month')), (NULL, 6, 5, 'Spotless rooms, great breakfast and a perfect location.', 'Michael T.', 5, (CURRENT_TIMESTAMP - INTERVAL '2 month')), (NULL, 6, 4, 'Lovely hotel overall. Check-in was slow but everything else was great.', 'Sofia L.', 7, (CURRENT_TIMESTAMP - INTERVAL '3 month')), (NULL, 6, 4, 'Good value for money and very comfortable beds.', 'Rahul K.', 9, (CURRENT_TIMESTAMP - INTERVAL '4 month')), (NULL, 6, 5, 'One of the best hotels we have stayed at. Will be back.', 'Emma W.', 11, (CURRENT_TIMESTAMP - INTERVAL '5 month')), (NULL, 6, 3, 'Nice property but a bit noisy in the evenings.', 'David P.', 13, (CURRENT_TIMESTAMP - INTERVAL '6 month'));

