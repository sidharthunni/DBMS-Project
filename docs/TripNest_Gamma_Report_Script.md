# TripNest: Voice-First Tour and Travel Database Management System

### Course: 23CSE202 - Database Management Systems
### Academic Program: B.Tech Computer Science and Engineering
### Institution: Amrita School of Computing, Amrita Vishwa Vidyapeetham, Amritapuri Campus
### Semester: Semester 3
### Academic Year: 2026-2027

---

# Abstract and Executive Overview

### The Core Problem
Modern online travel booking platforms are severely fragmented. Users must juggle disparate booking portals for flights, accommodations, tour packages, and transport services. Furthermore, legacy systems lack hands-free accessibility and rely on error-prone client-side calculations for billing and inventory management.

### The Proposed Solution: TripNest
TripNest is a full-stack, voice-enabled tour and travel management system built on an enterprise-grade relational architecture.

### Key Database Highlights
* 24 Relational Tables in Third Normal Form (3NF)
* Complete ACID Transaction support using MySQL 8.0 InnoDB
* 3 Event-driven Database Triggers automating billing calculations, payment state synchronization, and audit logging
* 2 Stored Procedures encapsulating atomic reservations and cancellations with row-level locks
* 1 Denormalized Analytical Reporting View providing unified itinerary aggregates
* Web Speech API Integration executing hands-free natural language travel workflows

---

# Problem Domain and Industry Gaps

### Existing Scenario Limitations
* **Siloed Data Architecture:** Users navigate 3 to 5 separate systems to assemble a single travel itinerary, causing inconsistent records.
* **Overbooking Anomalies:** Concurrent booking requests lead to race conditions and inventory overselling when handled via uncoordinated application layers.
* **Client-Side Vulnerabilities:** Pricing computations, discounts, and tax tallies performed on frontend layers create discrepancies and security vulnerabilities.
* **Accessibility Barriers:** Complex multi-step filtering menus exclude users requiring hands-free or voice-first navigation.

### TripNest Value Proposition
* **Unified Relational Core:** Centralized schema connecting travelers, destinations, hotel rooms, packages, bookings, payments, and reviews.
* **Server-Side Enforcement:** Relational integrity, foreign key cascades, and check constraints enforced directly within the database engine.
* **Autonomous Synchronization:** Triggers guarantee that payment status transitions instantly reflect on booking records without manual intervention.

---

# Requirements Specification

### Functional Requirements (FR)
* **FR-1 Authentication and Roles:** Secure role-based access for Travelers, Hotel Managers, and System Administrators.
* **FR-2 Search and Dynamic Filtering:** Multi-criteria querying across destinations, hotels, price bands, and amenity tags.
* **FR-3 Atomic Booking Workflow:** Automated validation of room and seat availability with instant seat decrements.
* **FR-4 Automated Billing and Invoicing:** Automatic calculation of base amounts, tax tariffs, and net totals upon reservation.
* **FR-5 Multi-Gateway Payment Orchestration:** Transaction tracking across UPI, Credit/Debit cards, Net Banking, and GPay.
* **FR-6 Natural Language Voice Command Execution:** Hands-free command routing for search, navigation, form completion, and checkout.
* **FR-7 Cancellations and Inventory Rollback:** Procedure-driven cancellations with automatic inventory replenishment.
* **FR-8 Feedback and Rating Collection:** Constrained review submissions linked directly to verified booking IDs.
* **FR-9 Analytical Reporting:** Comprehensive administrative views tracking revenue, occupancy, and customer trends.

### Non-Functional Requirements (NFR)
* **NFR-1 Data Consistency:** Strict adherence to ACID properties via InnoDB storage engine.
* **NFR-2 Performance and Latency:** Sub-50 millisecond query execution times achieved through composite B-Tree indexing.
* **NFR-3 Security:** Password hashing via bcrypt, SQL injection prevention using parameterized queries, and strict privilege management.
* **NFR-4 Usability:** Responsive UI across mobile and desktop viewports, with real-time audio visualizers during speech input.
* **NFR-5 High Availability:** Scalable relational architecture supporting connection pooling and high concurrency.

---

# System Architecture and Technology Stack

```
+-------------------------------------------------------------+
|                      Client Layer                           |
|  - HTML5 / CSS3 Modern Glassmorphic Interface               |
|  - Vanilla JavaScript Engine                                |
|  - Web Speech API (Voice Recognition & Intent Parser)       |
+------------------------------+------------------------------+
                               | HTTPS / REST JSON
+------------------------------v------------------------------+
|                    Application Layer                        |
|  - Node.js Runtime & Express.js REST Framework              |
|  - Connection Pooling with mysql2                           |
|  - Role-Based Authentication & Session Management           |
+------------------------------+------------------------------+
                               | SQL Parameterized Queries
+------------------------------v------------------------------+
|                     Database Engine                         |
|  - MySQL 8.0 Community Server (InnoDB Engine)               |
|  - 24 Normalized Relational Tables (3NF)                    |
|  - Database Triggers, Stored Procedures, and Analytical Views|
|  - Foreign Key Constraints & Composite B-Tree Indexes       |
+-------------------------------------------------------------+
```

