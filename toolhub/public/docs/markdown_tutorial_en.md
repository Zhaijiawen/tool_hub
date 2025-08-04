# Markdown Usage Tutorial

## Introduction

This tutorial provides comprehensive guidance for implementing and using Markdown processing capabilities. It covers practical examples, best practices, syntax usage, and performance optimization for various use cases.

## Basic Markdown Processing

### Understanding Syntax

**Core Elements**
- **Headers**: `#` to `######` for different levels
- **Emphasis**: `*italic*`, `**bold**`, `~~strikethrough~~`
- **Lists**: `-` or `*` for unordered, `1.` for ordered
- **Links**: `[text](url)` for hyperlinks
- **Code**: `` `inline` `` or fenced blocks

**Syntax Guidelines**
```
Header Hierarchy:
- Use H1 (#) sparingly, typically once per document
- Use H2 (##) for major sections
- Use H3-H6 (###-######) for subsections
- Maintain logical hierarchy
```

### Basic Implementation

**Simple Markdown Processing**
```javascript
// Using marked.js library
function processMarkdown(markdownText) {
    const marked = require('marked');
    
    // Configure options
    marked.setOptions({
        breaks: true,
        gfm: true,
        sanitize: false
    });
    
    return marked(markdownText);
}

// Usage
const html = processMarkdown('# Hello World\nThis is **bold** text.');
```

**Python Implementation**
```python
import markdown

def process_markdown(text, extensions=None):
    """Process Markdown text to HTML"""
    if extensions is None:
        extensions = ['extra', 'codehilite', 'tables']
    
    md = markdown.Markdown(extensions=extensions)
    return md.convert(text)

# Usage
html = process_markdown("# Hello World\nThis is **bold** text.")
```

## Advanced Markdown Features

### Custom Extensions

**Custom Renderer**
```javascript
const marked = require('marked');

// Custom renderer for specific elements
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

**Python Custom Extensions**
```python
import markdown
from markdown.extensions import Extension

class CustomExtension(Extension):
    def extendMarkdown(self, md):
        # Add custom processing
        md.registerExtension(self)
        
        # Custom pattern for special syntax
        pattern = r'\[custom\](.*?)\[/custom\]'
        md.inlinePatterns.register(
            markdown.inlinepatterns.SimpleTextInlineProcessor(pattern),
            'custom',
            175
        )

# Usage
md = markdown.Markdown(extensions=[CustomExtension()])
html = md.convert('[custom]Special text[/custom]')
```

### Syntax Highlighting

**JavaScript Implementation**
```javascript
const hljs = require('highlight.js');
const marked = require('marked');

// Configure syntax highlighting
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
        
        # Register custom pattern
        pattern = r'```(\w+)?\n(.*?)\n```'
        md.inlinePatterns.register(
            markdown.inlinepatterns.SimpleTextInlineProcessor(pattern),
            'codehilite',
            175
        )
```

## Content Processing

### Input Validation

**Data Validation**
```javascript
function validateMarkdown(input) {
    if (!input || typeof input !== 'string') {
        throw new Error('Input must be a non-empty string');
    }
    
    // Check for potentially dangerous content
    const dangerousPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi
    ];
    
    for (const pattern of dangerousPatterns) {
        if (pattern.test(input)) {
            throw new Error('Input contains potentially dangerous content');
        }
    }
    
    return true;
}

function safeProcessMarkdown(input) {
    try {
        validateMarkdown(input);
        return processMarkdown(input);
    } catch (error) {
        console.error('Markdown processing error:', error.message);
        return null;
    }
}
```

**Python Validation**
```python
import re
from typing import Optional

def validate_markdown(text: str) -> bool:
    """Validate Markdown input"""
    if not text or not isinstance(text, str):
        raise ValueError("Input must be a non-empty string")
    
    # Check for dangerous patterns
    dangerous_patterns = [
        r'<script\b[^<]*(?:(?!</script>)<[^<]*)*</script>',
        r'javascript:',
        r'on\w+\s*='
    ]
    
    for pattern in dangerous_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            raise ValueError("Input contains potentially dangerous content")
    
    return True

def safe_process_markdown(text: str) -> Optional[str]:
    """Safely process Markdown with validation"""
    try:
        validate_markdown(text)
        return process_markdown(text)
    except Exception as e:
        print(f"Markdown processing error: {e}")
        return None
