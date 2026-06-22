# HTML — 幕后原理

HTML 是 Tim Berners-Lee 1991 年在 CERN 搞出来的。它是标记语言，不是编程语言——用来结构化内容，不做计算。HTML5（2014）是当前活标准，由 WHATWG 维护。

## DOM 树，不只是标签

浏览器把 HTML 解析成 DOM 树——页面在内存中的活体表示，JavaScript 可以随意修改它。写 `<div><p>hello</p></div>`，浏览器构建 `div` 为父节点、`p` 为子节点、文本为叶节点的树。CSS 和 JS 都在这棵树上操作，不是操作原始 HTML。

## 语义化 HTML

用描述内容*是什么*的元素，而不是描述它长啥样：

```html
<header>
  <nav>
    <ul>
      <li><a href="/">首页</a></li>
    </ul>
  </nav>
</header>
<main>
  <article>
    <h1>标题</h1>
    <p>内容...</p>
  </article>
</main>
<footer>
  <p>&copy; 2024</p>
</footer>
```

屏幕阅读器、搜索引擎、无障碍工具都理解这个结构。一堆 `<div>` 它们什么也看不懂。

## 表单

```html
<form action="/submit" method="post">
  <label for="name">姓名：</label>
  <input type="text" id="name" name="name" required>

  <label for="email">邮箱：</label>
  <input type="email" id="email" name="email" required>

  <label for="message">留言：</label>
  <textarea id="message" name="message" rows="4"></textarea>

  <button type="submit">提交</button>
</form>
```

`<label>` 一定要用 `for`/`id` 和 `<input>` 关联。屏幕阅读器依赖这个。HTML5 的输入类型（`email`、`url`、`tel`、`number`、`date`）自带浏览器端验证。

## 多媒体

```html
<video controls width="400">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  您的浏览器不支持视频。
</video>

<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
</audio>
```

多个 `<source>` 元素让浏览器自选支持的格式。

## Meta 和 SEO

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="页面描述">
  <title>页面标题</title>

  <meta property="og:title" content="页面标题">
  <meta property="og:description" content="页面描述">
  <meta property="og:image" content="https://example.com/image.jpg">
</head>
```

`viewport` meta 标签对移动端不可或缺。Open Graph 标签控制链接在社交媒体上的预览效果。

## 无障碍基础

- 每个 `<img>` 必须有 `alt` 属性（纯装饰图片用空 `alt=""`）
- 标题层级按顺序用：`h1` 然后 `h2`，别跳到 `h4`
- `aria-label` 和 `aria-describedby` 在可见文字不够用的时候补位
- `<button>` 做操作，`<a>` 做导航——别混着用