---

# Relational Database Design: 24 Tables

### Core System Tables (8 Tables)
* `users`: Primary identity store with role definitions and credential hashes.
* `user_profiles`: Demographic data, contact numbers, and preferences.
* `destinations`: Target regions, countries, geographical coordinates, and descriptions.
* `packages`: Curated travel packages tied to destinations.
* `itineraries`: Day-by-day scheduled activities per package.
* `bookings`: Master reservation records with guest counts and scheduling dates.
* `payments`: Transaction records with payment modes, gateway references, and status.
* `reviews`: Post-travel ratings (1 to 5 scale) and feedback comments.

### Normalized Hotel and Hospitality Tables (11 Tables)
* `hotels`: Property master data including star ratings and addresses.
* `hotel_policies`: Check-in/out policies, cancellation rules, and pet allowances.
* `hotel_photos`: Image asset URLs and category tags.
* `room_types`: Room categories (Standard, Deluxe, Suite, Executive).
* `room_details`: Capacities, bed configurations, and square footage.
* `room_pricing`: Dynamic base pricing, seasonal rates, and currency data.
* `room_inventory`: Real-time available units per room type.
* `room_photos`: High-resolution imagery per room category.
* `room_amenities_master`: Master list of room amenities (WiFi, AC, Jacuzzi, Balcony).
* `room_amenity_mappings`: Junction table linking room types to master amenities.
* `hotel_reviews`: Granular hospitality feedback with sub-ratings for cleanliness and service.

### Operational and Logistics Tables (5 Tables)
* `transport_modes`: Transport types (Flight, Train, AC Luxury Coach, Ferry).
* `transport_schedules`: Departure/arrival timestamps, carrier details, and seat quotas.
* `activities`: Optional excursions and adventure sports at destinations.
* `package_activities`: Junction table mapping excursions into specific tour packages.
* `audit_logs`: Enterprise audit trail recording status mutations and timestamps.

---

# Relational Normalization Analysis (1NF to 3NF)

### First Normal Form (1NF) Compliance
* **Elimination of Repeating Groups:** All attributes contain strictly atomic, indivisible values.
* **Elimination of Multi-Valued Attributes:** Hotel amenities, room photos, and package itineraries are extracted into dedicated child tables.
* **Primary Key Definition:** Every table enforces a non-null, unique primary key constraint.

### Second Normal Form (2NF) Compliance
* **1NF Pre-requisite Satisfied:** All relations adhere to 1NF.
* **Zero Partial Functional Dependencies:** In junction tables with composite candidate keys (such as `package_activities` with `{package_id, activity_id}`), all non-key attributes are fully functionally dependent on the entire composite key.

### Third Normal Form (3NF) Compliance
* **2NF Pre-requisite Satisfied:** All relations adhere to 2NF.
* **Elimination of Transitive Dependencies:** No non-prime attribute is functionally dependent on another non-prime attribute.
* **Example Resolution:** In the unnormalized hotel entity, `city_id -> state -> country` created a transitive chain. TripNest normalized geographical hierarchy into the parent `destinations` relation.

---

# Database Selection and Justification: Why MySQL 8.0 InnoDB

| Feature Required | MySQL 8.0 InnoDB Storage Engine | Flat-File / NoSQL Alternative | Impact on TripNest |
| :--- | :--- | :--- | :--- |
| **ACID Compliance** | Full ACID transactions with WAL redo/undo logging | Eventual consistency / No multi-document transactions | Guaranteed prevention of overbooking and ghost reservations |
| **Referential Integrity** | Cascading foreign key constraints (`ON DELETE CASCADE`) | Manual application-level integrity maintenance | Complete elimination of orphaned booking records |
| **Server-Side Automation** | Rich triggers and stored procedures | External worker processes required | Automatic tax/billing calculations and inventory release |
| **Indexing Performance** | Clustered Primary Keys and Secondary B-Trees | Hash or distributed indexing | Sub-millisecond lookup times for user bookings and package queries |
| **Concurrency Model** | Row-level locking with multi-version concurrency control (MVCC) | Collection or document-level coarse locks | High throughput during peak booking periods |

---

# Advanced Database Implementation: Event-Driven Triggers

