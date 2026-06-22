# Whitespace Handling — Examples

## Cleaning up user input

This is the most common thing you'll use trim for. Someone types their name into a form with extra spaces around it.

**Input:**
```
   John Doe
```
**Trim Output:**
```
John Doe
```

The leading spaces (and the trailing newline if there is one) are gone. The space between "John" and "Doe" stays. If the user had typed `   John   Doe   ` with extra internal spaces, trim would give you `John   Doe` — it doesn't touch the middle. For that, you'd need compress.

## Normalizing a CSV row

CSV files exported from different tools often have inconsistent spacing around delimiters. This can break parsers that expect clean data.

**Input:**
```
name,   age,   city
John,   25,    New York
```
**Compress Output:**
```
name, age, city
John, 25, New York
```

Compress replaces each cluster of whitespace with a single space. The commas are now followed by exactly one space each, and the values are clean. If you were going to parse this as CSV, the values would match as expected now.

After compress, the CSV is clean enough to parse, but you might want a dedicated CSV tool for advanced cases like quoted fields with embedded commas and newlines. The whitespace tool handles the spacing problem; the CSV parser handles the format.

## Fixing copy-pasted text with irregular gaps

Content copied from PDFs, websites, or IM conversations often has random extra spaces where the source layout broke words apart.

**Input:**
```
The   quick  brown    fox   jumps
over   the   lazy   dog
```
**Compress Output:**
```
The quick brown fox jumps
over the lazy dog
```

Line breaks between words are preserved as single spaces in the compressed output. If you wanted to collapse everything to a single line, you'd need an additional newline-to-space step. The tool keeps the line structure while normalizing the horizontal whitespace within each line.

## Removing trailing newlines from config values

A common bug in config files and environment variables: trailing newlines that sneak into values.

**Input:**
```
DATABASE_URL=postgres://localhost/db
```
(with a trailing newline after `db`)

**Trim Output:**
```
DATABASE_URL=postgres://localhost/db
```

The trailing newline is gone. If your application reads environment variables from a file and includes the newline, the connection string becomes invalid — `postgres://localhost/db\n` is not a valid URL. Trimming each line in your config loader prevents this.

## Cleaning mixed tabs and spaces

Code editors have settings for "tabs vs. spaces" and people disagree about them constantly. When you paste code from a source that uses different indentation style, you get a mess.

**Input:**
```
function foo() {
	  return \t 42;
}
```
(contains a tab between `return` and `42` mixed with spaces)

**Compress Output:**
```
function foo() { return 42; }
```

Compress converts all whitespace sequences — including tabs — into single spaces. This is destructive for code indentation (you'd want a formatter for that), but it's perfect for extracting the logical content into a readable single line, like for a commit message or a search index.
