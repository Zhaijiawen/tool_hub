# Script Toolkit — How to Use

## Creating a script

Click "+ New Script" in the left panel, give it a name, pick a category, save. The tool creates a new script with a starter template pre-filled. Scripts live in browser localStorage, so export them regularly.

## Writing the transform function

Your code must contain a function named `transform` that takes two arguments:

- `input` — the content of the input box (always a string)
- `helpers` — the helper library object (see the "Available helpers" panel in the tool)

Whatever you return gets displayed in the output area:

```javascript
async function transform(input, helpers) {
  // input is whatever's in the input box
  // helpers gives you all the built-in libraries
  return input.trim().toUpperCase()
}
```

`async/await` is fully supported for network requests and crypto operations.

## Running a script

Paste your data into the **Input Data** box (JSON, plain text, a timestamp — anything), then hit **Run**. If it succeeds, the output area shows the result and the elapsed time in milliseconds in the toolbar. If it fails, the output area turns red and shows the full error with stack trace.

Click **Copy** to grab the output to clipboard.

## Script management

| Action | What it does |
|--------|-------------|
| Click a script in the left panel | Switch to that script |
| Toolbar "Edit" | Rename, change category, update description |
| Toolbar "Delete" | Delete the script permanently |
| Export Scripts | Save all scripts as a `.toolhub.json` file |
| Import Scripts | Load scripts from a `.toolhub.json` file (adds, doesn't replace) |

## Tips

**Debugging:** Use `console.log` inside your function — output shows in browser DevTools. Or return intermediate values to inspect them directly.

**Return an object for multiple outputs:**

```javascript
async function transform(input, helpers) {
  return {
    original: input,
    upper: input.toUpperCase(),
    length: input.length,
    words: input.split(/\s+/).length
  }
}
```

**Chain helpers for multi-step pipelines:**

```javascript
async function transform(input, helpers) {
  const obj = helpers.yaml.load(input)       // 1. Parse YAML
  const names = helpers._.map(obj.users, 'name')  // 2. Extract with lodash
  return names.map(n => `${n} — ${helpers.dayjs().format('YYYY-MM-DD')}`)  // 3. Format dates
}
```
