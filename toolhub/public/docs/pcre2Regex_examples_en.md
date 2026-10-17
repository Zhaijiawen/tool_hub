# PCRE2 Regex — Examples

## Extract and reformat a date (named groups + replace)

**Pattern:** `(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})`
**Subject:** `order date: 2024-03-15, shipped 2024-03-18`
**Replacement:** `$day/$month/$year`
**Result:** `order date: 15/03/2024, shipped 15/03/2024`

Named groups make the replacement template highly readable.

## Match nested parentheses (PCRE2-only)

**Pattern:** `\((?:[^()]|(?R))*\)`
**Subject:** `a(b(c)d)e`
**Match:** `(b(c)d)`

JS regex can't recurse; PCRE2's `(?R)` handles nesting easily.

## Extract emails

**Pattern:** `[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}`
**Subject:** `contact alice@example.com or bob@test.org`
**Matches:** `alice@example.com`, `bob@test.org`

## Case-insensitive + multiline

**Pattern:** `^error`, with `i` and `m` ticked
**Subject:**
```
Error: disk full
warning: low mem
ERROR: timeout
```
**Matches:** `Error` on line 1 and `ERROR` on line 3 (`m` makes `^` match each line start, `i` ignores case).
