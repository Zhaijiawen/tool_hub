# QR Code Usage Tutorial

## Introduction

This tutorial provides comprehensive guidance for implementing and using QR code generation capabilities. It covers practical examples, best practices, parameter selection, and performance optimization for various use cases.

## Basic QR Code Generation

### Understanding Parameters

**Essential Parameters**
- **Data**: The content to encode (text, URL, contact info, etc.)
- **Error Correction Level**: L (7%), M (15%), Q (25%), H (30%)
- **Version**: QR code size (1-40, auto-selected if not specified)
- **Module Size**: Size of each black/white square in pixels
- **Quiet Zone**: White border around the QR code (minimum 4 modules)

**Parameter Selection Guidelines**
```
Error Correction Level Selection:
- Level L: Clean environments, large print sizes, maximum data capacity
- Level M: General purpose, balanced approach (recommended default)
- Level Q: Challenging environments, smaller sizes, moderate damage tolerance
- Level H: Maximum reliability, damaged/partially obscured codes
```

### Basic Implementation

**Simple QR Code Generation**
```python
import qrcode

def generate_basic_qr(data, filename="qrcode.png"):
    """Generate a basic QR code"""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4
    )
    qr.add_data(data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(filename)
    return img

# Usage examples
generate_basic_qr("https://example.com", "website_qr.png")
generate_basic_qr("Hello, World!", "text_qr.png")
```

**JavaScript Implementation**
```javascript
// Using qrcode.js library
function generateQRCode(data, containerId) {
    const qrcode = new QRCode(containerId, {
        text: data,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
    });
}

// Usage
generateQRCode("https://example.com", "qrcode-container");
```

## Advanced QR Code Features

### Custom Styling

**Color Customization**
```python
def generate_colored_qr(data, foreground_color, background_color, filename):
    """Generate QR code with custom colors"""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,  # Higher EC for colors
        box_size=10,
        border=4
    )
    qr.add_data(data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color=foreground_color, back_color=background_color)
    img.save(filename)
    return img

# Usage
generate_colored_qr("Custom QR", "#FF6B6B", "#4ECDC4", "colored_qr.png")
```

**Logo Integration**
```python
from PIL import Image

def generate_qr_with_logo(data, logo_path, filename, logo_size=0.3):
    """Generate QR code with embedded logo"""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,  # High EC for logo
        box_size=10,
        border=4
    )
    qr.add_data(data)
    qr.make(fit=True)
    
    qr_image = qr.make_image(fill_color="black", back_color="white").convert('RGBA')
    
    # Add logo
    logo = Image.open(logo_path).convert("RGBA")
    logo_size_pixels = int(qr_image.size[0] * logo_size)
    logo = logo.resize((logo_size_pixels, logo_size_pixels))
    
    # Calculate position (center)
    pos = ((qr_image.size[0] - logo_size_pixels) // 2,
           (qr_image.size[1] - logo_size_pixels) // 2)
    
    qr_image.paste(logo, pos, logo)
    qr_image.save(filename)
    return qr_image
```

### Data Type Optimization

**URL Encoding**
```python
def generate_url_qr(url, filename):
    """Generate QR code optimized for URLs"""
    # Validate URL
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    
    qr = qrcode.QRCode(
        version=None,  # Auto-select version
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4
    )
    qr.add_data(url)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(filename)
    return img
```

**Contact Information (vCard)**
```python
def generate_contact_qr(name, phone, email, company="", filename="contact_qr.png"):
    """Generate QR code with contact information"""
    vcard_data = f"""BEGIN:VCARD
VERSION:3.0
FN:{name}
TEL:{phone}
EMAIL:{email}
ORG:{company}
END:VCARD"""
    
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4
    )
    qr.add_data(vcard_data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(filename)
    return img
```

**WiFi Configuration**
```python
def generate_wifi_qr(ssid, password, security="WPA", filename="wifi_qr.png"):
    """Generate QR code for WiFi configuration"""
    wifi_data = f"WIFI:S:{ssid};T:{security};P:{password};;"
    
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4
    )
    qr.add_data(wifi_data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(filename)
    return img
```

## Batch Processing

