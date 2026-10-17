# PCRE2 Regex — Technical Background

This tool runs regular expressions in the browser using a WASM build of **PCRE2**, supporting match, replace, and group extraction. Unlike JavaScript's built-in regex, PCRE2 implements Perl-compatible semantics and is more powerful.

## Difference from JS regex

JS regex (based on the ECMAScript standard) lacks some advanced features. PCRE2 additionally supports:

- **Recursive matching / subroutine calls**: `(?R)`, `(?1)`, etc. — can match nested structures (e.g. balanced parentheses).
- **Named subroutines, conditionals**: `(?(1)yes|no)`.
- **Richer assertions**: lookbehind in PCRE2 has no JS-style length limit.
- **Fuller character classes**: `\R` (any newline), `\K` (reset match start), etc.

## Flags

Toggleable: `i` case-insensitive, `m` multiline, `s` dot matches newline, `x` free-spacing comments, `u` UTF, `UCP` Unicode properties, `U` ungreedy, `A` anchored, `D` dollar at end only, `n` no auto capture.

## Result display

- Total matches, capture count, named-group count, whether backreferences exist.
- Each match shows position, content, numbered groups `$(n)`, and named groups.
- Compile errors show the message and the offset where it failed, for easy locating.

## Privacy

Patterns and text are processed locally; nothing is uploaded.
