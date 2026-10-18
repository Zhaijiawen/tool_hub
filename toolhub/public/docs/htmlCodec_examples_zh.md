# HTML 实体编解码 — 代码示例

## JavaScript: 浏览器内置的编解码

```javascript
// 编码：浏览器原生 API
function encodeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

encodeHtml('<script>alert("xss")</script>')
// "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
```

注意 `&` 必须第一个替换——否则前面替换产生的 `&lt;` 会被二次转义成 `&amp;lt;`。

```javascript
// 解码：利用浏览器解析
function decodeHtml(str) {
  const el = document.createElement('textarea')
  el.innerHTML = str
  return el.value
}

decodeHtml('&lt;b&gt;粗体&lt;/b&gt;')  // "<b>粗体</b>"
```

## Python: html 标准库

```python
import html

html.escape('<script>')          # '&lt;script&gt;'
html.unescape('&lt;b&gt;')       # '<b>'
```

## 在服务端模板里

```html
<!-- 错误：用户输入直接插入，XSS 漏洞 -->
<div>{{ user_input }}</div>

<!-- 正确：框架自动转义（Django/Jinja2/Vue 默认都开） -->
<div>{{ user_input }}</div>
```

现代模板引擎默认开启自动转义，手写拼接 HTML 才是重灾区。

## 记住

- 实体编码是显示层转义，不等于 XSS 防护完备方案
- `&` 永远第一个编码，否则双重转义
- 生产环境防 XSS 用 DOMPurify 这类审计过的库
