# SQLite Tool — Examples

## Import and browse an existing database

**Input:** `chinook.sqlite3` (sample music DB)
**Action:** upload import, click the `albums` table
**Output:** table showing the first 200 albums

No SQLite client to install — browse right in the browser.

## Build a table and export to CSV

```sql
CREATE TABLE tasks(id INTEGER PRIMARY KEY, title TEXT, done INTEGER);
INSERT INTO tasks(title, done) VALUES ('write docs', 1), ('ship', 0);
SELECT * FROM tasks WHERE done = 0;
```

**Output:** table of unfinished tasks; click **Export CSV** to get `query-result.csv`.

## Spin up an in-memory DB to try SQL

**Action:** New, choose **memory**, run a throwaway query
**Note:** gone on close — perfect for testing syntax or an idea without touching local files.

## Export the edited database

**Action:** top bar **Export**
**Output:** the current database downloaded as a `.sqlite3` file

When you've changed data and want to keep it or send it, export.
