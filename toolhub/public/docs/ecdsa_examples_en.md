# ECDSA Code Examples

ECDSA signing and verification in Python, JavaScript, and Java. All examples use deterministic nonce generation where available.

## Python

```python
from Crypto.PublicKey import ECC
from Crypto.Signature import DSS
from Crypto.Hash import SHA256

key = ECC.generate(curve='P-256')

message = b"Hello, ECDSA!"

# Deterministic signing (RFC 6979)
signer = DSS.new(key, 'deterministic-rfc6979')
signature = signer.sign(SHA256.new(message))
print(f"Signature: {signature.hex()}")

# Verification
verifier = DSS.new(key.public_key(), 'fips-186-3')
try:
    verifier.verify(SHA256.new(message), signature)
    print("Valid signature!")
except ValueError:
    print("Invalid signature!")
```

## JavaScript (Node.js)

```javascript
const crypto = require('crypto');

const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'P-256',
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'sec1', format: 'pem' },
});

const sign = crypto.createSign('SHA256');
sign.update('Hello, ECDSA!');
const signature = sign.sign(privateKey, 'hex');
console.log('Signature:', signature);

const verify = crypto.createVerify('SHA256');
verify.update('Hello, ECDSA!');
console.log('Valid:', verify.verify(publicKey, signature, 'hex'));
```

## Java (Bouncy Castle)

```java
import java.security.*;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

Security.addProvider(new BouncyCastleProvider());

KeyPairGenerator kpg = KeyPairGenerator.getInstance("EC", "BC");
kpg.initialize(new ECGenParameterSpec("P-256"));
KeyPair kp = kpg.generateKeyPair();

Signature ecdsa = Signature.getInstance("SHA256withECDSA", "BC");
ecdsa.initSign(kp.getPrivate());
ecdsa.update("Hello, ECDSA!".getBytes());
byte[] sig = ecdsa.sign();

ecdsa.initVerify(kp.getPublic());
ecdsa.update("Hello, ECDSA!".getBytes());
System.out.println("Valid: " + ecdsa.verify(sig));
```

## Critical reminder

- Use deterministic ECDSA (RFC 6979) to eliminate nonce-reuse risk
- Never share the nonce across signatures with the same key
- Prefer Ed25519 for new projects -- simpler and safer
