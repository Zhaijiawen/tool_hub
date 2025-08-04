# QR Code Examples

## Basic Examples

### Simple Text QR Code
```python
import qrcode

# Generate QR code for simple text
qr = qrcode.QRCode(version=1, box_size=10, border=5)
qr.add_data("Hello, World!")
qr.make(fit=True)

img = qr.make_image(fill_color="black", back_color="white")
img.save("hello_world_qr.png")
```

### URL QR Code
```python
import qrcode

# Generate QR code for website URL
qr = qrcode.QRCode(version=1, box_size=10, border=5)
qr.add_data("https://www.example.com")
qr.make(fit=True)

img = qr.make_image(fill_color="black", back_color="white")
img.save("website_qr.png")
```

### Contact Information (vCard)
```python
import qrcode

# Generate QR code with contact information
vcard_data = """BEGIN:VCARD
VERSION:3.0
FN:John Doe
TEL:+1-555-123-4567
EMAIL:john.doe@example.com
ORG:Example Company
TITLE:Software Engineer
ADR:123 Main St, City, State 12345
END:VCARD"""

qr = qrcode.QRCode(version=1, box_size=10, border=5)
qr.add_data(vcard_data)
qr.make(fit=True)

img = qr.make_image(fill_color="black", back_color="white")
img.save("contact_qr.png")
```

### WiFi Configuration
```python
import qrcode

# Generate QR code for WiFi network
wifi_data = "WIFI:S:MyWiFiNetwork;T:WPA;P:MyPassword123;;"

qr = qrcode.QRCode(version=1, box_size=10, border=5)
qr.add_data(wifi_data)
qr.make(fit=True)

img = qr.make_image(fill_color="black", back_color="white")
img.save("wifi_qr.png")
```

## Advanced Examples

### Custom Colors
```python
import qrcode

# Generate QR code with custom colors
qr = qrcode.QRCode(version=1, box_size=10, border=5)
qr.add_data("Custom colored QR code")
qr.make(fit=True)

# Use custom colors (foreground and background)
img = qr.make_image(fill_color="#FF6B6B", back_color="#4ECDC4")
img.save("colored_qr.png")
```

### QR Code with Logo
```python
import qrcode
from PIL import Image

# Generate QR code
qr = qrcode.QRCode(version=1, box_size=10, border=5)
qr.add_data("https://www.example.com")
qr.make(fit=True)

# Create QR code image
qr_image = qr.make_image(fill_color="black", back_color="white").convert('RGBA')

# Open and resize logo
logo = Image.open("logo.png").convert("RGBA")
logo_size = int(qr_image.size[0] * 0.3)  # Logo size = 30% of QR code
logo = logo.resize((logo_size, logo_size))

# Calculate position to center logo
pos = ((qr_image.size[0] - logo_size) // 2, (qr_image.size[1] - logo_size) // 2)

# Paste logo onto QR code
qr_image.paste(logo, pos, logo)
qr_image.save("qr_with_logo.png")
```

### Different Error Correction Levels
```python
import qrcode

# Generate QR codes with different error correction levels
text = "Sample text for QR code"

# Level L (Low) - 7% recovery
qr_l = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=10, border=5)
qr_l.add_data(text)
qr_l.make(fit=True)
img_l = qr_l.make_image(fill_color="black", back_color="white")
img_l.save("qr_level_l.png")

# Level M (Medium) - 15% recovery (default)
qr_m = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=10, border=5)
qr_m.add_data(text)
qr_m.make(fit=True)
img_m = qr_m.make_image(fill_color="black", back_color="white")
img_m.save("qr_level_m.png")

# Level Q (Quartile) - 25% recovery
qr_q = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_Q, box_size=10, border=5)
qr_q.add_data(text)
qr_q.make(fit=True)
img_q = qr_q.make_image(fill_color="black", back_color="white")
img_q.save("qr_level_q.png")

# Level H (High) - 30% recovery
qr_h = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=10, border=5)
qr_h.add_data(text)
qr_h.make(fit=True)
img_h = qr_h.make_image(fill_color="black", back_color="white")
img_h.save("qr_level_h.png")
```

