# Encoding Schemes Usage Tutorial

## Environment Setup

### Prerequisites
- Programming language with encoding libraries
- Understanding of binary data representation
- Knowledge of character encoding concepts
- Awareness of encoding security considerations

### Library Selection

#### Python Built-in Libraries
```python
import base64
import binascii
import urllib.parse
import html
import json
```

#### Node.js Built-in Modules
```javascript
const crypto = require('crypto');
const querystring = require('querystring');
const Buffer = require('buffer');
```

#### Go Standard Library
```go
import (
    "encoding/base64"
    "encoding/hex"
    "net/url"
    "html"
    "encoding/json"
)
```

## Basic Concepts

### Encoding Overview
```python
def encoding_overview():
    """Overview of different encoding schemes"""
    print("Encoding Schemes Overview:")
    print("1. Base64: Binary to text encoding (A-Z, a-z, 0-9, +, /)")
    print("2. Hex: Binary to hexadecimal (0-9, A-F)")
    print("3. URL: Percent-encoding for URLs")
    print("4. HTML: Character entities for HTML")
    print("5. JWT: JSON Web Tokens with Base64URL")

# Display overview
encoding_overview()
```

### Character Set Understanding
```python
def character_sets():
    """Understanding character sets for different encodings"""
    print("Character Sets:")
    print("Base64: A-Z, a-z, 0-9, +, /, = (padding)")
    print("Hex: 0-9, A-F (case insensitive)")
    print("URL: ASCII + percent encoding")
    print("HTML: Unicode + entity references")
    print("JWT: Base64URL (no padding, URL-safe)")
```

## Base64 Encoding

### Basic Base64 Operations
```python
import base64

def basic_base64_example():
    """Basic Base64 encoding and decoding"""
    # Original data
    original_data = b"Hello, Base64 encoding!"
    
    # Encode to Base64
    encoded_data = base64.b64encode(original_data)
    print(f"Original: {original_data}")
    print(f"Base64: {encoded_data.decode()}")
    
    # Decode from Base64
    decoded_data = base64.b64decode(encoded_data)
    print(f"Decoded: {decoded_data}")
    
    # Verify round-trip
    assert original_data == decoded_data
    print("✓ Round-trip verification successful")

basic_base64_example()
```

### Base64 with Different Data Types
```python
def base64_data_types():
    """Base64 encoding with different data types"""
    # String encoding
    text = "Hello, World!"
    text_encoded = base64.b64encode(text.encode('utf-8'))
    print(f"Text: {text}")
    print(f"Base64: {text_encoded.decode()}")
    
    # Binary data encoding
    binary_data = b'\x00\x01\x02\x03\x04\x05'
    binary_encoded = base64.b64encode(binary_data)
    print(f"Binary: {binary_data.hex()}")
    print(f"Base64: {binary_encoded.decode()}")
    
    # File-like encoding
    file_content = b"This is file content with special chars: !@#$%^&*()"
    file_encoded = base64.b64encode(file_content)
    print(f"File content: {file_content}")
    print(f"Base64: {file_encoded.decode()}")

base64_data_types()
```

### Base64URL Encoding
```python
def base64url_example():
    """Base64URL encoding (URL-safe Base64)"""
    # Original data
    data = b"URL-safe encoding test"
    
    # Standard Base64
    standard_b64 = base64.b64encode(data)
    print(f"Standard Base64: {standard_b64.decode()}")
    
    # Base64URL (replace + with -, / with _, remove padding)
    base64url = base64.urlsafe_b64encode(data)
    print(f"Base64URL: {base64url.decode()}")
    
    # Decode Base64URL
    decoded = base64.urlsafe_b64decode(base64url)
    print(f"Decoded: {decoded}")
    
    assert data == decoded
    print("✓ Base64URL round-trip successful")

base64url_example()
```

## Hexadecimal Encoding

