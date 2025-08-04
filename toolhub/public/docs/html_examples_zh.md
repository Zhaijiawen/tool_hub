# HTML 代码示例

## 基本 HTML 结构示例

### 简单 HTML 文档

```html
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的第一个网页</title>
  </head>
  <body>
    <h1>欢迎来到我的网站</h1>
    <p>这是我的第一个网页。</p>
  </body>
</html>
```

### 完整 HTML5 文档

```html
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="一个示例 HTML5 页面">
    <meta name="keywords" content="HTML, CSS, JavaScript">
    <meta name="author" content="张三">
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

## 文本和排版示例

### 标题和段落

```html
<h1>主标题（级别 1）</h1>
<h2>副标题（级别 2）</h2>
<h3>子副标题（级别 3）</h3>
<h4>级别 4 标题</h4>
<h5>级别 5 标题</h5>
<h6>级别 6 标题</h6>

<p>这是一个包含一些文本内容的常规段落。</p>
<p>另一个包含 <strong>粗体文本</strong> 和 <em>斜体文本</em> 的段落。</p>
<p>包含 <mark>高亮内容</mark> 和 <small>较小文本</small> 的文本。</p>
```

### 文本格式化

```html
<p>这是 <strong>粗体文本</strong>，这是 <em>斜体文本</em>。</p>
<p>这是 <mark>高亮文本</mark>，这是 <small>小文本</small>。</p>
<p>这是 <del>删除的文本</del>，这是 <ins>插入的文本</ins>。</p>
<p>这是 <sub>下标</sub>，这是 <sup>上标</sup>。</p>
<p>这是 <code>内联代码</code>，这是 <kbd>键盘输入</kbd>。</p>
<p>这是 <abbr title="超文本标记语言">HTML</abbr>。</p>
<p>这是 <cite>了不起的盖茨比</cite> 作者：F. Scott Fitzgerald。</p>
```

### 引用和代码

```html
<blockquote>
  <p>这是一个包含一些引用文本的引用块。</p>
  <cite>- 作者姓名</cite>
</blockquote>

<pre>
function greet() {
    console.log("Hello, World!");
}
</pre>

<code>console.log("Hello, World!");</code>
```

## 列表示例

### 无序列表

```html
<ul>
  <li>第一项</li>
  <li>第二项</li>
  <li>第三项</li>
</ul>

<ul>
  <li>水果
    <ul>
      <li>苹果</li>
      <li>香蕉</li>
      <li>橙子</li>
    </ul>
  </li>
  <li>蔬菜
    <ul>
      <li>胡萝卜</li>
      <li>西兰花</li>
      <li>菠菜</li>
    </ul>
  </li>
</ul>
```

### 有序列表

```html
<ol>
  <li>第一步</li>
  <li>第二步</li>
  <li>第三步</li>
</ol>

<ol type="A">
  <li>步骤 A</li>
  <li>步骤 B</li>
  <li>步骤 C</li>
</ol>

<ol start="5">
  <li>步骤 5</li>
  <li>步骤 6</li>
  <li>步骤 7</li>
</ol>
```

### 定义列表

```html
<dl>
  <dt>HTML</dt>
  <dd>超文本标记语言</dd>
  
  <dt>CSS</dt>
  <dd>层叠样式表</dd>
  
  <dt>JavaScript</dt>
  <dd>一种用于 Web 的编程语言</dd>
</dl>
```

## 链接示例

### 基本链接

```html
<!-- 外部链接 -->
<a href="https://example.com">访问示例网站</a>

<!-- 内部链接 -->
<a href="#section">转到章节</a>

<!-- 邮件链接 -->
<a href="mailto:user@example.com">给我们发送邮件</a>

<!-- 电话链接 -->
<a href="tel:+1234567890">联系我们</a>

<!-- 下载链接 -->
<a href="document.pdf" download>下载 PDF</a>
```

### 高级链接

```html
<!-- 带目标的链接 -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  在新标签页中打开
</a>

<!-- 带标题的链接 -->
<a href="https://example.com" title="访问我们的网站">
  示例网站
</a>

<!-- 带自定义样式的链接 -->
<a href="#section" class="button">点击我</a>

<!-- 图像链接 -->
<a href="https://example.com">
  <img src="logo.png" alt="示例标志">
</a>
```

### 导航菜单

```html
<nav>
  <ul>
    <li><a href="#home">首页</a></li>
    <li><a href="#about">关于</a></li>
    <li><a href="#services">服务</a></li>
    <li><a href="#contact">联系</a></li>
  </ul>
