# Regular Expression Tester — Technical Background

If you've spent any time in a terminal or an editor, you've probably stumbled across regex — those cryptic slash-delimited incantations that somehow match exactly what you need. A regular expression is just a search pattern expressed as a string of characters, and it shows up in every language: JavaScript, Python, Go, Java, shell scripts, you name it. Whether you're validating form input, parsing logs, or doing a quick find-and-replace across a codebase, regex is the Swiss Army knife you keep reaching for.

## The Building Blocks

Most of the time characters just match themselves. The pattern `abc` hits the literal string "abc" — no magic there. The power comes from the metacharacters, special symbols that change how matching works.

| Symbol | What it does |
|---|---|
| `.` | Matches any single character except newlines |
| `^` | Anchors to the start of the string (or start of line with `m` flag) |
| `$` | Anchors to the end of the string (or end of line with `m` flag) |
| `*` | Zero or more of whatever came before |
| `+` | One or more of whatever came before |
| `?` | Zero or one — makes the preceding token optional. Also switches quantifiers to lazy mode when placed after them |
| `\` | Escape hatch: turns the next metacharacter back into a literal |
| `|` | Alternation — think of it as "or" between two sub-patterns |
| `()` | Capturing group — also controls precedence |
| `[]` | Character class — match any one character inside |
| `{}` | Fixed-quantity quantifier |

## Character Classes

Instead of spelling out every possible character, you use shorthand classes. They're compact and way easier to read.

| Pattern | Matches |
|---|---|
| `[abc]` | Exactly a, b, or c |
| `[^abc]` | Anything except a, b, or c |
| `[a-z]` | Any lowercase letter |
| `[0-9]` | Any digit |
| `\d` | Shorthand for `[0-9]` |
| `\D` | Anything that isn't a digit |
| `\w` | Word characters: `[a-zA-Z0-9_]` |
| `\W` | Non-word characters |
| `\s` | Whitespace (spaces, tabs, newlines) |
| `\S` | Anything that's not whitespace |

## Quantifiers

You rarely want one character at a time. Quantifiers tell the engine how many of the preceding token to grab.

| Pattern | Meaning |
|---|---|
| `a{3}` | Exactly three a's |
| `a{2,4}` | Between two and four a's |
| `a{2,}` | Two or more a's, no upper limit |

A common gotcha: quantifiers are greedy by default — they'll grab as much as they can. Slap a `?` after a quantifier (like `*?` or `+?`) and it becomes lazy, matching as little as possible. This matters a lot when you're parsing HTML with `.*` and accidentally swallow the entire document.

## Flags

Flags tweak how the whole pattern behaves. You set them separately from the pattern itself.

| Flag | Effect |
|---|---|
| `g` | Global — return every match, not just the first one |
| `i` | Case-insensitive — `[a-z]` also matches `[A-Z]` |
| `m` | Multiline — `^` and `$` anchor to line boundaries instead of the whole string |
| `s` | Dotall — lets `.` match newlines too, which it normally skips |

In practice you'll combine flags. Pattern `/[a-z]+/gi` finds every alphabetic chunk regardless of case — that's the boring part you already know. The real trick is knowing when to use `m` for log files where each line is a separate record, or `s` when you need to slurp a multiline block into a single pattern.

## Groups and Lookarounds

Capturing groups `(pattern)` are how you pull substrings out of a match. The first pair of parens becomes `$1`, the second `$2`, and so on. When you're doing find-and-replace, `$1` lets you rearrange text without losing data — swap "Doe, John" to "John Doe" with `(\w+),\s(\w+)` and `$2 $1`.

Non-capturing groups `(?:pattern)` act like regular groups for precedence but don't create a backreference. Use them when you need grouping control but don't care about the captured content.

Lookaheads are zero-width assertions — they check whether something exists (or doesn't) without consuming characters:
- `(?=pattern)` — positive lookahead: must be followed by this
- `(?!pattern)` — negative lookahead: must NOT be followed by this

A classic use case: `\d+(?=px)` matches a number only when it's immediately followed by "px", so `12px` gives you `12` but `12em` doesn't. Handy when scraping CSS values, extracting dimensions from style attributes, or parsing any format where context determines meaning.
