# TripNest DBMS Project - Master Demo Video Script (5 to 6 Minutes)

This script is structured specifically for academic evaluation and lab examinations carrying 10 marks for DBMS concepts. It allocates 4.5 minutes strictly to technical database management system (DBMS) features and 1 minute to the user interface, demonstrating how frontend actions synchronize with the relational database.

---

## Timing Overview

- **0:00 - 0:30 (0.5 min)**: Project Title, Architecture & Schema Introduction
- **0:30 - 1:30 (1.0 min)**: Relational Data Model, 3NF Normalization & 24 Relational Tables
- **1:30 - 2:30 (1.0 min)**: Referential Integrity, Cascading Constraints, Generated Columns & B-Tree Indexes
- **2:30 - 3:45 (1.25 min)**: Active Database Triggers & ACID Transactions in Stored Procedures
- **3:45 - 4:30 (0.75 min)**: Complex Relational Views & Live GUI Verification (DBeaver / MySQL Workbench / pgAdmin)
- **4:30 - 5:30 (1.0 min)**: Frontend UI Walkthrough & End-to-End Database Reflection
- **5:30 - 5:50 (0.3 min)**: Conclusion, Technical Summary & Viva Defense Highlights

---

## Segment 1: Introduction & Architecture Overview (0:00 - 0:30)

- **Visual on Screen**: Title Slide / Terminal showing backend start (`npm start`) and MySQL Workbench / DBeaver connection screen showing the database `tripnest`.
- **On-Screen Action**: Show the database connection established and the terminal showing `TripNest running at http://localhost:3000`.

### Spoken Narration (Word-for-Word):
> "Good morning, respected evaluators. Today, our team presents TripNest, a full-stack Tourism and Trip Planning Management System engineered with an enterprise relational database architecture.
>
> While our frontend is built with responsive HTML5, CSS3, and JavaScript, the core of this project is a production-grade relational database powered by MySQL 8 with full migration compatibility for PostgreSQL in pgAdmin. Our database comprises 24 normalized tables, foreign key cascading constraints, check constraints, stored generated columns, performance indexes, three active database triggers, two transactional stored procedures, and multi-table relational views.
>
> Let us begin by inspecting the relational schema and normalization model."

---

## Segment 2: Relational Data Model & 3NF Normalization (0:30 - 1:30)

- **Visual on Screen**: DBeaver or MySQL Workbench Entity-Relationship (ER) Diagram (`tripnest` schema).
- **On-Screen Action**: Hover over `destinations`, `hotels`, `packages`, `package_includes`, `rooms`, and `wishlist`.

### Spoken Narration (Word-for-Word):
> "Here on screen is our Entity-Relationship diagram in DBeaver. Our schema is strictly organized in Third Normal Form (3NF) to eliminate insertion, deletion, and update anomalies while maximizing data integrity.
>
> First, to satisfy First Normal Form, all multi-valued and composite attributes have been segregated into distinct tables. For instance, package inclusions are not stored as comma-separated text; instead, we designed the dedicated relational entity `package_includes`, where each inclusion is an atomic tuple referencing `package_id`. Similarly, hotel facilities are resolved through an independent `amenities` dictionary and a many-to-many junction table `hotel_amenities`.
>
> Second, Second Normal Form is strictly enforced across all 24 entities. Every entity has a well-defined primary key—either single-attribute surrogate keys or composite keys like `(package_id, item)` and `(user_id, dest_id)`. Every non-prime attribute is fully functionally dependent on the entire primary key, eliminating partial dependency.
>
> Third, Third Normal Form is guaranteed by eliminating transitive dependencies. For example, hotel location metadata, room categories, pricing tiers, and attraction proximities depend directly and solely on their respective entity identifiers rather than transiting through intermediate entities. Furthermore, our many-to-many relationship between users and saved travel destinations is modeled cleanly through the associative table `wishlist`."

---

## Segment 3: Referential Integrity, Constraints & Performance Indexing (1:30 - 2:30)

- **Visual on Screen**: Table DDL definition tab in MySQL Workbench / DBeaver for `trips`, `bookings`, and `hotels`.
- **On-Screen Action**: Highlight foreign keys with `ON DELETE CASCADE` and `ON DELETE SET NULL`, the `duration_days` generated column, and indexes list.

