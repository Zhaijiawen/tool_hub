# Find & Replace — Technical Background

## Overview

Find & Replace is one of the most essential text editing operations. It locates occurrences of a search term within text and replaces them with a specified string. Modern implementations support both plain text and regular expression (regex) patterns.

## Plain Text vs. Regular Expression

### Plain Text Search
A straightforward match of the literal string. Fast and simple, suitable for most day-to-day tasks.

### Regular Expression Search
Regular expressions provide a powerful pattern-matching language that can describe complex search criteria:

```
\d+        → match one or more digits
[a-z]+     → match one or more lowercase letters
\bword\b   → match whole word "word"
(foo|bar)  → match "foo" or "bar"
```

## How Replace Works

When a match is found, the matched text is replaced by the replacement string. With regex, the replacement string can also reference captured groups using `$1`, `$2`, etc.

### Example
```
Pattern:    (\w+)\s(\w+)
Input:      John Doe
Replacement: $2, $1
Result:     Doe, John
```

## Case Sensitivity

- **Case-sensitive**: `hello` will not match `Hello` or `HELLO`
- **Case-insensitive**: `hello` matches `Hello`, `HELLO`, `hElLo`

## Global vs. First Occurrence

- **Replace All**: replaces every occurrence in the text
- **Replace First**: replaces only the first match found

## Common Applications

| Use Case | Example |
|---|---|
| Rename a variable | Replace `oldVar` with `newVar` |
| Fix typos | Replace `teh` with `the` |
| Format dates | Replace `(\d{4})-(\d{2})-(\d{2})` with `$3/$2/$1` |
| Remove HTML tags | Replace `<[^>]+>` with `` |

