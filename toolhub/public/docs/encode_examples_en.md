# Encoding Schemes Code Examples

## Basic Encoding Operations

### Base64 Encoding Examples
```python
import base64

def base64_basic_examples():
    """Basic Base64 encoding and decoding examples"""
    # String to Base64
    text = "Hello, World!"
    encoded = base64.b64encode(text.encode('utf-8'))
    decoded = base64.b64decode(encoded)
    
    print(f"Original: {text}")
    print(f"Base64: {encoded.decode()}")
    print(f"Decoded: {decoded.decode()}")
    
    # Binary data to Base64
    binary_data = b'\x00\x01\x02\x03\x04\x05'
    binary_encoded = base64.b64encode(binary_data)
    binary_decoded = base64.b64decode(binary_encoded)
    
    print(f"Binary: {binary_data.hex()}")
    print(f"Base64: {binary_encoded.decode()}")
    print(f"Decoded: {binary_decoded.hex()}")

base64_basic_examples()
```

### Hexadecimal Encoding Examples
```python
import binascii

def hex_basic_examples():
    """Basic hexadecimal encoding and decoding examples"""
    # String to hex
    text = "Hello, World!"
    hex_encoded = binascii.hexlify(text.encode('utf-8'))
    hex_decoded = binascii.unhexlify(hex_encoded)
    
    print(f"Original: {text}")
    print(f"Hex: {hex_encoded.decode()}")
    print(f"Decoded: {hex_decoded.decode()}")
    
    # Binary data to hex
    binary_data = b'\x00\xFF\xA5\x42\x7F\xE3'
    binary_hex = binascii.hexlify(binary_data)
    binary_decoded = binascii.unhexlify(binary_hex)
    
    print(f"Binary: {binary_data}")
    print(f"Hex: {binary_hex.decode()}")
    print(f"Decoded: {binary_decoded}")

hex_basic_examples()
```

### URL Encoding Examples
```python
import urllib.parse

def url_encoding_examples():
    """URL encoding and decoding examples"""
    # Basic URL encoding
    url = "https://example.com/path?name=John Doe&age=25"
    encoded_url = urllib.parse.quote(url)
    decoded_url = urllib.parse.unquote(encoded_url)
    
    print(f"Original: {url}")
    print(f"Encoded: {encoded_url}")
    print(f"Decoded: {decoded_url}")
    
    # Query parameters encoding
    params = {'name': 'John Doe', 'email': 'john@example.com'}
    query_string = urllib.parse.urlencode(params)
    parsed_params = urllib.parse.parse_qs(query_string)
    
    print(f"Params: {params}")
    print(f"Query: {query_string}")
    print(f"Parsed: {parsed_params}")

url_encoding_examples()
```

## Advanced Encoding Operations

### Base64URL Encoding
```python
def base64url_examples():
    """Base64URL encoding examples"""
    # Standard Base64 vs Base64URL
    data = b"URL-safe encoding test"
    
    # Standard Base64
    standard = base64.b64encode(data)
    print(f"Standard Base64: {standard.decode()}")
    
    # Base64URL (URL-safe)
    url_safe = base64.urlsafe_b64encode(data)
    print(f"Base64URL: {url_safe.decode()}")
    
    # Decode Base64URL
    decoded = base64.urlsafe_b64decode(url_safe)
    print(f"Decoded: {decoded}")
    
    # Manual Base64URL conversion
    manual_url_safe = standard.decode().replace('+', '-').replace('/', '_').rstrip('=')
    print(f"Manual Base64URL: {manual_url_safe}")

base64url_examples()
```

### Hex Format Variations
```python
def hex_format_examples():
    """Hexadecimal format variations"""
    data = b"Test data for hex encoding"
    
    # Different hex formats
    formats = {
        'lowercase': binascii.hexlify(data).decode(),
        'uppercase': binascii.hexlify(data).decode().upper(),
        'with_colons': ':'.join(f'{b:02x}' for b in data),
        'with_spaces': ' '.join(f'{b:02x}' for b in data),
        'with_0x': '0x' + binascii.hexlify(data).decode()
    }
    
    for format_name, hex_string in formats.items():
        print(f"{format_name}: {hex_string}")

hex_format_examples()
```

