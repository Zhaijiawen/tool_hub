# CSS — Code Examples

## A CSS Reset That Actually Makes Sense

```css
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html { font-size: 16px; line-height: 1.5; }

body {
  font-family: system-ui, -apple-system, sans-serif;
  color: #333;
  background: #fff;
}

img { max-width: 100%; height: auto; display: block; }
a { color: inherit; text-decoration: none; }
ul, ol { list-style: none; }
```

## Flexbox Layout

```css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #333;
  color: white;
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-menu a {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s;
}

.nav-menu a:hover { background: #555; }

@media (max-width: 768px) {
  .nav { flex-direction: column; gap: 1rem; }
  .nav-menu { flex-direction: column; }
}
```

## CSS Grid Page Layout

```css
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
}

.header { grid-area: header; background: #333; color: white; padding: 1rem; }
.sidebar { grid-area: sidebar; background: #f8f9fa; padding: 1rem; }
.main { grid-area: main; padding: 2rem; }
.footer { grid-area: footer; background: #333; color: white; padding: 1rem; text-align: center; }

@media (max-width: 768px) {
  .page {
    grid-template-areas: "header" "main" "sidebar" "footer";
    grid-template-columns: 1fr;
  }
}
```

## Custom Properties for Theming

```css
:root {
  --primary: #2563eb;
  --surface: #ffffff;
  --text: #1a1a2e;
  --border: #e2e8f0;
  --radius: 8px;
}

.dark {
  --primary: #3b82f6;
  --surface: #1e293b;
  --text: #e2e8f0;
  --border: #334155;
}

.card {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
```

## Animations and Transitions

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

.button {
  background: var(--primary);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

@media (prefers-reduced-motion: reduce) {
  .fade-in, .button { animation: none; transition: none; }
}
```

## Accessibility

```css
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}
```
