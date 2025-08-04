# Image Processing Code Examples

## Format Conversion and Compression

### Basic Format Conversion

```python
# Python with PIL
from PIL import Image

def convert_format(input_path, output_path, format='JPEG', quality=85):
    """Convert image to different format"""
    with Image.open(input_path) as img:
        if format.upper() == 'JPEG':
            img = img.convert('RGB')  # Remove alpha channel
        img.save(output_path, format=format, quality=quality)

# Usage
convert_format('photo.png', 'photo.jpg', 'JPEG', 80)
convert_format('logo.jpg', 'logo.webp', 'WEBP', 90)
```

```javascript
// JavaScript with Canvas
function convertImageFormat(imageData, format, quality = 0.8) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.drawImage(imageData, 0, 0);
    
    return canvas.toBlob((blob) => {
        // Handle the converted image blob
        console.log('Converted:', blob);
    }, `image/${format}`, quality);
}
```

### Batch Conversion

```python
import os
from PIL import Image

def batch_convert(input_dir, output_dir, target_format='WEBP'):
    """Convert all images in directory"""
    for filename in os.listdir(input_dir):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            input_path = os.path.join(input_dir, filename)
            output_path = os.path.join(output_dir, 
                                     f"{os.path.splitext(filename)[0]}.{target_format.lower()}")
            
            with Image.open(input_path) as img:
                if target_format.upper() == 'JPEG':
                    img = img.convert('RGB')
                img.save(output_path, format=target_format, quality=85)
```

## Geometric Transformations

### Image Rotation

```python
import cv2
import numpy as np

def rotate_image(image, angle):
    """Rotate image by angle degrees"""
    height, width = image.shape[:2]
    center = (width // 2, height // 2)
    
    rotation_matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv2.warpAffine(image, rotation_matrix, (width, height))
    
    return rotated

# Usage
image = cv2.imread('photo.jpg')
rotated_90 = rotate_image(image, 90)
cv2.imwrite('rotated_90.jpg', rotated_90)
```

```javascript
function rotateImage(imageData, angle) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Calculate new dimensions
    const rad = angle * Math.PI / 180;
    const cos = Math.abs(Math.cos(rad));
    const sin = Math.abs(Math.sin(rad));
    
    const newWidth = Math.ceil(imageData.width * cos + imageData.height * sin);
    const newHeight = Math.ceil(imageData.width * sin + imageData.height * cos);
    
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    // Move to center and rotate
    ctx.translate(newWidth / 2, newHeight / 2);
    ctx.rotate(rad);
    ctx.drawImage(imageData, -imageData.width / 2, -imageData.height / 2);
    
    return canvas;
}
```

### Image Cropping

```python
def crop_image(image, x, y, width, height):
    """Crop image to specified rectangle"""
    return image[y:y+height, x:x+width]

def crop_center(image, target_width, target_height):
    """Crop image to center with target dimensions"""
    height, width = image.shape[:2]
    
    start_x = (width - target_width) // 2
    start_y = (height - target_height) // 2
    
    return image[start_y:start_y+target_height, start_x:start_x+target_width]

# Usage
image = cv2.imread('photo.jpg')
cropped = crop_center(image, 800, 600)
cv2.imwrite('cropped.jpg', cropped)
```

```javascript
function cropImage(imageData, x, y, width, height) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = width;
    canvas.height = height;
    
    ctx.drawImage(imageData, x, y, width, height, 0, 0, width, height);
    return canvas;
}

function cropCenter(imageData, targetWidth, targetHeight) {
    const x = (imageData.width - targetWidth) / 2;
    const y = (imageData.height - targetHeight) / 2;
    return cropImage(imageData, x, y, targetWidth, targetHeight);
}
```

### Image Resizing

```python
def resize_image(image, target_width, target_height, method='bilinear'):
    """Resize image with specified method"""
    methods = {
        'nearest': cv2.INTER_NEAREST,
        'bilinear': cv2.INTER_LINEAR,
        'bicubic': cv2.INTER_CUBIC,
        'lanczos': cv2.INTER_LANCZOS4
    }
    
    interpolation = methods.get(method, cv2.INTER_LINEAR)
    resized = cv2.resize(image, (target_width, target_height), interpolation=interpolation)
    
    return resized

def resize_maintain_aspect(image, target_width):
    """Resize image maintaining aspect ratio"""
    height, width = image.shape[:2]
    aspect_ratio = width / height
    target_height = int(target_width / aspect_ratio)
    
    return resize_image(image, target_width, target_height)
```

