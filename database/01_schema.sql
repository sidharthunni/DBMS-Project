-- TripNest DBMS Project - MySQL 8.0+
DROP DATABASE IF EXISTS tripnest;
CREATE DATABASE tripnest;
USE tripnest;

-- ========== TABLES ==========
CREATE TABLE users (
  user_id       INT AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(100) NOT NULL UNIQUE,
  phone         VARCHAR(20),
  country       VARCHAR(60),
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE destinations (
  dest_id       INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  country       VARCHAR(60)  NOT NULL,
  continent     VARCHAR(30),
  style         VARCHAR(30),
  price         DECIMAL(10,2) DEFAULT 0,
  rating        DECIMAL(2,1) CHECK (rating BETWEEN 0 AND 5),
  reviews_count INT DEFAULT 0,
  best_season   VARCHAR(30),
  description   TEXT,
  img_url       VARCHAR(500)
);

CREATE TABLE hotels (
  hotel_id        INT AUTO_INCREMENT PRIMARY KEY,
  dest_id         INT NOT NULL,
  name            VARCHAR(120) NOT NULL,
  stars           TINYINT CHECK (stars BETWEEN 1 AND 5),
  price_per_night DECIMAL(10,2) NOT NULL,
  rating          DECIMAL(2,1),
  FOREIGN KEY (dest_id) REFERENCES destinations(dest_id) ON DELETE CASCADE
);

CREATE TABLE packages (
  package_id INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(120) NOT NULL,
  days       INT NOT NULL,
  countries  INT DEFAULT 1,
  rating     DECIMAL(2,1),
  price      DECIMAL(10,2) NOT NULL,
  tag        VARCHAR(30),
  category   VARCHAR(30),
  img_url    VARCHAR(500)
);

-- 1NF: package "includes" list ni separate table lo pettam
CREATE TABLE package_includes (
  package_id INT NOT NULL,
  item       VARCHAR(50) NOT NULL,
  PRIMARY KEY (package_id, item),
  FOREIGN KEY (package_id) REFERENCES packages(package_id) ON DELETE CASCADE
);

CREATE TABLE trips (
  trip_id       INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  dest_id       INT NOT NULL,
  hotel_id      INT,
  package_tier  VARCHAR(30),
  travelers     INT NOT NULL DEFAULT 1 CHECK (travelers > 0),
  budget        DECIMAL(10,2),
  start_date    DATE NOT NULL,
  end_date      DATE NOT NULL,
  duration_days INT GENERATED ALWAYS AS (DATEDIFF(end_date, start_date)) STORED,
  status        ENUM('planned','confirmed','cancelled') DEFAULT 'planned',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES users(user_id)          ON DELETE CASCADE,
  FOREIGN KEY (dest_id)    REFERENCES destinations(dest_id),
  FOREIGN KEY (hotel_id)   REFERENCES hotels(hotel_id)        ON DELETE SET NULL,
  CHECK (end_date >= start_date)
);

CREATE TABLE bookings (
  booking_id  INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  package_id  INT NOT NULL,
  travel_date DATE NOT NULL,
  travelers   INT NOT NULL DEFAULT 1 CHECK (travelers > 0),
  total_price DECIMAL(10,2),
  status      ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
  booked_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES users(user_id)       ON DELETE CASCADE,
  FOREIGN KEY (package_id) REFERENCES packages(package_id)
);

CREATE TABLE reviews (
  review_id  INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  hotel_id   INT NOT NULL,
  rating     TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)  REFERENCES users(user_id)   ON DELETE CASCADE,
  FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id) ON DELETE CASCADE
);

-- Many-to-many: users <-> destinations (wishlist)
CREATE TABLE wishlist (
  user_id  INT NOT NULL,
  dest_id  INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, dest_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)        ON DELETE CASCADE,
  FOREIGN KEY (dest_id) REFERENCES destinations(dest_id) ON DELETE CASCADE
);

