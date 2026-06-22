# JSON Multi-format Converter - Tutorial

Converts between JSON, YAML, CSV, TOML, and XML. Paste your data in one format, pick the target, convert, copy, done.

## The workflow

### 1. Paste your source data

Drop your data into the left input area. The tool tries to auto-detect the format. If it guesses wrong, pick the right one from the dropdown.

### 2. Pick the target format

Choose what you want to convert to on the right side. Can't be the same as the input format -- converting JSON to JSON isn't interesting.

### 3. Convert

Hit the button. Result appears in the right panel.

### 4. Copy or download

Copy button for quick paste elsewhere. Download if you need a file in the target format.

## Conversion walkthroughs

### JSON to YAML -- API config to CI file

Input:
```json
{
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "mydb"
  },
  "features": ["auth", "cache"]
}
```

Output:
```yaml
database:
  host: localhost
  port: 5432
  name: mydb
features:
  - auth
  - cache
```

### YAML to JSON -- the reverse

Input:
```yaml
# Server configuration
server:
  host: 0.0.0.0
  port: 8080
  debug: false
```

Output (comments are stripped -- JSON can't hold them):
```json
{
  "server": {
    "host": "0.0.0.0",
    "port": 8080,
    "debug": false
  }
}
```

### JSON to CSV -- must be an array of objects

Input:
```json
[
  {"id": 1, "name": "Alice", "age": 25, "city": "New York"},
  {"id": 2, "name": "Bob", "age": 30, "city": "Los Angeles"},
  {"id": 3, "name": "Carol", "age": 28, "city": "Chicago"}
]
```

Output:
```csv
id,name,age,city
1,Alice,25,New York
2,Bob,30,Los Angeles
3,Carol,28,Chicago
```

### CSV to JSON -- everything becomes a string

Input:
```csv
name,price,in_stock
Apple,1.20,true
Banana,0.50,true
```

Output -- note the quotes around numbers and booleans:
```json
[
  {"name": "Apple", "price": "1.20", "in_stock": "true"},
  {"name": "Banana", "price": "0.50", "in_stock": "true"}
]
```

If you need `price` as a number and `in_stock` as a boolean, you'll have to `parseInt`/`parseFloat` after converting, or map the array.

### JSON to XML

Input:
```json
{
  "person": {
    "name": "Alice",
    "age": 25,
    "hobbies": ["reading", "sports"]
  }
}
```

Output (arrays become repeated tags):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<root>
  <person>
    <name>Alice</name>
    <age>25</age>
    <hobbies>reading</hobbies>
    <hobbies>sports</hobbies>
  </person>
</root>
```

## The swap button

Middle button swaps input and output -- useful for reverse conversions to verify nothing got mangled.

## Common gotchas

**JSON to CSV fails?** Your data probably isn't an array of flat objects. Nested objects can't convert to CSV without losing structure.

**YAML comments disappeared?** Expected. JSON doesn't support comments, so they're dropped during conversion.

**XML to JSON looks weird?** XML attributes and text nodes don't map 1:1 to JSON. The converter follows a standard convention, but you might need tweaks for your specific schema.

**Large data?** Over 1MB might lag the browser. Split into chunks or use a CLI tool like `yq` or `dasel` for big files.
