# 渐变色生成器 - 代码示例

## 精选预设方案

### 经典蓝紫渐变

稳妥、专业，放在哪里都合适。一半的 SaaS 落地页默认渐变都长这样，不是没道理的。

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

按钮、卡片、Hero 区域通吃，不会突兀。

---

### 日落橙金渐变

温暖、有活力，适合促销横幅和 CTA 按钮。

```css
background: linear-gradient(to right, #f7971e 0%, #ffd200 100%);
```

---

### 极光绿青渐变

清新、现代，搭配白色文字和充裕的内边距效果很好。

```css
background: linear-gradient(120deg, #11998e 0%, #38ef7d 100%);
```

---

### 霓虹粉紫渐变

大胆、科技感强。品牌风格张扬的话可以考虑。

```css
background: linear-gradient(to right, #f953c6 0%, #b91d73 50%, #510a7d 100%);
```

---

### 天空蓝白渐变

轻盈、干净。做页面背景很合适，有微妙的层次感但不会抢内容的风头。

```css
background: linear-gradient(to bottom, #e0f7fa 0%, #ffffff 100%);
```

---

### 径向光晕

聚光灯效果，放在头像或者重点卡片背后很出彩。

```css
background: radial-gradient(circle at center, #fff 0%, #a18cd1 50%, #fbc2eb 100%);
```

---

### 锥形彩虹色轮

完整色轮，加上 `border-radius: 50%` 秒变艺术品。

```css
background: conic-gradient(
  from 0deg,
  #ff6b6b,
  #ffd93d,
  #6bcb77,
  #4d96ff,
  #9b59b6,
  #ff6b6b
);
border-radius: 50%;
```

---

## 实际组件示例

### 渐变按钮

hover 效果直接用 `opacity`，渐变不变只降低透明度，比单独定义一个 hover 渐变干净得多。

```css
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 28px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.85;
}
```

---

### 卡片浅渐变背景

淡色渐变给卡片增加层次感，但不会太抢眼。

```css
.feature-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

---

### 渐变文字

`-webkit-background-clip` 把渐变裁剪到文字形状里。加了标准的 `background-clip: text` 给 Firefox。注意这个效果只在实色背景上成立 -- 透明背景下渐变会穿透文字显示出来。

```css
.gradient-text {
  background: linear-gradient(to right, #f7971e, #ffd200);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 48px;
  font-weight: bold;
}
```

---

### Hero 区域横幅

三个色点比两个更有层次，中间色充当过渡桥。

```css
.hero-section {
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 40%,
    #f093fb 100%
  );
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

### 暗色主题渐变卡片

深蓝色系在暗色背景下可见性好，又不像纯黑那么死板。

```css
.dark-card {
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white;
  border-radius: 12px;
  padding: 20px;
}
```

---

## CSS 变量管理渐变

定义一次，到处使用。主题切换方便，渐变调色板也能保持统一。

```css
:root {
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-success: linear-gradient(120deg, #11998e 0%, #38ef7d 100%);
  --gradient-warning: linear-gradient(to right, #f7971e 0%, #ffd200 100%);
  --gradient-danger: linear-gradient(135deg, #f953c6 0%, #b91d73 100%);
}

.btn-primary { background: var(--gradient-primary); }
.btn-success { background: var(--gradient-success); }
.btn-warning { background: var(--gradient-warning); }
.btn-danger  { background: var(--gradient-danger); }
```