```javascript
function resizeImage(imageData, targetWidth, targetHeight) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imageData, 0, 0, targetWidth, targetHeight);
    
    return canvas;
}

function resizeMaintainAspect(imageData, targetWidth) {
    const aspectRatio = imageData.width / imageData.height;
    const targetHeight = targetWidth / aspectRatio;
    return resizeImage(imageData, targetWidth, targetHeight);
}
```

## Watermarking

### Text Watermark

```python
import cv2
import numpy as np

def add_text_watermark(image, text, position='bottom-right', font_scale=1.0, color=(255, 255, 255)):
    """Add text watermark to image"""
    height, width = image.shape[:2]
    
    # Calculate position
    if position == 'bottom-right':
        x = width - 200
        y = height - 20
    elif position == 'top-left':
        x = 10
        y = 30
    elif position == 'center':
        x = width // 2
        y = height // 2
    else:
        x, y = 10, height - 20
    
    # Add text with shadow
    cv2.putText(image, text, (x+2, y+2), cv2.FONT_HERSHEY_SIMPLEX, 
                font_scale, (0, 0, 0), 2)  # Shadow
    cv2.putText(image, text, (x, y), cv2.FONT_HERSHEY_SIMPLEX, 
                font_scale, color, 2)  # Text
    
    return image

# Usage
image = cv2.imread('photo.jpg')
watermarked = add_text_watermark(image, '© 2024 Company', 'bottom-right')
cv2.imwrite('watermarked.jpg', watermarked)
```

```javascript
function addTextWatermark(imageData, text, position = 'bottom-right') {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    
    // Draw original image
    ctx.drawImage(imageData, 0, 0);
    
    // Configure text
    ctx.font = '24px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.lineWidth = 2;
    
    // Calculate position
    let x, y;
    switch (position) {
        case 'top-left':
            x = 10; y = 30;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            break;
        case 'bottom-right':
        default:
            x = canvas.width - 10; y = canvas.height - 10;
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            break;
    }
    
    // Draw text with stroke
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    
    return canvas;
}
```

### Image Watermark

```python
def add_image_watermark(base_image, watermark_image, position='bottom-right', opacity=0.7):
    """Add image watermark to base image"""
    base_height, base_width = base_image.shape[:2]
    wm_height, wm_width = watermark_image.shape[:2]
    
    # Calculate position
    if position == 'bottom-right':
        x = base_width - wm_width - 10
        y = base_height - wm_height - 10
    elif position == 'top-left':
        x, y = 10, 10
    elif position == 'center':
        x = (base_width - wm_width) // 2
        y = (base_height - wm_height) // 2
    else:
        x, y = 10, 10
    
    # Create ROI and blend
    roi = base_image[y:y+wm_height, x:x+wm_width]
    blended = cv2.addWeighted(roi, 1-opacity, watermark_image, opacity, 0)
    base_image[y:y+wm_height, x:x+wm_width] = blended
    
    return base_image

# Usage
base = cv2.imread('photo.jpg')
watermark = cv2.imread('logo.png')
result = add_image_watermark(base, watermark, 'bottom-right', 0.5)
cv2.imwrite('watermarked.jpg', result)
```

### Invisible Watermark (LSB)

```python
import numpy as np

def embed_lsb_watermark(image, text):
    """Embed text using LSB steganography"""
    # Convert text to binary
    binary_text = ''.join(format(ord(char), '08b') for char in text)
    binary_text += '00000000'  # Null terminator
    
    # Flatten image
    flat_image = image.flatten()
    
    if len(binary_text) > len(flat_image):
        raise ValueError("Image too small for watermark")
    
    # Embed watermark
    for i, bit in enumerate(binary_text):
        flat_image[i] = (flat_image[i] & 0xFE) | int(bit)
    
    return flat_image.reshape(image.shape).astype(np.uint8)

def extract_lsb_watermark(image):
    """Extract text from LSB watermark"""
    flat_image = image.flatten()
    binary_data = ''
    
    for i in range(len(flat_image)):
        binary_data += str(flat_image[i] & 1)
        if len(binary_data) >= 8 and binary_data[-8:] == '00000000':
            break
    
    # Convert binary to text
    text = ''
    for i in range(0, len(binary_data) - 8, 8):
        byte = binary_data[i:i+8]
        if byte == '00000000':
            break
        text += chr(int(byte, 2))
    
    return text

# Usage
image = cv2.imread('photo.jpg')
watermarked = embed_lsb_watermark(image, "Secret message")
cv2.imwrite('watermarked.jpg', watermarked)

# Extract later
extracted = extract_lsb_watermark(watermarked)
print("Extracted:", extracted)
```

