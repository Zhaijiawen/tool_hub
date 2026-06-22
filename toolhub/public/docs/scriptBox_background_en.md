# Script Toolkit — What's Going On Under the Hood

The Script Toolkit lets you write arbitrary JavaScript data transformations and run them instantly in your browser. You define a function called `transform`, we give it your input data and a set of pre-loaded helper libraries, and the return value shows up in the output panel. Everything runs locally — no server, no uploads.

## How execution works

We use the browser's `new Function()` API to dynamically execute your code. The tool automatically `await`s your function, so both synchronous and `async/await` styles work:

```javascript
// Synchronous — straightforward
function transform(input, helpers) {
  return input.trim().toUpperCase()
}

// Async — fetch APIs, Web Crypto, anything
async function transform(input, helpers) {
  const res = await fetch('https://api.example.com?q=' + input)
  return await res.json()
}
```

## The helpers system

To let you use popular libraries without manual `import` statements, the tool lazily loads a set of pre-defined packages and injects them through the `helpers` argument on first run:

| Library | Injected as | What it does |
|---------|------------|-------------|
| dayjs | `helpers.dayjs` | Date formatting and arithmetic |
| lodash-es | `helpers._` | Array/object utilities |
| CryptoJS | `helpers.CryptoJS` | MD5, AES, SHA, HMAC |
| js-yaml | `helpers.yaml` | YAML parse and stringify |
| mathjs | `helpers.math` | Precision math evaluation |
| diff | `helpers.diff` | Word-level text diffing |
| marked | `helpers.marked` | Markdown to HTML |
| DOMPurify | `helpers.DOMPurify` | XSS sanitization |
| fast-xml-parser | `helpers.xmlParser / xmlBuilder` | XML parse and build |
| spark-md5 | `helpers.sparkMD5` | Large file MD5 hashing |

Also available globally, no import required:

- `fetch` — HTTP requests
- `crypto.subtle` — Web Crypto API (native SHA, AES)
- `JSON`, `btoa`, `atob` — browser built-ins
- `helpers.TextEncoder / TextDecoder` — binary/string conversion

## Data persistence

Scripts are stored as JSON in `localStorage`. If you clear your browser data, your scripts go with it. Use the "Export Scripts" button regularly to save a backup as a `.toolhub.json` file.
