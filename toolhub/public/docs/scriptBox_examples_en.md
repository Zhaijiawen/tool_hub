# Script Toolkit — Example Scripts

---

## Example 1: Unix Timestamp → Human-Readable Date

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

---

## Example 2: JSON Field Extraction (lodash)

**Input:** JSON with a `users` array

```javascript
async function transform(input, helpers) {
  const data = JSON.parse(input)
  return helpers._.map(data.users, u => helpers._.pick(u, ['name', 'email']))
}
```

---

## Example 3: Compute MD5 & SHA-256

**Input:** Any text

```javascript
async function transform(input, helpers) {
  const md5    = helpers.CryptoJS.MD5(input.trim()).toString()
  const sha256 = helpers.CryptoJS.SHA256(input.trim()).toString()
  return { md5, sha256 }
}
```

---

## Example 4: YAML → JSON

**Input:** YAML configuration content

```javascript
async function transform(input, helpers) {
  const obj = helpers.yaml.load(input)
  return JSON.stringify(obj, null, 2)
}
```

---

## Example 5: JSON → YAML

**Input:** JSON object

```javascript
async function transform(input, helpers) {
  const obj = JSON.parse(input)
  return helpers.yaml.dump(obj)
}
```

---

## Example 6: Bulk UUID Generation

**Input:** `10` (how many UUIDs to generate)

```javascript
async function transform(input, helpers) {
  const count = parseInt(input.trim()) || 5
  return Array.from({ length: count }, () => helpers.uuid()).join('\n')
}
```

---

## Example 7: Math Expression Evaluator

**Input:** `sqrt(2) * pi + log(100, 10)`

```javascript
async function transform(input, helpers) {
  const result = helpers.math.evaluate(input.trim())
  return String(result)
}
```

---

## Example 8: Word-level Text Diff

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

---

## Example 9: Markdown → HTML (sanitized)

**Input:** Markdown text

```javascript
async function transform(input, helpers) {
  const html = helpers.marked.parse(input)
  return helpers.DOMPurify.sanitize(html)
}
```

---

## Example 10: Parse XML

**Input:** XML string

```javascript
async function transform(input, helpers) {
  const result = helpers.xmlParser.parse(input.trim())
  return JSON.stringify(result, null, 2)
}
```

---

## Example 11: SparkMD5 Hash

**Input:** Any text (works well for large content)

```javascript
async function transform(input, helpers) {
  return helpers.sparkMD5.hash(input)
}
```

---

## Example 12: AES Encrypt & Decrypt

**Input:** Plain text to encrypt

```javascript
async function transform(input, helpers) {
  const key = 'my-secret-key-16'
  const encrypted = helpers.CryptoJS.AES.encrypt(input.trim(), key).toString()
  const decrypted = helpers.CryptoJS.AES.decrypt(encrypted, key).toString(helpers.CryptoJS.enc.Utf8)
  return { encrypted, decrypted }
}
```

---

## Example 13: lodash Array Dedup & Sort

**Input:** JSON array, e.g. `[3,1,2,1,3,4]`

```javascript
async function transform(input, helpers) {
  const arr = JSON.parse(input)
  return helpers._.chain(arr).uniq().sortBy().value()
}
```

---

## Example 14: Bulk NanoID Generation

**Input:** `8` (how many IDs to generate)

```javascript
async function transform(input, helpers) {
  const count = parseInt(input.trim()) || 5
  return Array.from({ length: count }, () => helpers.nanoid()).join('\n')
}
```

---

## Example 15: HTTP GET Request

```javascript
async function transform(input, helpers) {
  const url = input.trim() || 'https://httpbin.org/get'
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.json()
}

