# Mock Data Generator — How to Use

The tool comes with a pre-built user schema so you can hit Generate and see output immediately. Modify that template or clear it and build your own from scratch.

## Configuring fields

Hit "+ Add Field" to add a row. Each field needs a name (the JSON key) and a type (what to generate).

### Field types

**Basic types —**

| Type | Produces | Extra config |
|------|---------|-------------|
| Integer | Random number in a range | Min / Max |
| Float | Random decimal | Min / Max / Decimal places |
| String | Random alphanumeric | — |
| Boolean | `true` or `false` | — |
| UUID | Standard UUID v4 | — |

**Faker types —**

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

**Enum —** Define a list of options separated by commas: `active,inactive,pending,deleted`. The generator picks one randomly.

**Custom template —** Use `{{}}` placeholders to compose values. Available helpers:

| Placeholder | What it does |
|-------------|-------------|
| `{{int(1,100)}}` | Random integer 1 to 100 |
| `{{float(0,1,2)}}` | Random float 0 to 1, 2 decimal places |
| `{{uuid}}` | UUID v4 |
| `{{name}}` | Random name |
| `{{email}}` | Random email |

Example: `USER_{{int(10000,99999)}}_{{name}}` produces something like `USER_45892_AliceSmith`.

**Nested structures —** Object creates a nested object (add child fields under it). Array generates an array of elements — configure the element type (a basic type or enum) and min/max count.

### Managing fields

Click the × button to delete a field. Drag fields to reorder them (the order determines the JSON key order in output). Object and Array fields can be collapsed to keep the UI manageable.

## Generating and exporting

Set the count (1 to 1000), hit Generate. The output area shows pretty-printed JSON. Click Copy to grab it to clipboard, or JSON to download as a `.json` file.

## Tips

Field names can include any characters including Chinese, but camelCase or snake_case is safer for broad JSON parser compatibility. Object and Array fields produce structured output that matches real API response shapes. Date and datetime values use your browser's timezone.