</nav>

<nav>
  <ul>
    <li><a href="#home">首页</a></li>
    <li>
      <a href="#products">产品</a>
      <ul>
        <li><a href="#software">软件</a></li>
        <li><a href="#hardware">硬件</a></li>
        <li><a href="#services">服务</a></li>
      </ul>
    </li>
    <li><a href="#about">关于</a></li>
  </ul>
</nav>
```

## 图像和媒体示例

### 基本图像

```html
<!-- 简单图像 -->
<img src="image.jpg" alt="图像描述">

<!-- 带尺寸的图像 -->
<img src="image.jpg" alt="描述" width="300" height="200">

<!-- 响应式图像 -->
<img src="image.jpg" alt="描述" style="max-width: 100%; height: auto;">

<!-- 带标题的图像 -->
<img src="image.jpg" alt="描述" title="图像标题">
```

### 高级图像

```html
<!-- 多源图像 -->
<picture>
  <source media="(min-width: 800px)" srcset="large.jpg">
  <source media="(min-width: 400px)" srcset="medium.jpg">
  <img src="small.jpg" alt="响应式图像">
</picture>

<!-- 带标题的图像 -->
<figure>
  <img src="image.jpg" alt="描述">
  <figcaption>这是图像标题</figcaption>
</figure>

<!-- 图像映射 -->
<img src="image.jpg" alt="图像映射" usemap="#imagemap">
<map name="imagemap">
  <area shape="rect" coords="0,0,100,100" href="#section1" alt="章节 1">
  <area shape="circle" coords="150,150,50" href="#section2" alt="章节 2">
</map>
```

### 视频示例

```html
<!-- 基本视频 -->
<video controls width="400" height="300">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  您的浏览器不支持视频。
</video>

<!-- 带海报的视频 -->
<video controls poster="poster.jpg" width="400" height="300">
  <source src="video.mp4" type="video/mp4">
  您的浏览器不支持视频。
</video>

<!-- 带字幕的视频 -->
<video controls width="400" height="300">
  <source src="video.mp4" type="video/mp4">
  <track kind="subtitles" src="subtitles.vtt" srclang="zh" label="中文">
  <track kind="subtitles" src="subtitles-en.vtt" srclang="en" label="English">
  您的浏览器不支持视频。
</video>
```

### 音频示例

```html
<!-- 基本音频 -->
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
  您的浏览器不支持音频。
</audio>

<!-- 带预加载的音频 -->
<audio controls preload="metadata">
  <source src="audio.mp3" type="audio/mpeg">
  您的浏览器不支持音频。
</audio>
```

## 表单示例

### 基本表单

```html
<form action="/submit" method="post">
  <label for="name">姓名：</label>
  <input type="text" id="name" name="name" required>
  
  <label for="email">邮箱：</label>
  <input type="email" id="email" name="email" required>
  
  <label for="message">消息：</label>
  <textarea id="message" name="message" rows="4"></textarea>
  
  <button type="submit">提交</button>
</form>
```

### 高级表单

```html
<form action="/submit" method="post" enctype="multipart/form-data">
  <fieldset>
    <legend>个人信息</legend>
    
    <div class="form-group">
      <label for="firstname">名字：</label>
      <input type="text" id="firstname" name="firstname" required>
    </div>
    
    <div class="form-group">
      <label for="lastname">姓氏：</label>
      <input type="text" id="lastname" name="lastname" required>
    </div>
    
    <div class="form-group">
      <label for="email">邮箱：</label>
      <input type="email" id="email" name="email" required>
    </div>
    
    <div class="form-group">
      <label for="phone">电话：</label>
      <input type="tel" id="phone" name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}">
    </div>
    
    <div class="form-group">
      <label for="birthdate">出生日期：</label>
      <input type="date" id="birthdate" name="birthdate">
    </div>
    
    <div class="form-group">
      <label for="gender">性别：</label>
      <select id="gender" name="gender">
        <option value="">选择性别</option>
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
      <div>
        <input type="checkbox" id="reading" name="interests" value="reading">
        <label for="reading">阅读</label>
      </div>
    </div>
    
    <div class="form-group">
      <label>新闻通讯：</label>
      <div>
        <input type="radio" id="yes" name="newsletter" value="yes">
        <label for="yes">是</label>
      </div>
      <div>
        <input type="radio" id="no" name="newsletter" value="no">
        <label for="no">否</label>
      </div>
    </div>
    
    <div class="form-group">
      <label for="file">上传文件：</label>
      <input type="file" id="file" name="file" accept=".pdf,.doc,.docx">
    </div>
    
    <div class="form-group">
      <label for="message">消息：</label>
      <textarea id="message" name="message" rows="4" placeholder="输入您的消息"></textarea>
    </div>
    
    <button type="submit">提交</button>
    <button type="reset">重置</button>
  </fieldset>
