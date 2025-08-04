# SQL Usage Tutorial

This tutorial provides a comprehensive guide to getting started with SQL database operations and querying.

## Environment Setup

### Installing Database Systems

**MySQL/MariaDB**:
```sql
-- Download from mysql.com or mariadb.org
-- Install MySQL Workbench for GUI
-- Start MySQL service
sudo systemctl start mysql
```

**PostgreSQL**:
```sql
-- Download from postgresql.org
-- Install pgAdmin for GUI
-- Start PostgreSQL service
sudo systemctl start postgresql
```

**SQLite**:
```sql
-- Built into many systems
-- No server setup required
-- Use DB Browser for SQLite
```

### Database Connection

**Command Line**:
```sql
mysql -u username -p database_name
psql -U username -d database_name
sqlite3 database.db
```

**Connection String**:
```sql
-- MySQL
mysql://username:password@localhost:3306/database

-- PostgreSQL
postgresql://username:password@localhost:5432/database

-- SQLite
sqlite:///path/to/database.db
```

## Basic SQL Commands

### Creating Tables

```sql
-- Basic table creation
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table with foreign key
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    total DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Inserting Data

```sql
-- Single row insertion
INSERT INTO users (username, email) 
VALUES ('john_doe', 'john@example.com');

-- Multiple rows
INSERT INTO users (username, email) VALUES 
('jane_smith', 'jane@example.com'),
('bob_wilson', 'bob@example.com');

-- Insert with SELECT
INSERT INTO users (username, email)
SELECT name, email FROM temp_users;
```

### Querying Data

```sql
-- Basic SELECT
SELECT * FROM users;

-- Specific columns
SELECT username, email FROM users;

-- With WHERE clause
SELECT * FROM users WHERE username = 'john_doe';

-- With ORDER BY
SELECT * FROM users ORDER BY created_at DESC;

-- With LIMIT
SELECT * FROM users LIMIT 10;
```

## Advanced Queries

### Joins

```sql
-- INNER JOIN
SELECT u.username, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- LEFT JOIN
SELECT u.username, o.total
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- Multiple joins
SELECT u.username, p.name, o.total
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN products p ON o.product_id = p.id;
```

### Aggregation

```sql
-- COUNT
SELECT COUNT(*) FROM users;

-- GROUP BY
SELECT username, COUNT(*) as order_count
FROM users u
JOIN orders o ON u.id = o.user_id
GROUP BY u.username;

-- HAVING
SELECT username, COUNT(*) as order_count
FROM users u
JOIN orders o ON u.id = o.user_id
GROUP BY u.username
HAVING COUNT(*) > 5;
```

### Subqueries

```sql
-- Subquery in WHERE
SELECT * FROM users 
WHERE id IN (SELECT user_id FROM orders);

-- Subquery in SELECT
SELECT username, 
       (SELECT COUNT(*) FROM orders WHERE user_id = users.id) as order_count
FROM users;

-- EXISTS
SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
```

## Data Modification

### Updating Data

```sql
-- Simple update
UPDATE users SET email = 'newemail@example.com' 
WHERE username = 'john_doe';

-- Update with JOIN
UPDATE users u
JOIN orders o ON u.id = o.user_id
SET u.last_order_date = o.created_at;

-- Conditional update
UPDATE users 
SET status = CASE 
    WHEN order_count > 10 THEN 'premium'
    WHEN order_count > 5 THEN 'regular'
    ELSE 'basic'
END;
```

### Deleting Data

```sql
-- Delete specific rows
DELETE FROM users WHERE username = 'john_doe';

-- Delete with JOIN
DELETE u FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;

-- Truncate table (remove all data)
TRUNCATE TABLE temp_users;
```

## Advanced Features

### Views

```sql
-- Create view
CREATE VIEW user_orders AS
SELECT u.username, o.total, o.created_at
FROM users u
JOIN orders o ON u.id = o.user_id;

-- Query view
SELECT * FROM user_orders WHERE total > 100;

-- Update view
CREATE OR REPLACE VIEW user_orders AS
SELECT u.username, o.total, o.created_at, p.name as product_name
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN products p ON o.product_id = p.id;
```

### Stored Procedures

```sql
-- Create procedure
DELIMITER //
CREATE PROCEDURE GetUserOrders(IN user_id INT)
BEGIN
    SELECT o.*, p.name as product_name
    FROM orders o
    JOIN products p ON o.product_id = p.id
    WHERE o.user_id = user_id;
END //
DELIMITER ;

-- Call procedure
CALL GetUserOrders(1);
```

### Triggers

```sql
-- Before insert trigger
DELIMITER //
CREATE TRIGGER before_user_insert
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    SET NEW.created_at = NOW();
    SET NEW.username = LOWER(NEW.username);
END //
DELIMITER ;

-- After update trigger
CREATE TRIGGER after_order_update
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    INSERT INTO order_log (order_id, action, timestamp)
    VALUES (NEW.id, 'UPDATED', NOW());
END;
```

## Performance Optimization

### Indexes

```sql
-- Create index
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email ON users(email);

-- Composite index
CREATE INDEX idx_user_order ON orders(user_id, created_at);

-- Unique index
CREATE UNIQUE INDEX idx_unique_email ON users(email);
```

### Query Optimization

```sql
-- Use EXPLAIN to analyze queries
EXPLAIN SELECT * FROM users WHERE username = 'john_doe';

-- Optimize with proper WHERE clauses
SELECT * FROM users 
WHERE created_at >= '2024-01-01' 
AND created_at < '2024-02-01';

-- Use appropriate JOIN types
SELECT u.username, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.total > 100;
```

## Best Practices

### Security

```sql
-- Use parameterized queries
PREPARE stmt FROM 'SELECT * FROM users WHERE username = ?';
EXECUTE stmt USING 'john_doe';

-- Grant minimal permissions
GRANT SELECT ON database.* TO 'readonly_user'@'localhost';
GRANT INSERT, UPDATE ON database.users TO 'app_user'@'localhost';
```

### Data Integrity

```sql
-- Use transactions
START TRANSACTION;
INSERT INTO orders (user_id, total) VALUES (1, 100.00);
UPDATE users SET last_order_date = NOW() WHERE id = 1;
COMMIT;

-- Add constraints
ALTER TABLE users ADD CONSTRAINT chk_email 
CHECK (email LIKE '%@%');

-- Use foreign keys
ALTER TABLE orders 
ADD CONSTRAINT fk_user_id 
FOREIGN KEY (user_id) REFERENCES users(id);
```

This tutorial covers essential SQL concepts and practices. Continue exploring SQL features to become proficient in database management and querying. 