### Different Sizes
```python
import qrcode

# Generate QR codes with different sizes
text = "Sample text"

# Small size (box_size=5)
qr_small = qrcode.QRCode(version=1, box_size=5, border=4)
qr_small.add_data(text)
qr_small.make(fit=True)
img_small = qr_small.make_image(fill_color="black", back_color="white")
img_small.save("qr_small.png")

# Medium size (box_size=10)
qr_medium = qrcode.QRCode(version=1, box_size=10, border=4)
qr_medium.add_data(text)
qr_medium.make(fit=True)
img_medium = qr_medium.make_image(fill_color="black", back_color="white")
img_medium.save("qr_medium.png")

# Large size (box_size=20)
qr_large = qrcode.QRCode(version=1, box_size=20, border=4)
qr_large.add_data(text)
qr_large.make(fit=True)
img_large = qr_large.make_image(fill_color="black", back_color="white")
img_large.save("qr_large.png")
```

## JavaScript Examples

### Basic QR Code Generation
```javascript
// Using qrcode.js library
function generateBasicQR(text, containerId) {
    const qrcode = new QRCode(containerId, {
        text: text,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
    });
}

// Usage
generateBasicQR("Hello, World!", "qrcode-container");
```

### Custom Styled QR Code
```javascript
function generateStyledQR(text, containerId) {
    const qrcode = new QRCode(containerId, {
        text: text,
        width: 300,
        height: 300,
        colorDark: "#FF6B6B",
        colorLight: "#4ECDC4",
        correctLevel: QRCode.CorrectLevel.H
    });
}

// Usage
generateStyledQR("Styled QR Code", "styled-qr-container");
```

### QR Code with Logo (JavaScript)
```javascript
function generateQRWithLogo(text, containerId, logoUrl) {
    const qrcode = new QRCode(containerId, {
        text: text,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
    
    // Add logo overlay
    const logo = document.createElement('img');
    logo.src = logoUrl;
    logo.style.position = 'absolute';
    logo.style.top = '50%';
    logo.style.left = '50%';
    logo.style.transform = 'translate(-50%, -50%)';
    logo.style.width = '60px';
    logo.style.height = '60px';
    
    document.getElementById(containerId).appendChild(logo);
}

// Usage
generateQRWithLogo("QR with Logo", "qr-logo-container", "logo.png");
```

## Batch Processing Examples

### Generate Multiple QR Codes
```python
import qrcode
import os

def generate_multiple_qr_codes(data_list, output_dir):
    """Generate multiple QR codes from a list of data"""
    os.makedirs(output_dir, exist_ok=True)
    
    for i, data in enumerate(data_list):
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(data)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        img.save(os.path.join(output_dir, f"qr_{i+1}.png"))

# Usage
data_list = [
    "https://example1.com",
    "https://example2.com",
    "Contact: John Doe",
    "WiFi: MyNetwork"
]

generate_multiple_qr_codes(data_list, "qr_codes_output")
```

### QR Code with Metadata
```python
import qrcode
import json

def generate_qr_with_metadata(data, metadata, filename):
    """Generate QR code with embedded metadata"""
    # Combine data and metadata
    combined_data = {
        "data": data,
        "metadata": metadata,
        "timestamp": "2024-01-01T00:00:00Z"
    }
    
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(json.dumps(combined_data))
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(filename)

# Usage
metadata = {
    "type": "product",
    "id": "12345",
    "category": "electronics"
}

generate_qr_with_metadata("Product Information", metadata, "product_qr.png")
```

## Error Handling Examples

