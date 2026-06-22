# DES Code Examples

DES and 3DES examples for educational purposes and legacy interop. Don't use these for new systems.

## Python

### Basic DES (educational only)

```python
from Crypto.Cipher import DES
from Crypto.Util.Padding import pad, unpad
import os

key = os.urandom(8)
iv = os.urandom(8)

cipher = DES.new(key, DES.MODE_CBC, iv=iv)
ciphertext = cipher.encrypt(pad(b"DES demo!", DES.block_size))

cipher = DES.new(key, DES.MODE_CBC, iv=iv)
decrypted = unpad(cipher.decrypt(ciphertext), DES.block_size)
print(decrypted.decode())
```

### Triple DES (3DES)

```python
from Crypto.Cipher import DES3
import os

key = os.urandom(24)
iv = os.urandom(8)

cipher = DES3.new(key, DES3.MODE_CBC, iv=iv)
ciphertext = cipher.encrypt(pad(b"3DES is deprecated", DES3.block_size))

cipher = DES3.new(key, DES3.MODE_CBC, iv=iv)
decrypted = unpad(cipher.decrypt(ciphertext), DES3.block_size)
print(decrypted.decode())
```

## JavaScript (Node.js -- legacy interop only)

```javascript
const crypto = require('crypto');

function tripleDesEncrypt(text, key, iv) {
    const cipher = crypto.createCipheriv('des-ede3-cbc', key, iv);
    return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
}

function tripleDesDecrypt(encrypted, key, iv) {
    const decipher = crypto.createDecipheriv('des-ede3-cbc', key, iv);
    return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
}

const key = crypto.randomBytes(24), iv = crypto.randomBytes(8);
const enc = tripleDesEncrypt("Legacy 3DES", key, iv);
console.log(tripleDesDecrypt(enc, key, iv));
```

## Java

```java
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import java.security.SecureRandom;

KeyGenerator keyGen = KeyGenerator.getInstance("DESede");
keyGen.init(168);
SecretKey key = keyGen.generateKey();

byte[] iv = new byte[8];
new SecureRandom().nextBytes(iv);

Cipher cipher = Cipher.getInstance("DESede/CBC/PKCS5Padding");
cipher.init(Cipher.ENCRYPT_MODE, key, new IvParameterSpec(iv));
byte[] ciphertext = cipher.doFinal("3DES in Java".getBytes("UTF-8"));

cipher.init(Cipher.DECRYPT_MODE, key, new IvParameterSpec(iv));
System.out.println(new String(cipher.doFinal(ciphertext), "UTF-8"));
```

## Don't use DES or 3DES for new systems
- DES: brute-forced in hours
- 3DES: 3x slower than AES, 64-bit blocks (vulnerable to Sweet32)
- NIST deprecated both
- Use AES-256-GCM or ChaCha20-Poly1305 instead
