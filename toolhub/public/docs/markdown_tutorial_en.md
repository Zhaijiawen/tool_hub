# Markdown Preview — How to Use It

## Quick Start

Type or paste Markdown into the input area at the top. The preview renders below as you type — no refresh needed.

Once you're happy with the output:

- Hit **Copy** to grab the rendered HTML source
- Hit **Load Example** to try out different Markdown styles

That's it. Everything runs in your browser — nothing to install.

## Cheat Sheet

| What you want | Type this | You get |
|---|---|---|
| Bold | `**text**` | **strong text** |
| Italic | `_text_` | *emphasized text* |
| H1 | `# Title` | Large heading |
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

## Code Blocks with Language Tags

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

The language tag is preserved in the output HTML (`class="language-python"`). Paste it into a blog or docs site with highlight.js and you'll get syntax coloring. Common tags: `javascript`, `python`, `bash`, `json`, `yaml`, `css`, `html`, `sql`, `java`, `ruby`, `go`, `rust`.

You can also use ` ``` ` without a tag for plain preformatted text.

## Pro Tips

- Use `---` on its own line to drop in a horizontal divider — handy for section breaks in long docs
- Nest lists by indenting sub-items with 2 spaces (or 3 for ordered sub-lists under ordered parents)
- Wrap text you don't want parsed in backticks: `` `**this won't be bold**` ``
- Most platforms support GFM tables, so go ahead and use them in READMEs, issues, and PRs
- For long docs, break sections with `##` headings — they create anchor links automatically on GitHub
- Two trailing spaces at end of line creates a `<br>` line break without starting a new paragraph
