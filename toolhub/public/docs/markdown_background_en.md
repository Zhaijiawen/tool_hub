# Markdown — What's Under the Hood

Markdown was cooked up by John Gruber back in 2004, and the core idea hasn't changed: write in plain text that's readable as-is, and let a parser turn it into HTML. The trick is that the "markup" characters — hashes, asterisks, brackets — are chosen to look natural even before rendering. You can read a raw `.md` file in any text editor and it still makes sense.

## How Parsers Actually Work

When you feed Markdown to a converter, it goes through a couple of stages. First the input gets split into blocks — paragraphs, headings, code fences, lists. Then each block gets its inline parsing: bold markers become `<strong>` tags, links get turned into `<a href="...">`, and so on. The output is an HTML string. Most parsers (like `marked`, `markdown-it`, `remark`) use a similar two-pass approach, though the details differ between implementations.

## Flavors You'll Actually Run Into

Markdown was never formally standardized by Gruber, so a bunch of variants emerged. The main ones:

- **CommonMark** is the closest thing to an official standard. It's strict and predictable — if your Markdown works in CommonMark, it'll probably work everywhere.
- **GitHub Flavored Markdown (GFM)** adds tables, task lists, strikethrough, and auto-linked URLs. This is what you're using on GitHub, GitLab, and most dev platforms.
- **MDX** lets you drop JSX components right into Markdown — it's how React-based doc sites (Docusaurus, Nextra) work.
- **kramdown** is what Jekyll uses under the hood for GitHub Pages.

## Syntax That Matters Day to Day

### Headings

```markdown
# H1 — page title
## H2 — sections
### H3 — sub-sections
#### H4 — rarely needed, but there if you need it
```

Use ATX-style (`#`) headings, not Setext (`===` underline style). Every parser handles ATX consistently.

### Emphasis

```markdown
**bold text**      — rendered as <strong>
_italic text_      — rendered as <em>
~~strikethrough~~  — GFM only
***bold italic***  — both at once
```

### Lists

Unordered lists accept `-`, `*`, or `+` — pick one and stick with it per document.

```markdown
- One
- Two
  - Nested with 2-space indent
  - Another nested item

1. First step
2. Second step
   1. Sub-step (3-space indent for ordered sub-lists)
```

### Links and Images

```markdown
[inline link](https://example.com)
[link with title](https://example.com "hover text")
[reference link][ref]

![alt text](image.png)
![alt text](image.png "title")

[ref]: https://example.com
```

Reference-style links are cleaner when you're linking to the same URL multiple times.

### Code

Inline: `` `const x = 1` `` — use double backticks if your code contains backticks.

Fenced blocks:

````markdown
```javascript
const greet = (name) => `Hello, ${name}`;
```
````

Always include the language tag — it's what makes syntax highlighting work in previews.

### Tables (GFM)

```markdown
| Left   | Center | Right |
|:-------|:------:|------:|
| Cell 1 | Cell 2 | $3.00 |
| Cell 4 | Cell 5 | $6.00 |
```

The colons in the separator row set alignment. The pipes on the edges are optional but make the source more readable.

### Blockquotes

```markdown
> Single line

> Multi-line blockquote
> with multiple paragraphs
>
> Second paragraph still inside the quote
```

### Task Lists (GFM)

```markdown
- [x] Completed item
- [ ] Pending item
- [ ] Another pending
```

### Horizontal Rules

Use `---` on its own line. Avoid `***` or `___` — `---` is the most widely recognized.

## Things That Trip People Up

**Blank line before a list.** If you forget it, the list might not be recognized as a list — it could get merged into the preceding paragraph.

**Indentation for code blocks inside lists.** You need 8 spaces (or one tab) before a fenced code block that's inside a list item. Fenced blocks solve this problem more cleanly than indented code blocks.

**Escaping.** Markdown doesn't use backslash escaping for everything — `\*` works to escape an asterisk, but inside code spans you don't need escaping at all.

**HTML passthrough.** Most parsers allow raw HTML, so `<div>`, `<span>`, and even `<details>` work. Block-level HTML elements need blank lines around them to work reliably.
