# Whitespace Handling — Usage Tutorial

## How to Use

### Step 1: Input Your Text
Paste the text you want to process into the input area. Multi-line text is fully supported.

### Step 2: Choose an Operation

**Trim Whitespace**
Removes all leading (before) and trailing (after) whitespace from the text. Internal whitespace is not affected.
- Input: `  hello world  `
- Output: `hello world`

**Compress Whitespace**
Replaces all sequences of multiple whitespace characters (spaces, tabs) with a single space. Also trims leading and trailing whitespace.
- Input: `hello    world   foo`
- Output: `hello world foo`

### Step 3: Copy the Result
The processed text appears in the output area. Click **Copy** to copy it to your clipboard.

## Common Use Cases

1. **Form input sanitization** — trim user-submitted data before validation or storage
2. **Log cleanup** — compress irregular spacing in log messages for easier parsing
3. **CSV preprocessing** — normalize whitespace around delimiters
4. **Code cleanup** — remove extra spaces from pasted snippets