### Basic Hex Operations
```python
import binascii

def basic_hex_example():
    """Basic hexadecimal encoding and decoding"""
    # Original data
    original_data = b"Hello, Hex encoding!"
    
    # Encode to hex
    hex_data = binascii.hexlify(original_data)
    print(f"Original: {original_data}")
    print(f"Hex: {hex_data.decode()}")
    
    # Decode from hex
    decoded_data = binascii.unhexlify(hex_data)
    print(f"Decoded: {decoded_data}")
    
    # Verify round-trip
    assert original_data == decoded_data
    print("✓ Round-trip verification successful")

basic_hex_example()
```

### Hex with Different Formats
```python
def hex_formats():
    """Hexadecimal encoding with different formats"""
    data = b"Test data for hex encoding"
    
    # Lowercase hex
    hex_lower = binascii.hexlify(data).decode()
    print(f"Lowercase hex: {hex_lower}")
    
    # Uppercase hex
    hex_upper = binascii.hexlify(data).decode().upper()
    print(f"Uppercase hex: {hex_upper}")
    
    # With separators
    hex_separated = ':'.join(f'{b:02x}' for b in data)
    print(f"Separated hex: {hex_separated}")
    
    # With 0x prefix
    hex_prefixed = '0x' + binascii.hexlify(data).decode()
    print(f"Prefixed hex: {hex_prefixed}")

hex_formats()
```

### Hex for Binary Data
```python
def hex_binary_data():
    """Hexadecimal encoding for binary data"""
    # Binary data
    binary_data = b'\x00\xFF\xA5\x42\x7F\xE3'
    
    # Encode to hex
    hex_string = binascii.hexlify(binary_data).decode()
    print(f"Binary: {binary_data}")
    print(f"Hex: {hex_string}")
    
    # Decode back
    decoded_binary = binascii.unhexlify(hex_string)
    print(f"Decoded binary: {decoded_binary}")
    
    # Verify
    assert binary_data == decoded_binary
    print("✓ Binary data round-trip successful")

hex_binary_data()
```

## URL Encoding

### Basic URL Encoding
```python
import urllib.parse

def basic_url_encoding():
    """Basic URL encoding and decoding"""
    # Original URL with special characters
    original_url = "https://example.com/path?name=John Doe&age=25"
    
    # Encode URL
    encoded_url = urllib.parse.quote(original_url)
    print(f"Original: {original_url}")
    print(f"Encoded: {encoded_url}")
    
    # Decode URL
    decoded_url = urllib.parse.unquote(encoded_url)
    print(f"Decoded: {decoded_url}")
    
    # Verify round-trip
    assert original_url == decoded_url
    print("✓ Round-trip verification successful")

basic_url_encoding()
```

### URL Encoding Components
```python
def url_components():
    """URL encoding for different URL components"""
    # Query parameters
    params = {
        'name': 'John Doe',
        'email': 'john@example.com',
        'message': 'Hello, world!'
    }
    
    # Encode query string
    query_string = urllib.parse.urlencode(params)
    print(f"Original params: {params}")
    print(f"Encoded query: {query_string}")
    
    # Parse encoded query
    parsed_params = urllib.parse.parse_qs(query_string)
    print(f"Parsed params: {parsed_params}")
    
    # Path encoding
    path = "/user profile/John Doe"
    encoded_path = urllib.parse.quote(path)
    print(f"Original path: {path}")
    print(f"Encoded path: {encoded_path}")

url_components()
```

### URL Encoding Special Cases
```python
def url_special_cases():
    """URL encoding for special cases"""
    # Reserved characters
    reserved_chars = "!*'();:@&=+$,/?#[]"
    encoded_reserved = urllib.parse.quote(reserved_chars)
    print(f"Reserved chars: {reserved_chars}")
    print(f"Encoded: {encoded_reserved}")
    
    # Unicode characters
    unicode_text = "Hello, 世界!"
    encoded_unicode = urllib.parse.quote(unicode_text)
    print(f"Unicode: {unicode_text}")
    print(f"Encoded: {encoded_unicode}")
    
    # Plus sign handling
    text_with_plus = "Hello+World"
    encoded_plus = urllib.parse.quote_plus(text_with_plus)
    print(f"With plus: {text_with_plus}")
    print(f"Encoded: {encoded_plus}")

url_special_cases()
```