### Multiple QR Code Generation

**Batch Processing Implementation**
```python
import os
from typing import List, Dict

def batch_generate_qr(data_list: List[Dict], output_dir: str):
    """Generate multiple QR codes from a list of data"""
    os.makedirs(output_dir, exist_ok=True)
    
    results = []
    for i, item in enumerate(data_list):
        try:
            filename = f"qr_{i+1:03d}.png"
            filepath = os.path.join(output_dir, filename)
            
            qr = qrcode.QRCode(
                version=None,
                error_correction=qrcode.constants.ERROR_CORRECT_M,
                box_size=10,
                border=4
            )
            qr.add_data(item['data'])
            qr.make(fit=True)
            
            img = qr.make_image(fill_color="black", back_color="white")
            img.save(filepath)
            
            results.append({
                'index': i,
                'data': item['data'],
                'filename': filename,
                'success': True
            })
            
        except Exception as e:
            results.append({
                'index': i,
                'data': item['data'],
                'error': str(e),
                'success': False
            })
    
    return results

# Usage
data_list = [
    {'data': 'https://example1.com'},
    {'data': 'https://example2.com'},
    {'data': 'Contact: John Doe, 123-456-7890'}
]

results = batch_generate_qr(data_list, "output_qrcodes")
```

### Performance Optimization

**Parallel Processing**
```python
import concurrent.futures
from functools import partial

def generate_single_qr(data, output_dir, index):
    """Generate a single QR code"""
    filename = f"qr_{index:03d}.png"
    filepath = os.path.join(output_dir, filename)
    
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4
    )
    qr.add_data(data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(filepath)
    return {'index': index, 'filename': filename, 'success': True}

def parallel_batch_generate_qr(data_list: List[str], output_dir: str, max_workers=4):
    """Generate QR codes using parallel processing"""
    os.makedirs(output_dir, exist_ok=True)
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [
            executor.submit(generate_single_qr, data, output_dir, i)
            for i, data in enumerate(data_list)
        ]
        
        results = [future.result() for future in concurrent.futures.as_completed(futures)]
    
    return sorted(results, key=lambda x: x['index'])
```

## Error Handling and Validation

### Input Validation

**Data Validation**
```python
def validate_qr_data(data, max_length=2953):
    """Validate data for QR code generation"""
    if not data or not isinstance(data, str):
        raise ValueError("Data must be a non-empty string")
    
    if len(data.encode('utf-8')) > max_length:
        raise ValueError(f"Data too long. Maximum {max_length} bytes allowed.")
    
    # Check for problematic characters
    problematic_chars = ['\x00', '\x01', '\x02', '\x03', '\x04', '\x05', '\x06', '\x07']
    for char in problematic_chars:
        if char in data:
            raise ValueError(f"Data contains problematic character: {repr(char)}")
    
    return True

def safe_generate_qr(data, filename, **kwargs):
    """Safely generate QR code with validation"""
    try:
        validate_qr_data(data)
        
        qr = qrcode.QRCode(
            version=kwargs.get('version', None),
            error_correction=kwargs.get('error_correction', qrcode.constants.ERROR_CORRECT_M),
            box_size=kwargs.get('box_size', 10),
            border=kwargs.get('border', 4)
        )
        qr.add_data(data)
        qr.make(fit=True)
        
        img = qr.make_image(
            fill_color=kwargs.get('fill_color', 'black'),
            back_color=kwargs.get('back_color', 'white')
        )
        img.save(filename)
        return img
        
    except Exception as e:
        print(f"Error generating QR code: {e}")
        return None
```

### Error Recovery

**Graceful Error Handling**
```python
def robust_batch_generate_qr(data_list, output_dir):
    """Generate QR codes with robust error handling"""
    os.makedirs(output_dir, exist_ok=True)
    
    successful = []
    failed = []
    
    for i, data in enumerate(data_list):
        try:
            filename = f"qr_{i+1:03d}.png"
            filepath = os.path.join(output_dir, filename)
            
            result = safe_generate_qr(data, filepath)
            
            if result:
                successful.append({
                    'index': i,
                    'data': data,
                    'filename': filename
                })
            else:
                failed.append({
                    'index': i,
                    'data': data,
                    'error': 'Generation failed'
                })
                
        except Exception as e:
            failed.append({
                'index': i,
                'data': data,
                'error': str(e)
            })
    
    return {
        'successful': successful,
        'failed': failed,
        'total': len(data_list),
        'success_rate': len(successful) / len(data_list) * 100
    }
```

