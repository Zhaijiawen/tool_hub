// 数据工具
export default {
  data: {
    sqlite: {
      title: "SQLite Database",
      description: "Run SQLite in your browser: query uploaded .db files, execute SQL, browse table schemas — with OPFS persistent storage, all locally without uploads",
      modes: {
        upload: "Upload Database",
        saved: "Saved Databases",
        new: "New Database"
      },
      opfsUnavailable: "This environment does not support OPFS persistent storage (requires cross-origin isolation COOP/COEP and dedicated Worker support). Only a temporary in-memory database is available — data is lost on refresh.",
      uploadHint: "Click or drop a .db / .sqlite file here",
      uploadSubHint: "The file is imported into browser storage locally and never uploaded to any server",
      dbNameLabel: "Database name",
      dbNamePlaceholder: "e.g. my-database",
      uploadNameHint: "The database is saved under this name in browser OPFS storage and can be reopened later. Letters, digits, dots, hyphens and underscores only.",
      newNamePlaceholder: "e.g. my-database",
      importButton: "Import & Open",
      refreshList: "Refresh",
      savedHint: "These databases live in this browser's OPFS storage — visible only on this device and browser",
      noSaved: "No saved databases yet — create one via \"Upload Database\" or \"New Database\"",
      colName: "Name",
      colSize: "Size",
      colActions: "Actions",
      open: "Open",
      createButton: "Create & Open",
      kindOpfs: "Persistent (OPFS)",
      kindMemory: "In-memory",
      kindOpfsHint: "Stored in the browser Origin Private File System — survives page reloads and can be reopened anytime",
      kindMemoryHint: "Lives only in the current page — data is lost on refresh or close. Great for quick experiments.",
      sizeLabel: "Size",
      exportButton: "Export .db",
      closeButton: "Close",
      tablesTitle: "Tables & Views",
      tableTag: "table",
      viewTag: "view",
      noTables: "Empty database — start by creating a table in the SQL editor",
      sqlPlaceholder: "Enter SQL, e.g.: SELECT * FROM sqlite_master;",
      runButton: "Run SQL",
      execHint: "Multiple statements run in order; the result shows the first query's columns and rows, with the affected row count below",
      fillSelect: "Fill SELECT",
      changesLabel: "Rows affected",
      rowsLabel: "Rows",
      exportCsv: "Export CSV",
      noRows: "The query returned no rows",
      phaseDownloading: "Downloading the SQLite engine...",
      phaseWorking: "Executing...",
      failed: "Operation failed",
      imported: "Imported and opened {name}",
      deleted: "Deleted {name}",
      exported: "Exported {name}",
      errors: {
        notDbFile: "Please choose a SQLite database file (.db / .sqlite / .sqlite3)",
        notSqliteFile: "This file is not a valid SQLite database",
        importFailed: "Import failed — the file may be corrupted or not a valid SQLite database",
        openFailed: "Failed to open the database",
        deserializeFailed: "Failed to read the database file — it may be corrupted",
        opfsUnavailable: "OPFS persistent storage is not available in this environment",
        nameRequired: "Please enter a database name",
        dbNotOpen: "No database is open",
        workerNotReady: "The SQLite engine is not ready yet",
        workerError: "The SQLite engine encountered an error",
        initTimeout: "SQLite engine initialization timed out"
      },
      infoTitle: "Usage Guide",
      infoContent: "This tool runs the official SQLite WebAssembly build entirely in your browser — database files are never uploaded. Uploaded .db files are validated and imported into browser OPFS persistent storage (requires a cross-origin isolated environment), so you can reopen them from \"Saved Databases\" after a refresh; or create a temporary in-memory database for quick experiments. The SQL editor supports arbitrary SQL (CREATE TABLE, INSERT/UPDATE/DELETE, SELECT, JOIN, transactions...). Click a table name on the left to preview its first 200 rows, export query results as CSV, or export the whole database as a .db file."
    },
    python: {
      title: "Python Runner",
      description: "Run Python code in your browser (Pyodide WebAssembly) — standard library computation and text processing, fully local without uploading code",
      stdlibOnly: "Standard library mode: supports json / re / datetime / math / statistics / collections and other Python standard library modules. Scientific libraries such as numpy and pandas are not included (they require extra downloads and an external CDN).",
      engineNote: "The Python engine is about 11MB (downloaded on first use, then cached) and runs entirely in your browser — code is never sent to any server.",
      examples: "Examples:",
      examplesList: {
        stats: {
          label: "Statistics"
        },
        json: {
          label: "JSON Handling"
        },
        regex: {
          label: "Regex Extraction"
        },
        datetime: {
          label: "Date Math"
        },
        algo: {
          label: "Algorithms"
        }
      },
      placeholder: "# Write your Python code here\nprint(\"Hello, Python!\")",
      run: "Run Code",
      running: "Running...",
      resultValue: "Return value",
      stdout: "Standard output (stdout)",
      stderr: "Error output (stderr)",
      noOutput: "Code executed with no output",
      phaseDownloading: "Downloading the Python engine (~9MB, cancellable)...",
      phaseLoading: "Loading the Python runtime...",
      phaseRunning: "Executing...",
      failed: "Execution failed",
      errors: {
        workerNotReady: "The Python engine is not ready yet",
        workerError: "The Python engine encountered an error",
        initTimeout: "Python engine initialization timed out — please check your network and refresh"
      },
      emptyTip: "Click an example above, or write your own Python code and run it",
      infoTitle: "Usage Guide",
      infoContent: "This tool runs Pyodide (CPython 3.13 compiled to WebAssembly) entirely in your browser — your code is never uploaded. First use downloads the engine (~11MB, with progress and cancel), then caches it. Return values, print output and errors are shown separately; since Python script duration is unpredictable, the progress bar sits at 95% during execution. Note: this is standard library mode without numpy / pandas — for matrix math or heavy data analysis, a local Python environment is a better fit."
    }
  }
}
