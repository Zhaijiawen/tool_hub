# 渐变色生成器 - 代码示例

## 精选渐变方案

### 1. 经典蓝紫渐变

效果：沉稳、专业
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```
适用：按钮、卡片背景、Banner

---

### 2. 日落橙金渐变

效果：温暖、活力
```css
background: linear-gradient(to right, #f7971e 0%, #ffd200 100%);
```
适用：促销横幅、登录页背景

---

### 3. 极光绿青渐变

效果：清新、现代
```css
background: linear-gradient(120deg, #11998e 0%, #38ef7d 100%);
```
适用：成功状态、环保主题

---

### 4. 霓虹粉紫渐变

效果：时尚、科技感
```css
background: linear-gradient(to right, #f953c6 0%, #b91d73 50%, #510a7d 100%);
```
适用：科技产品、游戏界面

---

### 5. 天空蓝白渐变

效果：轻盈、干净
```css
background: linear-gradient(to bottom, #e0f7fa 0%, #ffffff 100%);
```
适用：页面背景、卡片

---

### 6. 径向光晕效果

效果：聚光灯感
```css
background: radial-gradient(circle at center, #fff 0%, #a18cd1 50%, #fbc2eb 100%);
```
适用：头像背景、焦点区域

---

### 7. 锥形彩虹（色轮）

效果：多彩、艺术感
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
适用：颜色选择器、艺术装饰

---

## 实际应用示例

### 按钮渐变

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

### 卡片渐变背景

```css
.feature-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

---

### 渐变文字效果

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

### 页面头部渐变横幅

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

### 暗色主题渐变

```css
.dark-card {
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white;
  border-radius: 12px;
  padding: 20px;
}
```

---

## 渐变与 CSS 变量结合

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

