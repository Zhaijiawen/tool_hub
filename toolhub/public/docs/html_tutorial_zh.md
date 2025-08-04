# HTML 使用教程

## HTML 格式化入门

HTML 格式化工具帮助你组织和美化 HTML 代码，使其更易读和可维护。本教程将指导你有效地格式化 HTML 代码。

## 基本格式化流程

### 步骤 1：准备你的 HTML 代码

首先收集你想要格式化的 HTML 代码。这可能是：
- HTML 文档
- HTML 片段
- 模板文件
- 邮件模板
- 表单结构
- 复杂嵌套元素

### 步骤 2：输入你的代码

1. 打开 HTML 格式化工具
2. 找到输入区域（通常在左侧）
3. 将你的 HTML 代码粘贴到输入框中
4. 确保你的代码在语法上有效（工具会验证它）

示例输入：
```html
<!DOCTYPE html><html><head><title>我的页面</title></head><body><h1>欢迎</h1><p>这是一个包含 <strong>粗体文本</strong> 和 <em>斜体文本</em> 的段落。</p><ul><li>项目 1</li><li>项目 2</li><li>项目 3</li></ul></body></html>
```

### 步骤 3：选择格式化选项

在格式化之前，考虑这些选项：

#### 缩进设置
- **2 个空格**：标准缩进，适用于大多数用例
- **4 个空格**：对于复杂嵌套结构更易读
- **制表符**：传统缩进方法（在现代 HTML 中较少使用）

#### 其他选项
- **换行属性**：将长属性列表换行到多行
- **排序属性**：按字母顺序排序属性
- **移除注释**：删除 HTML 注释
- **保留注释**：保持 HTML 注释完整
- **压缩空白**：删除不必要的空白

### 步骤 4：格式化你的代码

1. 点击"格式化"按钮
2. 等待工具处理你的代码
3. 在右侧查看格式化的输出

预期输出：
```html
<!DOCTYPE html>
<html>
  <head>
    <title>我的页面</title>
  </head>
  <body>
    <h1>欢迎</h1>
    <p>
      这是一个包含 <strong>粗体文本</strong> 和
      <em>斜体文本</em> 的段落。
    </p>
    <ul>
      <li>项目 1</li>
      <li>项目 2</li>
      <li>项目 3</li>
    </ul>
  </body>
</html>
```

## 高级格式化功能

### 语法验证

工具会自动验证你的 HTML 语法并提供有用的错误消息：

#### 常见错误和解决方案

**未闭合的标签**
```html
<!-- 错误 -->
<p>这是一个段落
<div>这是一个 div

<!-- 正确 -->
<p>这是一个段落</p>
<div>这是一个 div</div>
```

**缺失 DOCTYPE**
```html
<!-- 错误 -->
<html>
<head>
<title>页面</title>
</head>

<!-- 正确 -->
<!DOCTYPE html>
<html>
<head>
<title>页面</title>
</head>
```

**无效属性**
```html
<!-- 错误 -->
<img src="image.jpg" alt>

<!-- 正确 -->
<img src="image.jpg" alt="描述">
```

### 错误处理

当工具遇到错误时：

1. **语法错误**：工具会高亮显示有问题的行
2. **验证消息**：清楚地解释需要修复的内容
3. **自动修正**：一些工具可以自动修复常见问题

## 工具功能

### 复制功能

1. 点击格式化输出旁边的"复制"按钮
2. 格式化的 HTML 被复制到你的剪贴板
3. 将其粘贴到你需要的任何地方

### 清除功能

1. 点击"清除"按钮重置输入和输出区域
2. 在处理多个代码片段时很有用

### 导出选项

一些格式化器提供额外的导出选项：
- 下载为 `.html` 文件
- 导出为格式化文本
- 通过 URL 分享（如果支持）

## HTML 格式化最佳实践

### 1. 一致的缩进

选择缩进样式并坚持使用：
```html
<!-- 好的做法 - 2 个空格 -->
<div>
  <h1>标题</h1>
  <p>内容</p>
</div>
```

### 2. 正确的标签嵌套

确保 HTML 元素的正确嵌套：
```html
<!-- 好的做法 -->
<div>
  <p>div 内的段落</p>
</div>

<!-- 避免 -->
<div>
<p>div 内的段落
</div>
```

### 3. 有意义的属性顺序

逻辑地组织属性：
```html
<!-- 好的做法 -->
<img src="image.jpg" alt="描述" width="300" height="200" class="responsive">

<!-- 避免 -->
<img class="responsive" width="300" height="200" alt="描述" src="image.jpg">
```

### 4. 正确的自闭合标签

使用正确的自闭合标签语法：
```html
<!-- 好的做法 -->
<img src="image.jpg" alt="描述">
<input type="text" name="username">
<br>

<!-- 避免 -->
<img src="image.jpg" alt="描述" />
<input type="text" name="username" />
<br />
```

## 常见问题故障排除

### 问题："无效 HTML"错误

**可能原因：**
- 未闭合的标签
- 缺失 DOCTYPE
- 无效属性
- 格式错误的结构

**解决方案：**
1. 检查错误消息中的行号
2. 验证语法正确
3. 添加缺失的 DOCTYPE 声明
4. 检查无效属性值

### 问题：缩进问题

**问题：** 不一致的缩进使代码难以阅读

**解决方案：**
1. 使用一致的缩进（推荐 2 个空格）
2. 配置你的编辑器使用空格而不是制表符
3. 使用代码检查工具捕获缩进问题
4. 在编辑器中启用"保存时格式化"

