# Regular Expression Tester — Technical Background

## What Is a Regular Expression?

A regular expression (regex or regexp) is a sequence of characters that defines a search pattern. It is a powerful tool for string matching, validation, extraction, and transformation used across virtually every programming language.

## Core Syntax

### Literal Characters
Most characters match themselves: `abc` matches the string "abc".

### Special Characters (Metacharacters)
| Symbol | Meaning |
|---|---|
| `.` | Any single character (except newline) |
| `^` | Start of string (or line in multiline mode) |
| `$` | End of string (or line in multiline mode) |
| `*` | 0 or more of the preceding element |
| `+` | 1 or more of the preceding element |
| `?` | 0 or 1 of the preceding element (also makes quantifiers lazy) |
| `\` | Escapes the next special character |
| `|` | Alternation — matches either the left or right expression |
| `()` | Grouping and capture |
| `[]` | Character class |
| `{}` | Quantifier with exact count |

### Character Classes
| Pattern | Matches |
|---|---|
| `[abc]` | a, b, or c |
| `[^abc]` | Any character except a, b, c |
| `[a-z]` | Any lowercase letter |
| `[0-9]` | Any digit |
| `\d` | Any digit — equivalent to `[0-9]` |
| `\D` | Any non-digit |
| `\w` | Word character `[a-zA-Z0-9_]` |
| `\W` | Non-word character |
| `\s` | Whitespace character |
| `\S` | Non-whitespace character |

### Quantifiers
| Pattern | Meaning |
|---|---|
| `a{3}` | Exactly 3 a's |
| `a{2,4}` | 2 to 4 a's |
| `a{2,}` | 2 or more a's |

## Flags

| Flag | Effect |
|---|---|
| `g` | Global — find all matches, not just the first |
| `i` | Case-insensitive matching |
| `m` | Multiline — `^` and `$` match line boundaries |
| `s` | Dotall — `.` also matches newline |

## Groups and Backreferences

- `(pattern)` — capturing group, accessible as `$1`, `$2`, etc.
- `(?:pattern)` — non-capturing group
- `(?=pattern)` — positive lookahead
- `(?!pattern)` — negative lookahead

