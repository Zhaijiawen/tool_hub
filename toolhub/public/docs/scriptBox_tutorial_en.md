# Script Toolkit — Usage Tutorial

## Step 1: Create a New Script

Click the **"+ New Script"** button in the left panel. Enter a name and choose a category (JSON, Text, Crypto, etc.), then save. The tool creates a new script pre-filled with a starter template.

> ⚠️ Scripts are stored in browser localStorage. Use "Export Scripts" regularly to back them up.

## Step 2: Write a transform Function

Your code **must contain a function named `transform`** that accepts two arguments:

- `input` — the content of the input box (string)
- `helpers` — the built-in helper library object (see the "Available helpers" panel)

The return value is automatically displayed in the output area:

```javascript
async function transform(input, helpers) {
  // input is the content of the input box
  // helpers provides all built-in libraries
  return input.trim().toUpperCase()
}
```

`async/await` is fully supported — you can call `fetch` to make network requests.

## Step 3: Provide Input and Run

Paste the data you want to process into the **Input Data** box on the right (JSON, plain text, a timestamp — anything works), then click **"▶ Run"**.

- **Success**: the output area shows the result and elapsed time (ms) in the toolbar
- **Error**: the output area turns red and displays the full error message with stack trace

## Step 4: Copy the Output

After a successful run, click **"Copy"** to write the output to your clipboard.

## Script Management

| Action | Description |
|---|---|
| Click item in left panel | Switch active script |
| Toolbar "Edit" | Rename, change category or description |
| Toolbar "Delete" | Delete script permanently (cannot be undone) |
| Export Scripts | Save all scripts as a `.toolhub.json` file |
| Import Scripts | Load scripts from a `.toolhub.json` file (non-destructive) |

## Tips & Tricks

**Debugging:** Use `console.log` inside your function (open browser DevTools to see output), or return intermediate values to inspect them.

**Multiple outputs:** Return an object — the tool formats it as pretty-printed JSON:

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

**Pipeline style:** Chain multiple helpers for multi-step processing:

```javascript
async function transform(input, helpers) {
  // 1. Parse YAML
  const obj = helpers.yaml.load(input)
  // 2. Extract fields with lodash
  const names = helpers._.map(obj.users, 'name')
  // 3. Format dates with dayjs
  return names.map(n => `${n} — ${helpers.dayjs().format('YYYY-MM-DD')}`)
}

