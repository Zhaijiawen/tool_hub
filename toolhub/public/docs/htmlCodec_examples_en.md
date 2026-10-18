# HTML Entity Codec — Code Examples

## JavaScript: built-in browser codecs

```javascript
// Encoding: manual replacements
function encodeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

encodeHtml('<script>alert("xss")</script>')
// "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
```

`&` must be replaced first — otherwise the `&lt;` produced by earlier replacements gets double-escaped into `&amp;lt;`.

```javascript
// Decoding: let the browser parse it
function decodeHtml(str) {
  const el = document.createElement('textarea')
  el.innerHTML = str
  return el.value
}

decodeHtml('&lt;b&gt;bold&lt;/b&gt;')  // "<b>bold</b>"
```

## Python: the html standard library

```python
import html

html.escape('<script>')          # '&lt;script&gt;'
html.unescape('&lt;b&gt;')       # '<b>'
```

## In server-side templates

```html
<!-- Wrong: user input inserted directly, XSS hole -->
<div>{{ user_input }}</div>

<!-- Right: frameworks auto-escape (Django/Jinja2/Vue do this by default) -->
<div>{{ user_input }}</div>
```

Modern template engines escape by default; hand-rolled HTML concatenation is where the holes are.

## Remember

- Entity encoding is display-layer escaping, not a complete XSS defense
- Always encode `&` first or you get double-escaping
- For production XSS defense, use an audited library like DOMPurify
