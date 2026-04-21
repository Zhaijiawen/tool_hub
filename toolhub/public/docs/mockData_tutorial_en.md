# Mock Data Generator - Usage Tutorial

## Quick Start

The tool comes pre-loaded with a typical user data structure. Click "Generate" right away to see the output. Use it as a starting point, or click "Clear" to build a schema from scratch.

## Configuring Fields

### Adding Fields

Click the "+ Add Field" button to append a new row to the field list. Each field requires:

1. **Field name**: The JSON key in the generated output, e.g. `id`, `name`, `createdAt`
2. **Field type**: Determines what data is generated (see type reference below)

### Field Type Reference

#### Basic Types

| Type | Generated content | Extra config |
|------|------------------|--------------|
| Integer (int) | Random integer within a range | Min / Max |
| Float | Random decimal within a range | Min / Max / Decimal places |
| String | Random alphanumeric string | — |
| Boolean | `true` or `false` | — |
| UUID | Standard UUID v4 | — |

#### Common Faker Types

| Type | Example output |
|------|---------------|
| Name | Alice Smith |
| Email | user123@example.com |
| Phone | +1-555-0123 |
| Date | 2024-03-15 |
| Datetime | 2024-03-15T14:30:00Z |
| URL | https://example.com/page |
| IP | 192.168.1.42 |
| Color | #3a7bd5 |

#### Enum

Randomly picks one value from a custom list. Enter comma-separated options in the text field:

```
active,inactive,pending,deleted
```

#### Custom Template

Freely combine output using `{{}}` placeholders:

| Placeholder | Meaning |
|-------------|---------|
| `{{int(1,100)}}` | Random integer from 1 to 100 |
| `{{float(0,1,2)}}` | Random decimal 0–1 with 2 decimal places |
| `{{uuid}}` | UUID |
| `{{name}}` | Random name |
| `{{email}}` | Random email |

Example: `USER_{{int(10000,99999)}}_{{name}}`

#### Nested Structures

- **Object**: Generates a nested object; add child fields underneath it
- **Array**: Generates an array; configure the element type (basic type or enum) and min/max element count

### Removing Fields

Click the **×** button on the right side of a field to delete it. Child fields within nested structures work the same way.

## Setting the Record Count

Enter the number of records to generate (1–1000) in the "Count" field.

## Generating and Exporting

- **Generate**: produce JSON data based on the current field schema
- **Copy**: copy the generated JSON to the clipboard
- **JSON**: download the generated data as a `.json` file

## Tips

- Field names support any characters including non-ASCII, but camelCase or snake_case is recommended for broadest JSON parser compatibility
- Object / Array fields can be collapsed and expanded to manage complex structures
- Dates and datetimes are generated using the browser's local timezone

