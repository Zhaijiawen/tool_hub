# JWT Codec — The Technical Background

A JWT (JSON Web Token, RFC 7519) is a three-part Base64URL string joined by dots:

```
header.payload.signature
```

**header** — declares token type and signing algorithm, typically `{"alg":"HS256","typ":"JWT"}`.
**payload** — the actual data (claims): `sub` (subject), `exp` (expiry), `iat` (issued at), plus custom fields.
**signature** — a signature over the first two parts that prevents tampering.

## How the signature works

For the common HS256 (HMAC-SHA256):

```
signature = HMAC-SHA256(
  base64url(header) + "." + base64url(payload),
  secret
)
```

The server recomputes the signature with the same secret and compares. Any change to the payload (say, pushing `exp` later) makes the signature mismatch — **provided the secret hasn't leaked**.

## Common misconceptions

**"JWT is encrypted, nobody can see the contents"** — wrong. Base64URL is encoding, not encryption. Anyone can decode the payload. Never put passwords or keys in a JWT. For confidential payloads, use JWE.

**"Signed means secure"** — signatures prevent tampering, not forgery. Anyone with the secret can sign arbitrary tokens; a weak secret falls to brute force. Use a long random secret in production, or asymmetric algorithms (RS256/ES256: sign with private key, verify with public key).

**"alg: none works too"** — some legacy libraries accept unsigned tokens with `alg` set to `none`, a famous vulnerability source. Servers must validate `alg` and reject none.

**"expired exp means the token is dead"** — `exp` is just a claim in the payload; whether it's enforced is the server's choice. A client-side "decode" showing an expired `exp` doesn't mean the server will reject it.

## What this tool does

Local Base64URL codec plus HMAC-SHA256 signing/verification: paste a token to extract header and payload JSON; supply a secret to recompute the signature and compare. All computation happens in the browser — the secret never leaves your device — but remember that pasting production secrets into any third-party tool carries risk; use dedicated test secrets.
