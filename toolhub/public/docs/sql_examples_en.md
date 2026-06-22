# SQL — Code Examples

## A Real Schema

Three tables that model a simple e-commerce setup:

```sql
CREATE TABLE users (
    id            INT PRIMARY KEY AUTO_INCREMENT,
    username      VARCHAR(50) NOT NULL UNIQUE,
    email         VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id             INT PRIMARY KEY AUTO_INCREMENT,
    name           VARCHAR(100) NOT NULL,
    description    TEXT,
    price          DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    category_id    INT,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id           INT PRIMARY KEY AUTO_INCREMENT,
    user_id      INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status       ENUM('pending', 'processing', 'shipped', 'delivered') DEFAULT 'pending',
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    id         INT PRIMARY KEY AUTO_INCREMENT,
    order_id   INT NOT NULL,
    product_id INT NOT NULL,
    quantity   INT NOT NULL DEFAULT 1,
    price      DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

## Joins That Actually Do Something Useful

```sql
-- Orders with user names and product details — the classic report query
SELECT
    o.id AS order_id,
    u.username,
    p.name AS product,
    oi.quantity,
    oi.price,
    o.status,
    o.created_at
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.created_at >= '2024-01-01'
ORDER BY o.created_at DESC;

-- Users with their lifetime spending — LEFT JOIN so users with no orders show $0
SELECT
    u.username,
    u.email,
    COUNT(o.id) AS total_orders,
    COALESCE(SUM(o.total_amount), 0) AS lifetime_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.username, u.email
ORDER BY lifetime_spent DESC;
```

## Aggregation with Real Numbers

```sql
-- Sales by category
SELECT
    c.name AS category,
    COUNT(DISTINCT p.id) AS product_count,
    SUM(oi.quantity) AS units_sold,
    SUM(oi.quantity * oi.price) AS revenue
FROM categories c
JOIN products p ON c.id = p.category_id
JOIN order_items oi ON p.id = oi.product_id
GROUP BY c.id, c.name
HAVING revenue > 1000
ORDER BY revenue DESC;

-- Monthly revenue trend
SELECT
    DATE_FORMAT(created_at, '%Y-%m') AS month,
    COUNT(*) AS order_count,
    SUM(total_amount) AS revenue
FROM orders
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY month;
```

## Useful Subquery Patterns

```sql
-- Top-spending users with subquery
SELECT username, email,
       (SELECT COUNT(*) FROM orders WHERE user_id = users.id) AS order_count,
       (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE user_id = users.id) AS total_spent
FROM users
ORDER BY total_spent DESC
LIMIT 10;

-- Products never ordered — find dead inventory
SELECT p.id, p.name, p.stock_quantity
FROM products p
WHERE NOT EXISTS (
    SELECT 1 FROM order_items oi WHERE oi.product_id = p.id
)
ORDER BY p.stock_quantity DESC;

-- Users who placed orders above the average
SELECT username, total_amount
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.total_amount > (SELECT AVG(total_amount) FROM orders);
```

## Window Functions (MySQL 8+ / PostgreSQL)

```sql
-- Rank users by spending
SELECT
    username,
    SUM(o.total_amount) AS total_spent,
    RANK() OVER (ORDER BY SUM(o.total_amount) DESC) AS spending_rank
FROM users u
JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.username;

-- Running total of orders per month
SELECT
    DATE_FORMAT(created_at, '%Y-%m') AS month,
    COUNT(*) AS orders,
    SUM(COUNT(*)) OVER (ORDER BY DATE_FORMAT(created_at, '%Y-%m')) AS cumulative_orders
FROM orders
GROUP BY DATE_FORMAT(created_at, '%Y-%m');
```

## Transactions Done Right

```sql
-- Place an order atomically: deduct stock, create order, create line items
START TRANSACTION;

-- Verify stock
SELECT stock_quantity INTO @stock FROM products WHERE id = 1 FOR UPDATE;

IF @stock < 2 THEN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Not enough stock';
END IF;

INSERT INTO orders (user_id, total_amount) VALUES (1, 199.98);
SET @order_id = LAST_INSERT_ID();

INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES (@order_id, 1, 2, 99.99);

UPDATE products SET stock_quantity = stock_quantity - 2 WHERE id = 1;

COMMIT;
```

`SELECT ... FOR UPDATE` locks the row so concurrent transactions can't snatch the stock between your check and your deduction.

## Indexes Worth Creating

```sql
-- Single-column indexes for frequent filters
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Composite index for the most common query pattern
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);

-- Covering index — the query never touches the table, only the index
CREATE INDEX idx_products_active ON products(category_id, price, stock_quantity);

-- See if it's actually used
EXPLAIN SELECT * FROM orders WHERE user_id = 1 AND created_at >= '2024-01-01';
```
