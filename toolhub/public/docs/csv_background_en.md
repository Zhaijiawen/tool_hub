# CSV and TSV: The Universal Data Interchange Format

CSV has been around forever and it's not going anywhere. It's the lowest common denominator for moving tabular data between systems. But it's surprisingly tricky to parse correctly.

## CSV vs TSV: Just the Delimiter

CSV uses commas. TSV uses tabs. That's the only structural difference. But the delimiter choice matters because it determines what needs escaping.

| Delimiter | Character | Where you'll see it |
|---|---|---|
| Comma | `,` | Excel, Google Sheets, general CSV |
| Tab | `\t` | Database dumps, MySQL exports |
| Semicolon | `;` | European Excel (comma is decimal separator there) |
| Pipe | `\|` | Custom log formats |
| Space | ` ` | nginx/apache access logs |

## Why Parsing CSV Is Harder Than It Looks

### 1. Delimiter inside a field

When a field value itself contains the delimiter, it gets wrapped in double quotes:

```
name,city,note
Alice,"New York, Boston","Frequent traveler, works across cities"
```

Without the quotes, "New York" and " Boston" would parse as separate columns.

### 2. Newlines inside a field

A quoted field can span multiple lines:

```
id,description
1,"Line one
Line two"
```

This means you can't just split on `\n` and then split on `,`. You have to track whether you're inside quotes while iterating through characters.

### 3. Escaped quotes

Double quotes inside a quoted field are escaped by doubling them: `""` means a literal `"`:

```
name,quote
Bob,"He said ""hello"""
```

### 4. Encoding problems

CSV files can be UTF-8, GBK (common on Chinese Windows), UTF-8 with BOM, Latin-1, or anything else. If the encoding doesn't match what the parser expects, you get garbled text -- especially for non-ASCII characters.

## RFC 4180: The De Facto Standard

RFC 4180 formalized the rules most CSV tools follow:

1. Each record is one line, terminated by CRLF
2. The last record may or may not have a trailing line break
3. The first line is optionally a header row
4. Fields are separated by commas
5. Fields containing commas, double quotes, or line breaks must be quoted
6. Double quotes inside quoted fields are escaped as `""`

Most real-world CSV is "RFC 4180-ish" -- close enough that parsers handle it, but rarely 100% compliant. Real data is messy.
