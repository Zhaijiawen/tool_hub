# Image Processing Usage Tutorial

## Introduction

This tutorial provides comprehensive guidance for implementing and using image processing operations including format conversion, compression, geometric transformations, and watermarking. Each section includes practical examples, best practices, and performance considerations.

## Image Format Conversion and Compression

### Understanding Image Formats

**Choosing the Right Format**
- **JPEG**: Use for photographs, complex images, and web content where file size matters
- **PNG**: Use for graphics with transparency, sharp edges, or when lossless quality is required
- **WebP**: Use for modern web applications requiring better compression than JPEG/PNG
- **AVIF**: Use for cutting-edge applications where maximum compression is needed

**Quality vs. File Size Trade-offs**
```
JPEG Quality Guidelines:
- 90-100: High quality, large files (archival, print)
- 70-89: Good quality, moderate files (web, general use)
- 50-69: Acceptable quality, smaller files (thumbnails, previews)
- 30-49: Low quality, very small files (icons, placeholders)
```

### Format Conversion Best Practices

**Progressive Conversion Strategy**
1. Start with the highest quality source available
2. Convert to target format with appropriate quality settings
3. Validate output quality and file size
4. Iterate if necessary to find optimal balance

**Batch Processing Guidelines**
```javascript
// Example batch conversion workflow
const conversionQueue = [
  { input: 'photo.jpg', output: 'photo_webp.webp', quality: 80 },
  { input: 'logo.png', output: 'logo_jpeg.jpg', quality: 90 },
  { input: 'icon.png', output: 'icon_avif.avif', quality: 85 }
];

// Process with error handling and progress tracking
for (const task of conversionQueue) {
  try {
    await convertImage(task.input, task.output, task.quality);
    console.log(`Converted: ${task.input} → ${task.output}`);
  } catch (error) {
    console.error(`Failed to convert ${task.input}:`, error);
  }
}
```

### Compression Optimization

**Lossy Compression Techniques**
- **Quantization**: Adjust quality parameters based on image content
- **Subsampling**: Use chroma subsampling for color images
- **Progressive Encoding**: Enable for large images to improve perceived loading speed

**Lossless Compression Strategies**
- **Optimization**: Use tools to remove unnecessary metadata
- **Palette Optimization**: Reduce color palette for PNG-8 images
- **Compression Level**: Balance between compression time and file size

## Geometric Transformations

### Image Rotation

**Rotation Implementation**
```python
def rotate_image(image, angle, center=None, scale=1.0):
    """
    Rotate image by given angle around center point
    
    Args:
        image: Input image array
        angle: Rotation angle in degrees (positive = counterclockwise)
        center: Rotation center point (x, y), defaults to image center
        scale: Scale factor for output image
    
    Returns:
        Rotated image array
    """
    import cv2
    import numpy as np
    
    # Get image dimensions
    height, width = image.shape[:2]
    
    # Calculate rotation center if not provided
    if center is None:
        center = (width // 2, height // 2)
    
    # Get rotation matrix
    rotation_matrix = cv2.getRotationMatrix2D(center, angle, scale)
    
    # Calculate new image dimensions
    cos = np.abs(rotation_matrix[0, 0])
    sin = np.abs(rotation_matrix[0, 1])
    new_width = int((height * sin) + (width * cos))
    new_height = int((height * cos) + (width * sin))
    
    # Adjust rotation matrix for new dimensions
    rotation_matrix[0, 2] += (new_width / 2) - center[0]
    rotation_matrix[1, 2] += (new_height / 2) - center[1]
    
    # Perform rotation
    rotated_image = cv2.warpAffine(image, rotation_matrix, (new_width, new_height))
    
    return rotated_image
```

**Rotation Best Practices**
- **Interpolation**: Use bilinear interpolation for most cases, bicubic for high-quality results
- **Anti-aliasing**: Enable for smooth edges, especially for text and graphics
- **Memory Management**: Consider image size limits for large rotations
- **Batch Processing**: Implement queue system for multiple rotations

### Image Cropping

