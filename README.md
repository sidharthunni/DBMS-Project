# TripNest - Full-Stack DBMS Tourism & Trip Planning System

TripNest is an enterprise-grade full-stack database management system (DBMS) mini-project built to demonstrate advanced relational database concepts, 3NF normalization, transactional integrity, active database objects (triggers, stored procedures, views), and role-based access control.

The system allows travellers to explore global destinations, browse hotels and suites, book vacation packages, plan customized itineraries with stored computed attributes, process simulated payments, receive confirmation receipts, and manage cancellations governed by automated refund policies. Administrators have access to an operational telemetry dashboard monitoring live platform activity.

---

## Technical Architecture

- **Frontend Tier**: Vanilla HTML5, CSS3, JavaScript (ES6+), GSAP animations.
- **Backend Application Tier**: Node.js, Express.js REST API with connection pooling (mysql2/promise).
- **Database Engine**:
  - Primary Engine: MySQL 8.0+ (InnoDB storage engine).
  - PostgreSQL / pgAdmin Compatibility: Dedicated PostgreSQL 12+ migration schema included.
- **Security & Integrity**: Bcrypt password hashing, session tokens, foreign key cascading constraints, check constraints, database transactions with row-level locks (FOR UPDATE).

---

## Core DBMS Concepts & Architecture Highlights

### 1. Relational Schema Normalization (3NF)
- **1NF Compliance**: Multi-valued attributes such as package inclusions and hotel amenities are normalized into dedicated bridge tables (package_includes, hotel_amenities) rather than comma-separated fields.
- **2NF & 3NF Compliance**: All tables possess designated primary keys. Non-key attributes depend strictly and entirely on primary keys, eliminating transitive dependencies across 24 distinct relational tables.

### 2. Relational Integrity & Cascades
- Foreign key constraints enforce referential integrity across the system.
- Cascading deletes (ON DELETE CASCADE) automatically purge orphaned child records (e.g., removing a package drops associated package includes, hotel deletions drop room amenities and gallery photos).
- Nullifying cascades (ON DELETE SET NULL) ensure user trip plans remain preserved even if a hotel partner is removed.

### 3. Generated Columns & Check Constraints
- trips.duration_days: A stored generated column automatically computing DATEDIFF(end_date, start_date).
- Temporal validation constraints enforce CHECK (end_date >= start_date).
- Rating domain checks ensure CHECK (rating BETWEEN 0 AND 5).

### 4. Database Triggers (Active Database Rules)
1. trg_booking_total (BEFORE INSERT ON bookings): Automatically looks up package base price and computes total_price = travelers * price.
2. trg_payment_confirm (AFTER INSERT ON payments): Automatically upgrades booking status from 'pending' to 'confirmed' upon successful transaction creation.
3. trg_booking_cancelled_at (BEFORE UPDATE ON bookings): Sets the timestamp cancelled_at = NOW() whenever a booking is marked as cancelled.

### 5. Stored Procedures & ACID Transactions
1. sp_book_package: Encapsulates validation and atomic insertion for tour package reservations.
2. sp_cancel_booking: Executes an atomic transaction (START TRANSACTION ... COMMIT / ROLLBACK) utilizing exclusive row locks (FOR UPDATE). Calculates tiered refunds based on cancellation lead time (100% refund for 7+ days, 50% for 2-6 days, 0% for under 2 days), logs refund reference tokens, inserts transactional notification records into email_log, and rolls back automatically upon any SQLEXCEPTION.

### 6. Relational Views
- v_trip_details: A comprehensive 4-table join (trips, users, destinations, hotels) providing aggregated trip summaries for user profiles and admin telemetry.

### 7. Performance Indexing
- Dedicated B-Tree indexes created on high-cardinality filter and sort columns:
  - destinations(continent), destinations(price), destinations(rating)
  - hotels(price_per_night)
  - packages(price)

---

## Database Schema Structure (24 Tables)

1. users - Customer and administrator authentication accounts with role tags.
2. destinations - Travel destinations with geography, climate, and pricing.
3. hotels - Accommodation partner properties.
4. packages - Curated tour packages.
5. package_includes - 1NF itemized inclusions for packages.
6. trips - Custom itinerary planner records with generated duration.
7. bookings - Tour reservations.
8. reviews - Verified guest ratings and reviews.
9. wishlist - Many-to-many relationship mapping users to saved destinations.
10. contact_messages - Platform support inquiries.
11. payments - Ledger of simulated payment transactions.
12. refunds - Processed refund records linked to cancellations.
13. email_log - System audit log for simulated notification emails.
14. amenities - Global master dictionary of facility codes.
15. hotel_amenities - Many-to-many bridge linking hotels to facilities.
16. hotel_images - Media gallery URLs for hotels.
17. hotel_badges - Featured metadata badges.
18. rooms - Specific room categories per hotel.
19. room_features - Itemized amenities per room category.
20. room_images - Gallery images per room category.
21. hotel_policies - Property check-in/out guidelines.
22. hotel_rules - Property house rules.
23. hotel_attractions - Nearby landmarks and distances.
24. hotel_faqs - Frequently asked questions per hotel.