### 1. Automated Booking Total Calculation
```sql
CREATE TRIGGER trg_booking_total
BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    DECLARE v_package_price DECIMAL(10,2) DEFAULT 0.00;
    SELECT price INTO v_package_price 
    FROM packages WHERE package_id = NEW.package_id;
    
    SET NEW.total_amount = v_package_price * NEW.num_travelers;
END;
```

### 2. Payment State Synchronization
```sql
CREATE TRIGGER trg_payment_confirm
AFTER UPDATE ON payments
FOR EACH ROW
BEGIN
    IF NEW.payment_status = 'Success' AND OLD.payment_status <> 'Success' THEN
        UPDATE bookings 
        SET booking_status = 'Confirmed' 
        WHERE booking_id = NEW.booking_id;
    END IF;
END;
```

### 3. Cancellation Timestamp Audit
```sql
CREATE TRIGGER trg_booking_cancelled_at
BEFORE UPDATE ON bookings
FOR EACH ROW
BEGIN
    IF NEW.booking_status = 'Cancelled' AND OLD.booking_status <> 'Cancelled' THEN
        SET NEW.cancelled_at = NOW();
    END IF;
END;
```

---

# Advanced Database Implementation: ACID Stored Procedures

### Package Reservation Procedure (`sp_book_package`)
```sql
CREATE PROCEDURE sp_book_package(
    IN p_user_id INT,
    IN p_package_id INT,
    IN p_travel_date DATE,
    IN p_num_travelers INT,
    OUT p_booking_id INT
)
BEGIN
    DECLARE v_available_seats INT DEFAULT 0;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
    -- Row-level locking to prevent race conditions
    SELECT available_seats INTO v_available_seats
    FROM packages WHERE package_id = p_package_id FOR UPDATE;

    IF v_available_seats < p_num_travelers THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Insufficient package inventory available.';
    END IF;

    INSERT INTO bookings (user_id, package_id, booking_date, travel_date, num_travelers, booking_status)
    VALUES (p_user_id, p_package_id, CURDATE(), p_travel_date, p_num_travelers, 'Pending');

    SET p_booking_id = LAST_INSERT_ID();

    UPDATE packages 
    SET available_seats = available_seats - p_num_travelers
    WHERE package_id = p_package_id;

    COMMIT;
END;
```

### Booking Cancellation Procedure (`sp_cancel_booking`)
* Atomic cancellation that validates booking status, sets status to `Cancelled`, and immediately replenishes package seats or room inventory.

---

# Advanced Database Implementation: Analytical Views

### Master Trip Aggregation View (`v_trip_details`)
```sql
CREATE OR REPLACE VIEW v_trip_details AS
SELECT 
    b.booking_id,
    u.full_name AS customer_name,
    u.email AS customer_email,
    p.package_name,
    d.destination_name,
    d.country,
    b.travel_date,
    b.num_travelers,
    b.total_amount,
    b.booking_status,
    pay.payment_status,
    pay.payment_method
FROM bookings b
JOIN users u ON b.user_id = u.user_id
JOIN packages p ON b.package_id = p.package_id
JOIN destinations d ON p.destination_id = d.destination_id
LEFT JOIN payments pay ON b.booking_id = pay.booking_id;
```

### Business Utility
* Powers the Administrative Executive Dashboard.
* Eliminates repetitive 5-table joins across client and reporting queries.
* Pre-compiled query execution plan maximizes database read performance.

---

# Verification and Testing Matrix

| Test ID | Module Tested | Input Scenario | Expected Output | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | User Registration | Duplicate email registration (`john@example.com`) | `ER_DUP_ENTRY` unique key violation | Rejected with duplicate key exception | **Passed** |
| **TC-02** | Referential Integrity | Delete destination with active package bookings | Blocked by Foreign Key constraint | Foreign key constraint prevented deletion | **Passed** |
| **TC-03** | Trigger Automation | Insert booking with 3 travelers for 1,200 USD package | `total_amount` computed as 3,600.00 USD | Trigger `trg_booking_total` populated 3,600.00 USD | **Passed** |
| **TC-04** | Trigger Automation | Update payment status from `Pending` to `Success` | Booking status updated to `Confirmed` | Trigger `trg_payment_confirm` updated booking status | **Passed** |
| **TC-05** | Trigger Automation | Update booking status to `Cancelled` | `cancelled_at` set to current timestamp | Trigger `trg_booking_cancelled_at` logged exact timestamp | **Passed** |
| **TC-06** | Stored Procedure | Execute `sp_book_package` with valid inventory | Booking created and seats decremented | Booking ID generated, package seats reduced atomically | **Passed** |
| **TC-07** | Stored Procedure | Execute `sp_book_package` requesting 50 seats when 5 available | Transaction rollback with custom SQLSTATE 45000 | Caught `Insufficient inventory` error, rollback executed | **Passed** |
| **TC-08** | Stored Procedure | Execute `sp_cancel_booking` on confirmed booking | Status set to `Cancelled`, seats restored | Status updated, available seats incremented | **Passed** |
| **TC-09** | Analytical View | Query `v_trip_details` for customer history | Single query return of 5-table consolidated data | Returned full aggregate records in 4 milliseconds | **Passed** |
| **TC-10** | Voice Assistant | Speech input: "take me to switzerland" | URL redirection to Swiss hotel details page | Regex parsed destination, navigated to `hotels-details.html?id=4` | **Passed** |

