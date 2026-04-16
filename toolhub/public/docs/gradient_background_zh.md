# 渐变色生成器 - 技术背景

## CSS 渐变简介

CSS 渐变是一种创建从一种颜色平滑过渡到另一种颜色的图像效果技术，完全由浏览器渲染，无需图片资源，具有无损缩放、体积轻量的优点。

## 渐变类型

### 线性渐变（linear-gradient）

颜色沿直线方向过渡，是最常用的渐变类型。

```css
/* 基础语法 */
background: linear-gradient(direction, color-stop1, color-stop2, ...);

/* 从上到下（默认） */
background: linear-gradient(#e66465, #9198e5);

/* 指定角度 */
background: linear-gradient(45deg, #ff6b6b, #4ecdc4);

/* 指定方向 */
background: linear-gradient(to right, #667eea, #764ba2);

/* 多色点 */
background: linear-gradient(to right, #f7971e, #ffd200, #21d4fd, #b721ff);
```

**角度说明：**
- `0deg`：从下到上
- `90deg`：从左到右
- `180deg`：从上到下（与 `to bottom` 相同）
- `270deg`：从右到左

### 径向渐变（radial-gradient）

颜色从中心向外辐射扩散。

```css
/* 基础语法 */
background: radial-gradient(shape size at position, color-stop1, color-stop2);

/* 圆形渐变 */
background: radial-gradient(circle, #ff6b6b, #4ecdc4);

/* 椭圆渐变（默认） */
background: radial-gradient(ellipse, #667eea, #764ba2);

/* 指定中心位置 */
background: radial-gradient(circle at top left, #f7971e, #ffd200);

/* 指定大小 */
background: radial-gradient(circle closest-side, #ee9ca7, #ffdde1);
```

### 锥形渐变（conic-gradient）

颜色围绕中心点旋转过渡，类似饼图效果，CSS Level 4 新增。

```css
/* 基础语法 */
background: conic-gradient(color-stop1, color-stop2, ...);

/* 基础饼图效果 */
background: conic-gradient(red 0%, yellow 33%, green 67%);

/* 带角度偏移 */
background: conic-gradient(from 90deg, #ff6b6b, #4ecdc4, #ff6b6b);

/* 色轮效果 */
background: conic-gradient(
  hsl(0, 100%, 50%),
  hsl(60, 100%, 50%),
  hsl(120, 100%, 50%),
  hsl(180, 100%, 50%),
  hsl(240, 100%, 50%),
  hsl(300, 100%, 50%),
  hsl(360, 100%, 50%)
);
```

## 颜色停止点（Color Stops）

颜色停止点定义了渐变中每种颜色的位置：

```css
/* 均匀分布（自动计算位置） */
background: linear-gradient(red, yellow, green);

/* 手动指定位置（百分比） */
background: linear-gradient(red 0%, yellow 30%, green 100%);

/* 精确位置（px 或其他单位） */
background: linear-gradient(red 0px, yellow 50px, green 200px);

/* 创建硬边效果（同位置两色） */
background: linear-gradient(red 50%, blue 50%);
```

## 浏览器兼容性

| 渐变类型 | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| linear-gradient | 26+ | 16+ | 6.1+ | 12+ |
| radial-gradient | 26+ | 16+ | 6.1+ | 12+ |
| conic-gradient | 69+ | 83+ | 12.1+ | 79+ |

> `conic-gradient` 在较旧的浏览器中不支持，需要注意兼容性。

## 设计最佳实践

### 配色原则
1. **同色系渐变**：使用相近色相（色轮上相邻的颜色）创建和谐的渐变
2. **对比色渐变**：使用互补色创建活力四射的渐变
3. **限制色彩数量**：2-3 个颜色的渐变最常用，超过5个往往显得杂乱

### 可读性考虑
- 文字叠加在渐变背景上时，需确保对比度足够（WCAG 标准：正文文字至少 4.5:1）
- 避免在中间过渡区域放置重要文字

### 性能优化
- CSS 渐变无需网络请求，相比图片加载更快
- 可以用 CSS 变量和媒体查询实现主题切换

