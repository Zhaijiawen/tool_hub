# SQL — What's Going On Under the Hood

SQL has been around since the 1970s. IBM researchers Chamberlin and Boyce cooked up SEQUEL (later SQL) as a way to talk to databases in something resembling English. Oracle shipped the first commercial version in 1979, and it's been the lingua franca of relational databases ever since.

## The Core Idea

SQL is declarative — you say *what* you want, not *how* to get it. The database engine figures out the most efficient plan. That's the whole magic: write `SELECT * FROM users WHERE active = true` and let the query planner worry about index scans, join strategies, and memory buffers.

The relational model underneath is dead simple: everything is tables (relations) with rows and columns. SQL gives you four sub-languages to interact with them:

- **DDL** — `CREATE`, `ALTER`, `DROP`; you're defining the schema
- **DML** — `SELECT`, `INSERT`, `UPDATE`, `DELETE`; the stuff you write 99% of the time
- **DCL** — `GRANT`, `REVOKE`; who can do what
- **TCL** — `COMMIT`, `ROLLBACK`, `SAVEPOINT`; transaction control

## Why SQL Sticks Around

**ACID transactions.** Atomicity, Consistency, Isolation, Durability. If you move money between accounts, either both updates happen or neither does. No half-states. Every major RDBMS guarantees this.

**Constraints protect your data.** Primary keys, foreign keys, `NOT NULL`, `CHECK`, `UNIQUE` — the database refuses to store bad data. Way more reliable than hoping application code never has a bug.

**Indexes make it fast.** A B-tree index turns an O(n) table scan into an O(log n) lookup. Get your indexes right and a billion-row table queries in milliseconds.

## The Big Players

- **PostgreSQL** — the developer's database. JSONB, full-text search, window functions, CTEs, extensions. If you're starting something new, you pick Postgres.
- **MySQL/MariaDB** — powers half the internet. Simple, fast, great for read-heavy workloads. The LAMP stack default.
- **SQLite** — a library, not a server. Embedded in your phone, your browser, your apps. Zero setup, zero config, single-file storage.
- **SQL Server / Oracle** — enterprise staples with licensing costs to match. Huge ecosystems of tooling.

## The Things Nobody Told You

**NULL is weird.** `NULL = NULL` is not true — it's NULL. Use `IS NULL` / `IS NOT NULL`. Aggregate functions skip NULLs, except `COUNT(*)`.

**Indexes aren't free.** Every index slows down writes because it needs updating. Index columns you query, not every column. Use `EXPLAIN` (or `EXPLAIN ANALYZE`) to see what the planner actually does.

**Parameterize everything.** Never concatenate user input into SQL strings. That's how you get pwned. Parameterized queries (prepared statements) are immune to SQL injection because the query structure is fixed before values are plugged in.

**Transactions are cheap until they're not.** Holding a transaction open locks rows. Long-running transactions are the #1 cause of mysterious production slowdowns. Keep them short.
