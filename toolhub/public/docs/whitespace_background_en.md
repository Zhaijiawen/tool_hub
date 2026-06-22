# Whitespace Handling — Technical Background

Whitespace is invisible, which is precisely why it causes so many problems. A string that looks identical to the human eye can be completely different to a computer because of a trailing space, a tab instead of spaces, or a non-breaking space character masquerading as a regular space.

The whitespace handling tool tackles the two most common cleanup operations: trimming (removing whitespace from the edges) and compressing (collapsing multiple whitespace characters into singletons).

## What counts as whitespace

The obvious ones are space (` `), tab (`\t`), newline (`\n`), and carriage return (`\r`). But Unicode defines a lot more whitespace characters:

| Character | Code Point | Name | Where you'll encounter it |
|---|---|---|---|
| Space | U+0020 | SPACE | Everywhere |
| Tab | U+0009 | CHARACTER TABULATION | Code indentation, TSV files |
| Newline | U+000A | LINE FEED | Unix/Mac line endings |
| Carriage return | U+000D | CARRIAGE RETURN | Windows line endings (`\r\n`) |
| Non-breaking space | U+00A0 | NO-BREAK SPACE | Copied web content, Word documents |
| Zero-width space | U+200B | ZERO WIDTH SPACE | Text from rich editors, some emoji sequences |

The non-breaking space (U+00A0) is particularly sneaky. It looks exactly like a regular space but doesn't allow a line break at that position. It shows up constantly in text copied from web pages, Word documents, and HTML emails. JavaScript's `.trim()` does NOT strip it — only `\s` in regex matches it. The tool handles it.

Zero-width space is even worse: it's completely invisible and takes up zero width. You can have one in the middle of what looks like a single word and not know it until a string comparison mysteriously fails.

## Why whitespace matters

- **String comparison**: `"hello" === "hello "` is `false`. The difference is invisible.
- **Database queries**: `WHERE name = 'John'` won't match a stored value of `'John '`.
- **Hash/digest mismatches**: A trailing newline changes the MD5/SHA of a file completely. Two config files that look identical can have different hashes.
- **CSV parsing**: An extra space after a comma can break field matching — `"New York"` vs `" New York"`.
- **Form validation**: Users frequently add accidental spaces when typing or copy-pasting into form fields.

## Trim vs. compress

Trimming removes whitespace from the beginning and end of the text only. Internal whitespace (spaces between words) is left alone. This is what you want for cleaning up form inputs — `"  John Doe  "` becomes `"John Doe"`.

Compressing goes further: it replaces every sequence of one or more whitespace characters with a single space, and also trims the edges. `"hello    world   foo"` becomes `"hello world foo"`. This is what you want for normalizing text that has irregular spacing — pasted content, log entries, or anything with mixed tabs and spaces.

Under the hood, compression uses a regex like `\s+` to match any whitespace sequence and replaces it with a single space. The tool also handles the Unicode whitespace characters that `.trim()` misses.
