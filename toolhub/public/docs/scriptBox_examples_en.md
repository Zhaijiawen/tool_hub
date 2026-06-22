# Script Toolkit — Example Scripts

## Timestamp to readable date

**Input:** `1702889856000`

```javascript
async function transform(input, helpers) {
  const ts = parseInt(input.trim())
  const d = helpers.dayjs(ts)
  return {
    iso: d.toISOString(),
    local: d.format('YYYY-MM-DD HH:mm:ss'),
    unix: d.unix()
  }
}
```

dayjs handles both millisecond and second timestamps — just pass the number.

## JSON field extraction with lodash

**Input:** JSON with a `users` array

```javascript
async function transform(input, helpers) {
  const data = JSON.parse(input)
  return helpers._.map(data.users, u => helpers._.pick(u, ['name', 'email']))
}
```

Handy when you've got a big API response and only need a few fields.

## MD5 and SHA-256 in one call

**Input:** Any text

```javascript
async function transform(input, helpers) {
  const md5    = helpers.CryptoJS.MD5(input.trim()).toString()
  const sha256 = helpers.CryptoJS.SHA256(input.trim()).toString()
  return { md5, sha256 }
}
```

## YAML to JSON

**Input:** YAML config content

```javascript
async function transform(input, helpers) {
  const obj = helpers.yaml.load(input)
  return JSON.stringify(obj, null, 2)
}
```

## JSON to YAML

**Input:** JSON object

```javascript
async function transform(input, helpers) {
  const obj = JSON.parse(input)
  return helpers.yaml.dump(obj)
}
```

## Bulk UUID generation

**Input:** `10` (how many)

```javascript
async function transform(input, helpers) {
  const count = parseInt(input.trim()) || 5
  return Array.from({ length: count }, () => helpers.uuid()).join('\n')
}
```

Defaults to 5 if the input isn't a valid number.

## Math expression evaluator

**Input:** `sqrt(2) * pi + log(100, 10)`

```javascript
async function transform(input, helpers) {
  const result = helpers.math.evaluate(input.trim())
  return String(result)
}
```

mathjs supports everything from basic arithmetic to matrix operations and symbolic algebra.

## Word-level text diff

**Input:** Two texts separated by `===SPLIT===`

```javascript
async function transform(input, helpers) {
  const [before, after] = input.split('===SPLIT===')
  const changes = helpers.diff.diffWords(
    (before || '').trim(),
    (after  || '').trim()
  )
  return changes
    .map(c => c.added ? `[+${c.value}]` : c.removed ? `[-${c.value}]` : c.value)
    .join('')
}
```

Output shows additions in `[+brackets]` and deletions in `[-brackets]`.

## Markdown to HTML (sanitized)

**Input:** Markdown text

```javascript
async function transform(input, helpers) {
  const html = helpers.marked.parse(input)
  return helpers.DOMPurify.sanitize(html)
}
```

Always sanitize after Markdown conversion — it prevents XSS if the markdown contains embedded HTML.

## Parse XML to JSON

**Input:** XML string

```javascript
async function transform(input, helpers) {
  const result = helpers.xmlParser.parse(input.trim())
  return JSON.stringify(result, null, 2)
}
```

## AES encrypt and verify

**Input:** Plain text

```javascript
async function transform(input, helpers) {
  const key = 'my-secret-key-16'
  const encrypted = helpers.CryptoJS.AES.encrypt(input.trim(), key).toString()
  const decrypted = helpers.CryptoJS.AES.decrypt(encrypted, key).toString(helpers.CryptoJS.enc.Utf8)
  return { encrypted, decrypted }
}
```

The script encrypts and then decrypts to verify the round trip. Replace the hardcoded key with your own.

## lodash array dedup and sort

**Input:** JSON array like `[3,1,2,1,3,4]`

```javascript
async function transform(input, helpers) {
  const arr = JSON.parse(input)
  return helpers._.chain(arr).uniq().sortBy().value()
}
```

## Bulk NanoID generation

**Input:** `8` (how many)

```javascript
async function transform(input, helpers) {
  const count = parseInt(input.trim()) || 5
  return Array.from({ length: count }, () => helpers.nanoid()).join('\n')
}
```

NanoID is shorter than UUID — 21 URL-safe characters by default.

## HTTP GET request

```javascript
async function transform(input, helpers) {
  const url = input.trim() || 'https://httpbin.org/get'
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.json()
}
```

Paste any URL as input or leave empty to hit httpbin.
