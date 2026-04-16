# JSON Multi-format Converter - Tutorial

## Getting Started

The JSON multi-format converter supports arbitrary mutual conversion among five formats: JSON, YAML, CSV, TOML, and XML — simple to use, no software installation required.

## Basic Usage

### Step 1: Paste Your Source Data

Paste your source data into the left input area. The tool will automatically attempt to detect the input format, or you can manually select the correct format from the dropdown.

### Step 2: Select Target Format

From the format dropdown on the right, select the target format you want to convert to (must be different from the input format).

### Step 3: Click Convert

Click the **Convert** button to execute the conversion. The converted output will appear in the right panel.

### Step 4: Copy or Download

- Click **Copy** to copy the result to your clipboard
- Click **Download** to save the result as a file in the target format

## Detailed Format Conversion Examples

### JSON → YAML

**Input (JSON):**
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

**Output (YAML):**
```yaml
database:
  host: localhost
  port: 5432
  name: mydb
features:
  - auth
  - cache
```

### YAML → JSON

**Input (YAML):**
```yaml
# Server configuration
server:
  host: 0.0.0.0
  port: 8080
  debug: false
```

**Output (JSON):**
```json
{
  "server": {
    "host": "0.0.0.0",
    "port": 8080,
    "debug": false
  }
}
```
> Note: Comments in YAML are removed when converting to JSON.

### JSON → CSV

**Input (JSON, must be an array of objects):**
```json
[
  {"id": 1, "name": "Alice", "age": 25, "city": "New York"},
  {"id": 2, "name": "Bob", "age": 30, "city": "Los Angeles"},
  {"id": 3, "name": "Carol", "age": 28, "city": "Chicago"}
]
```

**Output (CSV):**
```csv
id,name,age,city
1,Alice,25,New York
2,Bob,30,Los Angeles
3,Carol,28,Chicago
```

### CSV → JSON

**Input (CSV):**
```csv
name,price,in_stock
Apple,1.20,true
Banana,0.50,true
Durian,8.99,false
```

**Output (JSON):**
```json
[
  {"name": "Apple", "price": "1.20", "in_stock": "true"},
  {"name": "Banana", "price": "0.50", "in_stock": "true"},
  {"name": "Durian", "price": "8.99", "in_stock": "false"}
]
```
> Note: All values are strings when converting CSV to JSON. Manual type casting is needed for numeric or boolean values.

### JSON → XML

**Input (JSON):**
```json
{
  "person": {
    "name": "Alice",
    "age": 25,
    "hobbies": ["reading", "sports"]
  }
}
```

**Output (XML):**
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

## Swap Feature

Click the **Swap** button in the middle to move the output to the left, swap formats, and perform a reverse conversion for verification.

## FAQ

**Q: Why does JSON to CSV conversion fail?**

A: Converting JSON to CSV requires the input to be an array of objects (`[{...}, {...}]`). Plain objects or primitives are not supported.

**Q: My YAML comments disappeared after conversion?**

A: JSON does not support comments. YAML comments are discarded when converting to JSON — this is expected behavior.

**Q: The XML to JSON structure looks strange?**

A: XML attributes (`<tag attr="val">`) and text nodes are mapped to JSON following a standard convention. You may need to manually adjust the result to fit your specific needs.

## Best Practices

1. **Validate source data first**: Ensure the source data is a valid format before converting, otherwise conversion will fail
2. **Organize CSV data**: Make sure CSV has a meaningful header row and that each row has a consistent number of columns
3. **Large file handling**: Data larger than 1MB may cause the browser to slow down; consider splitting it into batches
4. **Save important results**: Use the download feature to save critical conversion results to your local machine

