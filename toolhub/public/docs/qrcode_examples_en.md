# QR Code — Code Examples

## Generating a QR code in JavaScript (browser)

```javascript
// Using qrcode.js — the library this tool is built on
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

This is the simplest setup — 256px, black on white, M error correction. Good enough for most digital use.

## Python: basic QR with qrcode library

```python
import qrcode

qr = qrcode.QRCode(version=1, box_size=10, border=5)
qr.add_data('https://www.example.com')
qr.make(fit=True)

img = qr.make_image(fill_color='black', back_color='white')
img.save('website_qr.png')
```

Setting `version=1` forces a small QR code. In practice, you'll usually want `version=None` so the library auto-selects based on your data size.

## Custom colored QR code

```python
import qrcode

qr = qrcode.QRCode(version=1, box_size=10, border=5)
qr.add_data('Custom colored QR code')
qr.make(fit=True)

img = qr.make_image(fill_color='#FF6B6B', back_color='#4ECDC4')
img.save('colored_qr.png')
```

When using custom colors, use H error correction level — colors reduce effective contrast, so you want maximum error recovery headroom.

## QR code with embedded logo

```python
import qrcode
from PIL import Image

qr = qrcode.QRCode(
  version=1,
  error_correction=qrcode.constants.ERROR_CORRECT_H,  # max recovery for logo overlay
  box_size=10,
  border=5
)
qr.add_data('https://www.example.com')
qr.make(fit=True)

qr_image = qr.make_image(fill_color='black', back_color='white').convert('RGBA')

logo = Image.open('logo.png').convert('RGBA')
logo_size = int(qr_image.size[0] * 0.3)  # logo = 30% of QR code
logo = logo.resize((logo_size, logo_size))

pos = ((qr_image.size[0] - logo_size) // 2, (qr_image.size[1] - logo_size) // 2)
qr_image.paste(logo, pos, logo)
qr_image.save('qr_with_logo.png')
```

Key decisions here: H error correction (logo obscures ~9% of the code, need headroom) and 30% logo size (bigger logos cause scanning failures). Always test on multiple phones after adding a logo.

## WiFi QR code

```python
import qrcode

wifi_data = 'WIFI:S:MyNetwork;T:WPA;P:mypassword123;;'

qr = qrcode.QRCode(version=1, box_size=10, border=5)
qr.add_data(wifi_data)
qr.make(fit=True)

img = qr.make_image(fill_color='black', back_color='white')
img.save('wifi_qr.png')
```

Print this and stick it on your router or guest room wall. Most phones' camera apps detect WiFi QR codes and offer to connect.

## Contact (vCard) QR code

```python
import qrcode

vcard = '''BEGIN:VCARD
VERSION:3.0
FN:John Doe
TEL:+1-555-123-4567
EMAIL:john@example.com
ORG:Example Inc.
END:VCARD'''

qr = qrcode.QRCode(version=1, box_size=10, border=5)
qr.add_data(vcard)
qr.make(fit=True)

img = qr.make_image(fill_color='black', back_color='white')
img.save('contact_qr.png')
```

Put this on your business card or email signature. Phones recognize vCard QR codes and offer to save the contact directly.
