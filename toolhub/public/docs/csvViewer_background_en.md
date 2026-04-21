# CSV / TSV Preview - Technical Background

## What are CSV and TSV

**CSV (Comma-Separated Values)** is the most common plain-text tabular format, widely used for data exports, table interchange, and database migrations.

**TSV (Tab-Separated Values)** is similar to CSV but uses a tab character (`\t`) as the delimiter instead of a comma. It's common in log systems and database dumps.

## Delimiter Types

| Delimiter | Character | Typical use case |
|-----------|-----------|-----------------|
| Comma | `,` | Excel export, Google Sheets, generic CSV |
| Tab | `\t` | Database dumps, MySQL exports |
| Semicolon | `;` | European Excel (localized: comma = decimal point) |
| Pipe | `\|` | Log files, custom data formats |
| Space | ` ` | nginx logs, system logs |

## Common CSV Pitfalls

### 1. Delimiter inside a field

When a field value contains the delimiter, wrap it in double quotes:

```
name,city,note
Alice,"New York,Boston","Frequent traveler, works across cities"
```

### 2. Newline inside a field

A quoted field can span multiple lines:

```
id,description
1,"Line one
Line two"
```

### 3. Escaped double quotes

To represent a literal double quote inside a quoted field, use `""`:

```
name,quote
Bob,"He said ""hello"""
```

### 4. Encoding issues

CSV files may be UTF-8, GBK (common on Chinese Windows), or UTF-8 with BOM. Encoding mismatches cause garbled characters.

## RFC 4180 Standard

The de-facto CSV standard is defined by [RFC 4180](https://tools.ietf.org/html/rfc4180). Key rules:

1. Each record occupies exactly one line, terminated by CRLF
2. The last record may or may not have an ending line break
3. The first line may optionally serve as a header row
4. Fields are separated by commas
5. Fields containing commas, double quotes, or newlines must be enclosed in double quotes
6. A double quote within a quoted field is represented by `""`