### Spoken Narration (Word-for-Word):
> "Next, let us examine relational integrity and business rule enforcement directly at the database layer.
>
> To preserve referential integrity, foreign key relationships are configured with appropriate cascading semantics. Child entities such as `hotel_images`, `rooms`, and `reviews` enforce `ON DELETE CASCADE`. If a hotel or user account is purged, all orphaned child records are automatically cleaned up by the database engine. In contrast, in our `trips` table, the foreign key referencing `hotels` specifies `ON DELETE SET NULL`. This ensures that if a partner hotel is removed from the catalog, the customer's planned itinerary remains intact without corrupting the trip entity.
>
> We also make use of advanced database constraints and computed attributes:
> In the `trips` table, `duration_days` is a stored generated column calculated automatically as `DATEDIFF(end_date, start_date)`. This avoids redundant application-level calculations and ensures consistency. We have also enforced temporal domain validation using a check constraint: `CHECK (end_date >= start_date)`. Similar check constraints restrict user ratings strictly between zero and five.
>
> For performance optimization on large datasets, B-Tree indexes have been created on high-cardinality search columns: `continent`, `price`, and `rating` on `destinations`, as well as `price_per_night` on `hotels` and `price` on `packages`. This enables the MySQL query optimizer to perform indexed range scans rather than full table scans during search and filtering operations."

---

## Segment 4: Active Database Triggers & Transactional Stored Procedures (2:30 - 3:45)

- **Visual on Screen**: SQL Editor showing code for `trg_booking_total`, `trg_payment_confirm`, and `sp_cancel_booking`.
- **On-Screen Action**: Execute a test query inserting a booking, then run a query on `bookings` to prove total price was auto-calculated by the trigger. Then execute `CALL sp_cancel_booking(1, 2, 'Personal emergency');`.

### Spoken Narration (Word-for-Word):
> "Now, we examine active database objects: Triggers and Stored Procedures.
>
> We have implemented three distinct triggers:
> 1. `trg_booking_total`: A BEFORE INSERT trigger on the `bookings` table. When a reservation is inserted with only a user ID, package ID, and traveler count, this trigger automatically queries the `packages` table, multiplies unit price by travelers, and assigns `NEW.total_price`. This prevents client-side price tampering.
> 2. `trg_payment_confirm`: An AFTER INSERT trigger on the `payments` table. When a payment record with status 'success' is committed, this trigger automatically updates the parent booking status from 'pending' to 'confirmed'.
> 3. `trg_booking_cancelled_at`: A BEFORE UPDATE trigger on `bookings` that automatically records `NEW.cancelled_at = NOW()` when status transitions to 'cancelled'.
>
> Most importantly, for financial integrity, booking cancellations and refunds are executed via the stored procedure `sp_cancel_booking`. This procedure exemplifies ACID transaction properties:
> - It initiates an explicit transaction using `START TRANSACTION`.
> - It applies pessimistic row locking using `SELECT ... FOR UPDATE` on the target booking to prevent concurrent modification or race conditions.
> - It dynamically calculates refund percentages based on lead time: 100 percent refund if cancelled 7 or more days prior to travel, 50 percent if between 2 and 6 days, and 0 percent if under 2 days.
> - It atomically inserts a refund record into `refunds`, updates the booking state, and appends a confirmation entry to `email_log`.
> - It declares an `EXIT HANDLER FOR SQLEXCEPTION` ensuring that any runtime failure triggers an immediate `ROLLBACK` and `RESIGNAL`, preventing partial database mutations."

---

## Segment 5: Relational Views & Live GUI Verification (3:45 - 4:30)

- **Visual on Screen**: SQL query execution showing `SELECT * FROM v_trip_details;` and `SELECT * FROM refunds;`. Also show the same schema in pgAdmin / DBeaver.
- **On-Screen Action**: Run the query and show the joined columns (`trip_id`, `full_name`, `destination`, `country`, `hotel`, `duration_days`, `status`).