</form>
```

### HTML5 表单输入类型

```html
<form>
  <!-- 文本输入 -->
  <input type="text" placeholder="文本输入">
  <input type="email" placeholder="邮箱输入">
  <input type="url" placeholder="网址输入">
  <input type="tel" placeholder="电话输入">
  <input type="password" placeholder="密码输入">
  <input type="search" placeholder="搜索输入">
  
  <!-- 数字输入 -->
  <input type="number" min="0" max="100" step="1" placeholder="数字输入">
  <input type="range" min="0" max="100" value="50">
  
  <!-- 日期和时间输入 -->
  <input type="date">
  <input type="time">
  <input type="datetime-local">
  <input type="month">
  <input type="week">
  
  <!-- 其他输入 -->
  <input type="color">
  <input type="file" accept="image/*">
  
  <!-- 数据列表 -->
  <input list="browsers" placeholder="选择浏览器">
  <datalist id="browsers">
    <option value="Chrome">
    <option value="Firefox">
    <option value="Safari">
    <option value="Edge">
  </datalist>
  
  <!-- 输出 -->
  <input type="range" id="volume" min="0" max="100" value="50">
  <output for="volume">50</output>
</form>
```

## 表格示例

### 基本表格

```html
<table>
  <tr>
    <th>姓名</th>
    <th>邮箱</th>
    <th>电话</th>
  </tr>
  <tr>
    <td>张三</td>
    <td>zhang@example.com</td>
    <td>123-456-7890</td>
  </tr>
  <tr>
    <td>李四</td>
    <td>li@example.com</td>
    <td>098-765-4321</td>
  </tr>
</table>
```

### 高级表格

```html
<table>
  <caption>员工信息</caption>
  <thead>
    <tr>
      <th>ID</th>
      <th>姓名</th>
      <th>部门</th>
      <th>薪资</th>
      <th>入职日期</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>001</td>
      <td>张三</td>
      <td>工程部</td>
      <td>¥75,000</td>
      <td>2023-01-15</td>
    </tr>
    <tr>
      <td>002</td>
      <td>李四</td>
      <td>市场部</td>
      <td>¥65,000</td>
      <td>2023-02-20</td>
    </tr>
    <tr>
      <td>003</td>
      <td>王五</td>
      <td>销售部</td>
      <td>¥70,000</td>
      <td>2023-03-10</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="3">员工总数：</td>
      <td colspan="2">3</td>
    </tr>
  </tfoot>
</table>
```

### 复杂表格

```html
<table>
  <thead>
    <tr>
      <th rowspan="2">产品</th>
      <th colspan="3">季度销售</th>
      <th rowspan="2">总计</th>
    </tr>
    <tr>
      <th>Q1</th>
      <th>Q2</th>
      <th>Q3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>产品 A</td>
      <td>100</td>
      <td>150</td>
      <td>200</td>
      <td>450</td>
    </tr>
    <tr>
      <td>产品 B</td>
      <td>80</td>
      <td>120</td>
      <td>180</td>
      <td>380</td>
    </tr>
    <tr>
      <td>产品 C</td>
      <td>90</td>
      <td>110</td>
      <td>160</td>
      <td>360</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td><strong>总计</strong></td>
      <td><strong>270</strong></td>
      <td><strong>380</strong></td>
      <td><strong>540</strong></td>
      <td><strong>1190</strong></td>
    </tr>
  </tfoot>
</table>
```

## 语义 HTML 示例

### 文章结构

```html
<article>
  <header>
    <h1>文章标题</h1>
    <p class="author">作者：<a href="#author">张三</a></p>
    <time datetime="2024-01-15">2024年1月15日</time>
  </header>
  
  <section>
    <h2>介绍</h2>
    <p>这是文章的介绍...</p>
  </section>
  
  <section>
    <h2>主要内容</h2>
    <p>这是文章的主要内容...</p>
    
    <figure>
      <img src="image.jpg" alt="相关图像">
      <figcaption>图像标题</figcaption>
    </figure>
    
    <blockquote>
      <p>这是文章中的引用。</p>
      <cite>- 来源姓名</cite>
    </blockquote>
  </section>
  
  <footer>
    <p>标签：<a href="#tag1">HTML</a>、<a href="#tag2">CSS</a></p>
    <p>分类：<a href="#category">Web 开发</a></p>
  </footer>
