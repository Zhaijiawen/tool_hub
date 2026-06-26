# CSS — Using the Formatter

Paste messy CSS into the editor, hit format, and the result appears in place. The formatter normalizes indentation, line breaks, and spacing.

Before:

```css
body{margin:0;padding:0;font-family:Arial,sans-serif;}.container{width:100%;max-width:1200px;margin:0 auto;padding:20px;}.header{background-color:#333;color:white;padding:1rem;}
```

After:

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

## Common Pitfalls

**Missing semicolons** — a frequent issue, formatting makes misaligned properties easier to spot:

```css
/* Broken */
body { margin: 0 padding: 0 }

/* Correct */
body { margin: 0; padding: 0; }
```

**Unclosed braces** — formatting helps reveal structurally mismatched blocks.

## Formatting Tips

Pick 2-space indent and stick with it. Order your properties logically: positioning, box model, typography, visual, misc. Comment major sections with `/* Section */` headers.

```css
.card {
  /* Positioning */
  position: relative;

  /* Box model */
  width: 300px;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;

  /* Typography */
  font-size: 1rem;
  color: #333;

  /* Visual */
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

## Custom Properties

Format CSS variables consistently:

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

## Media Queries

Keep them at the bottom, mobile-first:

```css
/* Base (mobile) */
.container { width: 100%; padding: 10px; }

@media (min-width: 768px) {
  .container { width: 750px; margin: 0 auto; }
}

@media (min-width: 1024px) {
  .container { width: 1000px; }
}
```