**Rectangular Cropping**
```javascript
function cropImage(imageData, x, y, width, height) {
    // Validate crop parameters
    if (x < 0 || y < 0 || width <= 0 || height <= 0) {
        throw new Error('Invalid crop parameters');
    }
    
    if (x + width > imageData.width || y + height > imageData.height) {
        throw new Error('Crop area exceeds image boundaries');
    }
    
    // Create new canvas for cropped image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = width;
    canvas.height = height;
    
    // Draw cropped region
    ctx.drawImage(
        imageData,
        x, y, width, height,  // Source rectangle
        0, 0, width, height   // Destination rectangle
    );
    
    return canvas;
}
```

**Smart Cropping Techniques**
- **Aspect Ratio Preservation**: Maintain original proportions or force specific ratios
- **Content-Aware Cropping**: Use AI/ML to identify important image regions
- **Face Detection**: Automatically crop to include detected faces
- **Rule of Thirds**: Apply photographic composition guidelines

### Scaling and Resizing

**Resizing Algorithms**
```python
def resize_image(image, target_width, target_height, method='bilinear'):
    """
    Resize image using specified interpolation method
    
    Methods:
    - 'nearest': Fast, pixelated results
    - 'bilinear': Good balance of speed and quality
    - 'bicubic': High quality, slower
    - 'lanczos': Best quality, slowest
    """
    import cv2
    
    interpolation_methods = {
        'nearest': cv2.INTER_NEAREST,
        'bilinear': cv2.INTER_LINEAR,
        'bicubic': cv2.INTER_CUBIC,
        'lanczos': cv2.INTER_LANCZOS4
    }
    
    method = interpolation_methods.get(method, cv2.INTER_LINEAR)
    
    resized = cv2.resize(image, (target_width, target_height), 
                        interpolation=method)
    
    return resized
```

**Scaling Best Practices**
- **Upscaling**: Use bicubic or Lanczos for better quality
- **Downscaling**: Use bilinear for speed, bicubic for quality
- **Aspect Ratio**: Maintain proportions unless distortion is intentional
- **Multiple Sizes**: Generate thumbnails and responsive image sizes

## Watermarking Implementation

### Visible Watermarks

**Text Watermark Implementation**
```javascript
function addTextWatermark(image, text, options = {}) {
    const {
        position = 'bottom-right',
        fontSize = 24,
        fontFamily = 'Arial',
        color = 'rgba(255, 255, 255, 0.7)',
        padding = 10
    } = options;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = image.width;
    canvas.height = image.height;
    
    // Draw original image
    ctx.drawImage(image, 0, 0);
    
    // Configure text style
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    
    // Calculate position
    const textMetrics = ctx.measureText(text);
    let x, y;
    
    switch (position) {
        case 'top-left':
            x = padding;
            y = fontSize + padding;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            break;
        case 'top-right':
            x = canvas.width - padding;
            y = fontSize + padding;
            ctx.textBaseline = 'top';
            break;
        case 'bottom-left':
            x = padding;
            y = canvas.height - padding;
            ctx.textAlign = 'left';
            break;
        case 'bottom-right':
        default:
            x = canvas.width - padding;
            y = canvas.height - padding;
            break;
    }
    
    // Add text shadow for better visibility
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    // Draw watermark text
    ctx.fillText(text, x, y);
    
    return canvas;
}
```

