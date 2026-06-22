# ECC Code Examples

Practical ECC snippets: key generation, ECDH key exchange, ECDSA signatures, and hybrid encryption across Python, JavaScript, and Java.

## Python

### Key generation and PEM export

```python
from Crypto.PublicKey import ECC

key = ECC.generate(curve='P-256')
print(f"Curve: {key.curve}, Size: {key.pointQ.size_in_bits()} bits")

# Save
with open('private.pem', 'wb') as f:
    f.write(key.export_key(format='PEM'))
with open('public.pem', 'wb') as f:
    f.write(key.public_key().export_key(format='PEM'))
```

### ECDH key exchange

```python
from Crypto.PublicKey import ECC
from Crypto.Protocol.KDF import HKDF
from Crypto.Hash import SHA256

alice = ECC.generate(curve='P-256')
bob = ECC.generate(curve='P-256')

# Each computes shared secret from peer's public key
alice_shared = alice.d * bob.public_key().pointQ
bob_shared = bob.d * alice.public_key().pointQ

shared_bytes = int(alice_shared.x).to_bytes(32, 'big')
derived_key = HKDF(shared_bytes, 32, b"", SHA256)
assert derived_key == HKDF(int(bob_shared.x).to_bytes(32, 'big'), 32, b"", SHA256)
print("Shared key derived successfully")
```

### ECDSA sign and verify

```python
from Crypto.Signature import DSS
from Crypto.Hash import SHA256

key = ECC.generate(curve='P-256')
message = b"Hello, ECDSA!"

signer = DSS.new(key, 'fips-186-3')
signature = signer.sign(SHA256.new(message))

verifier = DSS.new(key.public_key(), 'fips-186-3')
try:
    verifier.verify(SHA256.new(message), signature)
    print("Signature valid!")
except ValueError:
    print("Invalid signature!")
```

## JavaScript (Node.js)

### Key generation

```javascript
const crypto = require('crypto');
const { generateKeyPairSync } = crypto;

const { publicKey, privateKey } = generateKeyPairSync('ec', {
    namedCurve: 'P-256',
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'sec1', format: 'pem' },
});
```

### ECDH key exchange

```javascript
const alice = crypto.createECDH('P-256');
const bob = crypto.createECDH('P-256');
alice.generateKeys();
bob.generateKeys();

const aliceShared = alice.computeSecret(bob.getPublicKey());
const bobShared = bob.computeSecret(alice.getPublicKey());
// aliceShared.equals(bobShared) === true

const derived = crypto.hkdfSync('sha256', aliceShared, '', '', 32);
console.log('Derived key:', derived.toString('hex'));
```

### ECDSA signatures

```javascript
const sign = crypto.createSign('SHA256');
sign.update('Hello, ECDSA!');
const signature = sign.sign(privateKey, 'hex');

const verify = crypto.createVerify('SHA256');
verify.update('Hello, ECDSA!');
console.log('Valid:', verify.verify(publicKey, signature, 'hex'));
```

## Java (Bouncy Castle)

```java
import java.security.*;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

Security.addProvider(new BouncyCastleProvider());

// Generate P-256 key pair
KeyPairGenerator keyGen = KeyPairGenerator.getInstance("EC", "BC");
keyGen.initialize(new ECGenParameterSpec("P-256"));
KeyPair keyPair = keyGen.generateKeyPair();

// ECDSA sign
Signature ecdsa = Signature.getInstance("SHA256withECDSA", "BC");
ecdsa.initSign(keyPair.getPrivate());
ecdsa.update("Hello, ECDSA!".getBytes());
byte[] signature = ecdsa.sign();

// ECDSA verify
ecdsa.initVerify(keyPair.getPublic());
ecdsa.update("Hello, ECDSA!".getBytes());
System.out.println("Valid: " + ecdsa.verify(signature));
```

## Key takeaways

- Use P-256 for broad compatibility, Curve25519/Ed25519 for new projects
- Always pass ECDH output through HKDF before using as a key
- ECDSA nonces must be unique per signature -- use a library that handles this
- Ed25519 is simpler and safer than ECDSA for signatures
