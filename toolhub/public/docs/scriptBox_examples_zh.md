# 脚本工具箱 — 示例脚本

---

## 示例一：时间戳转可读日期

**输入：** `1702889856000`

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

## 示例二：JSON 字段提取（lodash）

**输入：** 一段包含用户数组的 JSON

```javascript
async function transform(input, helpers) {
  const data = JSON.parse(input)
  // 提取所有用户的姓名和邮箱
  return helpers._.map(data.users, u => helpers._.pick(u, ['name', 'email']))
}
```

---

## 示例三：计算字符串 MD5 / SHA256

**输入：** 任意文本

```javascript
async function transform(input, helpers) {
  const md5    = helpers.CryptoJS.MD5(input.trim()).toString()
  const sha256 = helpers.CryptoJS.SHA256(input.trim()).toString()
  return { md5, sha256 }
}
```

---

## 示例四：YAML 转 JSON

**输入：** YAML 配置文件内容

```javascript
async function transform(input, helpers) {
  const obj = helpers.yaml.load(input)
  return JSON.stringify(obj, null, 2)
}
```

---

## 示例五：JSON 转 YAML

**输入：** JSON 对象

```javascript
async function transform(input, helpers) {
  const obj = JSON.parse(input)
  return helpers.yaml.dump(obj)
}
```

---

## 示例六：批量生成 UUID

**输入：** `10`（要生成的数量）

```javascript
async function transform(input, helpers) {
  const count = parseInt(input.trim()) || 5
  return Array.from({ length: count }, () => helpers.uuid()).join('\n')
}
```

---

## 示例七：数学表达式计算

**输入：** `sqrt(2) * pi + log(100, 10)`

```javascript
async function transform(input, helpers) {
  const result = helpers.math.evaluate(input.trim())
  return String(result)
}
```

---

## 示例八：文本 Diff 对比

**输入：** 两段文本，用 `===SPLIT===` 分隔

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

## 示例九：Markdown 转 HTML

**输入：** Markdown 文本

```javascript
async function transform(input, helpers) {
  const html = helpers.marked.parse(input)
  return helpers.DOMPurify.sanitize(html)
}
```

---

## 示例十：XML 解析

**输入：** XML 字符串

```javascript
async function transform(input, helpers) {
  const result = helpers.xmlParser.parse(input.trim())
  return JSON.stringify(result, null, 2)
}
```

---

## 示例十一：计算文件/字符串 MD5（SparkMD5）

**输入：** 任意较长文本

```javascript
async function transform(input, helpers) {
  return helpers.sparkMD5.hash(input)
}
```

---

## 示例十二：AES 加密

**输入：** `明文内容`（密钥硬编码在脚本里，按需修改）

```javascript
async function transform(input, helpers) {
  const key = 'my-secret-key-16'
  const encrypted = helpers.CryptoJS.AES.encrypt(input.trim(), key).toString()
  const decrypted = helpers.CryptoJS.AES.decrypt(encrypted, key).toString(helpers.CryptoJS.enc.Utf8)
  return { encrypted, decrypted }
}
```

---

## 示例十三：lodash 数组去重排序

**输入：** JSON 数组，如 `[3,1,2,1,3,4]`

```javascript
async function transform(input, helpers) {
  const arr = JSON.parse(input)
  return helpers._.chain(arr).uniq().sortBy().value()
}
```

---

## 示例十四：nanoid 批量生成短 ID

**输入：** `8`（要生成的数量）

```javascript
async function transform(input, helpers) {
  const count = parseInt(input.trim()) || 5
  return Array.from({ length: count }, () => helpers.nanoid()).join('\n')
}
```

---

## 示例十五：发起 HTTP GET 请求

```javascript
async function transform(input, helpers) {
  const url = input.trim() || 'https://httpbin.org/get'
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.json()
}

