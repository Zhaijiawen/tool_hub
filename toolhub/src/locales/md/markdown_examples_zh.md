# Markdown示例

## 基础示例

### 简单文本处理
```javascript
// 基础Markdown到HTML转换
const marked = require('marked');

const markdownText = `
# Hello World
这是**粗体**和*斜体*文本。

- 列表项1
- 列表项2

[链接](https://example.com)
`;

const html = marked(markdownText);
console.log(html);
```

### Python基础处理
```python
import markdown

# 基础Markdown到HTML转换
markdown_text = """
# Hello World
这是**粗体**和*斜体*文本。

- 列表项1
- 列表项2

[链接](https://example.com)
"""

html = markdown.markdown(markdown_text)
print(html)
```

## 高级示例

### 自定义渲染器
```javascript
const marked = require('marked');

// 带ID的自定义标题渲染器
const renderer = new marked.Renderer();

renderer.heading = function(text, level) {
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
    return `<h${level} id="${escapedText}">${text}</h${level}>`;
};

renderer.link = function(href, title, text) {
    return `<a href="${href}" title="${title}" target="_blank" rel="noopener">${text}</a>`;
};

marked.setOptions({ renderer });

const html = marked('# 我的标题\n[链接](https://example.com)');
```

### 语法高亮
```javascript
const marked = require('marked');
const hljs = require('highlight.js');

// 配置语法高亮
marked.setOptions({
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(code, { language: lang }).value;
            } catch (err) {}
        }
        return hljs.highlightAuto(code).value;
    }
});

const codeBlock = `
\`\`\`javascript
function hello() {
    console.log("Hello, World!");
}
\`\`\`
`;

const html = marked(codeBlock);
```

### Python扩展
```python
import markdown

# 带扩展的Markdown
extensions = ['extra', 'codehilite', 'tables', 'toc']

md = markdown.Markdown(extensions=extensions)

text = """
# 目录
[TOC]

## 代码示例
```python
def hello():
    print("Hello, World!")
```

## 表格
| 姓名 | 年龄 |
|------|------|
| 张三 | 25   |
| 李四 | 30   |
"""

html = md.convert(text)
```

## 内容处理示例

### 输入验证
```javascript
function validateMarkdown(input) {
    if (!input || typeof input !== 'string') {
        throw new Error('输入必须是非空字符串');
    }
    
    // 检查危险模式
    const dangerousPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi
    ];
    
    for (const pattern of dangerousPatterns) {
        if (pattern.test(input)) {
            throw new Error('输入包含潜在危险内容');
        }
    }
    
    return true;
}

function safeProcessMarkdown(input) {
    try {
        validateMarkdown(input);
        return marked(input);
    } catch (error) {
        console.error('Markdown处理错误:', error.message);
        return null;
    }
}
```

### HTML清理
```javascript
const DOMPurify = require('dompurify');

function sanitizeHtml(html) {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'code', 'pre', 'ul', 'ol', 'li', 'a', 'img'],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title'],
        ALLOW_DATA_ATTR: false
    });
}

function processAndSanitize(markdownText) {
    const html = marked(markdownText);
    return sanitizeHtml(html);
}
```

## 性能示例

### 缓存实现
```javascript
const crypto = require('crypto');

class MarkdownCache {
    constructor() {
        this.cache = new Map();
    }
    
    getCacheKey(input, options = {}) {
        const content = JSON.stringify({ input, options });
        return crypto.createHash('md5').update(content).digest('hex');
    }
    
    get(input, options = {}) {
        const key = this.getCacheKey(input, options);
        return this.cache.get(key);
    }
    
    set(input, result, options = {}) {
        const key = this.getCacheKey(input, options);
        this.cache.set(key, result);
        return key;
    }
}

// 使用
const cache = new MarkdownCache();
const cached = cache.get(markdownText);
if (cached) {
    return cached;
} else {
    const result = marked(markdownText);
    cache.set(markdownText, result);
    return result;
}
```

### 批处理
```javascript
async function batchProcessMarkdown(documents) {
    const results = [];
    
    for (const doc of documents) {
        try {
            const html = await marked(doc.content);
            results.push({
                id: doc.id,
                html: html,
                success: true
            });
        } catch (error) {
            results.push({
                id: doc.id,
                error: error.message,
                success: false
            });
        }
    }
    
    return results;
}

