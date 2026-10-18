# JWT Codec — How to Use

Decode and construct JWT tokens locally. Paste a token to inspect it, or supply data plus a secret to generate a new one.

## Decoding: see what's inside

1. Paste the JWT into the input (the three-part `xxxxx.yyyyy.zzzzz` string)
2. Click "Decode"
3. The header and payload JSON appear in the output area

Decoding doesn't verify the signature — it just turns Base64URL back into JSON. To check the signature, fill in the secret.

## Encoding: generate a token

1. Enter the payload JSON (e.g. `{"sub":"1234","exp":1719000000}`)
2. Fill in the secret
3. Click "Encode" to get the fully signed token

The header is generated automatically (HS256 by default). The secret is used for HMAC-SHA256 signing.

## Verifying signatures

Take an existing token plus its secret, re-encode, and compare the signature segment — a match means the token is untampered and the secret is correct. This is the fastest path for debugging "why does the server reject this token": first check whether the decoded payload is what you expect, then verify the signature.

## Common errors

**"Invalid JWT format"**: the input isn't a three-part dot-separated string. Check for truncation or a stray `Bearer ` prefix (strip it before pasting).

**"JSON parse error"**: the payload isn't valid JSON. Check commas, quotes, brackets.

**"Secret required"**: encoding requires a secret; decoding works without one.

## Debug checklist

- Server rejects it → decode here first and confirm the claims are what you intend
- `exp` is a Unix timestamp in seconds, not a date string
- Different services use different secrets — mixing them up breaks verification
- Change any byte of the payload, including Base64 padding, and the signature changes
