# Markdown Formatting — What's Under the Hood

The Markdown formatter runs on **Prettier**, cleaning up the layout of Markdown source without touching content.

## What Prettier Actually Does

Prettier parses with its `markdown` parser and applies these rules:

- **Table alignment**: separator rows are padded, columns are spaced — raw table source becomes scannable
- **Blank line normalization**: headings get a leading blank line; excess consecutive blank lines are collapsed to one
- **Code block breathing room**: fenced code blocks get blank lines before and after, separating them from surrounding text
- **Indentation cleanup**: nested list indentation is aligned, irregular offset is corrected

## What It Leaves Alone

Prettier preserves semantics and won't second-guess your content:

- **Paragraph text** — no automatic word-wrapping. Markdown paragraphs have no width limit, and reflowing could alter intended line breaks
- **Nested list markers** — `*` and `+` in sub-items stay as-is. Forcing them all to `-` would risk breaking intentional list separation
- **Ordered list numbers** — the numbers you wrote stay unchanged, no auto-increment or correction
- **Link URLs and image paths** — pass through untouched

Markdown formatting is about **source readability**, not content editing. It won't rewrite sentences, adjust paragraph lengths, or change any list marker you intentionally chose.

## Why Prettier

Prettier is the most widely adopted code formatter in the front-end ecosystem. Its Markdown support covers the dimensions that matter most for doc source readability: tables, blank lines, and code blocks. One non-configurable style — especially useful in team collaboration.
