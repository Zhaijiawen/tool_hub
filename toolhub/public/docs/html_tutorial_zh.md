# HTML — 使用格式化工具

左边粘贴乱掉的 HTML，右边出整齐缩进的输出。工具边输入边验证标记。

格式化前：

```html
<!DOCTYPE html><html><head><title>我的页面</title></head><body><h1>欢迎</h1><p>这是一个包含 <strong>粗体文本</strong> 的段落。</p><ul><li>项目 1</li><li>项目 2</li></ul></body></html>
```

格式化后：

```html
<!DOCTYPE html>
<html>
  <head>
    <title>我的页面</title>
  </head>
  <body>
    <h1>欢迎</h1>
    <p>这是一个包含 <strong>粗体文本</strong> 的段落。</p>
    <ul>
      <li>项目 1</li>
      <li>项目 2</li>
    </ul>
  </body>
</html>
```

## 常见错误

**没闭合的标签** — 格式化工具会抓到缺失的 `</p>`、`</div>` 等。

**缺失 DOCTYPE** — HTML5 文件顶部必须有 `<!DOCTYPE html>`。

**无效属性** — `alt` 必须有值才能通过验证。

## 语义化结构

用语义化标记组织文档：

```html
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>页面标题</title>
  </head>
  <body>
    <header>
      <h1>网站名称</h1>
      <nav>
        <ul>
          <li><a href="/">首页</a></li>
          <li><a href="/about">关于</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <article>
        <h2>文章标题</h2>
        <p>内容...</p>
      </article>

      <aside>
        <h3>相关信息</h3>
        <p>侧边栏内容...</p>
      </aside>
    </main>

    <footer>
      <p>&copy; 2024</p>
    </footer>
  </body>
</html>
```

## 表单

```html
<form action="/submit" method="post">
  <fieldset>
    <legend>联系信息</legend>

    <div class="form-group">
      <label for="name">姓名：</label>
      <input type="text" id="name" name="name" required>
    </div>

    <div class="form-group">
      <label for="email">邮箱：</label>
      <input type="email" id="email" name="email" required>
    </div>

    <button type="submit">提交</button>
  </fieldset>
</form>
```

## Meta 标签

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="页面描述">
  <title>页面标题</title>
  <meta property="og:title" content="页面标题">
  <meta property="og:image" content="https://example.com/image.jpg">
</head>
```