### HTML Encoding Examples
```python
import html

def html_encoding_examples():
    """HTML encoding and decoding examples"""
    # Basic HTML encoding
    text = "<script>alert('Hello, World!')</script>"
    encoded = html.escape(text)
    decoded = html.unescape(encoded)
    
    print(f"Original: {text}")
    print(f"Encoded: {encoded}")
    print(f"Decoded: {decoded}")
    
    # HTML entities
    entities = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#39;'
    }
    
    for char, entity in entities.items():
        print(f"'{char}' -> '{entity}'")
    
    # Unicode encoding
    unicode_text = "Hello, 世界! © 2024"
    unicode_encoded = html.escape(unicode_text)
    print(f"Unicode: {unicode_text}")
    print(f"Encoded: {unicode_encoded}")

html_encoding_examples()
```

## File and Data Processing

### File Encoding Examples
```python
def file_encoding_examples():
    """File encoding examples"""
    # Create test file
    test_content = "This is a test file with special characters: !@#$%^&*()"
    with open("test_file.txt", "w") as f:
        f.write(test_content)
    
    # Read and encode file
    with open("test_file.txt", "rb") as f:
        file_data = f.read()
    
    # Base64 encode file
    file_base64 = base64.b64encode(file_data)
    print(f"File Base64: {file_base64.decode()}")
    
    # Hex encode file
    file_hex = binascii.hexlify(file_data)
    print(f"File Hex: {file_hex.decode()}")
    
    # Decode and verify
    decoded_data = base64.b64decode(file_base64)
    print(f"Decoded matches: {decoded_data == file_data}")

file_encoding_examples()
```

### Binary Data Processing
```python
def binary_data_examples():
    """Binary data encoding examples"""
    # Generate random binary data
    import os
    random_data = os.urandom(16)
    
    print(f"Random data: {random_data}")
    print(f"Base64: {base64.b64encode(random_data).decode()}")
    print(f"Hex: {binascii.hexlify(random_data).decode()}")
    
    # Process different data types
    data_types = {
        'text': b"Hello, World!",
        'numbers': b'\x00\x01\x02\x03\x04\x05',
        'mixed': b'Text\x00\xFF\x42Numbers'
    }
    
    for data_type, data in data_types.items():
        print(f"\n{data_type}:")
        print(f"  Base64: {base64.b64encode(data).decode()}")
        print(f"  Hex: {binascii.hexlify(data).decode()}")

binary_data_examples()
```

## Web and API Examples

### URL Parameter Encoding
```python
def url_parameter_examples():
    """URL parameter encoding examples"""
    # Complex query parameters
    params = {
        'name': 'John Doe',
        'email': 'john.doe@example.com',
        'message': 'Hello, world! How are you?',
        'special': '!@#$%^&*()',
        'unicode': 'Hello, 世界!'
    }
    
    # Encode parameters
    query_string = urllib.parse.urlencode(params)
    print(f"Encoded query: {query_string}")
    
    # Parse encoded query
    parsed = urllib.parse.parse_qs(query_string)
    print(f"Parsed params: {parsed}")
    
    # Build URL
    base_url = "https://api.example.com/search"
    full_url = f"{base_url}?{query_string}"
    print(f"Full URL: {full_url}")

url_parameter_examples()
```

### API Response Encoding
```python
def api_encoding_examples():
    """API response encoding examples"""
    # Simulate API response with binary data
    api_response = {
        'status': 'success',
        'data': {
            'image': base64.b64encode(b'fake_image_data').decode(),
            'hash': binascii.hexlify(b'fake_hash_data').decode(),
            'message': 'Hello, API!'
        }
    }
    
    import json
    json_response = json.dumps(api_response, indent=2)
    print(f"API Response: {json_response}")
    
    # Decode response data
    decoded_image = base64.b64decode(api_response['data']['image'])
    decoded_hash = binascii.unhexlify(api_response['data']['hash'])
    
    print(f"Decoded image: {decoded_image}")
    print(f"Decoded hash: {decoded_hash}")

api_encoding_examples()
```

## Security and Validation

### Input Validation Examples
```python
def validation_examples():
    """Input validation for encoding"""
    # Validate Base64 input
    def is_valid_base64(data):
        try:
            base64.b64decode(data)
            return True
        except Exception:
            return False
    
    # Validate hex input
    def is_valid_hex(data):
        try:
            binascii.unhexlify(data)
            return True
        except Exception:
            return False
    
    # Test cases
    test_cases = [
        ("SGVsbG8=", "Base64"),
        ("48656c6c6f", "Hex"),
        ("Invalid", "Invalid"),
        ("SGVsbG8", "Base64"),
        ("48656c6c6f7", "Hex")
    ]
    
    for data, data_type in test_cases:
        if data_type == "Base64":
            valid = is_valid_base64(data)
        elif data_type == "Hex":
            valid = is_valid_hex(data)
        else:
            valid = False
        
        print(f"{data_type}: {data} -> Valid: {valid}")

validation_examples()
```

