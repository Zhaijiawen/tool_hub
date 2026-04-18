# Script Toolkit — Technical Background

## What is Script Toolkit?

Script Toolkit lets you write arbitrary JavaScript data-transformation logic and run it instantly in the browser. You only need to define a function named `transform`; the tool automatically passes the content of the input box as the `input` argument and displays the return value in the output area.

Everything runs **100% locally in your browser** — no server involved, no data ever leaves your device.

## Execution Model

The tool uses the browser-native `new Function()` API to execute your code dynamically. It automatically `await`s your function, so both synchronous and `async/await` styles are fully supported.

```javascript
// Synchronous
function transform(input, helpers) {
  return input.trim().toUpperCase()
}

// Async — works with fetch, Web Crypto, etc.
async function transform(input, helpers) {
  const res = await fetch('https://api.example.com?q=' + input)
  return await res.json()
}
```

## How Built-in Helpers Work

To let you use popular third-party libraries without manual `import` statements, the tool lazily loads a set of pre-defined packages on the first run and injects them via the `helpers` argument.

| Library | Injected as | Purpose |
|---|---|---|
| dayjs | `helpers.dayjs` | Date/time formatting & arithmetic |
| lodash-es | `helpers._` | Array / object utilities |
| CryptoJS | `helpers.CryptoJS` | MD5, AES, SHA, HMAC |
| js-yaml | `helpers.yaml` | YAML parse & stringify |
| mathjs | `helpers.math` | Precision math |
| diff | `helpers.diff` | Text diff comparison |
| marked | `helpers.marked` | Markdown to HTML |
| DOMPurify | `helpers.DOMPurify` | XSS sanitization |
| fast-xml-parser | `helpers.xmlParser / xmlBuilder` | XML parse & build |
| spark-md5 | `helpers.sparkMD5` | Large file MD5 |

The following are available globally with no import required:

- **`fetch`** — HTTP requests
- **`crypto.subtle`** — Web Crypto API (native SHA/AES)
- **`JSON`, `btoa`, `atob`** — browser built-ins
- **`helpers.TextEncoder / TextDecoder`** — binary ↔ string conversion

## Data Persistence

All scripts are stored as JSON in browser `localStorage`. Clearing browser data may cause scripts to be lost — export your script collection regularly as a backup.

