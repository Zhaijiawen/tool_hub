# SQL — 使用格式化工具

SQL 格式化工具把乱成一团的查询语句整理得干净工整。粘贴到编辑区，点格式化，结果原位输出。

## 基本操作

### 建表

```sql
-- 清爽的表定义
CREATE TABLE users (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    username    VARCHAR(50) NOT NULL UNIQUE,
    email       VARCHAR(100) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 带外键的表
CREATE TABLE orders (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    user_id     INT NOT NULL,
    total       DECIMAL(10, 2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 插入数据

```sql
-- 单行插入
INSERT INTO users (username, email)
VALUES ('john_doe', 'john@example.com');

-- 批量插入 — 比逐行插快得多
INSERT INTO users (username, email) VALUES
    ('jane_smith', 'jane@example.com'),
    ('bob_wilson', 'bob@example.com');

-- 从另一张表插入
INSERT INTO users (username, email)
SELECT name, email FROM temp_users;
```

### 查询

```sql
-- 基本查询
SELECT * FROM users;

-- 明确指定列 — 更快、更清晰
SELECT username, email FROM users;

-- 过滤和排序
SELECT * FROM users
WHERE created_at >= '2024-01-01'
ORDER BY created_at DESC
LIMIT 10;
```

## 连接 — 日常操作的核心

```sql
-- INNER JOIN：只返回两表都匹配的行
SELECT u.username, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- LEFT JOIN：所有用户都返回，没订单的显示 NULL
SELECT u.username, COALESCE(o.total, 0) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- 多表连接
SELECT u.username, p.name AS product, oi.quantity
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id;
```

## 聚合

```sql
-- 简单统计
SELECT COUNT(*) FROM users;
SELECT AVG(price) FROM products;
SELECT SUM(total) FROM orders;

-- GROUP BY：按组聚合
SELECT user_id, COUNT(*) AS order_count, SUM(total) AS total_spent
FROM orders
GROUP BY user_id;

-- HAVING：聚合之后筛选（WHERE 是聚合之前筛）
SELECT user_id, COUNT(*) AS order_count
FROM orders
GROUP BY user_id
HAVING COUNT(*) > 5;
```

## 子查询

```sql
-- WHERE 里的子查询
SELECT * FROM users
WHERE id IN (SELECT DISTINCT user_id FROM orders);

-- SELECT 里的关联子查询
SELECT username,
       (SELECT COUNT(*) FROM orders WHERE user_id = users.id) AS order_count
FROM users;

-- EXISTS：大数据量下通常比 IN 快
SELECT * FROM products p
WHERE EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.id);
```

## 修改数据

```sql
-- 更新
UPDATE users SET email = 'new@example.com' WHERE username = 'john_doe';

-- 条件更新
UPDATE users SET status =
    CASE
        WHEN order_count > 10 THEN 'premium'
        WHEN order_count > 5  THEN 'regular'
        ELSE 'basic'
    END;

-- 删除
DELETE FROM users WHERE username = 'john_doe';

-- 联表删除 — 删掉没有订单的用户
DELETE u FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;
```

## 事务

```sql
START TRANSACTION;
INSERT INTO orders (user_id, total) VALUES (1, 100.00);
UPDATE users SET last_order_date = NOW() WHERE id = 1;
COMMIT;
-- COMMIT 之前任何一步出错，ROLLBACK 全部回滚
```

## 实用建议

- SQL 一定要格式化。缩进统一了，join 和子查询的层次一眼就能看清。
- `UPDATE` 和 `DELETE` 务必带 `WHERE`——除非你真心想操作所有行。
- 探索时 `SELECT *` 没问题，但生产代码里明确列出列名。表结构变了查询不会崩。
- 上生产之前先跑 `EXPLAIN`。少个索引，毫秒级查询就能变成全表扫描跑几分钟。