## HTML Encoding

### Basic HTML Encoding
```python
import html

def basic_html_encoding():
    """Basic HTML encoding and decoding"""
    # Original text with special characters
    original_text = "<script>alert('Hello, World!')</script>"
    
    # Encode HTML
    encoded_text = html.escape(original_text)
    print(f"Original: {original_text}")
    print(f"Encoded: {encoded_text}")
    
    # Decode HTML
    decoded_text = html.unescape(encoded_text)
    print(f"Decoded: {decoded_text}")
    
    # Verify round-trip
    assert original_text == decoded_text
    print("✓ Round-trip verification successful")

basic_html_encoding()
```

### HTML Entity Encoding
```python
def html_entities():
    """HTML entity encoding examples"""
    # Common HTML entities
    entities = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#39;'
    }
    
    # Test text with entities
    test_text = '<div class="test">Hello & World</div>'
    encoded_text = html.escape(test_text)
    print(f"Original: {test_text}")
    print(f"Encoded: {encoded_text}")
    
    # Decode entities
    decoded_text = html.unescape(encoded_text)
    print(f"Decoded: {decoded_text}")
    
    # Unicode entities
    unicode_text = "Hello, 世界! © 2024"
    encoded_unicode = html.escape(unicode_text)
    print(f"Unicode: {unicode_text}")
    print(f"Encoded: {encoded_unicode}")

html_entities()
```

### HTML Encoding for XSS Prevention
```python
def xss_prevention():
    """HTML encoding for XSS prevention"""
    # Malicious input
    malicious_input = '<script>alert("XSS")</script>'
    
    # Safe encoding
    safe_output = html.escape(malicious_input)
    print(f"Malicious input: {malicious_input}")
    print(f"Safe output: {safe_output}")
    
    # Context-specific encoding
    contexts = {
        'html': html.escape(malicious_input),
        'attribute': html.escape(malicious_input, quote=True),
        'javascript': f"'{malicious_input.replace(\"'\", \"\\'\")}'"
    }
    
    for context, encoded in contexts.items():
        print(f"{context}: {encoded}")

xss_prevention()
```

## JSON Web Tokens (JWT)

### Basic JWT Operations
```python
import json
import base64

def basic_jwt_example():
    """Basic JWT creation and parsing"""
    # JWT components
    header = {
        "alg": "HS256",
        "typ": "JWT"
    }
    
    payload = {
        "sub": "1234567890",
        "name": "John Doe",
        "iat": 1516239022
    }
    
    # Encode components
    header_encoded = base64.urlsafe_b64encode(
        json.dumps(header).encode()
    ).rstrip(b'=').decode()
    
    payload_encoded = base64.urlsafe_b64encode(
        json.dumps(payload).encode()
    ).rstrip(b'=').decode()
    
    # Create JWT (without signature for demo)
    jwt_token = f"{header_encoded}.{payload_encoded}"
    print(f"JWT Token: {jwt_token}")
    
    # Parse JWT
    parts = jwt_token.split('.')
    header_decoded = json.loads(
        base64.urlsafe_b64decode(parts[0] + '==').decode()
    )
    payload_decoded = json.loads(
        base64.urlsafe_b64decode(parts[1] + '==').decode()
    )
    
    print(f"Header: {header_decoded}")
    print(f"Payload: {payload_decoded}")

basic_jwt_example()
```

