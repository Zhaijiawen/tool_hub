# JSON Schema Generator - Technical Background

JSON Schema is a way to describe the shape of JSON data -- what fields exist, what types they are, which ones are required, and what constraints apply. The clever part: the schema itself is valid JSON, so you can version it, store it, and generate it with the same tools you use for any JSON.

It's defined by the JSON Schema spec at json-schema.org, with Draft 7 being the most widely supported version. Draft 2020-12 added some refinements, but Draft 7 is the safe choice for broad compatibility.

## What a schema looks like

Here's a schema for a simple user object:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "User",
  "required": ["id", "name"],
  "properties": {
    "id": {
      "type": "integer",
      "description": "Unique user identifier"
    },
    "name": {
      "type": "string",
      "description": "User's full name",
      "minLength": 1,
      "maxLength": 50
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "age": {
      "type": "integer",
      "minimum": 0,
      "maximum": 150
    }
  }
}
```

The structure is self-describing: `type` declares the overall shape, `required` lists mandatory fields, and `properties` describes each field's type and constraints.

## The type system

JSON Schema recognizes seven core types: `string`, `number`, `integer`, `boolean`, `null`, `array`, and `object`. The distinction between `number` and `integer` is useful -- `integer` rejects `3.14` and `number` accepts it.

## Validation keywords worth knowing

**Strings:** `minLength`/`maxLength` for length bounds. `pattern` for regex validation. `format` for semantic validation of common patterns -- `email`, `uri`, `date`, `date-time`, `ipv4`, `ipv6`, `hostname`. `enum` restricts values to a fixed set.

**Numbers:** `minimum`/`maximum` (inclusive), `exclusiveMinimum`/`exclusiveMaximum` (strict), `multipleOf` (divisibility check).

**Arrays:** `items` defines the schema for each element. `minItems`/`maxItems` for bounds. `uniqueItems` to reject duplicates.

**Objects:** `required` is an array of mandatory property names. `properties` maps each property to its schema. `additionalProperties` controls whether extra fields are allowed (set to `false` to forbid them). `minProperties`/`maxProperties` limit the total count.

## Where JSON Schema is used

- **OpenAPI 3.0** uses it under the hood for request/response body schemas
- **AJV** is the go-to JavaScript validator -- fast, well-maintained, supports Draft 7 through 2020-12
- **VS Code** uses JSON Schema for autocomplete and validation in `settings.json`, `package.json`, and CI configs
- **Mongoose** shares concepts with JSON Schema (though the syntax differs)
- **Code generation** tools like `quicktype` and `json-schema-to-typescript` can produce TypeScript interfaces, Go structs, or Python dataclasses from a JSON Schema

## The generator's limits

This tool infers schema from sample data. That means it can only see what's in your sample -- if a field is sometimes a string and sometimes a number, it'll only detect one. Constraints like `minLength`, `pattern`, and `format` can't be inferred from values (you'll add those manually). nullability also needs manual attention: if a field is missing in the sample but can be `null` in practice, update the type to `["string", "null"]`.
