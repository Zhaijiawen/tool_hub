# Markdown使用教程

## 简介

本教程提供了实施和使用Markdown处理功能的全面指导。它涵盖了各种用例的实用示例、最佳实践、语法使用和性能优化。

## 基础Markdown处理

### 理解语法

**核心元素**
- **标题**：`#` 到 `######` 用于不同级别
- **强调**：`*斜体*`、`**粗体**`、`~~删除线~~`
- **列表**：`-` 或 `*` 用于无序，`1.` 用于有序
- **链接**：`[文本](url)` 用于超链接
- **代码**：`` `行内` `` 或围栏代码块

**语法指南**
```
标题层次：
- 谨慎使用H1 (#)，通常每个文档一次
- 使用H2 (##) 用于主要章节
- 使用H3-H6 (###-######) 用于子章节
- 保持逻辑层次
```

### 基础实现

**简单Markdown处理**
```javascript
// 使用marked.js库
function processMarkdown(markdownText) {
    const marked = require('marked');
    
    // 配置选项
    marked.setOptions({
        breaks: true,
        gfm: true,
        sanitize: false
    });
    
    return marked(markdownText);
}

// 使用
const html = processMarkdown('# Hello World\n这是**粗体**文本。');
```

**Python实现**
```python
import markdown

def process_markdown(text, extensions=None):
    """处理Markdown文本到HTML"""
    if extensions is None:
        extensions = ['extra', 'codehilite', 'tables']
    
    md = markdown.Markdown(extensions=extensions)
    return md.convert(text)

# 使用
html = process_markdown("# Hello World\n这是**粗体**文本。")
```

## 高级Markdown功能

### 自定义扩展

**自定义渲染器**
```javascript
const marked = require('marked');

// 特定元素的自定义渲染器
const renderer = new marked.Renderer();

renderer.heading = function(text, level) {
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
    return `<h${level} id="${escapedText}">${text}</h${level}>`;
};

renderer.link = function(href, title, text) {
    return `<a href="${href}" title="${title}" target="_blank" rel="noopener">${text}</a>`;
};

marked.setOptions({ renderer });
```

**Python自定义扩展**
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

### 语法高亮

**JavaScript实现**
```javascript
const hljs = require('highlight.js');
const marked = require('marked');

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
```

**Python with Pygments**
```python
import markdown
from pygments import highlight
from pygments.lexers import get_lexer_by_name
from pygments.formatters import HtmlFormatter

class CodeHiliteExtension(markdown.Extension):
    def extendMarkdown(self, md):
        md.registerExtension(self)
        
        def highlight_code(match):
            lang = match.group(1)
            code = match.group(2)
            
            if lang:
                lexer = get_lexer_by_name(lang)
                formatter = HtmlFormatter()
                return highlight(code, lexer, formatter)
            return f'<pre><code>{code}</code></pre>'
        
        # 注册自定义模式
        pattern = r'```(\w+)?\n(.*?)\n```'
        md.inlinePatterns.register(
            markdown.inlinepatterns.SimpleTextInlineProcessor(pattern),
            'codehilite',
            175
        )
```

## 内容处理

### 输入验证

**数据验证**
```javascript
function validateMarkdown(input) {
    if (!input || typeof input !== 'string') {
        throw new Error('输入必须是非空字符串');
    }
    
    // 检查潜在危险内容
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
        return processMarkdown(input);
    } catch (error) {
        console.error('Markdown处理错误:', error.message);
        return null;
    }
}
```

**Python验证**
```python
import re
from typing import Optional

def validate_markdown(text: str) -> bool:
    """验证Markdown输入"""
    if not text or not isinstance(text, str):
        raise ValueError("输入必须是非空字符串")
    
    # 检查危险模式
    dangerous_patterns = [
        r'<script\b[^<]*(?:(?!</script>)<[^<]*)*</script>',
        r'javascript:',
        r'on\w+\s*='
    ]
    
    for pattern in dangerous_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            raise ValueError("输入包含潜在危险内容")
    
    return True

def safe_process_markdown(text: str) -> Optional[str]:
    """安全处理带验证的Markdown"""
    try:
        validate_markdown(text)
        return process_markdown(text)
    except Exception as e:
        print(f"Markdown处理错误: {e}")
        return None
```

### 内容清理

**HTML清理**
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
    const html = processMarkdown(markdownText);
    return sanitizeHtml(html);
}
```

**Python清理**
```python
from bs4 import BeautifulSoup
import bleach

def sanitize_html(html: str) -> str:
    """清理HTML输出"""
    allowed_tags = [
        'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'strong', 'em', 'code', 'pre', 'ul', 'ol', 'li',
        'a', 'img', 'blockquote', 'hr'
    ]
    
    allowed_attrs = {
        'a': ['href', 'title'],
        'img': ['src', 'alt', 'title']
    }
    
    return bleach.clean(
        html,
        tags=allowed_tags,
        attributes=allowed_attrs,
        strip=True
    )

def process_and_sanitize(markdown_text: str) -> str:
    """处理Markdown并清理HTML"""
    html = process_markdown(markdown_text)
    return sanitize_html(html)
```

## 性能优化

### 缓存策略

**结果缓存**
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
    
    clear() {
        this.cache.clear();
    }
}

// 使用
const cache = new MarkdownCache();
const cached = cache.get(markdownText);
if (cached) {
    return cached;
} else {
    const result = processMarkdown(markdownText);
    cache.set(markdownText, result);
    return result;
}
```