### JWT with PyJWT Library
```python
# Note: This requires pip install PyJWT
try:
    import jwt
    
    def jwt_with_library():
        """JWT operations using PyJWT library"""
        # Secret key
        secret = "your-secret-key"
        
        # Create payload
        payload = {
            "user_id": 123,
            "username": "john_doe",
            "exp": 1516239022
        }
        
        # Encode JWT
        token = jwt.encode(payload, secret, algorithm="HS256")
        print(f"JWT Token: {token}")
        
        # Decode JWT
        decoded = jwt.decode(token, secret, algorithms=["HS256"])
        print(f"Decoded: {decoded}")
        
        return token, decoded
    
    # jwt_with_library()
    print("PyJWT library example (commented out)")
    
except ImportError:
    print("PyJWT library not available")
```

## Advanced Usage

### Encoding Performance Comparison
```python
import time

def performance_comparison():
    """Compare performance of different encoding schemes"""
    test_data = b"Hello, World! This is a test string for encoding performance comparison."
    
    # Base64 performance
    start_time = time.time()
    for _ in range(10000):
        base64.b64encode(test_data)
    base64_time = time.time() - start_time
    
    # Hex performance
    start_time = time.time()
    for _ in range(10000):
        binascii.hexlify(test_data)
    hex_time = time.time() - start_time
    
    # URL encoding performance
    start_time = time.time()
    for _ in range(10000):
        urllib.parse.quote(test_data.decode())
    url_time = time.time() - start_time
    
    print("Performance Comparison (10,000 iterations):")
    print(f"Base64: {base64_time:.4f} seconds")
    print(f"Hex: {hex_time:.4f} seconds")
    print(f"URL: {url_time:.4f} seconds")

performance_comparison()
```

### Error Handling
```python
def encoding_error_handling():
    """Error handling for encoding operations"""
    # Invalid Base64
    try:
        invalid_b64 = "Invalid Base64 String!"
        decoded = base64.b64decode(invalid_b64)
        print("Decoded successfully")
    except Exception as e:
        print(f"Base64 decode error: {e}")
    
    # Invalid Hex
    try:
        invalid_hex = "Invalid Hex String!"
        decoded = binascii.unhexlify(invalid_hex)
        print("Decoded successfully")
    except Exception as e:
        print(f"Hex decode error: {e}")
    
    # Invalid URL encoding
    try:
        invalid_url = "Invalid%URL%Encoding"
        decoded = urllib.parse.unquote(invalid_url)
        print(f"URL decoded: {decoded}")
    except Exception as e:
        print(f"URL decode error: {e}")

encoding_error_handling()
```

## Security Best Practices

### Input Validation
```python
def input_validation():
    """Input validation for encoding operations"""
    # Validate Base64 input
    def validate_base64(data):
        try:
            base64.b64decode(data)
            return True
        except Exception:
            return False
    
    # Validate Hex input
    def validate_hex(data):
        try:
            binascii.unhexlify(data)
            return True
        except Exception:
            return False
    
    # Test validation
    test_cases = [
        ("SGVsbG8=", "Base64"),
        ("48656c6c6f", "Hex"),
        ("Invalid", "Invalid")
    ]
    
    for data, data_type in test_cases:
        if data_type == "Base64":
            is_valid = validate_base64(data)
        elif data_type == "Hex":
            is_valid = validate_hex(data)
        else:
            is_valid = False
        
        print(f"{data_type}: {data} -> Valid: {is_valid}")

input_validation()
```

### Secure Encoding Practices
```python
def secure_encoding_practices():
    """Secure encoding practices"""
    print("Secure Encoding Practices:")
    print("1. Always validate input before encoding/decoding")
    print("2. Use appropriate encoding for the context")
    print("3. Handle encoding errors gracefully")
    print("4. Be aware of encoding security implications")
    print("5. Use HTTPS for sensitive data transmission")
    print("6. Validate JWT signatures before processing")
    print("7. Sanitize HTML output to prevent XSS")
    print("8. Use parameterized queries to prevent injection")

secure_encoding_practices()
``` 