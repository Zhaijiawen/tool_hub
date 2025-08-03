# SQL 使用教程

本教程提供了开始SQL数据库操作和查询的综合指南。

## 环境搭建

### 安装数据库系统

**MySQL/MariaDB**：
```sql
-- 从mysql.com或mariadb.org下载
-- 安装MySQL Workbench作为GUI
-- 启动MySQL服务
sudo systemctl start mysql
```

**PostgreSQL**：
```sql
-- 从postgresql.org下载
-- 安装pgAdmin作为GUI
-- 启动PostgreSQL服务
sudo systemctl start postgresql
```

**SQLite**：
```sql
-- 内置在许多系统中
-- 无需服务器设置
-- 使用DB Browser for SQLite
```

### 数据库连接

**命令行**：
```sql
mysql -u username -p database_name
psql -U username -d database_name
sqlite3 database.db
```

**连接字符串**：
```sql
-- MySQL
mysql://username:password@localhost:3306/database

-- PostgreSQL
postgresql://username:password@localhost:5432/database

-- SQLite
sqlite:///path/to/database.db
```

## 基本SQL命令

### 创建表

```sql
-- 基本表创建
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 带外键的表
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    total DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 插入数据

```sql
-- 单行插入
INSERT INTO users (username, email) 
VALUES ('john_doe', 'john@example.com');

-- 多行插入
INSERT INTO users (username, email) VALUES 
('jane_smith', 'jane@example.com'),
('bob_wilson', 'bob@example.com');

-- 使用SELECT插入
INSERT INTO users (username, email)
SELECT name, email FROM temp_users;
```

### 查询数据

```sql
-- 基本SELECT
SELECT * FROM users;

-- 特定列
SELECT username, email FROM users;

-- 带WHERE子句
SELECT * FROM users WHERE username = 'john_doe';

-- 带ORDER BY
SELECT * FROM users ORDER BY created_at DESC;

-- 带LIMIT
SELECT * FROM users LIMIT 10;
```

## 高级查询

### 连接

```sql
-- 内连接
SELECT u.username, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- 左连接
SELECT u.username, o.total
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- 多表连接
SELECT u.username, p.name, o.total
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN products p ON o.product_id = p.id;
```

### 聚合

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

### 子查询

```sql
-- WHERE中的子查询
SELECT * FROM users 
WHERE id IN (SELECT user_id FROM orders);

-- SELECT中的子查询
SELECT username, 
       (SELECT COUNT(*) FROM orders WHERE user_id = users.id) as order_count
FROM users;

-- EXISTS
SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
```

## 数据修改

### 更新数据

```sql
-- 简单更新
UPDATE users SET email = 'newemail@example.com' 
WHERE username = 'john_doe';

-- 带JOIN的更新
UPDATE users u
JOIN orders o ON u.id = o.user_id
SET u.last_order_date = o.created_at;

-- 条件更新
UPDATE users 
SET status = CASE 
    WHEN order_count > 10 THEN 'premium'
    WHEN order_count > 5 THEN 'regular'
    ELSE 'basic'
END;
```

### 删除数据

```sql
-- 删除特定行
DELETE FROM users WHERE username = 'john_doe';

-- 带JOIN的删除
DELETE u FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;

-- 截断表（删除所有数据）
TRUNCATE TABLE temp_users;
```

## 高级功能

### 视图

```sql
-- 创建视图
CREATE VIEW user_orders AS
SELECT u.username, o.total, o.created_at
FROM users u
JOIN orders o ON u.id = o.user_id;

-- 查询视图
SELECT * FROM user_orders WHERE total > 100;

-- 更新视图
CREATE OR REPLACE VIEW user_orders AS
SELECT u.username, o.total, o.created_at, p.name as product_name
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN products p ON o.product_id = p.id;
```

### 存储过程

```sql
-- 创建存储过程
DELIMITER //
CREATE PROCEDURE GetUserOrders(IN user_id INT)
BEGIN
    SELECT o.*, p.name as product_name
    FROM orders o
    JOIN products p ON o.product_id = p.id
    WHERE o.user_id = user_id;
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
    SET NEW.created_at = NOW();
    SET NEW.username = LOWER(NEW.username);
END //
DELIMITER ;

-- 更新后触发器
CREATE TRIGGER after_order_update
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    INSERT INTO order_log (order_id, action, timestamp)
    VALUES (NEW.id, 'UPDATED', NOW());
END;
```

## 性能优化

### 索引

```sql
-- 创建索引
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email ON users(email);

-- 复合索引
CREATE INDEX idx_user_order ON orders(user_id, created_at);

-- 唯一索引
CREATE UNIQUE INDEX idx_unique_email ON users(email);
```

### 查询优化

```sql
-- 使用EXPLAIN分析查询
EXPLAIN SELECT * FROM users WHERE username = 'john_doe';

-- 使用适当的WHERE子句优化
SELECT * FROM users 
WHERE created_at >= '2024-01-01' 
AND created_at < '2024-02-01';

-- 使用适当的JOIN类型
SELECT u.username, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.total > 100;
```

## 最佳实践

### 安全

```sql
-- 使用参数化查询
PREPARE stmt FROM 'SELECT * FROM users WHERE username = ?';
EXECUTE stmt USING 'john_doe';

-- 授予最小权限
GRANT SELECT ON database.* TO 'readonly_user'@'localhost';
GRANT INSERT, UPDATE ON database.users TO 'app_user'@'localhost';
```

### 数据完整性

```sql
-- 使用事务
START TRANSACTION;
INSERT INTO orders (user_id, total) VALUES (1, 100.00);
UPDATE users SET last_order_date = NOW() WHERE id = 1;
COMMIT;

-- 添加约束
ALTER TABLE users ADD CONSTRAINT chk_email 
CHECK (email LIKE '%@%');

-- 使用外键
ALTER TABLE orders 
ADD CONSTRAINT fk_user_id 
FOREIGN KEY (user_id) REFERENCES users(id);
```

本教程涵盖了基本的SQL概念和实践。继续探索SQL功能以精通数据库管理和查询。 