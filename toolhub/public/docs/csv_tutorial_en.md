# CSV/TSV Viewer -- How to Use

Paste or upload a CSV/TSV file and see it rendered as a proper table instantly.

## Two Ways to Get Data In

1. **Paste directly**: Copy CSV/TSV content and paste it into the text area. The table renders immediately.
2. **Upload a file**: Click the upload area and pick a `.csv`, `.tsv`, or `.txt` file. Max 5 MB -- enough for about 50,000 rows of typical data.

## Picking the Right Delimiter

The tool defaults to **Auto-detect** mode. It scans the content and picks the delimiter that results in the most consistent column counts. This works well for clean data.

If auto-detect guesses wrong, switch manually:

| Option | When to use |
|---|---|
| Auto detect | Default -- let the tool figure it out |
| Comma (`,`) | Standard CSV from Excel, Google Sheets |
| Tab | TSV files, database dumps |
| Semicolon (`;`) | European Excel exports |
| Pipe (`\|`) | Custom log formats |
| Space | nginx/apache access logs |

## What You See

After parsing, the data displays as a sortable, scrollable table:

- **First row as header**: The first row becomes column names by default.
- **Row/column count**: Displayed above the table so you know the data dimensions at a glance.
- **10,000 row limit**: For display purposes, the table caps at 10K rows. If your data is larger, you'll see a notice but the tool still parses everything -- it just truncates the visual output.

## Copy as JSON

The **Copy** button in the top-right corner copies the parsed data as a JSON array to your clipboard:

```json
[
  { "name": "Alice", "city": "New York", "age": "28" },
  { "name": "Bob", "city": "Chicago", "age": "32" }
]
```

This is handy for dropping data directly into JavaScript, Python (after `json.loads`), or any other code that speaks JSON.

## Troubleshooting

### Garbled text (especially Chinese characters)

The file is likely GBK-encoded but being read as UTF-8. Open the file in VS Code or Notepad, re-save as UTF-8, and re-upload.

### Wrong number of columns

Some fields probably contain unescaped delimiters. Try switching to a different delimiter from the dropdown. Pipe-delimited files sometimes get mistaken for comma-delimited ones.

### Empty table after upload

The file might be empty, or it has only a header row with no data rows. Check the file content directly.