---

## Quick Setup Guide

### Prerequisites
- Node.js (v16.0 or higher)
- MySQL 8.0+ or PostgreSQL 12+

### Step 1: Database Setup

#### Option A: MySQL (Recommended)
Open MySQL Workbench, DBeaver, or terminal client, and run the all-in-one script:
mysql -u root -p < database/00_master_tripnest_all_in_one.sql

(Alternatively, you can run the sequential upgrade scripts in database/01 through 05 in order).

#### Option B: PostgreSQL / pgAdmin
Open pgAdmin 4, create a database named tripnest, open the Query Tool, and run:
database/tripnest_postgresql.sql

### Step 2: Backend Configuration
Navigate to the backend/ directory:
cd backend
cp .env.example .env

Edit .env to match your local database credentials:
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=tripnest
ADMIN_CODE=TRIPNEST-ADMIN

### Step 3: Start Application Server
npm install
npm start

The server will start at http://localhost:3000. Open this URL in your web browser.

---

## Pre-Seeded Demonstration Accounts

For quick evaluation and grading demonstrations, the database comes pre-seeded with ready-to-use accounts:

| Role | Email | Password |
|---|---|---|
| Administrator | admin@tripnest.com | admin123 |
| Customer | john@example.com | password123 |

You may also register new customer or administrator accounts via the application registration page using the invite code configured in ADMIN_CODE.

---

## How to Display Database Features in GUI Tools (For Lab Evaluation)

### 1. In DBeaver (Universal Database Tool)
1. Open DBeaver and select New Database Connection -> MySQL (or PostgreSQL).
2. Connect to localhost port 3306 with database tripnest.
3. Expand tripnest -> Schemas -> Tables to display all 24 relational tables.
4. Right-click on tripnest and select View Diagram to render the complete Entity-Relationship (ER) diagram showing foreign key lines and cardinality.
5. Expand Triggers to show trg_booking_total, trg_payment_confirm, and trg_booking_cancelled_at.
6. Expand Procedures to inspect sp_book_package and sp_cancel_booking.
7. Expand Views to show v_trip_details.

### 2. In MySQL Workbench
1. Connect to Local Instance 3306.
2. In the left Navigator sidebar, expand tripnest.
3. Click on Tables, Views, Stored Procedures, and Triggers to showcase each object.
4. To display the complete visual ER model: Go to Database -> Reverse Engineer -> select tripnest -> click Execute. MySQL Workbench will generate a visual relational diagram.
5. Open an SQL query tab to run demo verification queries:
   SELECT booking_id, travelers, total_price, status FROM bookings;
   SELECT * FROM v_trip_details;
   SELECT * FROM refunds;

### 3. In pgAdmin 4 (PostgreSQL)
1. Launch pgAdmin 4 and connect to PostgreSQL server.
2. Under Databases, right-click tripnest -> Query Tool.
3. Load and run database/tripnest_postgresql.sql.
4. In the left browser tree, expand Schemas -> public:
   - Expand Tables (all 24 tables visible).
   - Right-click any table (e.g., bookings) -> Properties -> Constraints to display Foreign Keys and Checks.
   - Expand Trigger Functions and Triggers to show active triggers.
   - Expand Procedures to inspect the transactional stored procedures.
   - Expand Views to show v_trip_details.
5. Right-click any table or the database and select Generate ERD to display the visual diagram inside pgAdmin.

---

## Project Directory Organization

index.html                   Home landing page
destinations.html            Destination catalog with filters & wishlist
hotels.html                  Hotel showcase grid with ratings
hotels-details.html          Detailed hotel view with room tiers & virtual tour
packages.html                Tour packages with instant reservation modal
plan-trip.html               6-Step interactive custom trip planner
my-trips.html                User profile: trips, bookings, pay, refunds, wishlist
admin.html                   Admin dashboard for platform telemetry
login.html                   Role-based login page (Customer / Admin)
register.html                Role-based registration page with invite code
about.html                   Company background and mission
contact.html                 Contact form linked to database messages
css/                         Styling sheets for all views
js/                          Frontend logic, API communication, animations
backend/
  server.js                Main Express server, connection pool, core routes
  extra-routes.js          Search, payment simulation, refunds, reviews routes
  package.json             Node.js package specifications
  .env.example             Environment configuration template
database/
  00_master_tripnest_all_in_one.sql   Unified one-click master script (MySQL)
  tripnest_postgresql.sql             PostgreSQL / pgAdmin compatible script
  01_schema.sql                       Original foundational schema
  02_upgrade_roles_payments.sql       Roles, payments, email log upgrade
  03_upgrade_destination_columns.sql   Destination metadata upgrade
  04_upgrade_hotel_details.sql        11-table detailed hotel schema upgrade
  05_upgrade_refunds.sql              Cancellations and refunds upgrade
docs/
  er-core-tables.png       Visual ER diagram for core transaction tables
  er-hotel-tables.png      Visual ER diagram for accommodation details
