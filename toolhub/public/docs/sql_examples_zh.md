# SQL 代码示例

本文档提供了涵盖核心数据库操作和查询技术的实用SQL代码示例。

## 基本数据库操作

### 创建表

```sql
-- 创建用户表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建产品表
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建订单表（带外键）
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 插入数据

```sql
-- 插入单个用户
INSERT INTO users (username, email, password_hash) 
VALUES ('john_doe', 'john@example.com', 'hashed_password_123');

-- 插入多个产品
INSERT INTO products (name, description, price, stock_quantity, category_id) VALUES 
('Laptop', 'High-performance laptop', 999.99, 50, 1),
('Mouse', 'Wireless optical mouse', 29.99, 100, 2),
('Keyboard', 'Mechanical keyboard', 89.99, 75, 2);

-- 使用SELECT插入
INSERT INTO users (username, email, password_hash)
SELECT name, email, password FROM temp_users WHERE status = 'active';
```

### 基本查询

```sql
-- 选择所有用户
SELECT * FROM users;

-- 选择特定列
SELECT username, email, created_at FROM users;

-- 使用WHERE过滤
SELECT * FROM users WHERE created_at >= '2024-01-01';

-- 排序结果
SELECT * FROM products ORDER BY price DESC;

-- 限制结果
SELECT * FROM users LIMIT 10 OFFSET 20;
```

## 高级查询

### 连接

```sql
-- 内连接获取用户订单
SELECT u.username, o.total_amount, o.status
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- 左连接包含没有订单的用户
SELECT u.username, COALESCE(o.total_amount, 0) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- 多表连接
SELECT u.username, p.name as product_name, oi.quantity, oi.price
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id;
```

### 聚合函数

```sql
-- 计算总用户数
SELECT COUNT(*) as total_users FROM users;

-- 平均产品价格
SELECT AVG(price) as avg_price FROM products;

-- 所有订单的总和
SELECT SUM(total_amount) as total_revenue FROM orders;

-- 带聚合的分组
SELECT category_id, COUNT(*) as product_count, AVG(price) as avg_price
FROM products
GROUP BY category_id;

-- HAVING子句
SELECT user_id, COUNT(*) as order_count
FROM orders
GROUP BY user_id
HAVING COUNT(*) > 5;
```

### 子查询

```sql
-- WHERE子句中的子查询
SELECT * FROM users 
WHERE id IN (SELECT DISTINCT user_id FROM orders);

-- SELECT中的子查询
SELECT username, 
       (SELECT COUNT(*) FROM orders WHERE user_id = users.id) as order_count
FROM users;

-- EXISTS子查询
SELECT * FROM products p
WHERE EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.id);

-- 相关子查询
SELECT p.name, p.price,
       (SELECT AVG(price) FROM products WHERE category_id = p.category_id) as category_avg
FROM products p;
```

## 数据修改

### 更新数据

```sql
-- 简单更新
UPDATE users SET email = 'newemail@example.com' WHERE username = 'john_doe';

-- 带JOIN的更新
UPDATE products p
JOIN categories c ON p.category_id = c.id
SET p.price = p.price * 1.1
WHERE c.name = 'Electronics';

-- 带CASE的条件更新
UPDATE users 
SET status = CASE 
    WHEN (SELECT COUNT(*) FROM orders WHERE user_id = users.id) > 10 THEN 'premium'
    WHEN (SELECT COUNT(*) FROM orders WHERE user_id = users.id) > 5 THEN 'regular'
    ELSE 'basic'
END;
```

### 删除数据

```sql
-- 删除特定用户
DELETE FROM users WHERE username = 'john_doe';

-- 带子查询的删除
DELETE FROM products 
WHERE id NOT IN (SELECT DISTINCT product_id FROM order_items);

-- 删除孤立记录
DELETE u FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;
```

## 高级功能

### 视图

```sql
-- 创建简单视图
CREATE VIEW user_summary AS
SELECT u.username, u.email, COUNT(o.id) as order_count, SUM(o.total_amount) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.username, u.email;

-- 查询视图
SELECT * FROM user_summary WHERE total_spent > 1000;

-- 创建复杂视图
CREATE VIEW product_sales AS
SELECT p.name, p.price, COUNT(oi.id) as times_ordered, SUM(oi.quantity) as total_quantity
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name, p.price;
```

### 存储过程

```sql
-- 创建获取用户订单的存储过程
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

-- 调用存储过程
CALL GetUserOrders(1);
```

### 触发器

```sql
-- 插入前触发器
DELIMITER //
CREATE TRIGGER before_user_insert
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    SET NEW.username = LOWER(NEW.username);
    SET NEW.email = LOWER(NEW.email);
END //
DELIMITER ;

-- 更新后触发器
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

## 性能优化

### 索引

```sql
-- 创建索引以提高性能
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_user_orders ON orders(user_id, created_at);
CREATE INDEX idx_product_category ON products(category_id, price);

-- 复合索引
CREATE INDEX idx_order_status_date ON orders(status, created_at);

-- 唯一索引
CREATE UNIQUE INDEX idx_unique_email ON users(email);
```

### 查询优化

```sql
-- 使用EXPLAIN分析查询性能
EXPLAIN SELECT u.username, o.total_amount
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.created_at >= '2024-01-01';

-- 使用适当的WHERE子句优化
SELECT * FROM products 
WHERE category_id = 1 
AND price BETWEEN 50 AND 200
AND stock_quantity > 0;

-- 使用适当的JOIN类型
SELECT u.username, COUNT(o.id) as order_count
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.status = 'delivered'
GROUP BY u.id, u.username;
```

## 最佳实践

### 安全

```sql
-- 使用参数化查询（预处理语句）
PREPARE stmt FROM 'SELECT * FROM users WHERE username = ? AND email = ?';
EXECUTE stmt USING 'john_doe', 'john@example.com';

-- 授予最小权限
GRANT SELECT ON database.users TO 'readonly_user'@'localhost';
GRANT INSERT, UPDATE ON database.orders TO 'app_user'@'localhost';
REVOKE DELETE ON database.users FROM 'app_user'@'localhost';
```

### 数据完整性

```sql
-- 使用事务确保数据一致性
START TRANSACTION;
INSERT INTO orders (user_id, total_amount) VALUES (1, 150.00);
UPDATE products SET stock_quantity = stock_quantity - 1 WHERE id = 1;
COMMIT;

-- 添加约束
ALTER TABLE users ADD CONSTRAINT chk_email CHECK (email LIKE '%@%');
ALTER TABLE products ADD CONSTRAINT chk_price CHECK (price > 0);
ALTER TABLE orders ADD CONSTRAINT chk_amount CHECK (total_amount >= 0);
```

这些示例演示了核心SQL概念和有效数据库管理和查询的最佳实践。 