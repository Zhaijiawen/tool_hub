# Gradient Color Generator - Examples

## Curated Gradient Presets

### 1. Classic Blue-Purple

Feel: Calm, professional
```
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```
Use for: Buttons, card backgrounds, banners

---

### 2. Sunset Orange-Gold

Feel: Warm, energetic
```
background: linear-gradient(to right, #f7971e 0%, #ffd200 100%);
```
Use for: Promotional banners, login page backgrounds

---

### 3. Aurora Green-Teal

Feel: Fresh, modern
```
background: linear-gradient(120deg, #11998e 0%, #38ef7d 100%);
```
Use for: Success states, eco/nature themes

---

### 4. Neon Pink-Purple

Feel: Trendy, tech-forward
```
background: linear-gradient(to right, #f953c6 0%, #b91d73 50%, #510a7d 100%);
```
Use for: Tech products, gaming UIs

---

### 5. Sky Blue-to-White

Feel: Light, clean
```
background: linear-gradient(to bottom, #e0f7fa 0%, #ffffff 100%);
```
Use for: Page backgrounds, cards

---

### 6. Radial Spotlight Glow

Feel: Focus, depth
```
background: radial-gradient(circle at center, #fff 0%, #a18cd1 50%, #fbc2eb 100%);
```
Use for: Avatar backgrounds, focal areas

---

### 7. Conic Rainbow (Color Wheel)

Feel: Colorful, artistic
```
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
Use for: Color pickers, artistic decorations

---

## Practical Application Examples

### Gradient Button

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

### Card Gradient Background

```css
.feature-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

---

### Gradient Text Effect

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

### Hero Section Banner

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

### Dark Theme Gradient Card

```css
.dark-card {
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white;
  border-radius: 12px;
  padding: 20px;
}
```

---

## Gradients with CSS Variables

```css
:root {
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-success: linear-gradient(120deg, #11998e 0%, #38ef7d 100%);
  --gradient-warning: linear-gradient(to right, #f7971e 0%, #ffd200 100%);
  --gradient-danger:  linear-gradient(135deg, #f953c6 0%, #b91d73 100%);
}

.btn-primary { background: var(--gradient-primary); }
.btn-success { background: var(--gradient-success); }
.btn-warning { background: var(--gradient-warning); }
.btn-danger  { background: var(--gradient-danger); }