// 使用
const documents = [
    { id: 1, content: '# 文档1' },
    { id: 2, content: '# 文档2' },
    { id: 3, content: '# 文档3' }
];

const results = await batchProcessMarkdown(documents);
```

## 错误处理示例

### 强大处理
```javascript
function robustMarkdownProcessing(input, options = {}) {
    try {
        // 验证输入
        if (!input || typeof input !== 'string') {
            throw new Error('无效输入：必须是非空字符串');
        }
        
        // 使用回退选项处理
        const defaultOptions = {
            breaks: true,
            gfm: true,
            sanitize: true,
            ...options
        };
        
        const result = marked(input, defaultOptions);
        
        // 验证输出
        if (!result || typeof result !== 'string') {
            throw new Error('处理失败：无效输出');
        }
        
        return {
            success: true,
            html: result,
            warnings: []
        };
        
    } catch (error) {
        return {
            success: false,
            error: error.message,
            html: `<p>处理内容时出错：${error.message}</p>`
        };
    }
}
```

### Python错误处理
```python
from typing import Dict, Any, Optional

def robust_markdown_processing(text: str, options: Dict[str, Any] = None) -> Dict[str, Any]:
    """带错误处理的强大Markdown处理"""
    try:
        # 验证输入
        if not text or not isinstance(text, str):
            raise ValueError("无效输入：必须是非空字符串")
        
        # 设置默认选项
        default_options = {
            'extensions': ['extra', 'codehilite'],
            'output_format': 'html5',
            'safe_mode': 'escape'
        }
        if options:
            default_options.update(options)
        
        # 处理Markdown
        md = markdown.Markdown(**default_options)
        result = md.convert(text)
        
        # 验证输出
        if not result or not isinstance(result, str):
            raise ValueError("处理失败：无效输出")
        
        return {
            'success': True,
            'html': result,
            'warnings': []
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'html': f'<p>处理内容时出错：{str(e)}</p>'
        }
```

## 自定义扩展

### JavaScript自定义扩展
```javascript
// 特殊语法的自定义扩展
function createCustomExtension() {
    return {
        name: 'custom',
        level: 'inline',
        start: function(src) {
            return src.indexOf('[custom]');
        },
        tokenizer: function(src) {
            const match = src.match(/^\[custom\](.*?)\[\/custom\]/);
            if (match) {
                return {
                    type: 'custom',
                    raw: match[0],
                    text: match[1]
                };
            }
        },
        renderer: function(token) {
            return `<span class="custom">${token.text}</span>`;
        }
    };
}

// 注册自定义扩展
marked.use({ extensions: [createCustomExtension()] });

const html = marked('[custom]特殊文本[/custom]');
```

### Python自定义扩展
```python
import markdown
from markdown.extensions import Extension

class CustomExtension(Extension):
    def extendMarkdown(self, md):
        # 添加自定义处理
        md.registerExtension(self)
        
        # 特殊语法的自定义模式
        pattern = r'\[custom\](.*?)\[/custom\]'
        md.inlinePatterns.register(
            markdown.inlinepatterns.SimpleTextInlineProcessor(pattern),
            'custom',
            175
        )

# 使用
md = markdown.Markdown(extensions=[CustomExtension()])
html = md.convert('[custom]特殊文本[/custom]')
```

## 集成示例

### Express.js集成
```javascript
const express = require('express');
const marked = require('marked');
const app = express();

app.post('/convert', (req, res) => {
    try {
        const { markdown } = req.body;
        
        if (!markdown) {
            return res.status(400).json({ error: '需要Markdown内容' });
        }
        
        const html = marked(markdown);
        res.json({ html });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('服务器运行在端口3000');
});
```

### Flask集成
```python
from flask import Flask, request, jsonify
import markdown

app = Flask(__name__)

@app.route('/convert', methods=['POST'])
def convert_markdown():
    try:
        data = request.get_json()
        markdown_text = data.get('markdown')
        
        if not markdown_text:
            return jsonify({'error': '需要Markdown内容'}), 400
        
        html = markdown.markdown(markdown_text)
        return jsonify({'html': html})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
```

这些示例演示了处理Markdown的各种方法，包括不同功能、错误处理和性能优化。 