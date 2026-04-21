# JSON Schema Generator - Technical Background

## What is JSON Schema

**JSON Schema** is a declarative language, written in JSON itself, for describing the structure and constraints of JSON data. It can be used to:

- **Validate**: check whether JSON data conforms to an expected format
- **Document**: describe the structure of API request and response bodies
- **Generate code**: automatically produce TypeScript interfaces, database models, etc. from a schema

Official specification: [json-schema.org](https://json-schema.org)

## Basic Schema Structure

A basic JSON Schema is built from the following keywords:

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

## Core Data Types

| Type | Description | Example JSON value |
|------|-------------|-------------------|
| `string` | Text string | `"hello"` |
| `number` | Number (incl. decimals) | `3.14` |
| `integer` | Whole number | `42` |
| `boolean` | True or false | `true` |
| `null` | Null value | `null` |
| `array` | Ordered list | `[1, 2, 3]` |
| `object` | Key-value map | `{"key": "value"}` |

## Common Validation Keywords

### String constraints

| Keyword | Meaning |
|---------|---------|
| `minLength` / `maxLength` | Min / max character length |
| `pattern` | Regular expression match |
| `format` | Predefined formats: `email`, `date`, `uri`, etc. |
| `enum` | Enumerated allowed values |

### Number constraints

| Keyword | Meaning |
|---------|---------|
| `minimum` / `maximum` | Min / max value (inclusive) |
| `exclusiveMinimum` / `exclusiveMaximum` | Strictly less / greater than |
| `multipleOf` | Must be a multiple of the given number |

### Array constraints

| Keyword | Meaning |
|---------|---------|
| `items` | Schema describing each element |
| `minItems` / `maxItems` | Min / max element count |
| `uniqueItems` | Require all elements to be unique |

### Object constraints

| Keyword | Meaning |
|---------|---------|
| `required` | List of required property names |
| `properties` | Schema for each property |
| `additionalProperties` | Whether extra properties are allowed |
| `minProperties` / `maxProperties` | Min / max number of properties |

## Primary Use Cases

1. **API documentation**: OpenAPI 3.0 uses JSON Schema to describe request/response bodies
2. **Form validation**: Front-end libraries (react-hook-form, formik, etc.) use schema-driven validation
3. **Database ORM validation**: Mongoose schemas share concepts with JSON Schema
4. **Config file validation**: IDEs like VS Code use JSON Schema for autocomplete and validation in config files
5. **Code generation**: Tools like `quicktype` and `json-schema-to-typescript` generate strongly-typed code from schemas

