# JWT 编解码 — 代码示例

## Node.js: 手工构造与验签

```javascript
const crypto = require('crypto')

function base64url(buf) {
  return buf.toString('base64url')
}

function sign(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const h = base64url(JSON.stringify(header))
  const p = base64url(JSON.stringify(payload))
  const sig = crypto
    .createHmac('sha256', secret)
    .update(`${h}.${p}`)
    .digest('base64url')
  return `${h}.${p}.${sig}`
}

const token = sign({ sub: '1234', exp: 1719000000 }, 'my-secret')
console.log(token)
```

验签就是重算签名段并做常量时间比较：

```javascript
function verify(token, secret) {
  const [h, p, sig] = token.split('.')
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${h}.${p}`)
    .digest('base64url')
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
}
```

## 只看内容（任何语言）

```javascript
// payload 段就是 Base64URL 的 JSON
const payload = JSON.parse(
  Buffer.from(token.split('.')[1], 'base64url').toString()
)
console.log(payload.exp)
```

## Python: PyJWT

```python
import jwt

token = jwt.encode({'sub': '1234', 'exp': 1719000000}, 'my-secret', algorithm='HS256')
decoded = jwt.decode(token, 'my-secret', algorithms=['HS256'])
```

注意 `algorithms` 参数必须显式指定——不指定等于允许攻击者自选算法（包括 none）。

## 记住

- JWT 的 payload 是 Base64 不是加密，谁都能看
- `alg: none` 是著名漏洞，服务端必须拒绝
- secret 至少 256 位随机熵；HS256 的强度等于 secret 的强度
- 敏感载荷用 JWE，别用 JWT
