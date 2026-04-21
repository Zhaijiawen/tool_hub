# CSV / TSV Preview - Usage Tutorial

## Quick Start

The CSV / TSV Preview tool supports two input methods:

1. **Paste text directly**: Paste CSV/TSV content into the text area for instant preview
2. **Upload a file**: Click the upload area and select a `.csv`, `.tsv`, or `.txt` file (max 5 MB)

## Selecting a Delimiter

The tool defaults to **Auto-detect** mode, which analyzes character frequency to determine the most likely delimiter.

If the auto-detected result is wrong, switch manually using the dropdown:

| Option | Use case |
|--------|----------|
| Auto detect | Let the tool decide when unsure |
| Comma (,) | Standard CSV, Excel default export |
| Tab | TSV files, database dumps |
| Semicolon (;) | European Excel exports |
| Pipe (\|) | Custom log formats |
| Space | nginx / Apache access logs |

## Viewing the Parsed Table

After successful parsing, the data displays as a **table**:

- **First row as header**: The first row is treated as column names by default
- **Row/column info**: Total rows and columns are shown above the table
- **Data preview**: Up to 10,000 rows are displayed; a notice appears when truncated

## Copying Data

Click the **"Copy"** button in the top-right corner to copy the parsed data as a JSON array to your clipboard, ready to use in code:

```json
[
  { "name": "Alice", "city": "New York", "age": "28" },
  { "name": "Bob", "city": "Chicago", "age": "32" }
]
```

## Troubleshooting

### Garbled Chinese characters

**Cause**: The file is GBK-encoded but the browser reads it as UTF-8.

**Fix**: Open the file in Notepad or VS Code, save it as UTF-8, then re-upload.

### Wrong column count after parsing

**Cause**: Some fields contain unescaped delimiters.

**Fix**: Switch to "Auto detect" or try a different delimiter from the dropdown.

### Empty table after upload

**Cause**: The file is empty or only contains a header row with no data.

**Fix**: Verify the file content is correct.

