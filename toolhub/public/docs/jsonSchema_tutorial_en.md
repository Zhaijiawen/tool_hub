# JSON Schema Generator - Usage Tutorial

## Quick Start

1. Paste your JSON data into the left input area
2. Select the target format (JSON Schema or TypeScript Interface)
3. The result appears on the right instantly — click "Copy" to use it

## Input JSON Data

Paste the JSON you want to analyze into the left input area. For example:

```json
{
  "id": 1001,
  "name": "Alice",
  "email": "alice@example.com",
  "isActive": true,
  "roles": ["admin", "editor"],
  "address": {
    "city": "New York",
    "zipCode": "10001"
  }
}
```

The tool automatically infers the type of each field and generates the corresponding schema or interface.

## Choosing the Output Format

The tool supports two output formats:

### JSON Schema

Generates a standard JSON Schema (Draft-07), useful for:
- API documentation (OpenAPI/Swagger)
- Data validation with libraries like ajv or joi
- IDE support for config files

### TypeScript Interface

Generates TypeScript type interfaces, useful for:
- Type definitions in frontend TypeScript projects
- API response type annotations
- Editor autocomplete

## Understanding the Generation Rules

### Type Inference

| JSON value | Inferred type |
|------------|--------------|
| `"hello"` | `string` |
| `42` | `integer` |
| `3.14` | `number` |
| `true` / `false` | `boolean` |
| `null` | `null` |
| `[...]` | `array` |
| `{...}` | `object` |

### Nested Objects

The tool recursively processes nested objects and generates schemas for each level:

```json
{
  "user": {
    "profile": {
      "avatar": "url"
    }
  }
}
```

This produces a schema with `$defs` references or inline nested `properties`.

### Array Items

The first element of an array is used to infer the `items` type. If the array is empty (`[]`), `items` defaults to `{}` (allows anything).

## Using the Generated Output

### Validation in JavaScript

```javascript
import Ajv from 'ajv'
const ajv = new Ajv()

const validate = ajv.compile(schema) // paste the generated schema
const valid = validate(data)
if (!valid) console.log(validate.errors)
```

### Using the TypeScript Interface

Paste the generated interface directly into a `.ts` file:

```typescript
interface User {
  id: number
  name: string
  email: string
  isActive: boolean
  roles: string[]
  address: {
    city: string
    zipCode: string
  }
}
```

## Notes

- The tool infers types from **sample data** — it cannot infer constraints like `minLength` or `pattern` (add these manually)
- If a field can be `null`, update the type manually to `["string", "null"]` in JSON Schema or `string | null` in TypeScript
- For very large JSON (> 10,000 lines), consider extracting a representative slice before generating

