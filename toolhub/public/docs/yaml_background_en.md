# YAML — What's Going On Under the Hood

YAML started in 2001 as a reaction to XML's verbosity. Clark Evans wanted something humans could actually read without a parser. The name originally stood for "Yet Another Markup Language," but they changed it to "YAML Ain't Markup Language" to make it clear: this is for data, not documents.

## Why YAML Took Over Config Files

The big advantage over JSON? Comments. You can explain *why* a setting is what it is, right next to the value. And there's no bracket noise — indentation carries the structure. After years of staring at curly braces, reading clean YAML feels like taking off sunglasses indoors.

Compared to XML, YAML is dramatically less verbose. A 200-line XML config might be 20 lines of YAML. That matters when you're debugging a CI pipeline at 2am.

## The Syntax in 60 Seconds

```yaml
# Comments start with #
key: value                    # Simple scalar
nested:
  child: value                # Indentation (2 spaces) creates hierarchy
list:
  - item1                     # Sequences use dashes
  - item2
  - name: John                # List items can be objects
    age: 30
```

## Data Types

```yaml
string: "hello"               # Quotes optional unless there are special chars
number: 42
float: 3.14
boolean: true                 # or false
null_value: null              # or ~
multiline: |                  # | preserves newlines
  line one
  line two
folded: >                     # > folds newlines to spaces
  this becomes
  one line
```

## The Stuff That Bites You

**Indentation must be spaces, not tabs.** Mix the two and your YAML parser will throw errors that reference the wrong line number. Set your editor to show whitespace.

**The Norway problem.** Unquoted `no`, `yes`, `on`, `off` are booleans, not strings. So `country: no` means `country: false`. Norway literally breaks YAML configs. Always quote: `country: "no"`.

**`:` in values.** `url: http://example.com` is a syntax error because the parser sees the first `:` as a key-value separator. Quote it: `url: "http://example.com"`.

**Anchors and aliases** let you DRY up repeated blocks:

```yaml
defaults: &defaults
  timeout: 30
  retries: 3

dev:
  <<: *defaults
  host: localhost

prod:
  <<: *defaults
  host: prod.example.com
```

The `&` defines an anchor, `*` references it, `<<:` merges the keys.

**Multi-document files** use `---` as separator and `...` as terminator:

```yaml
---
doc1: value
---
doc2: value
```

## YAML 1.1 vs 1.2

YAML 1.2 (2009) cleaned up a bunch of the type ambiguity. `Yes`/`No`/`On`/`Off` only count as booleans in 1.1 — 1.2 requires lowercase. Most modern parsers use 1.2, but some (like PyYAML) still default to 1.1. Worth checking which spec your tool uses.

## Where You'll See It

- **Kubernetes** — every manifest is YAML
- **Docker Compose** — service definitions
- **GitHub Actions / GitLab CI** — workflow definitions
- **Ansible** — playbooks and inventories
- **Helm** — Kubernetes package manager charts
- **Every CI/CD pipeline** — pretty much universally YAML

## Security Heads-Up

YAML parsers vary widely in what they'll execute. The PyYAML `load()` function can run arbitrary Python code if the input contains `!!python/object` tags. Always use `safe_load()` or equivalent for untrusted input. Every language's YAML library has a safe mode — use it unless you have a specific reason not to.