### XSS Prevention Examples
```python
def xss_prevention_examples():
    """XSS prevention with HTML encoding"""
    # Malicious inputs
    malicious_inputs = [
        '<script>alert("XSS")</script>',
        'javascript:alert("XSS")',
        '<img src="x" onerror="alert(\'XSS\')">',
        '"><script>alert("XSS")</script>'
    ]
    
    for malicious in malicious_inputs:
        # Safe encoding
        safe_output = html.escape(malicious)
        print(f"Original: {malicious}")
        print(f"Safe: {safe_output}")
        print()
    
    # Context-specific encoding
    user_input = '<script>alert("XSS")</script>'
    
    contexts = {
        'html_content': html.escape(user_input),
        'html_attribute': html.escape(user_input, quote=True),
        'javascript_string': f"'{user_input.replace(\"'\", \"\\'\")}'",
        'url_parameter': urllib.parse.quote(user_input)
    }
    
    for context, encoded in contexts.items():
        print(f"{context}: {encoded}")

xss_prevention_examples()
```

## Performance and Optimization

### Performance Comparison
```python
import time

def performance_examples():
    """Performance comparison of encoding methods"""
    test_data = b"Hello, World! This is a test string for performance comparison."
    
    # Test Base64 performance
    start_time = time.time()
    for _ in range(10000):
        base64.b64encode(test_data)
    base64_time = time.time() - start_time
    
    # Test hex performance
    start_time = time.time()
    for _ in range(10000):
        binascii.hexlify(test_data)
    hex_time = time.time() - start_time
    
    # Test URL encoding performance
    start_time = time.time()
    for _ in range(10000):
        urllib.parse.quote(test_data.decode())
    url_time = time.time() - start_time
    
    print("Performance Results (10,000 iterations):")
    print(f"Base64: {base64_time:.4f} seconds")
    print(f"Hex: {hex_time:.4f} seconds")
    print(f"URL: {url_time:.4f} seconds")
    
    # Size comparison
    base64_size = len(base64.b64encode(test_data))
    hex_size = len(binascii.hexlify(test_data))
    original_size = len(test_data)
    
    print(f"\nSize Comparison:")
    print(f"Original: {original_size} bytes")
    print(f"Base64: {base64_size} bytes ({base64_size/original_size:.1%} increase)")
    print(f"Hex: {hex_size} bytes ({hex_size/original_size:.1%} increase)")

performance_examples()
```

### Memory Efficient Encoding
```python
def memory_efficient_examples():
    """Memory efficient encoding examples"""
    # Large file processing
    large_data = b"Large data " * 1000  # 11KB of data
    
    # Process in chunks
    chunk_size = 1024
    encoded_chunks = []
    
    for i in range(0, len(large_data), chunk_size):
        chunk = large_data[i:i + chunk_size]
        encoded_chunk = base64.b64encode(chunk)
        encoded_chunks.append(encoded_chunk)
    
    # Combine chunks
    full_encoded = b''.join(encoded_chunks)
    print(f"Original size: {len(large_data)} bytes")
    print(f"Encoded size: {len(full_encoded)} bytes")
    print(f"Number of chunks: {len(encoded_chunks)}")
    
    # Verify round-trip
    decoded_data = base64.b64decode(full_encoded)
    print(f"Round-trip successful: {decoded_data == large_data}")

memory_efficient_examples()
```

## Error Handling

### Robust Encoding Functions
```python
def robust_encoding_examples():
    """Robust encoding with error handling"""
    def safe_base64_encode(data):
        """Safely encode data to Base64"""
        try:
            if isinstance(data, str):
                data = data.encode('utf-8')
            return base64.b64encode(data).decode()
        except Exception as e:
            print(f"Base64 encoding error: {e}")
            return None
    
    def safe_hex_encode(data):
        """Safely encode data to hex"""
        try:
            if isinstance(data, str):
                data = data.encode('utf-8')
            return binascii.hexlify(data).decode()
        except Exception as e:
            print(f"Hex encoding error: {e}")
            return None
    
    # Test with various inputs
    test_inputs = [
        "Hello, World!",
        b"Binary data",
        "Unicode: 你好世界",
        None,
        "",
        "A" * 10000  # Large string
    ]
    
    for test_input in test_inputs:
        print(f"\nInput: {test_input}")
        base64_result = safe_base64_encode(test_input)
        hex_result = safe_hex_encode(test_input)
        
        print(f"Base64: {base64_result}")
        print(f"Hex: {hex_result}")

robust_encoding_examples()
```

