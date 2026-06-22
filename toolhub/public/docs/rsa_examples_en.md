# RSA Code Examples

RSA key generation, hybrid encryption, and PSS signatures in Python.

## Key generation

```python
from Crypto.PublicKey import RSA

key = RSA.generate(2048)
print(f"Key size: {key.size_in_bits()} bits")

# Save
with open('rsa_private.pem', 'wb') as f:
    f.write(key.export_key())
with open('rsa_public.pem', 'wb') as f:
    f.write(key.publickey().export_key())

# Load
key = RSA.import_key(open('rsa_private.pem', 'rb').read())
```

## Hybrid encryption (RSA + AES)

```python
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.Random import get_random_bytes

def rsa_encrypt(public_key, data):
    aes_key = get_random_bytes(32)
    cipher_aes = AES.new(aes_key, AES.MODE_GCM)
    ciphertext, tag = cipher_aes.encrypt_and_digest(data)
    cipher_rsa = PKCS1_OAEP.new(public_key)
    return cipher_rsa.encrypt(aes_key), cipher_aes.nonce, ciphertext, tag

def rsa_decrypt(private_key, enc_key, nonce, ciphertext, tag):
    cipher_rsa = PKCS1_OAEP.new(private_key)
    aes_key = cipher_rsa.decrypt(enc_key)
    cipher_aes = AES.new(aes_key, AES.MODE_GCM, nonce=nonce)
    return cipher_aes.decrypt_and_verify(ciphertext, tag)

key = RSA.generate(2048)
enc_key, nonce, ct, tag = rsa_encrypt(key.publickey(), b"Secret data!")
decrypted = rsa_decrypt(key, enc_key, nonce, ct, tag)
print(decrypted.decode())
```

## RSA-PSS signatures

```python
from Crypto.Signature import pss
from Crypto.Hash import SHA256

message = b"RSA-PSS signed message"

# Sign
h = SHA256.new(message)
signature = pss.new(key).sign(h)

# Verify
try:
    pss.new(key.publickey()).verify(SHA256.new(message), signature)
    print("Valid!")
except (ValueError, TypeError):
    print("Invalid!")
```

## JavaScript (Node.js)

```javascript
const crypto = require('crypto');

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

const sign = crypto.createSign('SHA256');
sign.update('Hello RSA!');
const sig = sign.sign(privateKey, 'hex');

const verify = crypto.createVerify('SHA256');
verify.update('Hello RSA!');
console.log('Valid:', verify.verify(publicKey, sig, 'hex'));
```

## Key takeaways

- Minimum 2048-bit keys; 3072 for long-term security
- Never encrypt data directly with RSA -- use hybrid encryption
- Use OAEP for encryption, PSS for signatures
- 1024-bit keys are broken -- replace on sight