```

### Content Sanitization

**HTML Sanitization**
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

**Python Sanitization**
```python
from bs4 import BeautifulSoup
import bleach

def sanitize_html(html: str) -> str:
    """Sanitize HTML output"""
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
    """Process Markdown and sanitize HTML"""
    html = process_markdown(markdown_text)
    return sanitize_html(html)
```

## Performance Optimization

### Caching Strategies

**Result Caching**
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

// Usage
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

**Python Caching**
```python
import hashlib
import json
from functools import lru_cache

class MarkdownCache:
    def __init__(self):
        self.cache = {}
    
    def get_cache_key(self, text: str, options: dict = None) -> str:
        """Generate cache key from text and options"""
        if options is None:
            options = {}
        content = json.dumps({'text': text, 'options': options}, sort_keys=True)
        return hashlib.md5(content.encode()).hexdigest()
    
    def get(self, text: str, options: dict = None):
        """Get cached result"""
        key = self.get_cache_key(text, options)
        return self.cache.get(key)
    
    def set(self, text: str, result: str, options: dict = None):
        """Cache result"""
        key = self.get_cache_key(text, options)
        self.cache[key] = result
        return key

# Using decorator for simple caching
@lru_cache(maxsize=1000)
def cached_process_markdown(text: str) -> str:
    return process_markdown(text)
```

### Batch Processing

**JavaScript Batch Processing**
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

// Parallel processing
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

**Python Batch Processing**
```python
import asyncio
from concurrent.futures import ThreadPoolExecutor
from typing import List, Dict

def batch_process_markdown(documents: List[Dict]) -> List[Dict]:
    """Process multiple Markdown documents"""
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
    """Process documents in parallel"""
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

## Error Handling

### Graceful Error Recovery

**JavaScript Error Handling**
```javascript
function robustMarkdownProcessing(input, options = {}) {
    try {
        // Validate input
        if (!input || typeof input !== 'string') {
            throw new Error('Invalid input: must be non-empty string');
        }
        
        // Process with fallback options
        const defaultOptions = {
            breaks: true,
            gfm: true,
            sanitize: true,
            ...options
        };
        
        const result = processMarkdown(input, defaultOptions);
        
        // Validate output
        if (!result || typeof result !== 'string') {
            throw new Error('Processing failed: invalid output');
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
            html: `<p>Error processing content: ${error.message}</p>`
        };
    }
}
```

**Python Error Handling**
```python
from typing import Dict, Any, Optional

def robust_markdown_processing(text: str, options: Dict[str, Any] = None) -> Dict[str, Any]:
    """Robust Markdown processing with error handling"""
    try:
        # Validate input
        if not text or not isinstance(text, str):
            raise ValueError("Invalid input: must be non-empty string")
        
        # Set default options
        default_options = {
            'extensions': ['extra', 'codehilite'],
            'output_format': 'html5',
            'safe_mode': 'escape'
        }
        if options:
            default_options.update(options)
        
        # Process Markdown
        result = process_markdown(text, default_options)
        
        # Validate output
        if not result or not isinstance(result, str):
            raise ValueError("Processing failed: invalid output")
        
        return {
            'success': True,
            'html': result,
            'warnings': []
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'html': f'<p>Error processing content: {str(e)}</p>'
        }
```

## Best Practices

### Code Organization

**Modular Structure**
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

// Usage
const processor = new MarkdownProcessor({ gfm: true });
const result = processor.process('# Hello World');
```

**Python Class Structure**
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
        """Setup custom extensions"""
        self.extensions = self.options['extensions']
        if 'custom' not in self.extensions:
            self.extensions.append(CustomExtension())
    
    def process(self, text: str) -> Dict[str, Any]:
        """Process single Markdown text"""
        return robust_markdown_processing(text, self.options)
    
    def batch_process(self, documents: List[Dict]) -> List[Dict]:
        """Process multiple documents"""
        return batch_process_markdown(documents)
    
    def get_cached(self, text: str) -> Optional[str]:
        """Get cached result"""
        return self.cache.get(text, self.options)

# Usage
processor = MarkdownProcessor({'extensions': ['extra', 'tables']})
result = processor.process('# Hello World')
```

This tutorial provides comprehensive guidance for implementing robust Markdown processing with proper error handling, performance optimization, and best practices for various use cases. 