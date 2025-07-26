# JSON Technical Background

JSON (JavaScript Object Notation) is a lightweight data interchange format widely used in frontend-backend communication, configuration files, API data transmission, and other scenarios.

## Typical JSON Structure

```json
{
  "name": "ToolHub",
  "version": "1.0.0",
  "features": ["format", "encrypt", "convert"]
}
```

## Parsing and Serialization

In JavaScript, you can use `JSON.parse` and `JSON.stringify` for parsing and serialization:

```js
const obj = JSON.parse('{"a":1,"b":2}')
console.log(obj.a) // outputs 1

const str = JSON.stringify({ x: 10, y: 20 })
console.log(str) // outputs {"x":10,"y":20}
```

> JSON only supports strings, numbers, booleans, arrays, objects, and null. It does not support functions, undefined, dates, or other types. 