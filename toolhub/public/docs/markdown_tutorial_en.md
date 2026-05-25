# Markdown Converter — Usage Tutorial

## How to Use

### Step 1: Write or Paste Markdown
Enter or paste your Markdown text in the left editor panel.

### Step 2: Preview the Rendered Output
The right panel shows the live HTML preview, updating as you type.

### Step 3: Copy or Export
- Click **Copy HTML** to copy the rendered HTML source
- Click **Copy Markdown** to copy the raw Markdown text

## Markdown Quick Reference

| Element | Syntax | Result |
|---|---|---|
| Bold | `**text**` | **text** |
| Italic | `_text_` | *text* |
| Heading 1 | `# Title` | large heading |
| Heading 2 | `## Title` | medium heading |
| Link | `[label](url)` | clickable link |
| Image | `![alt](src)` | image |
| Inline code | `` `code` `` | `code` |
| Block quote | `> text` | indented quote |
| Horizontal rule | `---` | divider line |

## Code Blocks with Syntax Highlighting

Use three backticks followed by the language name:
    
````markdown
```python
def hello():
    print("Hello, world!")
```
````

## Tips

- Use `---` to insert a horizontal rule as a visual separator
- Nest lists by indenting with 2 spaces
- Use `> > nested quote` for nested blockquotes
- Most Markdown renderers support GitHub Flavored Markdown (GFM) — tables, task lists, and strikethrough