CREATE TABLE contact_messages (
  msg_id     INT AUTO_INCREMENT PRIMARY KEY,
  full_name  VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL,
  phone      VARCHAR(20),
  subject    VARCHAR(150),
  message    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========== TRIGGER: booking total auto calculate ==========
DELIMITER //
CREATE TRIGGER trg_booking_total BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
  SET NEW.total_price = NEW.travelers *
    (SELECT price FROM packages WHERE package_id = NEW.package_id);
END//

-- ========== STORED PROCEDURE: book a package ==========
CREATE PROCEDURE sp_book_package(
  IN p_user INT, IN p_package INT, IN p_date DATE, IN p_travelers INT)
BEGIN
  INSERT INTO bookings (user_id, package_id, travel_date, travelers)
  VALUES (p_user, p_package, p_date, p_travelers);
  SELECT * FROM bookings WHERE booking_id = LAST_INSERT_ID();
END//
DELIMITER ;

-- ========== VIEW: full trip details (JOIN) ==========
CREATE VIEW v_trip_details AS
SELECT t.trip_id, u.full_name, d.name AS destination, d.country,
       h.name AS hotel, t.package_tier AS package_name,
       t.travelers, t.budget, t.start_date, t.end_date,
       t.duration_days, t.status
FROM trips t
JOIN users u        ON t.user_id = u.user_id
JOIN destinations d ON t.dest_id = d.dest_id
LEFT JOIN hotels h  ON t.hotel_id = h.hotel_id;

-- ========== SEED DATA (mee frontend JS nunchi teesukunnavi) ==========
INSERT INTO destinations (name, country, continent, style, price, rating, reviews_count, best_season, description, img_url) VALUES
('Paris','France','europe','Luxury',850,4.9,1240,'Apr - Oct','The City of Light with romantic Eiffel views, Louvre art, and fine gastronomy.','https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80'),
('Rome','Italy','europe','Historical',780,4.8,980,'May - Sep','Eternal city filled with ancient Colosseum ruins, Vatican treasures, and gelato.','https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80'),
('Santorini','Greece','europe','Honeymoon',1100,4.9,1510,'May - Oct','Whitewashed cliffside villas overlooking deep blue Aegean caldera waters.','https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80'),
('Swiss Alps','Switzerland','europe','Mountains',1299,5,890,'Dec - Mar','Snow-capped alpine peaks, luxury ski chalets, and scenic mountain trains.','https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80'),
('Venice','Italy','europe','Honeymoon',820,4.8,760,'Apr - Jun','Enchanting waterways, historic gondola rides, and grand Italian palaces.','https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=600&q=80'),
('Florence','Italy','europe','Historical',760,4.8,620,'May - Sep','Cradle of Renaissance art featuring Michelangelo Duomo and Tuscan winelands.','https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=600&q=80'),
('London','United Kingdom','europe','Historical',890,4.8,1100,'May - Sep','Royal palaces, Big Ben, West End theatre shows, and world-class museums.','https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80'),
('Barcelona','Spain','europe','Beach',740,4.8,930,'May - Oct','Mediterranean coast city famed for Gaudí architecture, beaches, and tapas bars.','https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=600&q=80'),
('Bali','Indonesia','asia','Honeymoon',620,4.9,1850,'Apr - Oct','Island of the Gods featuring jungle Ubud villas, rice terraces, and surf beaches.','https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80'),
('Kyoto','Japan','asia','Historical',940,4.9,1310,'Mar - May','Japan’s cultural heart with thousand-year temples, geishas, and cherry blossoms.','https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80'),
('Tokyo','Japan','asia','Luxury',990,4.9,1620,'Oct - Dec','Futuristic neon skyline met with serene ancient Shinto shrines and sushi spots.','https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80'),
('Maldives','Maldives','asia','Luxury',1850,5,1420,'Nov - Apr','Private overwater bungalows suspended over crystal bioluminescent ocean lagoons.','https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80'),
('Dubai','UAE','asia','Luxury',920,4.9,1180,'Nov - Mar','Ultramodern skyscrapers, luxury desert glamping safaris, and high-end shopping.','https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80'),
('New York','USA','north-america','Luxury',890,4.8,1400,'Apr - Jun','Times Square lights, Broadway shows, Central Park strolls, and world-class dining.','https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80'),
('Banff','Canada','north-america','Nature',890,4.9,920,'Jun - Aug','Turquoise glacial lakes, Canadian Rocky mountain wilderness, and pine forests.','https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80'),
('Machu Picchu','Peru','south-america','Historical',950,5,1120,'Apr - Oct','Ancient Incan sanctuary resting high among Andes cloud forest peaks.','https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=600&q=80'),
('Rio de Janeiro','Brazil','south-america','Beach',790,4.8,880,'Dec - Mar','Christ the Redeemer mountain views, Copacabana sands, and Carnival rhythm.','https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=600&q=80'),
('Serengeti','Tanzania','africa','Wildlife',1350,5,790,'Jun - Oct','Great Wildebeest Migration safari with Big Five game drives and luxury lodges.','https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80'),
('Sydney','Australia','oceania','Beach',980,4.9,1150,'Sep - Nov','Harbour Opera House vistas, Bondi surf breaks, and coastal cliffwalks.','https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80');

INSERT INTO packages (name, days, countries, rating, price, tag, category, img_url) VALUES
('Santorini Sunset Escape',7,1,4.9,2450,'Best Seller','beach','https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80'),
('Swiss Alps Summit Trail',9,1,4.8,3200,'Adventure','mountain','https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80'),
('Serengeti Safari Trail',6,2,4.9,3400,'Wildlife','safari','https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80'),
('Bali Wellness Retreat',8,1,4.7,1320,'Relax','honeymoon','https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80'),
('Maldives Overwater Bliss',5,1,5,4100,'Luxury','luxury','https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80'),
('Kyoto Cultural Journey',10,1,4.8,2680,'Culture','family','https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80'),
('Patagonia Trekking Expedition',12,2,4.9,3850,'Adventure','adventure','https://images.unsplash.com/photo-1478827387698-1527781a4887?w=600&q=80'),
('Amalfi Coast Getaway',6,1,4.7,2200,'Romantic','honeymoon','https://images.unsplash.com/photo-1533105045747-b17aacd6d0ea?w=600&q=80'),
('Great Barrier Reef Cruise',8,1,4.8,2780,'Cruise','cruise','https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80');

INSERT INTO package_includes (package_id, item) VALUES
(1,'Flights'),
(1,'Hotel'),
(1,'Meals'),
(2,'Flights'),
(2,'Guide'),
(2,'Transfers'),
(3,'Flights'),
(3,'Guide'),
(3,'Meals'),
(4,'Hotel'),
(4,'Meals'),
(4,'Spa'),
(5,'Flights'),
(5,'Villa'),
(5,'Meals'),
(6,'Flights'),
(6,'Guide'),
(6,'Hotel'),
(7,'Flights'),
(7,'Guide'),
(7,'Camp Gear'),
(8,'Hotel'),
(8,'Meals'),
(8,'Transfers'),
(9,'Flights'),
(9,'Cabin'),
(9,'Meals');

INSERT INTO hotels (dest_id, name, stars, price_per_night, rating)
SELECT dest_id, 'Azure Cliff Resort', 5, 310, 4.9 FROM destinations WHERE name = 'Santorini' LIMIT 1;
INSERT INTO hotels (dest_id, name, stars, price_per_night, rating)
SELECT dest_id, 'The Nest Boutique Hotel', 4, 190, 4.7 FROM destinations WHERE name = 'Rome' LIMIT 1;
INSERT INTO hotels (dest_id, name, stars, price_per_night, rating)
SELECT dest_id, 'Harbor View Suites', 4, 245, 4.6 FROM destinations WHERE name = 'Paris' LIMIT 1;

INSERT INTO hotels (dest_id, name, stars, price_per_night, rating)
SELECT dest_id, 'Alpine Summit Lodge', 4, 260, 4.8 FROM destinations WHERE name = 'Swiss Alps' LIMIT 1;
INSERT INTO hotels (dest_id, name, stars, price_per_night, rating)
SELECT dest_id, 'Bali Jungle Villas', 4, 150, 4.7 FROM destinations WHERE name LIKE 'Bali%' LIMIT 1;
INSERT INTO hotels (dest_id, name, stars, price_per_night, rating)
SELECT dest_id, 'Maldives Coral Retreat', 5, 520, 5.0 FROM destinations WHERE name LIKE 'Maldives%' LIMIT 1;

-- ========== DEMO QUERIES (report / viva kosam) ==========
-- 1. Top rated destinations:   SELECT name, rating FROM destinations ORDER BY rating DESC LIMIT 3;
-- 2. Hotels with destination:  SELECT h.name, d.name FROM hotels h JOIN destinations d USING (dest_id);
-- 3. Bookings revenue/package: SELECT p.name, SUM(b.total_price) FROM bookings b JOIN packages p USING (package_id) GROUP BY p.name;
-- 4. Users with > 1 trip:      SELECT user_id, COUNT(*) FROM trips GROUP BY user_id HAVING COUNT(*) > 1;
-- 5. Trip details view:        SELECT * FROM v_trip_details;
