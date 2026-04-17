# JSONPath Query — Tutorial

## Quick Start

Click one of the quick example buttons ("All Titles", etc.) to load demo data and auto-run the query.

## Custom JSON Data

1. Paste your JSON into the left input field
2. Click "Format" if the structure is hard to read
3. Any syntax errors will be highlighted with a red error message

## Writing JSONPath Expressions

Type a JSONPath expression in the right input — it queries automatically as you type.

### Common Expression Examples

**Get all items:**
```
$.items[*]
```

**Get a specific field:**
```
$.user.name
```

**Recursively find all `id` fields:**
```
$..id
```

**Filter by condition:**
```
$.products[?(@.price < 100 && @.inStock == true)]
```

**Array slice (first 3 items):**
```
$.items[0:3]
```

## Reading the Results

- The result panel shows the match count (green tag)
- Results are displayed as formatted JSON
- Click "Copy" to copy the result to clipboard

