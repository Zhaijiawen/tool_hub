# JSON - Technical Background

JSON (JavaScript Object Notation) is the universal data format of the web. If you've ever called an API, edited a config file, or looked at a `package.json`, you've worked with JSON. It's simple enough to read by eye, structured enough for machines to parse reliably, and supported by every programming language that matters.

Douglas Crockford popularized it in the early 2000s as a lighter alternative to XML. The big insight: JavaScript's object literal syntax was already a decent data format. No schemas, no namespaces, no closing tags -- just brackets, braces, colons, and commas.

## The six types

JSON has exactly six data types. That's it. No dates, no functions, no binary.

- **Strings** -- double quotes only, UTF-8, backslash escaping for special characters
- **Numbers** -- decimal, no hex, no octal, no `NaN` or `Infinity` (those aren't valid JSON)
- **Booleans** -- `true` and `false`, lowercase
- **Null** -- `null`, lowercase
- **Arrays** -- ordered, `[...]`, can mix types (though you usually shouldn't)
- **Objects** -- unordered key-value pairs, `{...}`, keys must be double-quoted strings

That last one trips people up: single-quoted keys or unquoted keys aren't valid JSON, even though they work fine in JavaScript.

## What JSON can't do

No comments. The spec intentionally omits them. Some tools (VS Code, certain parsers) tolerate `//` comments, but they're not standard. If you need comments in config files, use JSONC or YAML.

No trailing commas. `{"a": 1,}` is invalid. JavaScript is more forgiving, but `JSON.parse` isn't.

No date type. Dates get serialized as ISO 8601 strings like `"2024-01-15T10:30:00Z"`. Your parser has to know which fields are dates and revive them manually.

No binary. Base64-encode it if you must embed binary in JSON, but that's a workaround, not a feature.

## Parsing safely

In the browser and Node, you've got `JSON.parse()` and `JSON.stringify()`. Always wrap `parse` in a try/catch -- malformed JSON throws a `SyntaxError`. Never use `eval()` for JSON. Just don't.

```javascript
try {
  const data = JSON.parse(input)
} catch (e) {
  console.error('Invalid JSON:', e.message)
}
```

`JSON.stringify` takes a replacer function (for filtering/transforming) and a space argument for indentation. The space can be a number (spaces) or a string (tabs, etc.). `JSON.stringify(obj, null, 2)` is the standard pretty-print incantation.

## Where JSON lives

- REST APIs -- request and response bodies
- Configuration -- `package.json`, `tsconfig.json`, CI configs
- Document databases -- MongoDB, CouchDB, Firebase
- Data exchange between services
- Local storage in browsers and mobile apps
- Log aggregation (structured JSON logging)

It won because it's the right level of simplicity. XML had schemas and namespaces and attributes and CDATA sections. JSON just has brackets and braces. Sometimes less really is more.

## JSON5 — the "human-friendly" superset

JSON works great as a machine interchange format, but for config files that humans write, the strict rules get annoying: keys must be double-quoted, no comments, no trailing commas. JSON5 fixes exactly that.

JSON5 extends JSON with:

- **Unquoted keys**: `{ name: "value" }` — valid, using ECMAScript 5 identifier rules
- **Single-quoted strings**: `'hello'` works alongside `"hello"`
- **Trailing commas**: `{ a: 1, }` — no error
- **Comments**: `//` line comments and `/* */` block comments both allowed
- **More number formats**: hexadecimal `0xFF`, `Infinity`, `NaN`

JSON5 is a **superset** of JSON. Every valid JSON file is also valid JSON5. The reverse isn't true: JSON5 extras (comments, unquoted keys) will break standard JSON parsers.

Pretty much all modern build tool configs use JSON5-style files — `.prettierrc`, `tsconfig.json`, and most Vite/Webpack/Rollup configs. That's what this tool's JSON5 mode is designed for.

### JSON5 formatting behavior

When you switch to JSON5 mode, Prettier applies JSON5 rules:

- **Key quotes**: If you paste `{"name": "value"}`, the formatter may strip the key quotes leaving `{ name: "value" }`. This is valid JSON5, so Prettier removes unnecessary quoting
- **Comments**: fully preserved — this is the main reason to use JSON5 mode over standard JSON mode
- **Short objects**: objects that fit within `printWidth` may stay on a single line
