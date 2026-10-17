# SQLite Tool — Technical Background

This tool opens, queries, and edits SQLite databases in the browser using **wa-sqlite** (SQLite compiled to WebAssembly). No software to install, and database files are not uploaded.

## Three ways to open

- **Upload**: pick a local `.db` / `.sqlite` / `.sqlite3` file and import it into the browser's OPFS storage.
- **Saved**: list databases previously imported/created in OPFS and open them directly.
- **New**: create an empty database, stored either in **OPFS** (persistent — survives closing the tab) or **memory** (temporary — gone when closed).

## What is OPFS

OPFS (Origin Private File System) is a file system the browser gives to the current site, private to it. Databases stored here persist — they're still there next time you open the page. Some browsers or private modes may not support OPFS; the tool warns you then and you can only use memory mode.

## What you can do

- The left side lists all tables (including views); click a name to browse the first 200 rows.
- Write SQL on the right and click **Run**. SELECT results show as a table and can export to CSV; INSERT/UPDATE/DELETE show affected rows.
- The top bar can **export** the current database as a `.sqlite3` file to download.

## Privacy

Databases are processed entirely locally. Imported files only go into OPFS, never to a server.

> Note: the SQLite engine itself is also WASM and downloads on first use, with a progress bar, cancellable, then cached.
