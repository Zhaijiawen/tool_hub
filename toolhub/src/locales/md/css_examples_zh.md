# CSS 代码示例

## 基本 CSS 结构示例

### 简单 CSS 重置

```css
/* CSS 重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  line-height: 1.5;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  color: #333;
  background-color: #fff;
}

/* 移除列表样式 */
ul, ol {
  list-style: none;
}

/* 移除链接的文本装饰 */
a {
  text-decoration: none;
  color: inherit;
}

/* 使图像响应式 */
img {
  max-width: 100%;
  height: auto;
}
```

### 基本排版

```css
/* 标题样式 */
h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
}

h2 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  color: #444;
}

h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.6rem;
  color: #555;
}

/* 段落样式 */
p {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  color: #666;
}

/* 链接样式 */
a {
  color: #007bff;
  text-decoration: underline;
  transition: color 0.3s ease;
}

a:hover {
  color: #0056b3;
}

a:visited {
  color: #6f42c1;
}
```

## 布局示例

### Flexbox 布局

```css
/* 基本 flexbox 容器 */
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  background-color: #f8f9fa;
}

.flex-item {
  flex: 1;
  min-width: 200px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Flexbox 导航 */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #333;
  color: white;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-menu {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.nav-menu a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.nav-menu a:hover {
  background-color: #555;
}

/* 响应式 flexbox */
@media (max-width: 768px) {
  .nav {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-menu {
    flex-direction: column;
    gap: 0.5rem;
  }
}
```

### CSS Grid 布局

```css
/* 基本网格容器 */
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
  background-color: #f8f9fa;
}

.grid-item {
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* 复杂网格布局 */
.page-layout {
  display: grid;
  grid-template-areas: 
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 250px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header {
  grid-area: header;
  background-color: #333;
  color: white;
  padding: 1rem;
}

.sidebar {
  grid-area: sidebar;
  background-color: #f8f9fa;
  padding: 1rem;
}

.main {
  grid-area: main;
  padding: 2rem;
}

.footer {
  grid-area: footer;
  background-color: #333;
  color: white;
  padding: 1rem;
  text-align: center;
}

/* 响应式网格 */
@media (max-width: 768px) {
  .page-layout {
    grid-template-areas: 
      "header"
      "main"
      "sidebar"
      "footer";
    grid-template-columns: 1fr;
  }
}
```

### 定位示例

```css
/* 相对定位 */
.relative-box {
  position: relative;
  top: 10px;
  left: 20px;
  background-color: #007bff;
  color: white;
  padding: 10px;
  border-radius: 4px;
}

/* 绝对定位 */
.absolute-box {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #dc3545;
  color: white;
  padding: 5px 10px;
  border-radius: 0 0 0 4px;
}

/* 固定定位 */
.fixed-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  transition: transform 0.3s ease;
}

.fixed-button:hover {
  transform: scale(1.1);
}

/* 粘性定位 */
.sticky-header {
  position: sticky;
  top: 0;
  background-color: white;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  z-index: 100;
}
``` 