### Safe QR Code Generation
```python
import qrcode
import os

def safe_generate_qr(data, filename, max_length=2953):
    """Safely generate QR code with error handling"""
    try:
        # Validate input
        if not data or not isinstance(data, str):
            raise ValueError("Data must be a non-empty string")
        
        if len(data.encode('utf-8')) > max_length:
            raise ValueError(f"Data too long. Maximum {max_length} bytes allowed.")
        
        # Generate QR code
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(data)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        img.save(filename)
        
        return True, "QR code generated successfully"
        
    except Exception as e:
        return False, f"Error generating QR code: {str(e)}"

# Usage
success, message = safe_generate_qr("Test data", "test_qr.png")
print(message)
```

### Batch Generation with Error Handling
```python
import qrcode
import os

def batch_generate_with_errors(data_list, output_dir):
    """Generate multiple QR codes with error handling"""
    os.makedirs(output_dir, exist_ok=True)
    
    results = []
    for i, data in enumerate(data_list):
        try:
            filename = os.path.join(output_dir, f"qr_{i+1}.png")
            success, message = safe_generate_qr(data, filename)
            
            results.append({
                "index": i,
                "data": data,
                "success": success,
                "message": message,
                "filename": filename if success else None
            })
            
        except Exception as e:
            results.append({
                "index": i,
                "data": data,
                "success": False,
                "message": str(e),
                "filename": None
            })
    
    return results

# Usage
data_list = [
    "Valid data 1",
    "",  # Invalid empty data
    "Valid data 2",
    "x" * 3000  # Invalid long data
]

results = batch_generate_with_errors(data_list, "batch_output")
for result in results:
    print(f"Item {result['index']}: {result['success']} - {result['message']}")
```

## Performance Examples

### Memory Efficient Generation
```python
import qrcode
import gc

def memory_efficient_batch_generate(data_list, output_dir, batch_size=10):
    """Generate QR codes with memory management"""
    os.makedirs(output_dir, exist_ok=True)
    
    for i in range(0, len(data_list), batch_size):
        batch = data_list[i:i+batch_size]
        
        for j, data in enumerate(batch):
            index = i + j
            filename = os.path.join(output_dir, f"qr_{index+1}.png")
            
            qr = qrcode.QRCode(version=1, box_size=10, border=5)
            qr.add_data(data)
            qr.make(fit=True)
            
            img = qr.make_image(fill_color="black", back_color="white")
            img.save(filename)
            img.close()  # Explicitly close to free memory
        
        # Force garbage collection between batches
        gc.collect()

# Usage
large_data_list = [f"Data item {i}" for i in range(1000)]
memory_efficient_batch_generate(large_data_list, "large_batch_output")
```

### Cached QR Code Generation
```python
import qrcode
import hashlib
import json
import os

class QRCodeCache:
    def __init__(self, cache_dir="qr_cache"):
        self.cache_dir = cache_dir
        os.makedirs(cache_dir, exist_ok=True)
    
    def _get_cache_key(self, data, **params):
        """Generate cache key from data and parameters"""
        param_str = json.dumps(params, sort_keys=True)
        content = f"{data}:{param_str}"
        return hashlib.md5(content.encode()).hexdigest()
    
    def get_cached_qr(self, data, **params):
        """Get cached QR code if available"""
        cache_key = self._get_cache_key(data, **params)
        cache_file = os.path.join(self.cache_dir, f"{cache_key}.png")
        
        if os.path.exists(cache_file):
            return cache_file
        return None
    
    def cache_qr(self, data, qr_image, **params):
        """Cache generated QR code"""
        cache_key = self._get_cache_key(data, **params)
        cache_file = os.path.join(self.cache_dir, f"{cache_key}.png")
        qr_image.save(cache_file)
        return cache_file

# Usage
cache = QRCodeCache()

def generate_cached_qr(data, **params):
    """Generate QR code with caching"""
    # Check cache first
    cached_file = cache.get_cached_qr(data, **params)
    if cached_file:
        print(f"Using cached QR code: {cached_file}")
        return cached_file
    
    # Generate new QR code
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Cache the result
    cache.cache_qr(data, img, **params)
    return img

# Usage
generate_cached_qr("Cached data", error_correction='M')
```

These examples demonstrate various ways to generate QR codes with different features, error handling, and performance optimizations. 