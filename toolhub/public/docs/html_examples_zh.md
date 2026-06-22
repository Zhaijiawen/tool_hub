# HTML — 代码示例

## 完整的 HTML5 文档

```html
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="一个示例 HTML5 页面">
    <title>示例 HTML5 页面</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <header>
      <h1>网站标题</h1>
      <nav>
        <ul>
          <li><a href="#home">首页</a></li>
          <li><a href="#about">关于</a></li>
          <li><a href="#contact">联系</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <section id="home">
        <h2>欢迎</h2>
        <p>欢迎来到我们的网站！</p>
      </section>
    </main>

    <footer>
      <p>&copy; 2024 网站。保留所有权利。</p>
    </footer>
  </body>
</html>
```

## 高级表单

```html
<form action="/submit" method="post" enctype="multipart/form-data">
  <fieldset>
    <legend>个人信息</legend>

    <div class="form-group">
      <label for="name">姓名：</label>
      <input type="text" id="name" name="name" required>
    </div>

    <div class="form-group">
      <label for="email">邮箱：</label>
      <input type="email" id="email" name="email" required>
    </div>

    <div class="form-group">
      <label for="birthdate">出生日期：</label>
      <input type="date" id="birthdate" name="birthdate">
    </div>

    <div class="form-group">
      <label for="gender">性别：</label>
      <select id="gender" name="gender">
        <option value="">请选择...</option>
        <option value="male">男</option>
        <option value="female">女</option>
        <option value="other">其他</option>
      </select>
    </div>

    <div class="form-group">
      <label>兴趣：</label>
      <div>
        <input type="checkbox" id="sports" name="interests" value="sports">
        <label for="sports">运动</label>
      </div>
      <div>
        <input type="checkbox" id="music" name="interests" value="music">
        <label for="music">音乐</label>
      </div>
    </div>

    <div class="form-group">
      <label for="file">上传文件：</label>
      <input type="file" id="file" name="file" accept=".pdf,.doc,.docx">
    </div>

    <div class="form-group">
      <label for="message">留言：</label>
      <textarea id="message" name="message" rows="4" placeholder="请输入留言"></textarea>
    </div>

    <button type="submit">提交</button>
    <button type="reset">重置</button>
  </fieldset>
</form>
```

## 表格

```html
<table>
  <caption>员工信息</caption>
  <thead>
    <tr>
      <th>ID</th>
      <th>姓名</th>
      <th>部门</th>
      <th>薪资</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>001</td>
      <td>张三</td>
      <td>工程部</td>
      <td>¥75,000</td>
    </tr>
    <tr>
      <td>002</td>
      <td>李四</td>
      <td>市场部</td>
      <td>¥65,000</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="3">员工总数：</td>
      <td>2</td>
    </tr>
  </tfoot>
</table>
```

## 文章布局

```html
<article>
  <header>
    <h1>文章标题</h1>
    <p class="author">作者：<a href="#author">张三</a></p>
    <time datetime="2024-01-15">2024年1月15日</time>
  </header>

  <section>
    <h2>引言</h2>
    <p>这是引言部分...</p>
  </section>

  <section>
    <h2>正文</h2>
    <p>正文内容...</p>

    <figure>
      <img src="image.jpg" alt="相关图片">
      <figcaption>图片说明</figcaption>
    </figure>

    <blockquote>
      <p>这是一段引用。</p>
      <cite>- 来源名称</cite>
    </blockquote>
  </section>

  <footer>
    <p>标签：<a href="#html">HTML</a>、<a href="#css">CSS</a></p>
  </footer>
</article>
```

## 交互元素

```html
<details>
  <summary>点击展开</summary>
  <p>默认隐藏的内容，点击后展开。</p>
</details>

<details open>
  <summary>这个区域默认展开</summary>
  <p>立即可见的内容。</p>
</details>

<progress id="progress" value="70" max="100">70%</progress>

<meter value="0.6" min="0" max="1" low="0.3" high="0.8">60%</meter>
```
