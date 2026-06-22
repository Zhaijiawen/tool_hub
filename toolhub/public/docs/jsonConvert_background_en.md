# JSON Multi-format Converter - Technical Background

Data moves between systems in different formats all the time. API responses come in JSON, config files live in YAML or TOML, Excel exports are CSV, and legacy systems speak XML. This tool handles the conversion between all five.

## The five formats compared

### JSON
The default choice for APIs and data exchange. Concise, universally supported, no comments, no date type. If a system exposes data and doesn't specify a format, it's probably JSON.

```json
{
  "name": "ToolHub",
  "version": "1.0",
  "features": ["format", "encrypt", "convert"],
  "active": true
}
```

### YAML
JSON's more readable cousin, and technically a superset of JSON. Uses indentation instead of brackets -- cleaner for humans, trickier for machines (whitespace matters). Supports comments with `#`. The go-to format for CI/CD configs, Docker Compose, Kubernetes manifests, and Ansible playbooks.

```yaml
name: ToolHub
version: "1.0"
features:
  - format
  - encrypt
  - convert
active: true
```

### CSV
The simplest format -- rows and columns. No nesting, no types, just comma-separated values. Designed for spreadsheets, and it shows. First row is conventionally the header. Only works for flat tabular data; nested JSON objects won't survive the trip to CSV.

```csv
id,name,age,city
1,Alice,25,New York
2,Bob,30,Los Angeles
```

### TOML
Purpose-built for configuration files. Has a proper type system (integers, floats, booleans, datetimes, arrays), supports comments, and uses a clean `[section]` syntax. If you've worked with Rust (`Cargo.toml`) or Python (`pyproject.toml`), you already know it.

```toml
[project]
name = "ToolHub"
version = "1.0"
active = true

[project.features]
list = ["format", "encrypt", "convert"]
```

### XML
The verbose veteran. Attributes, elements, namespaces, schemas -- XML has everything you could want and more than you probably need. Still dominant in enterprise settings (SOAP, SAML, RSS, Android layouts). Converts to JSON with some loss of fidelity because XML attributes and text nodes don't map cleanly to JSON's key-value model.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<root>
  <name>ToolHub</name>
  <version>1.0</version>
  <features>
    <item>format</item>
    <item>encrypt</item>
  </features>
</root>
```

## At a glance

| Feature | JSON | YAML | CSV | TOML | XML |
|---------|------|------|-----|------|-----|
| Nesting | Yes | Yes | No | Yes | Yes |
| Comments | No | Yes | No | Yes | Yes |
| Types | Basic | Basic | None | Rich | None |
| File size | Small | Small | Smallest | Small | Large |
| Main use | API/Storage | Config | Tables | Config | Enterprise |

## What doesn't survive conversion

**JSON to CSV:** Only flat arrays of objects convert. Deeply nested structures get flattened or dropped. All values in CSV-to-JSON become strings -- numbers and booleans need manual type coercion.

**YAML to JSON:** YAML comments disappear (JSON has no comment syntax). YAML anchors (`&`) and aliases (`*`) get expanded into their full values.

**JSON to TOML:** TOML's richer types (datetimes, for example) become strings in JSON. JSON `null` has no clean TOML equivalent.

**XML to JSON:** XML attributes require a convention -- typically they become `@attr` keys or get merged with child elements. Arrays through repeated same-name tags are the standard approach but need agreed-upon rules.