**Image Watermark Implementation**
```python
def add_image_watermark(base_image, watermark_image, position='bottom-right', opacity=0.7):
    """
    Add image watermark to base image
    
    Args:
        base_image: Main image to watermark
        watermark_image: Watermark image to overlay
        position: Watermark position ('top-left', 'top-right', 'bottom-left', 'bottom-right', 'center')
        opacity: Watermark opacity (0.0 to 1.0)
    
    Returns:
        Watermarked image
    """
    import cv2
    import numpy as np
    
    # Get image dimensions
    base_height, base_width = base_image.shape[:2]
    wm_height, wm_width = watermark_image.shape[:2]
    
    # Calculate watermark position
    if position == 'top-left':
        x, y = 10, 10
    elif position == 'top-right':
        x, y = base_width - wm_width - 10, 10
    elif position == 'bottom-left':
        x, y = 10, base_height - wm_height - 10
    elif position == 'bottom-right':
        x, y = base_width - wm_width - 10, base_height - wm_height - 10
    elif position == 'center':
        x = (base_width - wm_width) // 2
        y = (base_height - wm_height) // 2
    else:
        x, y = 10, 10
    
    # Create ROI for watermark placement
    roi = base_image[y:y+wm_height, x:x+wm_width]
    
    # Blend watermark with ROI
    if watermark_image.shape[2] == 4:  # RGBA watermark
        alpha = watermark_image[:, :, 3] / 255.0 * opacity
        for c in range(3):
            roi[:, :, c] = (1 - alpha) * roi[:, :, c] + alpha * watermark_image[:, :, c]
    else:  # RGB watermark
        blended = cv2.addWeighted(roi, 1 - opacity, watermark_image, opacity, 0)
        base_image[y:y+wm_height, x:x+wm_width] = blended
    
    return base_image
```

### Invisible Watermarks

**LSB Steganography Implementation**
```python
def embed_lsb_watermark(image, watermark_text):
    """
    Embed text watermark using LSB steganography
    
    Args:
        image: Input image array
        watermark_text: Text to embed
    
    Returns:
        Image with embedded watermark
    """
    import numpy as np
    
    # Convert text to binary
    binary_text = ''.join(format(ord(char), '08b') for char in watermark_text)
    binary_text += '00000000'  # Null terminator
    
    # Flatten image
    flat_image = image.flatten()
    
    # Check if image can hold the watermark
    if len(binary_text) > len(flat_image):
        raise ValueError("Image too small to hold watermark")
    
    # Embed watermark
    for i, bit in enumerate(binary_text):
        flat_image[i] = (flat_image[i] & 0xFE) | int(bit)
    
    # Reshape back to original dimensions
    watermarked_image = flat_image.reshape(image.shape)
    
    return watermarked_image.astype(np.uint8)

def extract_lsb_watermark(image):
    """
    Extract text watermark from image using LSB steganography
    
    Args:
        image: Image with embedded watermark
    
    Returns:
        Extracted text
    """
    import numpy as np
    
    # Flatten image
    flat_image = image.flatten()
    
    # Extract binary data
    binary_data = ''
    for i in range(len(flat_image)):
        binary_data += str(flat_image[i] & 1)
        
        # Check for null terminator
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
```

## Performance Optimization

### Memory Management

**Streaming Processing**
```python
def process_large_image(input_path, output_path, operation_func):
    """
    Process large images using streaming to manage memory
    
    Args:
        input_path: Path to input image
        output_path: Path for output image
        operation_func: Function to apply to image tiles
    """
    from PIL import Image
    import numpy as np
    
    # Open image
    with Image.open(input_path) as img:
        # Get image dimensions
        width, height = img.size
        
        # Define tile size (adjust based on available memory)
        tile_size = 1024
        
        # Create output image
        output_img = Image.new(img.mode, img.size)
        
        # Process image in tiles
        for y in range(0, height, tile_size):
            for x in range(0, width, tile_size):
                # Calculate tile dimensions
                tile_width = min(tile_size, width - x)
                tile_height = min(tile_size, height - y)
                
                # Extract tile
                tile = img.crop((x, y, x + tile_width, y + tile_height))
                tile_array = np.array(tile)
                
                # Apply operation
                processed_tile = operation_func(tile_array)
                
                # Paste processed tile
                output_img.paste(Image.fromarray(processed_tile), (x, y))
        
        # Save output
        output_img.save(output_path)
```

### Batch Processing

