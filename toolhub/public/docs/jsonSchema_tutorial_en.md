# JSON Schema Generator - Tutorial

Drop in some JSON, get back either a JSON Schema or a TypeScript interface. It's a time-saver -- instead of typing out type definitions by hand, you paste an API response and the tool does the grunt work.

## How to use it

1. Paste your JSON into the input area at the top
2. Pick the output format -- JSON Schema or TypeScript Interface
3. The result shows up in the output area below. Copy and paste into your project.

Example input:
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

The tool walks through every field, infers the type from the value, handles nested objects recursively, and generates a clean schema or interface.

## Output formats

### JSON Schema

Standard Draft-07 JSON Schema. Use this when you need:
- API request/response validation with a library like AJV
- OpenAPI/Swagger documentation
- VS Code config file autocomplete (via `$schema` references)

### TypeScript Interface

Clean TypeScript type definitions. Use this when you want:
- Type annotations for API responses in a TS project
- Editor autocomplete and type checking
- A starting point for your domain types

## How type inference works

| JSON value | Inferred as |
|---|---|
| `"hello"` | `string` |
| `42` | `integer` |
| `3.14` | `number` |
| `true` / `false` | `boolean` |
| `null` | `null` |
| `[...]` | `array` |
| `{...}` | `object` |

Nested objects get their own inline schema or `$defs` entry. For arrays, the tool samples the first element to determine the item type. If the array is empty, it defaults to allowing anything.

## Using the output

### Validation with AJV

```javascript
import Ajv from 'ajv'
const ajv = new Ajv()

const schema = /* paste generated schema here */
const validate = ajv.compile(schema)
const data = { id: 123, name: 'Test' }
const valid = validate(data)
if (!valid) console.log(validate.errors)
```

### TypeScript interface

Paste directly into a `.ts` file:

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

## What to tweak after generation

The generator works from sample data, so it can't infer everything. Common manual additions:

- **Add `format`** for fields that look like emails or URIs -- the generator sees a string, but you know it's an email
- **Add constraints** -- `minLength`, `maxLength`, `minimum`, `maximum`, `pattern` -- these can't be inferred from a single sample value
- **Handle nullable fields** -- if a field can be null, change `"type": "string"` to `"type": ["string", "null"]`
- **Mark optional fields** -- remove them from the `required` array
- **Add `enum`** for fields with a known set of valid values

For very large JSON docs (10K+ lines), extract a representative slice before generating. The tool processes everything you give it, and a 100KB JSON file produces a schema you won't want to read.
