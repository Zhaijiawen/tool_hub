# Markdown Examples

## Basic Examples

### Simple Text Processing
```javascript
// Basic Markdown to HTML conversion
const marked = require('marked');

const markdownText = `
# Hello World
This is **bold** and *italic* text.

- List item 1
- List item 2

[Link](https://example.com)
`;

const html = marked(markdownText);
console.log(html);
```

### Python Basic Processing
```python
import markdown

# Basic Markdown to HTML conversion
markdown_text = """
# Hello World
This is **bold** and *italic* text.

- List item 1
- List item 2

[Link](https://example.com)
"""

html = markdown.markdown(markdown_text)
print(html)
```

## Advanced Examples

### Custom Renderer
```javascript
const marked = require('marked');

// Custom renderer for headings with IDs
const renderer = new marked.Renderer();

renderer.heading = function(text, level) {
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
    return `<h${level} id="${escapedText}">${text}</h${level}>`;
};

renderer.link = function(href, title, text) {
    return `<a href="${href}" title="${title}" target="_blank" rel="noopener">${text}</a>`;
};

marked.setOptions({ renderer });

const html = marked('# My Heading\n[Link](https://example.com)');
```

### Syntax Highlighting
```javascript
const marked = require('marked');
const hljs = require('highlight.js');

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

const codeBlock = `
\`\`\`javascript
function hello() {
    console.log("Hello, World!");
}
\`\`\`
`;

const html = marked(codeBlock);
```

### Python with Extensions
```python
import markdown

# Markdown with extensions
extensions = ['extra', 'codehilite', 'tables', 'toc']

md = markdown.Markdown(extensions=extensions)

text = """
# Table of Contents
[TOC]

## Code Example
```python
def hello():
    print("Hello, World!")
```

## Table
| Name | Age |
|------|-----|
| John | 25  |
| Jane | 30  |
"""

html = md.convert(text)
```

## Content Processing Examples

### Input Validation
```javascript
function validateMarkdown(input) {
    if (!input || typeof input !== 'string') {
        throw new Error('Input must be a non-empty string');
    }
    
    // Check for dangerous patterns
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
        return marked(input);
    } catch (error) {
        console.error('Markdown processing error:', error.message);
        return null;
    }
}
```

### HTML Sanitization
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

## Performance Examples

### Caching Implementation
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

// Usage
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

### Batch Processing
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

// Usage
const documents = [
    { id: 1, content: '# Document 1' },
    { id: 2, content: '# Document 2' },
    { id: 3, content: '# Document 3' }
];

const results = await batchProcessMarkdown(documents);
```

## Error Handling Examples

### Robust Processing
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
        
        const result = marked(input, defaultOptions);
        
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

### Python Error Handling
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
        md = markdown.Markdown(**default_options)
        result = md.convert(text)
        
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

## Custom Extensions

### JavaScript Custom Extension
```javascript
// Custom extension for special syntax
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

// Register custom extension
marked.use({ extensions: [createCustomExtension()] });

const html = marked('[custom]Special text[/custom]');
```

### Python Custom Extension
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

## Integration Examples

### Express.js Integration
```javascript
const express = require('express');
const marked = require('marked');
const app = express();

app.post('/convert', (req, res) => {
    try {
        const { markdown } = req.body;
        
        if (!markdown) {
            return res.status(400).json({ error: 'Markdown content required' });
        }
        
        const html = marked(markdown);
        res.json({ html });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

### Flask Integration
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
            return jsonify({'error': 'Markdown content required'}), 400
        
        html = markdown.markdown(markdown_text)
        return jsonify({'html': html})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
```

These examples demonstrate various ways to process Markdown with different features, error handling, and performance optimizations. 