# JSON Formatting - Tutorial

You've got a blob of minified JSON from an API response or a log file, and you need to actually read it. That's what this tool does -- formats, validates, and prettifies JSON in one click.

## How to use it

### Paste your JSON

Copy your raw JSON into the input area. It can be minified, half-broken, whatever. Common sources:

- API response bodies (the `Network` tab in DevTools is your friend)
- Log files with JSON lines
- Config files you're trying to debug
- Random JSON you found in a database column

Example of what you might paste:
```json
{"name":"ToolHub","version":"1.0.0","features":["format","encrypt","convert"],"config":{"theme":"dark","language":"en"}}
```

### Hit format

Click Format and the tool expands everything with proper indentation:
```json
{
  "name": "ToolHub",
  "version": "1.0.0",
  "features": [
    "format",
    "encrypt",
    "convert"
  ],
  "config": {
    "theme": "dark",
    "language": "en"
  }
}
```

### Copy and move on

Click Copy after formatting, paste it wherever you need it. Done.

## JSON / JSON5 toggle

Next to the card title there's a `[JSON → JSON5]` button group. Click to switch:

- **JSON** (default): standard JSON formatting, 2-space indent, double-quoted keys
- **JSON5**: supports comments, unquoted keys, trailing commas, single-quoted strings. Formatted via backend Prettier, comments fully preserved

JSON5 mode is built for config files like `.prettierrc`, `tsconfig.json`, and `eslintrc` — these are already JSON5 under the hood. Format them for cleaner structure without losing comments.

When you switch to JSON5 mode, a warning panel appears explaining that key quotes may be removed and short objects may stay single-line.

## Common pitfalls

The formatter handles layout, not syntax validation. Here's what to know about JSON and JSON5 boundaries:

**Unquoted keys** -- `{name: "value"}` is invalid in standard JSON but valid in JSON5 mode. JSON mode validates that keys are double-quoted.

**Trailing commas** -- that extra comma after the last element is not valid JSON, but fine in JSON5:
```json
// Invalid JSON, valid JSON5
{
  "a": 1,
  "b": 2,
}
```

**Mismatched brackets** -- a missing `}` or `]` will cause a parse error, but the formatter can only report the approximate location.

## Tips from the trenches

Keep a backup of the original minified JSON. Sometimes you need to diff the raw and formatted versions to verify nothing changed.

For really large JSON (over 1MB), the browser might lag. Most browser-based formatters handle up to a few MB fine. Beyond that, use `jq` or a native tool.

Don't store formatted JSON in production databases — it's wasted bytes. Format for debugging, minify for storage and transport.

If you hit a JSON file with comments, trailing commas, or single-quoted strings — switch to JSON5 mode instead of manually cleaning it up.
