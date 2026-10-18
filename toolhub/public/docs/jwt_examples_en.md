# JWT Codec — Code Examples

## Node.js: manual construction and verification

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

Verification recomputes the signature and compares in constant time:

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

## Inspecting only (any language)

```javascript
// The payload segment is just Base64URL-encoded JSON
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

Always pass `algorithms` explicitly — omitting it lets attackers pick the algorithm (including none).

## Remember

- The payload is Base64, not encryption — anyone can read it
- `alg: none` is a famous vulnerability; servers must reject it
- HS256 is only as strong as the secret — use at least 256 bits of randomness
- Confidential payloads need JWE, not JWT