### Encoding Error Recovery
```python
def error_recovery_examples():
    """Error recovery in encoding operations"""
    # Handle malformed Base64
    malformed_base64 = "SGVsbG8"  # Missing padding
    
    try:
        # Try to decode with padding
        decoded = base64.b64decode(malformed_base64 + "=")
        print(f"Recovered: {decoded}")
    except Exception as e:
        print(f"Recovery failed: {e}")
    
    # Handle malformed hex
    malformed_hex = "48656c6c6f7"  # Odd length
    
    try:
        # Try to decode with padding
        if len(malformed_hex) % 2 == 1:
            malformed_hex = "0" + malformed_hex
        decoded = binascii.unhexlify(malformed_hex)
        print(f"Recovered: {decoded}")
    except Exception as e:
        print(f"Recovery failed: {e}")
    
    # Handle URL encoding errors
    malformed_url = "Invalid%URL%Encoding"
    
    try:
        decoded = urllib.parse.unquote(malformed_url)
        print(f"Recovered: {decoded}")
    except Exception as e:
        print(f"Recovery failed: {e}")

error_recovery_examples()
```

## JavaScript Examples

### Node.js Encoding Examples
```javascript
// Base64 encoding in Node.js
const crypto = require('crypto');

function base64Examples() {
    // String to Base64
    const text = "Hello, World!";
    const encoded = Buffer.from(text).toString('base64');
    const decoded = Buffer.from(encoded, 'base64').toString();
    
    console.log(`Original: ${text}`);
    console.log(`Base64: ${encoded}`);
    console.log(`Decoded: ${decoded}`);
    
    // Binary data to Base64
    const binaryData = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05]);
    const binaryEncoded = binaryData.toString('base64');
    const binaryDecoded = Buffer.from(binaryEncoded, 'base64');
    
    console.log(`Binary: ${binaryData.toString('hex')}`);
    console.log(`Base64: ${binaryEncoded}`);
    console.log(`Decoded: ${binaryDecoded.toString('hex')}`);
}

// Hex encoding in Node.js
function hexExamples() {
    const text = "Hello, World!";
    const encoded = Buffer.from(text).toString('hex');
    const decoded = Buffer.from(encoded, 'hex').toString();
    
    console.log(`Original: ${text}`);
    console.log(`Hex: ${encoded}`);
    console.log(`Decoded: ${decoded}`);
}

// URL encoding in Node.js
function urlExamples() {
    const url = "https://example.com/path?name=John Doe&age=25";
    const encoded = encodeURIComponent(url);
    const decoded = decodeURIComponent(encoded);
    
    console.log(`Original: ${url}`);
    console.log(`Encoded: ${encoded}`);
    console.log(`Decoded: ${decoded}`);
}

// Example usage (commented out for Python file)
// base64Examples();
// hexExamples();
// urlExamples();
```

## Testing and Validation

### Encoding Test Cases
```python
def encoding_test_cases():
    """Comprehensive encoding test cases"""
    # Test data
    test_cases = [
        ("Hello, World!", "Basic string"),
        ("", "Empty string"),
        ("Unicode: 你好世界", "Unicode string"),
        ("Special chars: !@#$%^&*()", "Special characters"),
        ("A" * 1000, "Long string"),
        (b"\x00\x01\x02\x03", "Binary data"),
        ("Line1\nLine2\r\nLine3", "Multiline string")
    ]
    
    for test_data, description in test_cases:
        print(f"\n{description}:")
        
        # Convert to bytes if string
        if isinstance(test_data, str):
            data_bytes = test_data.encode('utf-8')
        else:
            data_bytes = test_data
        
        # Test all encodings
        base64_result = base64.b64encode(data_bytes).decode()
        hex_result = binascii.hexlify(data_bytes).decode()
        url_result = urllib.parse.quote(test_data if isinstance(test_data, str) else test_data.decode())
        
        print(f"  Base64: {base64_result}")
        print(f"  Hex: {hex_result}")
        print(f"  URL: {url_result}")
        
        # Verify round-trip
        base64_decoded = base64.b64decode(base64_result.encode())
        hex_decoded = binascii.unhexlify(hex_result.encode())
        
        print(f"  Base64 round-trip: {base64_decoded == data_bytes}")
        print(f"  Hex round-trip: {hex_decoded == data_bytes}")

encoding_test_cases()
``` 