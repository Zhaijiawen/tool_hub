// 代码示例数据 - 避免i18n转义问题
export const examples = {
  base64: `// 原文本
Hello World!

// Base64编码
SGVsbG8gV29ybGQh`,
  
  aes: `密钥长度: 128/192/256位
模式: CBC, ECB, CFB, OFB
填充: PKCS7, NoPadding`,
  
  hex: `文本: Hello
十六进制: 48656c6c6f
颜色: #FF6B6B`,
  
  rsa: `密钥长度: 1024/2048/4096位
填充方式: PKCS1, OAEP
用途: 加密小数据, 数字签名`,
  
  sha: `SHA-256: 
e3b0c44298fc1c149afbf4c8996fb924
27ae41e4649b934ca495991b7852b855

用途: 密码存储, 文件校验`,
  
  jwt: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6
IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
  
  timestamp: `当前时间戳: 1702889856
毫秒时间戳: 1702889856789
日期格式: 2023/12/18 15:10:56`,
  
  color: `HEX: #FF6B6B
RGB: rgb(255, 107, 107)
HSL: hsl(0, 100%, 71%)`,
  
  regex: `邮箱: ^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$
手机: ^1[3-9]\\d{9}$
URL: https?://[\\w.-]+`,
  
  number: `十进制: 255
二进制: 11111111
八进制: 377
十六进制: FF`,
  
  unit: `1米 = 100厘米 = 1000毫米
1公斤 = 1000克 = 2.205磅
1平方米 = 10.764平方英尺`,
  
  textCase: `原文本: hello world
大写: HELLO WORLD
小写: hello world
驼峰: helloWorld`,
  
  textReplace: `查找: \\d{4}-\\d{2}-\\d{2}
替换: $1年$2月$3日
结果: 2024-01-15 → 2024年01月15日`,
  
  imageConvert: `支持格式:
JPG ↔ PNG ↔ WebP
GIF ↔ BMP ↔ SVG
质量调节: 1-100%`,
  
  imageCrop: `常用比例:
1:1 (正方形)
4:3 (标准)
16:9 (宽屏)
自定义尺寸`,
  
  qrcode: `文本: Hello World
网址: https://toolhub.com
WiFi: WIFI:T:WPA;S:MyNetwork;P:password;;`,
  
  calculator: `基础运算: +, -, ×, ÷
科学计算: sin, cos, log, √
常数: π, e
进制转换: 2, 8, 10, 16`,
  
  iptools: `IPv4: 192.168.1.1
IPv6: 2001:db8::1
子网: 192.168.1.0/24
域名解析: example.com`,
  
  shorturl: `长链接:
https://example.com/very/long/path?param=value

短链接:
https://short.ly/abc123`,
  
  json: `{
  "name": "ToolHub",
  "version": "1.0.0",
  "features": ["format", "encrypt"]
}`,
  
  xml: `<?xml version="1.0" encoding="UTF-8"?>
<config>
  <database>
    <host>localhost</host>
    <port>3306</port>
  </database>
</config>`,
  
  css: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
}`,
  
  html: `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <title>ToolHub</title>
</head>`,
  
  js: `const formatCode = (code) => {
  return prettier.format(code, {
    parser: 'babel',
    singleQuote: true
  });
};`,
  
  yaml: `name: ToolHub
version: 1.0.0
dependencies:
  - vue: ^3.0.0
  - naive-ui: ^2.0.0`,
  
  sql: `SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id
ORDER BY order_count DESC;`,
  
  vue: `// Vue组件结构
template: 容器和标题
script: 响应式数据绑定
style: 作用域CSS样式`,
  
  php: `namespace App\\Services;

class ToolService {
    public function format(string $code): string {
        return trim($code);
    }
}`,
  
  ruby: `class ToolFormatter
  def self.beautify(code)
    code.split("\\n")
        .map(&:strip)
        .join("\\n")
  end
end`,
  
  shell: `#!/bin/bash
format_code() {
    local file="$1"
    prettier --write "$file"
    echo "Formatted: $file"
}

format_code "app.js"`,
  
  markdown: `# ToolHub
## 功能特色
- **格式化工具**：代码美化
- **加密工具**：数据安全
- **转换工具**：格式转换

\`\`\`javascript
console.log('Hello ToolHub');
\`\`\``,
  
  java: `public class ToolFormatter {
    public static String format(String code) {
        return code.trim()
                   .replaceAll("\\\\s+", " ");
    }
    
    public static void main(String[] args) {
        System.out.println("ToolHub");
    }
}`,
  
  rotate: `旋转角度: 90°, 180°, 270°
自动调整: 保持宽高比
批量处理: 支持多张图片
预览功能: 实时查看效果`,
  
  watermark: `文字水印: ToolHub Studio
位置选择: 左上、右上、左下、右下、中心
透明度: 10%-100%可调
字体样式: 大小、颜色、字体`,
  
  reverse: `字符反转: Hello → olleH
单词反转: Hello World → World Hello
行反转: 多行文本行序颠倒
保留格式: 空格和换行符`,
  
  whitespace: `去除首尾: "  text  " → "text"
压缩空白: "a   b" → "a b"
保留换行: 多行文本处理
批量处理: 支持大量文本`
}