</article>
```

### 页面布局

```html
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>语义 HTML 布局</title>
  </head>
  <body>
    <header>
      <h1>网站标题</h1>
      <nav>
        <ul>
          <li><a href="#home">首页</a></li>
          <li><a href="#about">关于</a></li>
          <li><a href="#services">服务</a></li>
          <li><a href="#contact">联系</a></li>
        </ul>
      </nav>
    </header>
    
    <main>
      <section id="hero">
        <h2>欢迎来到我们的网站</h2>
        <p>这是我们网站的主要英雄部分。</p>
      </section>
      
      <section id="features">
        <h2>我们的功能</h2>
        <article>
          <h3>功能 1</h3>
          <p>功能 1 的描述。</p>
        </article>
        <article>
          <h3>功能 2</h3>
          <p>功能 2 的描述。</p>
        </article>
        <article>
          <h3>功能 3</h3>
          <p>功能 3 的描述。</p>
        </article>
      </section>
      
      <aside>
        <h3>相关信息</h3>
        <ul>
          <li><a href="#link1">相关链接 1</a></li>
          <li><a href="#link2">相关链接 2</a></li>
          <li><a href="#link3">相关链接 3</a></li>
        </ul>
      </aside>
    </main>
    
    <footer>
      <section>
        <h3>联系信息</h3>
        <p>邮箱：<a href="mailto:contact@example.com">contact@example.com</a></p>
        <p>电话：<a href="tel:+1234567890">123-456-7890</a></p>
      </section>
      <section>
        <h3>关注我们</h3>
        <ul>
          <li><a href="#facebook">Facebook</a></li>
          <li><a href="#twitter">Twitter</a></li>
          <li><a href="#linkedin">LinkedIn</a></li>
        </ul>
      </section>
      <p>&copy; 2024 网站。保留所有权利。</p>
    </footer>
  </body>
</html>
```

## 交互元素

### Details 和 Summary

```html
<details>
  <summary>点击展开</summary>
  <p>此内容默认隐藏，可以通过点击摘要展开。</p>
  <ul>
    <li>项目 1</li>
    <li>项目 2</li>
    <li>项目 3</li>
  </ul>
</details>

<details open>
  <summary>此部分默认打开</summary>
  <p>此内容默认可见。</p>
</details>
```

### Progress 和 Meter

```html
<!-- 进度条 -->
<label for="progress">下载进度：</label>
<progress id="progress" value="70" max="100">70%</progress>

<!-- 仪表 -->
<label for="disk-usage">磁盘使用：</label>
<meter id="disk-usage" value="0.6" min="0" max="1" low="0.3" high="0.8" optimum="0.5">
  60%
</meter>
```

### Canvas 和 SVG

```html
<!-- Canvas -->
<canvas id="myCanvas" width="400" height="200">
  您的浏览器不支持 canvas。
</canvas>

<!-- SVG -->
<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red"/>
  <rect x="10" y="10" width="30" height="30" fill="blue"/>
  <line x1="0" y1="0" x2="100" y2="100" stroke="green" stroke-width="2"/>
</svg>
```

## 元标签和 SEO 示例

### 完整头部部分

```html
<head>
  <!-- 基本元标签 -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="HTML 综合指南">
  <meta name="keywords" content="HTML, CSS, JavaScript, web 开发">
  <meta name="author" content="张三">
  <meta name="robots" content="index, follow">
  
  <!-- Open Graph 标签 -->
  <meta property="og:title" content="HTML 指南">
  <meta property="og:description" content="HTML 综合指南">
  <meta property="og:image" content="https://example.com/image.jpg">
  <meta property="og:url" content="https://example.com/page">
  <meta property="og:type" content="website">
  
  <!-- Twitter Card 标签 -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="HTML 指南">
  <meta name="twitter:description" content="HTML 综合指南">
  <meta name="twitter:image" content="https://example.com/image.jpg">
  
  <!-- 网站图标 -->
  <link rel="icon" href="favicon.ico" type="image/x-icon">
  <link rel="apple-touch-icon" href="apple-touch-icon.png">
  
  <!-- 样式表 -->
  <link rel="stylesheet" href="styles.css">
  <link rel="preload" href="critical.css" as="style">
  
  <!-- 标题 -->
  <title>HTML 指南 - 完整教程</title>
</head>
```

这些示例演示了在 Web 开发中常用的各种 HTML 结构和模式，从基本元素到复杂的语义布局。 