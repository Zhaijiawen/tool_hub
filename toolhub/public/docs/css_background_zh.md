# CSS — 幕后原理

CSS 由 Hakon Wium Lie 在 1994 年首次提出。当时这个想法很激进：把内容（HTML）和样式（CSS）分开。在没有 CSS 的年代，排版靠 `<font>` 标签和表格布局。第一个正式规范 CSS1 在 1996 年落地，然后就一路迭代到现在。

## 层叠是核心

多个规则同时指向同一个元素时，三条规则决定谁胜出：

1. **来源** — 浏览器默认 < 用户样式 < 作者样式 < `!important` 作者 < `!important` 用户
2. **优先级** — 内联样式 > ID > 类/属性/伪类 > 元素/伪元素。可以想象成一个四位数：(0,0,0,0)。
3. **源码顺序** — 优先级相同时，后写的覆盖先写的

```css
p { color: black; }              /* (0,0,0,1) */
.intro { color: blue; }         /* (0,0,1,0) */
#main p { color: red; }         /* (0,1,0,1) — 这个赢 */
```

## 盒模型

每个元素都是一个盒子：content、padding、border、margin。`box-sizing: border-box` 把 padding 和 border 算进 width/height。每个项目都应该在开头写上：

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

## 现代布局

**Flexbox** 管一维布局（行或列）。`display: flex`、`justify-content`、`align-items`、`gap`。垂直居中、等高列、间距——这些以前难得要命的事，Flexbox 一键解决。

**Grid** 管二维布局。`display: grid`、`grid-template-columns`、`grid-template-areas`。父级定义布局，子元素自动归位。

```css
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
}
```

## 自定义属性改变了游戏规则

```css
:root {
  --primary: #2563eb;
  --spacing: 1rem;
}

.card {
  padding: var(--spacing);
  background: var(--primary);
}
```

不需要预处理器就能用变量，而且它们是层叠的（这一点 Sass 变量做不到）。切换主题极其简单：在 data 属性或 class 上改值，全部自动更新。

## 响应式设计

移动优先的意思是基础样式为小屏幕写，`@media (min-width: ...)` 为更大屏幕叠加。现代流畅排版用 `clamp()`：

```css
h1 { font-size: clamp(1.5rem, 4vw, 3rem); }
```

## 需要知道的事

- CSS 不是编程语言——没有循环、没有 if/else、没有函数（但 `@container` 查询和 `:has()` 正在补上这些缺口）
- 优先级战争是代码坏味道。如果你在写 `#id .class div p span`，重构吧
- `z-index` 只在定位元素（`position` 不是 `static`）上生效
- `will-change` 告诉浏览器提前优化即将发生的动画，但滥用会浪费 GPU 内存
