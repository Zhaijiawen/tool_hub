# RSA 代码示例

Python 中的 RSA 密钥生成、混合加密和 PSS 签名。

## 密钥生成

```python
from Crypto.PublicKey import RSA

key = RSA.generate(2048)
print(f"密钥大小: {key.size_in_bits()} 位")

with open('rsa_private.pem', 'wb') as f:
    f.write(key.export_key())
with open('rsa_public.pem', 'wb') as f:
    f.write(key.publickey().export_key())

key = RSA.import_key(open('rsa_private.pem', 'rb').read())
```

## 混合加密（RSA + AES）

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
enc_key, nonce, ct, tag = rsa_encrypt(key.publickey(), b"秘密数据！")
decrypted = rsa_decrypt(key, enc_key, nonce, ct, tag)
print(decrypted.decode())
```

## RSA-PSS 签名

```python
from Crypto.Signature import pss
from Crypto.Hash import SHA256

message = b"RSA-PSS 签名的消息"

h = SHA256.new(message)
signature = pss.new(key).sign(h)

try:
    pss.new(key.publickey()).verify(SHA256.new(message), signature)
    print("有效！")
except (ValueError, TypeError):
    print("无效！")
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
console.log('有效:', verify.verify(publicKey, sig, 'hex'));
```

## 关键要点

- 最低 2048 位密钥；长期安全用 3072
- 绝不直接用 RSA 加密数据 -- 用混合加密
- 加密用 OAEP，签名用 PSS
- 1024 位密钥不安全 -- 立即替换
