# HTML Entity Codec — How to Use

Convert between raw characters and HTML entities. Pure local computation, no network requests.

## When to encode

**Displaying code or markup on a page.** Writing `<div>` directly into HTML makes the browser treat it as a tag. Encode it to `&lt;div&gt;` first and viewers see the literal text.

**Writing docs, blog posts, tutorials.** Every `<`, `>`, and `&` in your sample code should be encoded, or the browser will swallow them or scramble the surrounding content.

**Handling text with special characters.** Product names like "AT&T" — the `&T` sequence can trip lenient parsers into thinking an entity started; `AT&amp;T` is always safe.

## When to decode

**Copied web content looks mangled.** Text that shows as `&quot;Hello&quot; &amp; Welcome` — paste it in, hit decode, get `"Hello" & Welcome`.

**Cleaning templates and config files.** Some systems export templates with special characters stored as entities; decoding restores the human-readable form.

## Common errors

**"Invalid HTML format"**: the input contains a dangling or malformed entity while decoding (e.g. `&lt` with no semicolon, or `&foo;` isn't a valid entity name). Check the input and complete the semicolons.

**Double encoding**: encoding already-encoded text produces `&amp;lt;` — displaying as `&lt;` instead of `<`. When in doubt, decode once first to see what you have.

**Expecting it to scan your whole HTML file**: this tool only processes what you paste. Auditing an entire file is a job for build tooling or editor plugins.
