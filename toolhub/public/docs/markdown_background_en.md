# Markdown Converter — Technical Background

## What Is Markdown?

Markdown is a lightweight markup language created by John Gruber in 2004. It allows you to write formatted text using plain text syntax that is easy to read and write. Markdown files are converted to HTML for display in browsers, documentation sites, and README files.

## Why Markdown?

- **Readable as plain text**: Unlike HTML, Markdown source is human-readable without rendering
- **Portable**: Works in GitHub, GitLab, Notion, Confluence, VS Code, and more
- **Simple syntax**: Learn in minutes, use for years

## Core Syntax

### Headings
```markdown
# H1
## H2
### H3
```

### Emphasis
```markdown
**bold**   _italic_   ~~strikethrough~~
```

### Lists
```markdown
- Unordered item
1. Ordered item
```

### Links and Images
```markdown
[link text](https://example.com)
![alt text](image.png)
```

### Code
```markdown
`inline code`

​```javascript
// code block
const x = 1;
​```
```

### Tables
```markdown
| Column 1 | Column 2 |
|---|---|
| Cell 1   | Cell 2   |
```

### Blockquotes
```markdown
> This is a blockquote
```

## Markdown Flavors

- **CommonMark**: the standardized Markdown specification
- **GitHub Flavored Markdown (GFM)**: adds tables, task lists, strikethrough
- **MDX**: Markdown with embedded JSX components (used in React docs)
- **kramdown**: used by Jekyll and GitHub Pages

## Markdown to HTML

Markdown processors convert `.md` files to HTML. The tool on this page renders Markdown in real time so you can preview exactly how your content will look when published.
