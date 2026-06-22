# 渐变色生成器 - 技术背景

CSS 渐变用了这么多年，很多人还是习惯从 Figma 切图。其实浏览器原生渲染渐变，不需要任何图片资源，任意分辨率都清晰，零 HTTP 请求。省带宽又省事。

## 三种渐变类型

### 线性渐变（linear-gradient）

日常用得最多的就是它。颜色沿着一条直线过渡。角度的记法有点绕：`0deg` 是从下到上，`90deg` 从左到右，`180deg` 从上到下。记不住的话直接用 `to right`、`to bottom left` 这种方向关键词，一目了然。

```css
/* 基础双色 */
background: linear-gradient(#e66465, #9198e5);

/* 指定角度 */
background: linear-gradient(45deg, #ff6b6b, #4ecdc4);

/* 方向关键词 -- 可读性好很多 */
background: linear-gradient(to right, #667eea, #764ba2);

/* 多色点 */
background: linear-gradient(to right, #f7971e, #ffd200, #21d4fd, #b721ff);
```

### 径向渐变（radial-gradient）

从中心向外发散。可以控制形状（圆形 `circle` 还是椭圆 `ellipse`）、大小（`closest-side`、`farthest-corner` 等）以及中心位置。

```css
/* 基础径向 */
background: radial-gradient(circle, #ff6b6b, #4ecdc4);

/* 偏移中心 -- 做聚光灯效果利器 */
background: radial-gradient(circle at top left, #f7971e, #ffd200);

/* 控制扩散范围 */
background: radial-gradient(circle closest-side, #ee9ca7, #ffdde1);
```

### 锥形渐变（conic-gradient）

CSS Level 4 才加进来的，颜色围绕中心旋转，做饼图、色轮、环形进度条很合适。不过老浏览器不支持（2020 年之前的版本基本都跪），用之前确认一下目标用户的浏览器分布。

```css
/* 饼图效果 */
background: conic-gradient(red 0%, yellow 33%, green 67%);

/* 指定起始角度 */
background: conic-gradient(from 90deg, #ff6b6b, #4ecdc4, #ff6b6b);

/* 完整色轮 */
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

## 颜色停止点

渐变的核心概念就是色点（color stop）-- 每种颜色在渐变线上的位置。不指定的话浏览器会均匀分布，但你完全可以手动控制：

```css
/* 均匀分布（默认） */
background: linear-gradient(red, yellow, green);

/* 精确定位 */
background: linear-gradient(red 0%, yellow 30%, green 100%);

/* 硬切 -- 两个颜色在同一位置产生锐利边界 */
background: linear-gradient(red 50%, blue 50%);
```

## 真正有用的设计建议

颜色别超过 3 个，超过 5 个的基本都像打翻的调色盘，除非你刻意追那个效果。色轮上相邻的颜色（近似色）做出来的渐变干净、专业，适合大部分场景。互补色能带来冲击力，但用不好容易刺眼。

渐变上面要放文字的话，特别注意中间过渡区域的对比度。两种颜色混合的瞬间，经常产生低对比度的灰色地带，肉眼不容易察觉，放上文字就翻车了。WCAG 要求正文至少 4.5:1 的对比度，别偷懒。

还有一个容易被忽略的性能细节：用 CSS 自定义属性定义渐变，暗色模式切换时不用重新渲染整个页面，比切换 class 覆盖样式顺滑得多：

```css
:root {
  --card-bg: linear-gradient(135deg, #f5f7fa, #c3cfe2);
}
[data-theme="dark"] {
  --card-bg: linear-gradient(135deg, #1a1a2e, #16213e);
}
```