## Performance Optimization

### Memory-Efficient Processing

```python
def process_large_image(input_path, output_path, operation_func, tile_size=1024):
    """Process large images in tiles to manage memory"""
    from PIL import Image
    import numpy as np
    
    with Image.open(input_path) as img:
        width, height = img.size
        output_img = Image.new(img.mode, img.size)
        
        for y in range(0, height, tile_size):
            for x in range(0, width, tile_size):
                tile_width = min(tile_size, width - x)
                tile_height = min(tile_size, height - y)
                
                tile = img.crop((x, y, x + tile_width, y + tile_height))
                tile_array = np.array(tile)
                
                processed_tile = operation_func(tile_array)
                output_img.paste(Image.fromarray(processed_tile), (x, y))
        
        output_img.save(output_path)

# Example usage
def blur_tile(tile):
    return cv2.GaussianBlur(tile, (15, 15), 0)

process_large_image('large_photo.jpg', 'blurred.jpg', blur_tile)
```

### Batch Processing

```javascript
class ImageProcessor {
    constructor(maxConcurrent = 4) {
        this.maxConcurrent = maxConcurrent;
        this.queue = [];
        this.processing = 0;
    }
    
    async addTask(task) {
        return new Promise((resolve, reject) => {
            this.queue.push({ task, resolve, reject });
            this.processQueue();
        });
    }
    
    async processQueue() {
        if (this.processing >= this.maxConcurrent || this.queue.length === 0) {
            return;
        }
        
        this.processing++;
        const { task, resolve, reject } = this.queue.shift();
        
        try {
            const result = await this.processImage(task);
            resolve(result);
        } catch (error) {
            reject(error);
        } finally {
            this.processing--;
            this.processQueue();
        }
    }
    
    async processImage(task) {
        // Implement specific processing logic
        const { input, output, operation, params } = task;
        
        // Load and process image
        const image = await this.loadImage(input);
        const processed = await this.applyOperation(image, operation, params);
        await this.saveImage(processed, output);
        
        return { input, output, success: true };
    }
}

// Usage
const processor = new ImageProcessor(3);
processor.addTask({
    input: 'photo1.jpg',
    output: 'resized1.jpg',
    operation: 'resize',
    params: { width: 800, height: 600 }
});
```

## Error Handling

### Input Validation

```python
def validate_image(image_path, max_size_mb=50):
    """Validate image before processing"""
    import os
    
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found: {image_path}")
    
    file_size_mb = os.path.getsize(image_path) / (1024 * 1024)
    if file_size_mb > max_size_mb:
        raise ValueError(f"Image too large: {file_size_mb:.2f}MB")
    
    try:
        with Image.open(image_path) as img:
            width, height = img.size
            if width > 10000 or height > 10000:
                print(f"Warning: Large image {width}x{height}")
    except Exception as e:
        raise ValueError(f"Invalid image file: {str(e)}")

# Usage
try:
    validate_image('photo.jpg', max_size_mb=100)
    # Process image
except (FileNotFoundError, ValueError) as e:
    print(f"Validation failed: {e}")
```

```javascript
function validateImage(file, maxSizeMB = 50) {
    return new Promise((resolve, reject) => {
        // Check file size
        if (file.size > maxSizeMB * 1024 * 1024) {
            reject(new Error(`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB`));
            return;
        }
        
        // Check file type
        if (!file.type.startsWith('image/')) {
            reject(new Error('Not an image file'));
            return;
        }
        
        // Validate image data
        const img = new Image();
        img.onload = () => {
            if (img.width > 10000 || img.height > 10000) {
                console.warn(`Large image: ${img.width}x${img.height}`);
            }
            resolve(img);
        };
        img.onerror = () => reject(new Error('Invalid image file'));
        img.src = URL.createObjectURL(file);
    });
}
```

These examples provide practical implementations for common image processing tasks with error handling and performance considerations. 