# Markdown 转换器 — 技术背景

## 什么是 Markdown？

Markdown 是 John Gruber 于 2004 年创建的轻量级标记语言。它允许你使用易于阅读和编写的纯文本语法来书写格式化文本。Markdown 文件会被转换为 HTML，在浏览器、文档网站和 README 文件中显示。

## 为什么选择 Markdown？

- **纯文本即可读**：与 HTML 不同，Markdown 源码无需渲染即可被人阅读
- **可移植性强**：在 GitHub、GitLab、Notion、Confluence、VS Code 等工具中均可使用
- **语法简单**：几分钟即可上手，受用终生

## 核心语法

### 标题
```markdown
# 一级标题
## 二级标题
### 三级标题
```

### 强调
```markdown
**粗体**   _斜体_   ~~删除线~~
```

### 列表
```markdown
- 无序列表项
1. 有序列表项
```

### 链接和图片
```markdown
[链接文字](https://example.com)
![替代文字](image.png)
```

### 代码
```markdown
`行内代码`

​```javascript
// 代码块
const x = 1;
​```
```

### 表格
```markdown
| 列1 | 列2 |
|---|---|
| 单元格1 | 单元格2 |
```

### 引用块
```markdown
> 这是一段引用
```

## Markdown 方言

- **CommonMark**：标准化的 Markdown 规范
- **GitHub Flavored Markdown (GFM)**：新增表格、任务列表、删除线
- **MDX**：嵌入 JSX 组件的 Markdown（用于 React 文档）
- **kramdown**：Jekyll 和 GitHub Pages 使用

## Markdown 转 HTML

Markdown 处理器将 `.md` 文件转换为 HTML。本页面的工具实时渲染 Markdown，让你提前预览发布后的效果。
