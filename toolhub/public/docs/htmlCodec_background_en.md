# HTML Entity Codec — The Technical Background

HTML reserves a set of characters with special meaning: `<` and `>` delimit tags, `&` starts an entity reference, quotes delimit attribute values. To *display* these characters literally instead of letting the browser parse them as syntax, you use entity references — escape sequences that start with `&` and end with `;`.

## Common entities

| Character | Entity | Use case |
|---|---|---|
| `<` | `&lt;` | Showing code snippets on a page |
| `>` | `&gt;` | Same |
| `&` | `&amp;` | Literal ampersands in text |
| `"` | `&quot;` | Quotes inside attribute values |
| `'` | `&#39;` | Same, single quotes |
| (space) | `&nbsp;` | Non-breaking consecutive spaces |

Numeric references work too: `&#60;` (decimal) or `&#x3C;` (hex) are equivalent to `&lt;`. Browsers accept all three forms.

## Encoding vs decoding

- **Encoding**: turns `<script>alert(1)</script>` into `&lt;script&gt;alert(1)&lt;/script&gt;` — the text can now be safely *displayed*; the browser won't execute it.
- **Decoding**: the reverse — `&lt;b&gt;` becomes `<b>`, turning entity-laden text copied from the web back into readable characters.

## Security boundary (important)

Entity encoding is a **display-layer** escape, not complete XSS protection. Encoding user input before inserting it into HTML stops the "`<script>` gets parsed" class of attacks, but attribute contexts (`javascript:` URLs in `href="..."`), event attributes, and mistimed decoding all leave openings. For production XSS defense, use an audited library (DOMPurify et al.) and pick the right escaping strategy per context (HTML body / attribute / JavaScript / URL each differ).

This tool is pure local computation: input in, result out, no network requests. Good for document fragments, template strings, and mangled text copied from web pages.
