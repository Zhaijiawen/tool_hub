# CSS — 使用格式化工具

把乱成一团的 CSS 粘贴到编辑区，点格式化，结果原位输出。格式化工具自动统一缩进、规范换行和间距。

格式化前：

```css
body{margin:0;padding:0;font-family:Arial,sans-serif;}.container{width:100%;max-width:1200px;margin:0 auto;padding:20px;}.header{background-color:#333;color:white;padding:1rem;}
```

格式化后：

```css
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  background-color: #333;
  color: white;
  padding: 1rem;
}
```

## 常见写法要点

**缺少分号** — 属性之间忘了加分号是高频错误，格式化后缩进对齐更容易扫出遗漏：

```css
/* 有问题 */
body { margin: 0 padding: 0 }

/* 正确 */
body { margin: 0; padding: 0; }
```

**没闭合的花括号** — 格式化能帮你发现结构不对称的块。

## 格式化技巧

选 2 空格缩进，用到底。属性按逻辑顺序排列：定位、盒模型、排版、视觉效果、杂项。用 `/* 区块 */` 注释分隔主要区域。

```css
.card {
  /* 定位 */
  position: relative;

  /* 盒模型 */
  width: 300px;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;

  /* 排版 */
  font-size: 1rem;
  color: #333;

  /* 视觉效果 */
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

## 自定义属性

CSS 变量统一格式化：

```css
:root {
  --primary: #007bff;
  --spacing: 1rem;
  --radius: 4px;
}

.button {
  background: var(--primary);
  padding: var(--spacing);
  border-radius: var(--radius);
  transition: all 0.3s ease;
}

.button:hover {
  background: color-mix(in srgb, var(--primary) 80%, black);
}
```

## 媒体查询

放在文件最后，移动优先：

```css
/* 基础（移动端） */
.container { width: 100%; padding: 10px; }

@media (min-width: 768px) {
  .container { width: 750px; margin: 0 auto; }
}

@media (min-width: 1024px) {
  .container { width: 1000px; }
}
```
