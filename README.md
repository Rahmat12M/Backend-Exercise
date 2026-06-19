# Backend-Exercise
Exersise

I chose PostgreSQL because I believe this system requires high data accuracy and strong relationships between tables. PostgreSQL is well suited for handling relational data and ensuring data integrity.

To prevent duplicate participant records, I used PostgreSQL's ON CONFLICT (UPSERT) feature together with a unique constraint on (event_id, device_id). If the same device is registered again for the same event, the existing record is updated instead of creating a duplicate.

I used the JSONB data type to store flexible log data, allowing different log details to be saved efficiently without modifying the database schema.

Overall, I believe PostgreSQL is a good choice because it provides strong data integrity and is well suited for data analysis and complex queries.

I chose direct SQL with the pg library because it provides full control over the queries and keeps the project simple, clear, and easy to review.

I used a composite unique constraint "UNIQUE(event_id, device_id)" und in the backend "ON CONFLICT (event_id, device_id) DO UPDATE" to prevent duplicate device registrations for the same event.
If the same device is registered again, the existing record is updated instead of creating a new one.

In the log route, I check if the device is registered using SELECT 1 FROM participants WHERE event_id = $1 AND device_id = $2 in the backend before allowing log creation.

