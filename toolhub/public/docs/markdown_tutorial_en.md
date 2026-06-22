# Markdown Converter — How to Use It

## Quick Start

Paste your Markdown into the left panel. The right panel shows a live HTML preview — it updates as you type, no refresh needed.

Once you're happy with the output:

- Hit **Copy HTML** to grab the rendered HTML source
- Hit **Copy Markdown** to copy the raw Markdown text

That's it. The tool handles the conversion, so you don't need to install anything.

## Cheat Sheet

| What you want | Type this | You get |
|---|---|---|
| Bold | `**text**` | **strong text** |
| Italic | `_text_` | *emphasized text* |
| `# Title` | Large heading | H1 |
| `## Title` | Medium heading | H2 |
| `### Title` | Small heading | H3 |
| Link | `[label](url)` | Clickable link |
| Image | `![alt](src)` | Embedded image |
| Inline code | `` `code` `` | `monospace text` |
| Code block | ` ```lang ` | Syntax-highlighted block |
| Blockquote | `> text` | Indented quote |
| Horizontal rule | `---` | Divider line |
| Unordered list | `- item` | Bullet list |
| Ordered list | `1. item` | Numbered list |
| Table | `\| col \| col \|` | HTML table |
| Task list | `- [ ] task` | Checkbox list |

## Code Blocks with Syntax Highlighting

Use three backticks with a language tag:

````markdown
```python
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b
```
````

The language tag tells the highlighter which grammar to use. Common tags: `javascript`, `python`, `bash`, `json`, `yaml`, `css`, `html`, `sql`, `java`, `ruby`, `go`, `rust`.

You can also use ` ``` ` without a tag for plain preformatted text.

## Pro Tips

- Use `---` on its own line to drop in a horizontal divider — handy for section breaks in long docs
- Nest lists by indenting sub-items with 2 spaces (or 3 for ordered sub-lists under ordered parents)
- Wrap text you don't want parsed in backticks: `` `**this won't be bold**` ``
- Most platforms support GFM tables, so go ahead and use them in READMEs, issues, and PRs
- For long docs, break sections with `##` headings — they create anchor links automatically on GitHub
- Two trailing spaces at end of line creates a `<br>` line break without starting a new paragraph