**Python缓存**
```python
import hashlib
import json
from functools import lru_cache

class MarkdownCache:
    def __init__(self):
        self.cache = {}
    
    def get_cache_key(self, text: str, options: dict = None) -> str:
        """从文本和选项生成缓存键"""
        if options is None:
            options = {}
        content = json.dumps({'text': text, 'options': options}, sort_keys=True)
        return hashlib.md5(content.encode()).hexdigest()
    
    def get(self, text: str, options: dict = None):
        """获取缓存结果"""
        key = self.get_cache_key(text, options)
        return self.cache.get(key)
    
    def set(self, text: str, result: str, options: dict = None):
        """缓存结果"""
        key = self.get_cache_key(text, options)
        self.cache[key] = result
        return key

# 使用装饰器进行简单缓存
@lru_cache(maxsize=1000)
def cached_process_markdown(text: str) -> str:
    return process_markdown(text)
```

### 批处理

**JavaScript批处理**
```javascript
async function batchProcessMarkdown(documents) {
    const results = [];
    
    for (const doc of documents) {
        try {
            const html = await processMarkdown(doc.content);
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

// 并行处理
async function parallelBatchProcess(documents, concurrency = 4) {
    const chunks = [];
    for (let i = 0; i < documents.length; i += concurrency) {
        chunks.push(documents.slice(i, i + concurrency));
    }
    
    const results = [];
    for (const chunk of chunks) {
        const chunkResults = await Promise.all(
            chunk.map(doc => processMarkdown(doc.content))
        );
        results.push(...chunkResults);
    }
    
    return results;
}
```

**Python批处理**
```python
import asyncio
from concurrent.futures import ThreadPoolExecutor
from typing import List, Dict

def batch_process_markdown(documents: List[Dict]) -> List[Dict]:
    """处理多个Markdown文档"""
    results = []
    
    for doc in documents:
        try:
            html = process_markdown(doc['content'])
            results.append({
                'id': doc['id'],
                'html': html,
                'success': True
            })
        except Exception as e:
            results.append({
                'id': doc['id'],
                'error': str(e),
                'success': False
            })
    
    return results

def parallel_batch_process(documents: List[Dict], max_workers: int = 4) -> List[Dict]:
    """并行处理文档"""
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [
            executor.submit(process_markdown, doc['content'])
            for doc in documents
        ]
        
        results = []
        for i, future in enumerate(futures):
            try:
                html = future.result()
                results.append({
                    'id': documents[i]['id'],
                    'html': html,
                    'success': True
                })
            except Exception as e:
                results.append({
                    'id': documents[i]['id'],
                    'error': str(e),
                    'success': False
                })
    
    return results
```

## 错误处理

### 优雅错误恢复

**JavaScript错误处理**
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
        
        const result = processMarkdown(input, defaultOptions);
        
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

**Python错误处理**
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
        result = process_markdown(text, default_options)
        
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

## 最佳实践

### 代码组织

**模块化结构**
```javascript
// markdown-processor.js
class MarkdownProcessor {
    constructor(options = {}) {
        this.options = {
            breaks: true,
            gfm: true,
            sanitize: true,
            ...options
        };
        this.cache = new MarkdownCache();
        this.setupRenderer();
    }
    
    setupRenderer() {
        this.renderer = new marked.Renderer();
        this.renderer.heading = this.customHeading.bind(this);
        this.renderer.link = this.customLink.bind(this);
        marked.setOptions({ renderer: this.renderer });
    }
    
    customHeading(text, level) {
        const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
        return `<h${level} id="${escapedText}">${text}</h${level}>`;
    }
    
    customLink(href, title, text) {
        return `<a href="${href}" title="${title}" target="_blank" rel="noopener">${text}</a>`;
    }
    
    process(input) {
        return robustMarkdownProcessing(input, this.options);
    }
    
    batchProcess(documents) {
        return batchProcessMarkdown(documents);
    }
}

// 使用
const processor = new MarkdownProcessor({ gfm: true });
const result = processor.process('# Hello World');
```

**Python类结构**
```python
class MarkdownProcessor:
    def __init__(self, options: Dict[str, Any] = None):
        self.options = {
            'extensions': ['extra', 'codehilite'],
            'output_format': 'html5',
            'safe_mode': 'escape'
        }
        if options:
            self.options.update(options)
        
        self.cache = MarkdownCache()
        self.setup_extensions()
    
    def setup_extensions(self):
        """设置自定义扩展"""
        self.extensions = self.options['extensions']
        if 'custom' not in self.extensions:
            self.extensions.append(CustomExtension())
    
    def process(self, text: str) -> Dict[str, Any]:
        """处理单个Markdown文本"""
        return robust_markdown_processing(text, self.options)
    
    def batch_process(self, documents: List[Dict]) -> List[Dict]:
        """处理多个文档"""
        return batch_process_markdown(documents)
    
    def get_cached(self, text: str) -> Optional[str]:
        """获取缓存结果"""
        return self.cache.get(text, self.options)

# 使用
processor = MarkdownProcessor({'extensions': ['extra', 'tables']})
result = processor.process('# Hello World')
```

本教程为实施具有适当错误处理、性能优化和最佳实践的强大Markdown处理功能提供了全面指导。 