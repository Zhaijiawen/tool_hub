# YAML Usage Tutorial

## Getting Started with YAML Formatting

The YAML formatter tool helps you organize and beautify YAML data, making it more readable and understandable. This tutorial will guide you through the process of formatting YAML data effectively.

## Basic Formatting Process

### Step 1: Prepare Your YAML Data

Start by gathering the YAML data you want to format. This could be:
- Configuration files
- CI/CD pipeline definitions
- Kubernetes manifests
- Docker Compose files
- Application settings

### Step 2: Input Your Data

1. Open the YAML formatter tool
2. Locate the input area (usually on the left side)
3. Paste your YAML data into the input box
4. Ensure your YAML is valid (the tool will validate it)

Example input:
```yaml
database:host:localhost port:5432 name:myapp user:admin server:port:8080 host:0.0.0.0 timeout:30 logging:level:INFO file:logs/app.log
```

### Step 3: Choose Formatting Options

Before formatting, consider these options:

#### Indentation Settings
- **2 Spaces**: Standard indentation, good for most use cases
- **4 Spaces**: More readable for complex nested structures
- **Tab**: Traditional indentation method (not recommended)

#### Additional Options
- **Sort Keys**: Alphabetically sort object keys
- **Compressed Format**: Remove all unnecessary whitespace
- **Preserve Comments**: Keep any comments in the YAML
- **Validate YAML**: Check for well-formedness and optionally validate against schemas

### Step 4: Format Your YAML

1. Click the "Format" button
2. Wait for the tool to process your data
3. Review the formatted output on the right side

Expected output:
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

logging:
  level: INFO
  file: logs/app.log
```

## Advanced Formatting Features

### Syntax Validation

The tool automatically validates your YAML syntax and provides helpful error messages:

#### Common Errors and Solutions

**Incorrect Indentation**
```yaml
# Incorrect
key:
nested_key: value

# Correct
key:
  nested_key: value
```

**Missing Quotes**
```yaml
# Incorrect
key: value with spaces
special: on:off

# Correct
key: "value with spaces"
special: "on:off"
```

**Invalid Characters**
```yaml
# Incorrect
text: Line 1
Line 2

# Correct
text: |
  Line 1
  Line 2
```

### Error Handling

When the tool encounters errors:

1. **Syntax Errors**: The tool will highlight the problematic line
2. **Validation Messages**: Clear explanations of what needs to be fixed
3. **Auto-correction**: Some tools can automatically fix common issues

## Tool Features

### Copy Functionality

1. Click the "Copy" button next to the formatted output
2. The formatted YAML is copied to your clipboard
3. Paste it wherever you need the formatted data

### Clear Function

1. Click the "Clear" button to reset both input and output areas
2. Useful when working with multiple YAML documents

### Export Options

Some formatters offer additional export options:
- Download as `.yaml` or `.yml` file
- Export as formatted text
- Share via URL (if supported)

## Best Practices for YAML Formatting

### 1. Consistent Indentation

Choose an indentation style and stick to it:
```yaml
# Good - 2 spaces
key:
  level1:
    level2:
      level3: value
```

### 2. Logical Grouping

Group related keys together:
```yaml
# Database configuration
database:
  host: localhost
  port: 5432
  name: myapp
  user: admin

# Server configuration
server:
  port: 8080
  host: 0.0.0.0
  timeout: 30
```

### 3. Meaningful Keys

Use descriptive and meaningful key names:
```yaml
# Good
user_name: "John Doe"
email_address: "john@example.com"
database_host: "localhost"

# Avoid
un: "John Doe"
ea: "john@example.com"
dh: "localhost"
```

### 4. Proper String Handling

Handle strings appropriately:
```yaml
# Simple strings (no quotes needed)
simple: Hello World
number: 42
boolean: true

# Complex strings (quotes recommended)
complex: "Hello, World!"
special: "on:off"
spaces: "value with spaces"
```

## Troubleshooting Common Issues

### Issue: "Invalid YAML" Error

**Possible Causes:**
- Incorrect indentation
- Missing quotes around special values
- Invalid characters in unquoted strings
- Improper nesting

**Solution:**
1. Check the error message for the line number
2. Verify indentation is consistent (use spaces, not tabs)
3. Add quotes around values with special characters
4. Check for proper nesting structure

### Issue: Indentation Problems

**Problem:** YAML is sensitive to indentation

**Solutions:**
1. Use consistent indentation (2 spaces recommended)
2. Avoid mixing spaces and tabs
3. Use a text editor that shows whitespace
4. Use YAML linters to catch indentation issues

### Issue: Complex Structures

**Problem:** Deeply nested YAML can be hard to read

**Solutions:**
1. Use consistent indentation
2. Add comments to document structure
3. Consider breaking large files into smaller ones
4. Use anchors and aliases for repeated structures

## Tips for Efficient YAML Formatting

### 1. Use Keyboard Shortcuts

Most YAML formatters support keyboard shortcuts:
- `Ctrl+Shift+F` (Windows/Linux) or `Cmd+Shift+F` (Mac) for formatting
- `Ctrl+C` and `Ctrl+V` for copy/paste operations

### 2. Validate Before Formatting

Always validate your YAML before formatting to catch errors early.

### 3. Keep Backups

Before making extensive changes, keep a backup of your original YAML.

### 4. Use Version Control

If working with YAML configuration files, use version control to track changes.

### 5. Consider Schema Validation

For important YAML documents, consider using YAML Schema validation to ensure data integrity.

## YAML Comments

Use comments to document your YAML:

```yaml
# Application configuration
app:
  name: MyApp
  version: 1.0.0

# Database settings
database:
  host: localhost  # Database host
  port: 5432       # Database port
  name: myapp      # Database name
```

## Multi-line Strings

YAML supports different multi-line string formats:

```yaml
# Literal block scalar (preserves newlines)
literal: |
  This is a
  multi-line string
  with preserved newlines

# Folded block scalar (folds newlines to spaces)
folded: >
  This is a folded
  multi-line string
  that becomes one line

# Flow scalar (quoted string)
flow: "This is a\nmulti-line string\nwith escape sequences"
```

## Anchors and Aliases

Use anchors and aliases to avoid repetition:

```yaml
# Define defaults
defaults: &defaults
  timeout: 30
  retries: 3
  logging: INFO

# Use defaults in different environments
development:
  <<: *defaults
  host: localhost
  debug: true

production:
  <<: *defaults
  host: prod.example.com
  debug: false
```

## Multi-document Streams

YAML can contain multiple documents:

```yaml
---
# First document
name: Document 1
value: 123
---
# Second document
name: Document 2
value: 456
```

This tutorial should help you effectively use YAML formatting tools to create clean, readable, and properly structured YAML documents. 