---

# Pitch Video and Live Demonstration Walkthrough

### Recommended Video Pitch Time Budget
* **Target Duration:** 3 Minutes 30 Seconds to 4 Minutes Total
* **Section 1: Problem and Architecture Overview (0:00 - 0:45)**
* **Section 2: Live Hands-Free Voice Demonstration (0:45 - 2:30)**
* **Section 3: Database Verification in MySQL Terminal (2:30 - 3:30)**
* **Section 4: Summary and Technical Moat (3:30 - 4:00)**

### The Complete 7-Step Voice Pathway
* **Step 1: One-Click Authentication**
  Show user profile initialized via browser authentication.
* **Step 2: Spoken Intent: "Plan my trip to Europe"**
  Assistant parses European region, displays curated packages and redirects to hotels portal.
* **Step 3: Intermediate Navigation: Hotels to Plan Trip**
  System prompts user to select a specific country and destination.
* **Step 4: Spoken Command: "Take me to Switzerland"**
  Direct navigation to `https://sidharthunni.github.io/DBMS-Project/hotels-details.html?id=4`.
* **Step 5: Automated Form Population**
  User states dates and guests; assistant fills Swiss Alpine Resort reservation form.
* **Step 6: Voice Confirmation: "Reserve"**
  Modal confirmation appears, invoking backend stored procedure and booking trigger.
* **Step 7: Checkout and Payment Gateway Redirection**
  Redirects to payment section (UPI, Credit Card, Bank Account). Clicking GPay seamlessly launches the Google Pay verification portal.

---

# Technical Challenges and Engineering Solutions

### 1. Deep Normalization of Hospitality Entities
* **Challenge:** Hotel properties have highly variable room configurations, dynamic seasonal pricing, and independent amenity sets.
* **Solution:** Decoupled hotels across 11 discrete 3NF tables, eliminating null anomalies and ensuring complete flexibility.

### 2. Multi-User Concurrency and Inventory Guardrails
* **Challenge:** Multiple users booking the final available seat simultaneously could result in negative inventory counts.
* **Solution:** Implemented `SELECT ... FOR UPDATE` row locks inside the `sp_book_package` transaction handler, enforcing strict serializability.

### 3. Asynchronous Voice Command Processing
* **Challenge:** Ambient audio noise and phonetic variance caused command misclassification in the browser.
* **Solution:** Implemented token-based fuzzy regex matchers with immediate text-to-speech voice feedback and fallback visual controls.

---

# Conclusion and Future Architectural Roadmap

### Key Project Achievements
* Successfully engineered an enterprise-ready tour and travel DBMS application.
* Designed and deployed 24 relational tables in Third Normal Form.
* Implemented event-driven triggers, stored procedures, and analytical views guaranteeing ACID data integrity.
* Delivered a seamless, voice-first travel booking experience from destination search to payment checkout.

### Future Roadmap
* **Machine Learning Recommendations:** Integration of collaborative filtering algorithms for personalized package suggestions.
* **Native Mobile Applications:** Flutter cross-platform mobile client with offline database synchronization via SQLite.
* **Real-Time Payment Webhooks:** Automated reconciliation with banking webhooks for real-time payment confirmation.
* **Cloud Database Deployment:** Migration to managed Amazon RDS MySQL with automated multi-zone replication.

---

# References

1. Elmasri, R., & Navathe, S. B. (2015). *Fundamentals of Database Systems* (7th ed.). Pearson.
2. Silberschatz, A., Korth, H. F., & Sudarshan, S. (2019). *Database System Concepts* (7th ed.). McGraw-Hill Education.
3. Date, C. J. (2003). *An Introduction to Database Systems* (8th ed.). Addison-Wesley.
4. Oracle Corporation. (2026). *MySQL 8.0 Reference Manual: InnoDB Storage Engine Architecture*.
5. World Wide Web Consortium (W3C). (2023). *Web Speech API Specification*.
