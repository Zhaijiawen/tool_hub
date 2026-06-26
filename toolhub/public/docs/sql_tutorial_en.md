# SQL — Using the Formatter

The SQL formatter takes messy, unindented queries and turns them into clean, readable SQL. Paste into the editor, hit format, and the result appears in place.

## Basic Operations

### Creating Tables

```sql
-- Clean table definition
CREATE TABLE users (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    username    VARCHAR(50) NOT NULL UNIQUE,
    email       VARCHAR(100) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table with foreign key
CREATE TABLE orders (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    user_id     INT NOT NULL,
    total       DECIMAL(10, 2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Inserting Data

```sql
-- Single row
INSERT INTO users (username, email)
VALUES ('john_doe', 'john@example.com');

-- Multiple rows — way faster than individual inserts
INSERT INTO users (username, email) VALUES
    ('jane_smith', 'jane@example.com'),
    ('bob_wilson', 'bob@example.com');

-- Insert from another table
INSERT INTO users (username, email)
SELECT name, email FROM temp_users;
```

### Querying

```sql
-- Basic SELECT
SELECT * FROM users;

-- Pick columns explicitly — faster, clearer
SELECT username, email FROM users;

-- Filter and sort
SELECT * FROM users
WHERE created_at >= '2024-01-01'
ORDER BY created_at DESC
LIMIT 10;
```

## Joins — The Bread and Butter

```sql
-- INNER JOIN: only rows that match in both tables
SELECT u.username, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- LEFT JOIN: all users, even those with no orders
SELECT u.username, COALESCE(o.total, 0) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- Multiple joins
SELECT u.username, p.name AS product, oi.quantity
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id;
```

## Aggregation

```sql
-- Simple counts
SELECT COUNT(*) FROM users;
SELECT AVG(price) FROM products;
SELECT SUM(total) FROM orders;

-- GROUP BY: aggregate per group
SELECT user_id, COUNT(*) AS order_count, SUM(total) AS total_spent
FROM orders
GROUP BY user_id;

-- HAVING: filter AFTER aggregation (WHERE filters before)
SELECT user_id, COUNT(*) AS order_count
FROM orders
GROUP BY user_id
HAVING COUNT(*) > 5;
```

## Subqueries

```sql
-- Subquery in WHERE
SELECT * FROM users
WHERE id IN (SELECT DISTINCT user_id FROM orders);

-- Correlated subquery in SELECT
SELECT username,
       (SELECT COUNT(*) FROM orders WHERE user_id = users.id) AS order_count
FROM users;

-- EXISTS: often faster than IN for large sets
SELECT * FROM products p
WHERE EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.id);
```

## Modifying Data

```sql
-- Update
UPDATE users SET email = 'new@example.com' WHERE username = 'john_doe';

-- Conditional update
UPDATE users SET status =
    CASE
        WHEN order_count > 10 THEN 'premium'
        WHEN order_count > 5  THEN 'regular'
        ELSE 'basic'
    END;

-- Delete
DELETE FROM users WHERE username = 'john_doe';

-- Delete with join — remove users with no orders
DELETE u FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;
```

## Transactions

```sql
START TRANSACTION;
INSERT INTO orders (user_id, total) VALUES (1, 100.00);
UPDATE users SET last_order_date = NOW() WHERE id = 1;
COMMIT;
-- If anything fails before COMMIT, ROLLBACK undoes everything
```

## Practical Tips

- Format your SQL. Consistent indentation makes joins and subqueries readable at a glance.
- Always use `WHERE` with `UPDATE` and `DELETE` — unless you really mean to hit every row.
- `SELECT *` is fine for exploration, but list columns explicitly in production code. Schema changes won't break your queries.
- Use `EXPLAIN` before shipping a query to production. A missing index can turn a sub-millisecond query into a minute-long table scan.
