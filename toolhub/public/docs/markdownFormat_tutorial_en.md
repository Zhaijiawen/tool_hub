# Markdown Formatter — How to Use It

## Quick Start

1. Paste your Markdown into the editor
2. Hit the **Format** button
3. Copy the result or download it as a `.md` file

The formatter runs entirely in your browser — nothing is uploaded.

## What Actually Changes

| Change you'll see | Example |
|---|---|
| Tables aligned | `\|a\|b\|` → `\| a \| b \|`, separator rows padded |
| Excess blank lines merged | 3 blank lines become 1 |
| Blank line before headings | Auto-inserted when heading is tight against previous text |
| Code blocks get breathing room | Blank lines added around fenced code blocks |

## Pro Tips

- **Formatting is idempotent** — hit Format twice, the output won't change
- Multi-author docs get consistent blank-line spacing after formatting — diffs don't get cluttered with meaningless whitespace changes
- Hand-written tables come out with aligned separators — way easier to scan the source
- Use the **Download** button to save straight to `.md` — one click instead of copy-paste
- Formatting preserves list markers and paragraph text — safe to use, nothing gets lost