### 问题：长行

**问题：** 非常长的行可能难以阅读

**解决方案：**
1. 在逻辑点断开长行
2. 使用适当的换行提高可读性
3. 考虑使用 CSS 类而不是内联样式
4. 使用语义 HTML 元素

## 高效 HTML 格式化的技巧

### 1. 使用键盘快捷键

大多数 HTML 格式化器支持键盘快捷键：
- `Ctrl+Shift+F`（Windows/Linux）或 `Cmd+Shift+F`（Mac）用于格式化
- `Ctrl+C` 和 `Ctrl+V` 用于复制/粘贴操作

### 2. 格式化前验证

始终在格式化前验证你的 HTML 以尽早捕获错误。

### 3. 保留备份

在进行大量更改之前，保留原始代码的备份。

### 4. 使用版本控制

如果使用 HTML 文件，使用版本控制来跟踪更改。

### 5. 考虑代码检查

对于重要的 HTML 代码，考虑使用 HTML 检查器确保代码质量。

## HTML 注释

使用注释来记录你的代码：

```html
<!-- 单行注释 -->
<div class="container">
  <!-- 这是主要内容区域 -->
  <h1>页面标题</h1>
  
  <!-- 导航部分 -->
  <nav>
    <ul>
      <li><a href="#home">首页</a></li>
      <li><a href="#about">关于</a></li>
    </ul>
  </nav>
</div>

<!--
  多行注释
  用于复杂解释
  或章节标题
-->
```

## 语义 HTML 结构

正确格式化语义 HTML：

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
      <h1>网站标题</h1>
      <nav>
        <ul>
          <li><a href="#home">首页</a></li>
          <li><a href="#about">关于</a></li>
        </ul>
      </nav>
    </header>
    
    <main>
      <article>
        <h2>文章标题</h2>
        <p>文章内容...</p>
      </article>
      
      <aside>
        <h3>相关信息</h3>
        <p>侧边栏内容...</p>
      </aside>
    </main>
    
    <footer>
      <p>&copy; 2024 网站</p>
    </footer>
  </body>
</html>
```

## 表单

一致地格式化表单：

```html
<form action="/submit" method="post">
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
      <label for="message">消息：</label>
      <textarea id="message" name="message" rows="4"></textarea>
    </div>
    
    <button type="submit">提交</button>
  </fieldset>
</form>
```

## 表格

正确格式化表格：

```html
<table>
  <thead>
    <tr>
      <th>姓名</th>
      <th>邮箱</th>
      <th>电话</th>
    </tr>
  </thead>
  <tbody>
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
  </tbody>
  <tfoot>
    <tr>
      <td colspan="3">总计：2 个联系人</td>
    </tr>
  </tfoot>
</table>
```

## 列表

一致地格式化列表：

```html
<!-- 无序列表 -->
<ul>
  <li>第一项</li>
  <li>第二项</li>
  <li>第三项</li>
</ul>

<!-- 有序列表 -->
<ol>
  <li>第一步</li>
  <li>第二步</li>
  <li>第三步</li>
</ol>

<!-- 定义列表 -->
<dl>
  <dt>术语 1</dt>
  <dd>定义 1</dd>
  <dt>术语 2</dt>
  <dd>定义 2</dd>
</dl>
```

## 链接和导航

正确格式化链接：

```html
<!-- 基本链接 -->
<a href="https://example.com">访问示例网站</a>

<!-- 内部链接 -->
<a href="#section">转到章节</a>

<!-- 邮件链接 -->
<a href="mailto:user@example.com">发送邮件</a>

<!-- 电话链接 -->
<a href="tel:+1234567890">联系我们</a>

<!-- 导航菜单 -->
<nav>
  <ul>
    <li><a href="#home">首页</a></li>
    <li><a href="#about">关于</a></li>
    <li><a href="#services">服务</a></li>
    <li><a href="#contact">联系</a></li>
  </ul>
</nav>
```

## 图像和媒体

正确格式化媒体元素：

```html
<!-- 图像 -->
<img src="image.jpg" alt="描述" width="300" height="200">

<!-- 视频 -->
<video controls width="400" height="300">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  您的浏览器不支持视频。
</video>

<!-- 音频 -->
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
  您的浏览器不支持音频。
</audio>

<!-- 带标题的图像 -->
<figure>
  <img src="image.jpg" alt="描述">
  <figcaption>图像标题</figcaption>
</figure>
```

## 元标签

正确格式化元标签：

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="页面描述">
  <meta name="keywords" content="相关, 关键词">
  <meta name="author" content="作者姓名">
  <meta name="robots" content="index, follow">
  
  <!-- Open Graph 标签 -->
  <meta property="og:title" content="页面标题">
  <meta property="og:description" content="页面描述">
  <meta property="og:image" content="image.jpg">
  
  <!-- Twitter Card 标签 -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="页面标题">
  <meta name="twitter:description" content="页面描述">
</head>
```

## 脚本和样式

正确格式化脚本和样式标签：

```html
<head>
  <!-- 外部 CSS -->
  <link rel="stylesheet" href="styles.css">
  
  <!-- 内部 CSS -->
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
  </style>
</head>

<body>
  <!-- 内容在这里 -->
  
  <!-- 外部 JavaScript -->
  <script src="script.js"></script>
  
  <!-- 内部 JavaScript -->
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      console.log('页面已加载');
    });
  </script>
</body>
```

本教程应该帮助你有效地使用 HTML 格式化工具来创建干净、可读且结构正确的 HTML 代码。 