# SQLite Tool — Usage Tutorial

## Open an existing database

1. Choose **Upload**, pick a `.sqlite3` file.
2. Give it a name in OPFS (defaults to the file name), click **Import**.
3. The table list appears on the left; click a name to browse, or write SQL on the right.

## Create a new database

1. Choose **New**, fill in a name.
2. Pick storage: **OPFS** (persistent) or **memory** (temporary).
3. Build tables and insert in the SQL editor, e.g.:

```sql
CREATE TABLE notes(id INTEGER PRIMARY KEY, body TEXT);
INSERT INTO notes(body) VALUES ('hello');
SELECT * FROM notes;
```

## Query and export

- Write a `SELECT`, click Run; results show as a table, click **Export CSV** to download.
- Write a data-changing statement and it shows affected rows.
- The top bar **Export** downloads the whole database as `.sqlite3`.

## Saved databases

Switch to the **Saved** tab to see databases previously stored in OPFS; open or delete them. Note: deleting removes them from OPFS permanently.

## Tips

- When OPFS is unavailable, New can only use memory mode — lost on close, so export in time.
- Wrap table/column names with special characters in double quotes, e.g. `SELECT * FROM "my table"`.
