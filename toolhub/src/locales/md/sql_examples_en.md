# SQL Code Examples

This document provides practical SQL code examples covering core database operations and querying techniques.

## Basic Database Operations

### Creating Tables

```sql
-- Create users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table with foreign keys
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Inserting Data

```sql
-- Insert single user
INSERT INTO users (username, email, password_hash) 
VALUES ('john_doe', 'john@example.com', 'hashed_password_123');

-- Insert multiple products
INSERT INTO products (name, description, price, stock_quantity, category_id) VALUES 
('Laptop', 'High-performance laptop', 999.99, 50, 1),
('Mouse', 'Wireless optical mouse', 29.99, 100, 2),
('Keyboard', 'Mechanical keyboard', 89.99, 75, 2);

-- Insert with SELECT
INSERT INTO users (username, email, password_hash)
SELECT name, email, password FROM temp_users WHERE status = 'active';
```

### Basic Queries

```sql
-- Select all users
SELECT * FROM users;

-- Select specific columns
SELECT username, email, created_at FROM users;

-- Filter with WHERE
SELECT * FROM users WHERE created_at >= '2024-01-01';

-- Order results
SELECT * FROM products ORDER BY price DESC;

-- Limit results
SELECT * FROM users LIMIT 10 OFFSET 20;
```

## Advanced Queries

### Joins

```sql
-- Inner join to get user orders
SELECT u.username, o.total_amount, o.status
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- Left join to include users without orders
SELECT u.username, COALESCE(o.total_amount, 0) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- Multiple table join
SELECT u.username, p.name as product_name, oi.quantity, oi.price
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id;
```

### Aggregation Functions

```sql
-- Count total users
SELECT COUNT(*) as total_users FROM users;

-- Average product price
SELECT AVG(price) as avg_price FROM products;

-- Sum of all orders
SELECT SUM(total_amount) as total_revenue FROM orders;

-- Group by with aggregation
SELECT category_id, COUNT(*) as product_count, AVG(price) as avg_price
FROM products
GROUP BY category_id;

-- Having clause
SELECT user_id, COUNT(*) as order_count
FROM orders
GROUP BY user_id
HAVING COUNT(*) > 5;
```

### Subqueries

```sql
-- Subquery in WHERE clause
SELECT * FROM users 
WHERE id IN (SELECT DISTINCT user_id FROM orders);

-- Subquery in SELECT
SELECT username, 
       (SELECT COUNT(*) FROM orders WHERE user_id = users.id) as order_count
FROM users;

-- EXISTS subquery
SELECT * FROM products p
WHERE EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.id);

-- Correlated subquery
SELECT p.name, p.price,
       (SELECT AVG(price) FROM products WHERE category_id = p.category_id) as category_avg
FROM products p;
```

## Data Modification

### Updating Data

```sql
-- Simple update
UPDATE users SET email = 'newemail@example.com' WHERE username = 'john_doe';

-- Update with JOIN
UPDATE products p
JOIN categories c ON p.category_id = c.id
SET p.price = p.price * 1.1
WHERE c.name = 'Electronics';

-- Conditional update with CASE
UPDATE users 
SET status = CASE 
    WHEN (SELECT COUNT(*) FROM orders WHERE user_id = users.id) > 10 THEN 'premium'
    WHEN (SELECT COUNT(*) FROM orders WHERE user_id = users.id) > 5 THEN 'regular'
    ELSE 'basic'
END;
```

### Deleting Data

```sql
-- Delete specific user
DELETE FROM users WHERE username = 'john_doe';

-- Delete with subquery
DELETE FROM products 
WHERE id NOT IN (SELECT DISTINCT product_id FROM order_items);

-- Delete orphaned records
DELETE u FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;
```

## Advanced Features

### Views

```sql
-- Create simple view
CREATE VIEW user_summary AS
SELECT u.username, u.email, COUNT(o.id) as order_count, SUM(o.total_amount) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.username, u.email;

-- Query the view
SELECT * FROM user_summary WHERE total_spent > 1000;

-- Create complex view
CREATE VIEW product_sales AS
SELECT p.name, p.price, COUNT(oi.id) as times_ordered, SUM(oi.quantity) as total_quantity
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name, p.price;
```

### Stored Procedures

```sql
-- Create procedure to get user orders
DELIMITER //
CREATE PROCEDURE GetUserOrders(IN user_id INT)
BEGIN
    SELECT o.id, o.total_amount, o.status, o.created_at,
           GROUP_CONCAT(p.name) as products
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = user_id
    GROUP BY o.id;
END //
DELIMITER ;

-- Call the procedure
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
    SET NEW.username = LOWER(NEW.username);
    SET NEW.email = LOWER(NEW.email);
END //
DELIMITER ;

-- After update trigger
CREATE TRIGGER after_order_update
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
        INSERT INTO notifications (user_id, message, created_at)
        VALUES (NEW.user_id, 'Your order has been delivered!', NOW());
    END IF;
END;
```

## Performance Optimization

### Indexes

```sql
-- Create indexes for better performance
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_user_orders ON orders(user_id, created_at);
CREATE INDEX idx_product_category ON products(category_id, price);

-- Composite index
CREATE INDEX idx_order_status_date ON orders(status, created_at);

-- Unique index
CREATE UNIQUE INDEX idx_unique_email ON users(email);
```

### Query Optimization

```sql
-- Use EXPLAIN to analyze query performance
EXPLAIN SELECT u.username, o.total_amount
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.created_at >= '2024-01-01';

-- Optimize with proper WHERE clauses
SELECT * FROM products 
WHERE category_id = 1 
AND price BETWEEN 50 AND 200
AND stock_quantity > 0;

-- Use appropriate JOIN types
SELECT u.username, COUNT(o.id) as order_count
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.status = 'delivered'
GROUP BY u.id, u.username;
```

## Best Practices

### Security

```sql
-- Use parameterized queries (prepared statements)
PREPARE stmt FROM 'SELECT * FROM users WHERE username = ? AND email = ?';
EXECUTE stmt USING 'john_doe', 'john@example.com';

-- Grant minimal permissions
GRANT SELECT ON database.users TO 'readonly_user'@'localhost';
GRANT INSERT, UPDATE ON database.orders TO 'app_user'@'localhost';
REVOKE DELETE ON database.users FROM 'app_user'@'localhost';
```

### Data Integrity

```sql
-- Use transactions for data consistency
START TRANSACTION;
INSERT INTO orders (user_id, total_amount) VALUES (1, 150.00);
UPDATE products SET stock_quantity = stock_quantity - 1 WHERE id = 1;
COMMIT;

-- Add constraints
ALTER TABLE users ADD CONSTRAINT chk_email CHECK (email LIKE '%@%');
ALTER TABLE products ADD CONSTRAINT chk_price CHECK (price > 0);
ALTER TABLE orders ADD CONSTRAINT chk_amount CHECK (total_amount >= 0);
```

These examples demonstrate core SQL concepts and best practices for effective database management and querying. 