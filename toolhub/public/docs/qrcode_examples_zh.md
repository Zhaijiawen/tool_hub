# 二维码 — 代码示例

## 浏览器 JavaScript 生成

```javascript
// 用 qrcode.js —— 本工具底层用的就是这个库
function generateQRCode(data, containerId) {
  const qrcode = new QRCode(containerId, {
    text: data,
    width: 256,
    height: 256,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.M
  })
}

generateQRCode('https://example.com', 'qrcode-container')
```

最简单的设置——256px、黑白、M 纠错级别。多数数字场景够用了。

## Python: qrcode 库基础用法

```python
import qrcode

qr = qrcode.QRCode(version=1, box_size=10, border=5)
qr.add_data('https://www.example.com')
qr.make(fit=True)

img = qr.make_image(fill_color='black', back_color='white')
img.save('website_qr.png')
```

`version=1` 强制用小尺寸。实际用的话设 `version=None`，让库根据数据量自动选版本。

## 自定义颜色

```python
import qrcode

qr = qrcode.QRCode(version=1, box_size=10, border=5)
qr.add_data('自定义颜色二维码')
qr.make(fit=True)

img = qr.make_image(fill_color='#FF6B6B', back_color='#4ECDC4')
img.save('colored_qr.png')
```

用自定义颜色时记得纠错级别选 H——颜色降低了有效对比度，需要最大的纠错余量。

## 带 Logo 的二维码

```python
import qrcode
from PIL import Image

qr = qrcode.QRCode(
  version=1,
  error_correction=qrcode.constants.ERROR_CORRECT_H,  # Logo 要用最高纠错
  box_size=10,
  border=5
)
qr.add_data('https://www.example.com')
qr.make(fit=True)

qr_image = qr.make_image(fill_color='black', back_color='white').convert('RGBA')

logo = Image.open('logo.png').convert('RGBA')
logo_size = int(qr_image.size[0] * 0.3)  # Logo 占二维码的 30%
logo = logo.resize((logo_size, logo_size))

pos = ((qr_image.size[0] - logo_size) // 2, (qr_image.size[1] - logo_size) // 2)
qr_image.paste(logo, pos, logo)
qr_image.save('qr_with_logo.png')
```

关键决策：H 纠错级别（Logo 会盖住约 9% 的码面，需要余量）、30% 尺寸（Logo 再大扫描失败率会飙升）。加了 Logo 之后一定在几台手机上实测。

## WiFi 二维码

```python
import qrcode

wifi_data = 'WIFI:S:我的网络;T:WPA;P:mypassword123;;'

qr = qrcode.QRCode(version=1, box_size=10, border=5)
qr.add_data(wifi_data)
qr.make(fit=True)

img = qr.make_image(fill_color='black', back_color='white')
img.save('wifi_qr.png')
```

打印出来贴在路由器或客房墙上。大多数手机的相机 App 能识别 WiFi 二维码并提示连接。

## 联系信息（vCard）二维码

```python
import qrcode

vcard = '''BEGIN:VCARD
VERSION:3.0
FN:张三
TEL:+86-138-1234-5678
EMAIL:zhangsan@example.com
ORG:示例公司
END:VCARD'''

qr = qrcode.QRCode(version=1, box_size=10, border=5)
qr.add_data(vcard)
qr.make(fit=True)

img = qr.make_image(fill_color='black', back_color='white')
img.save('contact_qr.png')
```

贴在名片或邮件签名里。手机识别 vCard 二维码后会提示直接存入通讯录。