**Efficient Batch Operations**
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
        // Implement specific image processing logic
        const { input, output, operation, params } = task;
        
        // Load image
        const image = await this.loadImage(input);
        
        // Apply operation
        let processed;
        switch (operation) {
            case 'resize':
                processed = await this.resizeImage(image, params);
                break;
            case 'crop':
                processed = await this.cropImage(image, params);
                break;
            case 'watermark':
                processed = await this.addWatermark(image, params);
                break;
            default:
                throw new Error(`Unknown operation: ${operation}`);
        }
        
        // Save result
        await this.saveImage(processed, output);
        
        return { input, output, success: true };
    }
}
```

## Error Handling and Validation

### Input Validation

**Comprehensive Validation**
```python
def validate_image_input(image_path, allowed_formats=None, max_size_mb=50):
    """
    Validate image input before processing
    
    Args:
        image_path: Path to image file
        allowed_formats: List of allowed file extensions
        max_size_mb: Maximum file size in MB
    
    Returns:
        Validation result with details
    """
    import os
    from PIL import Image
    
    result = {
        'valid': True,
        'errors': [],
        'warnings': []
    }
    
    # Check file existence
    if not os.path.exists(image_path):
        result['valid'] = False
        result['errors'].append(f"File not found: {image_path}")
        return result
    
    # Check file size
    file_size_mb = os.path.getsize(image_path) / (1024 * 1024)
    if file_size_mb > max_size_mb:
        result['valid'] = False
        result['errors'].append(f"File too large: {file_size_mb:.2f}MB > {max_size_mb}MB")
    
    # Check file format
    if allowed_formats:
        file_ext = os.path.splitext(image_path)[1].lower()
        if file_ext not in allowed_formats:
            result['valid'] = False
            result['errors'].append(f"Unsupported format: {file_ext}")
    
    # Validate image data
    try:
        with Image.open(image_path) as img:
            # Check image dimensions
            width, height = img.size
            if width > 10000 or height > 10000:
                result['warnings'].append(f"Large image dimensions: {width}x{height}")
            
            # Check color mode
            if img.mode not in ['RGB', 'RGBA', 'L', 'P']:
                result['warnings'].append(f"Unusual color mode: {img.mode}")
                
    except Exception as e:
        result['valid'] = False
        result['errors'].append(f"Invalid image file: {str(e)}")
    
    return result
```

### Error Recovery

**Graceful Error Handling**
```javascript
async function processImageWithFallback(imageData, operations) {
    const results = [];
    
    for (const operation of operations) {
        try {
            const result = await applyImageOperation(imageData, operation);
            results.push({
                operation: operation.name,
                success: true,
                result: result
            });
            
            // Use result as input for next operation
            imageData = result;
            
        } catch (error) {
            console.warn(`Operation ${operation.name} failed:`, error);
            
            results.push({
                operation: operation.name,
                success: false,
                error: error.message
            });
            
            // Continue with next operation using previous result
            continue;
        }
    }
    
    return {
        finalResult: imageData,
        operationResults: results,
        success: results.some(r => r.success)
    };
}
```

## Best Practices Summary

### Quality Guidelines

**Format Selection**
- Use JPEG for photographs and complex images
- Use PNG for graphics requiring transparency
- Use WebP for modern web applications
- Use AVIF for maximum compression efficiency

**Compression Settings**
- JPEG: 70-85 quality for web, 90+ for print
- PNG: Use optimization tools for smaller files
- WebP: 80-90 quality for good balance
- AVIF: 70-85 quality for excellent compression

### Performance Tips

**Processing Optimization**
- Use appropriate interpolation methods for scaling
- Implement batch processing for multiple images
- Apply memory management for large images
- Use parallel processing where possible

**User Experience**
- Provide progress indicators for long operations
- Implement preview functionality
- Allow operation cancellation
- Show before/after comparisons

### Security Considerations

**Input Validation**
- Validate all input parameters
- Check file formats and sizes
- Sanitize metadata when necessary
- Implement rate limiting for batch operations

**Output Security**
- Remove sensitive metadata
- Validate output file integrity
- Implement access controls
- Log processing activities

This tutorial provides a comprehensive foundation for implementing robust image processing capabilities with proper error handling, performance optimization, and security considerations. 