## Best Practices

### Parameter Selection

**Version Selection**
```python
def estimate_qr_version(data, error_correction_level='M'):
    """Estimate required QR version for given data"""
    # Simplified estimation
    data_bytes = len(data.encode('utf-8'))
    
    # Approximate capacity per version (Level M)
    capacities = {
        1: 14, 2: 26, 3: 42, 4: 62, 5: 84, 6: 106, 7: 130, 8: 154,
        9: 182, 10: 213, 11: 251, 12: 287, 13: 331, 14: 362, 15: 412,
        16: 450, 17: 504, 18: 560, 19: 624, 20: 666, 21: 711, 22: 779,
        23: 857, 24: 911, 25: 997, 26: 1059, 27: 1125, 28: 1190, 29: 1264,
        30: 1370, 31: 1452, 32: 1538, 33: 1628, 34: 1722, 35: 1809,
        36: 1911, 37: 1989, 38: 2099, 39: 2213, 40: 2334
    }
    
    for version, capacity in capacities.items():
        if data_bytes <= capacity:
            return version
    
    raise ValueError("Data too large for QR code (max version 40)")
```

**Error Correction Level Selection**
```python
def select_error_correction_level(use_case, environment, data_size):
    """Select appropriate error correction level"""
    if use_case == 'print_large':
        return 'L'  # Large print, clean environment
    elif use_case == 'web_display':
        return 'M'  # General purpose
    elif use_case == 'small_print':
        return 'Q'  # Smaller size, moderate damage tolerance
    elif use_case == 'damaged_expected':
        return 'H'  # Maximum reliability
    else:
        return 'M'  # Default
```

### Quality Assurance

**QR Code Validation**
```python
def validate_generated_qr(filepath):
    """Validate generated QR code file"""
    try:
        # Check file exists and is readable
        if not os.path.exists(filepath):
            return False, "File does not exist"
        
        # Check file size
        file_size = os.path.getsize(filepath)
        if file_size < 100:  # Minimum reasonable size
            return False, "File too small"
        
        # Try to open as image
        img = Image.open(filepath)
        width, height = img.size
        
        if width < 50 or height < 50:  # Minimum reasonable dimensions
            return False, "Image too small"
        
        return True, "Valid QR code"
        
    except Exception as e:
        return False, f"Validation error: {str(e)}"
```

## Performance Optimization

### Memory Management

**Efficient Processing**
```python
def memory_efficient_batch_generate(data_list, output_dir, batch_size=10):
    """Generate QR codes with memory management"""
    os.makedirs(output_dir, exist_ok=True)
    
    for i in range(0, len(data_list), batch_size):
        batch = data_list[i:i+batch_size]
        
        for j, data in enumerate(batch):
            index = i + j
            filename = f"qr_{index+1:03d}.png"
            filepath = os.path.join(output_dir, filename)
            
            qr = qrcode.QRCode(
                version=None,
                error_correction=qrcode.constants.ERROR_CORRECT_M,
                box_size=10,
                border=4
            )
            qr.add_data(data)
            qr.make(fit=True)
            
            img = qr.make_image(fill_color="black", back_color="white")
            img.save(filepath)
            img.close()  # Explicitly close to free memory
        
        # Optional: Add delay between batches
        import time
        time.sleep(0.1)
```

### Caching Strategies

**Result Caching**
```python
import hashlib
import json

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
cached_file = cache.get_cached_qr("https://example.com", error_correction='M')
if cached_file:
    print(f"Using cached QR code: {cached_file}")
else:
    # Generate new QR code and cache it
    qr = generate_basic_qr("https://example.com")
    cache.cache_qr("https://example.com", qr, error_correction='M')
```

This tutorial provides comprehensive guidance for implementing robust QR code generation with proper error handling, performance optimization, and best practices for various use cases. 