### Spoken Narration (Word-for-Word):
> "To simplify complex reporting for analytics and administration, we created the relational view `v_trip_details`.
>
> This view encapsulates a four-table relational join combining `trips`, `users`, `destinations`, and `hotels`. As you can see from our query output: `SELECT * FROM v_trip_details;`, it synthesizes traveler demographics, destination geography, accommodation names, and generated trip duration without requiring complex joins in application code.
>
> Notice also our complete database setup displayed here in our GUI management console. Whether using DBeaver, MySQL Workbench, or pgAdmin via our provided PostgreSQL migration script, all 24 relational tables, foreign key constraints, triggers, and procedures are fully visible, navigable, and verifiable."

---

## Segment 6: Frontend UI Walkthrough & End-to-End Database Sync (4:30 - 5:30)

- **Visual on Screen**: Browser showing `http://localhost:3000`.
- **On-Screen Action**:
  1. Open `index.html` -> navigate to `destinations.html`. Filter by continent and price.
  2. Click heart icon to save destination to wishlist.
  3. Navigate to `packages.html`, click 'Reserve' on a package, enter date, click 'Confirm Request'.
  4. Navigate to `my-trips.html` to show the newly created booking with its calculated price. Click 'Pay Now'.
  5. Switch to `admin.html` (Admin Dashboard) and show live updated counts in Users, Bookings, Payments, and Revenue.

### Spoken Narration (Word-for-Word):
> "Now, let us briefly demonstrate how our frontend seamlessly connects to these database features.
>
> Here is the TripNest web application. When browsing destinations or packages, all cards, pricing, and ratings are loaded directly from MySQL via our Node.js REST API. When we apply search and style filters, the backend leverages our indexed database columns to return matching tuples instantaneously.
>
> Clicking the heart icon on any destination invokes our `/api/wishlist/toggle` endpoint, inserting or deleting records in our many-to-many `wishlist` table.
>
> Now, let us book a tour package. We select 'Santorini Sunset Escape', choose our travel date, and submit. Behind the scenes, the stored procedure `sp_book_package` executes, and our `trg_booking_total` trigger automatically computes the total price.
>
> Opening the 'My Trips' portal, we see our active booking displayed from the database. Clicking 'Pay Now' simulates payment processing, inserting into `payments`. Instantly, our `trg_payment_confirm` trigger executes, marking the booking as 'confirmed' and logging an audit notification into `email_log`.
>
> Finally, switching to the Administrator Dashboard at `admin.html`, we observe live telemetry: total users, active itineraries, booking revenue, and audit logs populated directly through our relational views."

---

## Segment 7: Conclusion & Summary for Examiners (5:30 - 5:50)

- **Visual on Screen**: Summary slide or GitHub repository page (`https://github.com/sidharthunni/DBMS-Project`).

### Spoken Narration (Word-for-Word):
> "In conclusion, TripNest demonstrates a complete, robust implementation of modern database concepts: 3NF normalization, foreign key cascade integrity, computed generated columns, B-Tree indexes, active database triggers, atomic transactions in stored procedures, and relational views.
>
> The complete codebase, master schema script, and documentation are available in our GitHub repository. Thank you, and we welcome your questions."

---

## Quick Reference: Top Questions Evaluators Ask (Viva Defense Prep)

1. **Question**: "What normalization level is achieved?"
   - **Answer**: "The schema is fully in 3NF. Multi-valued attributes like inclusions and amenities are normalized into separate tables (1NF). All attributes depend strictly on candidate keys with no partial dependencies (2NF), and no transitive dependencies exist (3NF)."
2. **Question**: "Why use a trigger instead of backend JavaScript to compute total price?"
   - **Answer**: "Computing `total_price` in a BEFORE INSERT trigger enforces business logic at the data tier. If multiple applications or raw SQL queries insert bookings, price integrity is universally maintained, preventing client-side tampering."
3. **Question**: "How do your stored procedures handle concurrency and failure?"
   - **Answer**: "`sp_cancel_booking` uses `START TRANSACTION` with `FOR UPDATE` row-level locks to prevent race conditions during simultaneous cancellations. An `EXIT HANDLER FOR SQLEXCEPTION` automatically executes `ROLLBACK`, guaranteeing atomicity and consistency."
4. **Question**: "What is the role of `v_trip_details`?"
   - **Answer**: "It is an abstraction layer that joins `trips`, `users`, `destinations`, and `hotels`. It provides data independence, simplifies application queries, and restricts access to sensitive user columns like password hashes."
