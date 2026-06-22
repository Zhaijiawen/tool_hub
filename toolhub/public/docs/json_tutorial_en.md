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

### Choose your indentation

Most people use 2-space indent (it's what Prettier defaults to, and it keeps deeply nested JSON from drifting too far right). 4-space is more readable for shallow structures. Tab is an option if you're old school. Pick one and stick with it.

### Copy and move on

Click Copy next to the formatted output, paste it wherever you need it. Done.

## What the validator catches

The tool validates as it formats. Common errors:

**Unquoted keys** -- `{name: "value"}` is JavaScript, not JSON. The tool flags it, you add quotes, life goes on.

**Trailing commas** -- that extra comma after the last array element or object property is valid in JS but not JSON. Easy to miss:
```json
// Nope
{
  "a": 1,
  "b": 2,
}
```

**Unescaped control characters** -- real newlines inside JSON strings need to be `\n`, not actual line breaks. If you copy JSON from a terminal or text editor that wrapped lines, this is common.

**Mismatched brackets** -- a missing `}` or `]` somewhere in a 500-line JSON file. The validator points to the approximate line.

## Tips from the trenches

Keep a backup of the original minified JSON. Sometimes you need to diff the raw and formatted versions to verify nothing changed.

For really large JSON (over 1MB), the browser might lag. Most browser-based formatters handle up to a few MB fine. Beyond that, use `jq` or a native tool.

Don't store formatted JSON in production databases -- it's wasted bytes. Format for debugging, minify for storage and transport.

If you're working with JSON that other tools produce, watch out for non-standard extensions. Some services emit JSON with comments, trailing commas, or single-quoted strings. The tool will catch these -- that's the whole point.
