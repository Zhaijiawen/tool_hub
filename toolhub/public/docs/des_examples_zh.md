# DES 代码示例

DES 和 3DES 示例，供教育目的和遗留系统互操作使用。不要用于新系统。

## Python

### 基本 DES（仅供教育）

```python
from Crypto.Cipher import DES
from Crypto.Util.Padding import pad, unpad
import os

key = os.urandom(8)
iv = os.urandom(8)

cipher = DES.new(key, DES.MODE_CBC, iv=iv)
ciphertext = cipher.encrypt(pad(b"DES 演示！", DES.block_size))

cipher = DES.new(key, DES.MODE_CBC, iv=iv)
decrypted = unpad(cipher.decrypt(ciphertext), DES.block_size)
print(decrypted.decode())
```

### 三重 DES（3DES）

```python
from Crypto.Cipher import DES3
import os

key = os.urandom(24)
iv = os.urandom(8)

cipher = DES3.new(key, DES3.MODE_CBC, iv=iv)
ciphertext = cipher.encrypt(pad(b"3DES 已过时", DES3.block_size))

cipher = DES3.new(key, DES3.MODE_CBC, iv=iv)
decrypted = unpad(cipher.decrypt(ciphertext), DES3.block_size)
print(decrypted.decode())
```

## JavaScript（Node.js -- 仅遗留互操作）

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
const enc = tripleDesEncrypt("遗留的 3DES", key, iv);
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
byte[] ciphertext = cipher.doFinal("Java 中的 3DES".getBytes("UTF-8"));

cipher.init(Cipher.DECRYPT_MODE, key, new IvParameterSpec(iv));
System.out.println(new String(cipher.doFinal(ciphertext), "UTF-8"));
```

## 不要在新系统中使用 DES 或 3DES
- DES：几小时就能暴力破解
- 3DES：比 AES 慢 3 倍，64 位块（易受 Sweet32 攻击）
- NIST 已将两者列为不推荐
- 请用 AES-256-GCM 或 ChaCha20-Poly1305