// 英文版本
export const examplesEn = {
  base64: `// Original text
Hello World!

// Base64 encoded
SGVsbG8gV29ybGQh`,
  
  aes: `Key length: 128/192/256 bits
Mode: CBC, ECB, CFB, OFB
Padding: PKCS7, NoPadding`,
  
  hex: `Text: Hello
Hex: 48656c6c6f
Color: #FF6B6B`,
  
  rsa: `Key length: 1024/2048/4096 bits
Padding: PKCS1, OAEP
Usage: Encrypt small data, digital signature`,
  
  sha: `SHA-256: 
e3b0c44298fc1c149afbf4c8996fb924
27ae41e4649b934ca495991b7852b855

Usage: Password storage, file verification`,
  
  jwt: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6
IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
  
  timestamp: `Current timestamp: 1702889856
Millisecond timestamp: 1702889856789
Date format: 2023/12/18 15:10:56`,
  
  color: `HEX: #FF6B6B
RGB: rgb(255, 107, 107)
HSL: hsl(0, 100%, 71%)`,
  
  regex: `Email: ^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$
Phone: ^1[3-9]\\d{9}$
URL: https?://[\\w.-]+`,
  
  number: `Decimal: 255
Binary: 11111111
Octal: 377
Hexadecimal: FF`,
  
  unit: `1 meter = 100 centimeters = 1000 millimeters
1 kilogram = 1000 grams = 2.205 pounds
1 square meter = 10.764 square feet`,
  
  textCase: `Original: hello world
UPPERCASE: HELLO WORLD
lowercase: hello world
camelCase: helloWorld`,
  
  textReplace: `Find: \\d{4}-\\d{2}-\\d{2}
Replace: $1年$2月$3日
Result: 2024-01-15 → 2024年01月15日`,
  
  imageConvert: `Supported formats:
JPG ↔ PNG ↔ WebP
GIF ↔ BMP ↔ SVG
Quality adjustment: 1-100%`,
  
  imageCrop: `Common ratios:
1:1 (Square)
4:3 (Standard)
16:9 (Widescreen)
Custom size`,
  
  qrcode: `Text: Hello World
URL: https://toolhub.com
WiFi: WIFI:T:WPA;S:MyNetwork;P:password;;`,
  
  calculator: `Basic operations: +, -, ×, ÷
Scientific: sin, cos, log, √
Constants: π, e
Base conversion: 2, 8, 10, 16`,
  
  iptools: `IPv4: 192.168.1.1
IPv6: 2001:db8::1
Subnet: 192.168.1.0/24
Domain resolution: example.com`,
  
  shorturl: `Long URL:
https://example.com/very/long/path?param=value

Short URL:
https://short.ly/abc123`,
  
  json: `{
  "name": "ToolHub",
  "version": "1.0.0",
  "features": ["format", "encrypt"]
}`,
  
  xml: `<?xml version="1.0" encoding="UTF-8"?>
<config>
  <database>
    <host>localhost</host>
    <port>3306</port>
  </database>
</config>`,
  
  css: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
}`,
  
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ToolHub</title>
</head>`,
  
  js: `const formatCode = (code) => {
  return prettier.format(code, {
    parser: 'babel',
    singleQuote: true
  });
};`,
  
  yaml: `name: ToolHub
version: 1.0.0
dependencies:
  - vue: ^3.0.0
  - naive-ui: ^2.0.0`,
  
  sql: `SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id
ORDER BY order_count DESC;`,
  
  vue: `// Vue Component Structure
template: container with title
script: reactive data binding
style: scoped CSS styles`,
  
  php: `namespace App\\Services;

class ToolService {
    public function format(string $code): string {
        return trim($code);
    }
}`,
  
  ruby: `class ToolFormatter
  def self.beautify(code)
    code.split("\\n")
        .map(&:strip)
        .join("\\n")
  end
end`,
  
  shell: `#!/bin/bash
format_code() {
    local file="$1"
    prettier --write "$file"
    echo "Formatted: $file"
}

format_code "app.js"`,
  
  markdown: `# ToolHub
## Features
- **Format Tools**: Code beautification
- **Encrypt Tools**: Data security
- **Convert Tools**: Format conversion

\`\`\`javascript
console.log('Hello ToolHub');
\`\`\``,
  
  java: `public class ToolFormatter {
    public static String format(String code) {
        return code.trim()
                   .replaceAll("\\\\s+", " ");
    }
    
    public static void main(String[] args) {
        System.out.println("ToolHub");
    }
}`,
  
  rotate: `Rotation angles: 90°, 180°, 270°
Auto adjust: Maintain aspect ratio
Batch processing: Support multiple images
Preview: Real-time effect viewing`,
  
  watermark: `Text watermark: ToolHub Studio
Position: Top-left, Top-right, Bottom-left, Bottom-right, Center
Opacity: 10%-100% adjustable
Font style: Size, color, font family`,
  
  reverse: `Character reverse: Hello → olleH
Word reverse: Hello World → World Hello
Line reverse: Multi-line text line order reversal
Preserve format: Spaces and line breaks`,
  
  whitespace: `Trim ends: "  text  " → "text"
Compress whitespace: "a   b" → "a b"
Preserve line breaks: Multi-line text processing
Batch processing: Support large text volumes`
} 