# XML — Using the Formatter

Paste messy XML on the left, get clean, properly indented XML on the right. The formatter validates well-formedness as you type.

Before:

```xml
<bookstore><book category="fiction"><title lang="en">The Great Gatsby</title><author>Fitzgerald</author><year>1925</year><price currency="USD">10.99</price></book></bookstore>
```

After:

```xml
<bookstore>
  <book category="fiction">
    <title lang="en">The Great Gatsby</title>
    <author>Fitzgerald</author>
    <year>1925</year>
    <price currency="USD">10.99</price>
  </book>
</bookstore>
```

## Structure Rules

Every XML document must be well-formed:
- One root element that contains all others
- Every open tag must have a matching close tag (or be self-closing: `<br/>`)
- Elements must be properly nested — no overlapping
- Attribute values must be quoted
- Special characters (`<`, `>`, `&`, `"`, `'`) must be escaped

## Namespaces

```xml
<root xmlns:bk="http://example.com/books"
      xmlns:auth="http://example.com/authors">
  <bk:book>
    <bk:title>XML Guide</bk:title>
    <auth:name>John Doe</auth:name>
  </bk:book>
</root>
```

## Attributes vs Elements

Use attributes for metadata (IDs, types, references) and elements for content:

```xml
<!-- Good -->
<book isbn="978-0-123-45678-9">
  <title>The Great Novel</title>
  <author>Jane Smith</author>
</book>

<!-- Avoid putting content in attributes -->
<book title="The Great Novel" author="Jane Smith" isbn="978-0-123-45678-9" />
```

## Common Errors

**Unclosed tags** — `<book>` without `</book>`; the formatter catches these.

**Mismatched case** — `<Book>` vs `</book>`; XML is case-sensitive.

**Missing quotes on attributes** — `<book category=fiction>` is invalid; must be `<book category="fiction">`.

**Unescaped ampersands** — `&` in content must be `&amp;`. This bites people in URLs: `http://example.com?a=1&b=2` is invalid XML; use `&amp;`.
