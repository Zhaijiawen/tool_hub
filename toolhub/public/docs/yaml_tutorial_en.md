# YAML — Using the Formatter

Paste your YAML into the editor, hit format, and the result appears in place. The formatter normalizes indentation and key-value spacing.

## The Formatting Flow

Take something with inconsistent indentation:

```yaml
database:
    host: localhost
    port: 5432
    name: myapp
    user: admin
server:
    port: 8080
    host: 0.0.0.0
    timeout: 30
```

Hit format and it becomes:

```yaml
database:
  host: localhost
  port: 5432
  name: myapp
  user: admin

server:
  port: 8080
  host: 0.0.0.0
  timeout: 30
```

The formatter normalizes indentation to 2 spaces so the hierarchy is consistent and readable.

## Common Pitfalls

**Wrong indentation:**

```yaml
# Broken — no indent after key
key:
nested: value

# Fixed
key:
  nested: value
```

**Unquoted special values:**

```yaml
# Broken — the colon in the URL looks like a new key
url: http://example.com

# Fixed
url: "http://example.com"
```

**Missing quotes around yes/no/on/off:**

```yaml
# Broken — parsed as boolean, not a string
country: no

# Fixed
country: "no"
```

The formatter won't fix these for you — it handles layout, not semantics. But formatted indentation and spacing help you see the document structure clearly before committing.

## Multi-line Strings

```yaml
# Literal block — newlines are preserved
description: |
  Line one.
  Line two.
  Line three.

# Folded block — newlines become spaces
summary: >
  This long text gets
  folded into a single
  line in the output.
```

Use `|` when formatting matters (scripts, certificates, markdown), use `>` when you just want a readable long string in source.

## Anchors and Aliases

Repeat a config block once and reference it everywhere:

```yaml
defaults: &defaults
  timeout: 30
  retries: 3

development:
  <<: *defaults
  host: localhost
  debug: true

production:
  <<: *defaults
  host: prod.example.com
  debug: false
```

The `&defaults` sets the anchor, `*defaults` references it, `<<:` merges all keys into the current object.

## Multi-document Streams

Multiple YAML documents in one file, separated by `---`:

```yaml
---
name: doc1
value: 123
---
name: doc2
value: 456
```

Kubernetes uses this: every resource definition in a single file is its own document.

## Practical Tips

- Stick to 2-space indents. It's the de facto convention and every tool expects it.
- Show whitespace in your editor. Tabs in YAML are the #1 source of mysterious errors.
- Quote values that start with `{`, `[`, `!`, `%`, `&`, `*`, or contain `:` except as key-value separator.
- Use `#` comments liberally — they're the main reason to pick YAML over JSON in the first place.
