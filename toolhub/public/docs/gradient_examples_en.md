# Gradient Color Generator - Examples

## Curated presets

### Classic blue-purple

Safe, professional, works everywhere. This is the default gradient in about half the SaaS landing pages out there for a reason.

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

Buttons, cards, hero sections -- it doesn't look out of place anywhere.

---

### Sunset orange-gold

Warm, energetic, grabs attention. Great for CTAs and promotional sections.

```css
background: linear-gradient(to right, #f7971e 0%, #ffd200 100%);
```

---

### Aurora green-teal

Fresh, modern, feels clean. Pairs well with white text and generous padding.

```css
background: linear-gradient(120deg, #11998e 0%, #38ef7d 100%);
```

---

### Neon pink-purple

Bold, tech-forward, slightly aggressive. If your brand is loud and proud, this one's for you.

```css
background: linear-gradient(to right, #f953c6 0%, #b91d73 50%, #510a7d 100%);
```

---

### Sky blue-to-white

Light, airy, almost invisible in a good way. Perfect for page backgrounds where you want subtle depth without competing with content.

```css
background: linear-gradient(to bottom, #e0f7fa 0%, #ffffff 100%);
```

---

### Radial spotlight

Creates a focal glow. Throw this behind an avatar or a featured card.

```css
background: radial-gradient(circle at center, #fff 0%, #a18cd1 50%, #fbc2eb 100%);
```

---

### Conic rainbow

Full color wheel. Make it circular (`border-radius: 50%`) and it looks like an art piece.

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

## Real component examples

### Gradient button

The hover effect is just `opacity` -- keeps the gradient intact while giving feedback. Way cleaner than defining a separate hover gradient.

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

### Card with subtle gradient

Light gradients on cards add depth without screaming "look at me."

```css
.feature-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

---

### Gradient text

The `-webkit-background-clip` trick clips the gradient to the text shape. Standard `background-clip: text` is there for Firefox. Only works on solid backgrounds -- transparent backgrounds will show the gradient behind the text too.

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

### Hero banner

Three stops create more depth than two. The middle color acts as a bridge.

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

### Dark mode gradient card

Deep blues stay visible on dark backgrounds without the harshness of pure black.

```css
.dark-card {
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white;
  border-radius: 12px;
  padding: 20px;
}
```

---

## CSS custom properties for gradients

Define once, use everywhere. Makes theme switching trivial and keeps your gradient palette consistent.

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
```
