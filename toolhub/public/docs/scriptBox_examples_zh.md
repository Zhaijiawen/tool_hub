# 脚本工具箱 — 示例脚本

## 时间戳转可读日期

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

dayjs 毫秒和秒级时间戳都能处理，直接传数字就行。

## JSON 字段提取（lodash）

**输入：** 包含 `users` 数组的 JSON

```javascript
async function transform(input, helpers) {
  const data = JSON.parse(input)
  return helpers._.map(data.users, u => helpers._.pick(u, ['name', 'email']))
}
```

拿到一大段 API 响应但只需要几个字段的时候特别好用。

## 算 MD5 和 SHA-256

**输入：** 任意文本

```javascript
async function transform(input, helpers) {
  const md5    = helpers.CryptoJS.MD5(input.trim()).toString()
  const sha256 = helpers.CryptoJS.SHA256(input.trim()).toString()
  return { md5, sha256 }
}
```

## YAML 转 JSON

**输入：** YAML 配置内容

```javascript
async function transform(input, helpers) {
  const obj = helpers.yaml.load(input)
  return JSON.stringify(obj, null, 2)
}
```

## JSON 转 YAML

**输入：** JSON 对象

```javascript
async function transform(input, helpers) {
  const obj = JSON.parse(input)
  return helpers.yaml.dump(obj)
}
```

## 批量生成 UUID

**输入：** `10`（要几条）

```javascript
async function transform(input, helpers) {
  const count = parseInt(input.trim()) || 5
  return Array.from({ length: count }, () => helpers.uuid()).join('\n')
}
```

输入不是数字就默认生成 5 条。

## 数学表达式计算

**输入：** `sqrt(2) * pi + log(100, 10)`

```javascript
async function transform(input, helpers) {
  const result = helpers.math.evaluate(input.trim())
  return String(result)
}
```

mathjs 支持从基本运算到矩阵运算和符号代数。

## 文本 Diff 对比

**输入：** 两段文本用 `===SPLIT===` 隔开

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

新增内容用 `[+方括号]`，删除内容用 `[-方括号]`。

## Markdown 转 HTML（带 XSS 过滤）

**输入：** Markdown 文本

```javascript
async function transform(input, helpers) {
  const html = helpers.marked.parse(input)
  return helpers.DOMPurify.sanitize(html)
}
```

Markdown 转 HTML 之后一定要过一遍 DOMPurify——如果 markdown 里嵌了 HTML 标签可以防 XSS。

## XML 解析

**输入：** XML 字符串

```javascript
async function transform(input, helpers) {
  const result = helpers.xmlParser.parse(input.trim())
  return JSON.stringify(result, null, 2)
}
```

## AES 加密并验证

**输入：** 明文

```javascript
async function transform(input, helpers) {
  const key = 'my-secret-key-16'
  const encrypted = helpers.CryptoJS.AES.encrypt(input.trim(), key).toString()
  const decrypted = helpers.CryptoJS.AES.decrypt(encrypted, key).toString(helpers.CryptoJS.enc.Utf8)
  return { encrypted, decrypted }
}
```

加密完马上解密验证来回没问题。密钥换成你自己的。

## lodash 数组去重排序

**输入：** JSON 数组如 `[3,1,2,1,3,4]`

```javascript
async function transform(input, helpers) {
  const arr = JSON.parse(input)
  return helpers._.chain(arr).uniq().sortBy().value()
}
```

## 批量生成 NanoID

**输入：** `8`（要几条）

```javascript
async function transform(input, helpers) {
  const count = parseInt(input.trim()) || 5
  return Array.from({ length: count }, () => helpers.nanoid()).join('\n')
}
```

NanoID 比 UUID 短——默认 21 位 URL 安全字符。

## HTTP GET 请求

```javascript
async function transform(input, helpers) {
  const url = input.trim() || 'https://httpbin.org/get'
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.json()
}
```

输入框填 URL，留空就走 httpbin。
