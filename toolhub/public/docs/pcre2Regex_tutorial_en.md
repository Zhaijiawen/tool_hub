# PCRE2 Regex — Usage Tutorial

1. Write the pattern in the **Pattern** box.
2. Tick the flags you need (case-insensitive, multiline, etc.).
3. Paste the text to match into the **Subject** box.
4. Click **Run match**: matches, capture groups, and named groups list below.
5. To replace? Click **Replace first** or **Replace all**, write the replacement in the template box (supports `$1`, `${name}`, etc.), shown live.

## Named groups

Use `(?<name>...)` to name a group; results show it as "name: value", and you can reference it in replacement with `${name}`.

## Compile errors

When the pattern is wrong, the tool shows the error message and the offset (which character) so you can locate and fix it.

## Tips

- Click **Load example** to fill in a date-extraction regex with named groups and a replacement demo.
- To match nested structures (JSON, parentheses), JS regex can't — use PCRE2's recursion.
- Tick `x` to add spaces and comments inside the pattern for readability of complex regexes.
