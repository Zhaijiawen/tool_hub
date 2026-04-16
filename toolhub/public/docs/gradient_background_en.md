# Gradient Color Generator - Technical Background

## Introduction to CSS Gradients

CSS gradients create smooth color transitions rendered entirely by the browser — no image files needed. They scale losslessly and are lightweight in size.

## Gradient Types

### Linear Gradient

Colors transition along a straight line. The most commonly used gradient type.

```css
/* Basic syntax */
background: linear-gradient(direction, color-stop1, color-stop2, ...);

/* Top to bottom (default) */
background: linear-gradient(#e66465, #9198e5);

/* Specified angle */
background: linear-gradient(45deg, #ff6b6b, #4ecdc4);

/* Specified direction */
background: linear-gradient(to right, #667eea, #764ba2);

/* Multiple color stops */
background: linear-gradient(to right, #f7971e, #ffd200, #21d4fd, #b721ff);
```

**Angle reference:**
- `0deg`: bottom to top
- `90deg`: left to right
- `180deg`: top to bottom (same as `to bottom`)
- `270deg`: right to left

### Radial Gradient

Colors radiate outward from a center point.

```css
/* Basic syntax */
background: radial-gradient(shape size at position, color-stop1, color-stop2);

/* Circular gradient */
background: radial-gradient(circle, #ff6b6b, #4ecdc4);

/* Elliptical gradient (default) */
background: radial-gradient(ellipse, #667eea, #764ba2);

/* Custom center position */
background: radial-gradient(circle at top left, #f7971e, #ffd200);
```

### Conic Gradient

Colors rotate around a center point — similar to a pie chart. Added in CSS Level 4.

```css
/* Basic syntax */
background: conic-gradient(color-stop1, color-stop2, ...);

/* Basic pie chart */
background: conic-gradient(red 0%, yellow 33%, green 67%);

/* With angle offset */
background: conic-gradient(from 90deg, #ff6b6b, #4ecdc4, #ff6b6b);

/* Color wheel */
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

## Color Stops

Color stops define where each color appears in the gradient:

```css
/* Evenly distributed (auto-calculated) */
background: linear-gradient(red, yellow, green);

/* Manual position (percentage) */
background: linear-gradient(red 0%, yellow 30%, green 100%);

/* Hard edge effect (same position, two colors) */
background: linear-gradient(red 50%, blue 50%);
```

## Browser Compatibility

| Gradient Type | Chrome | Firefox | Safari | Edge |
|--------------|--------|---------|--------|------|
| linear-gradient | 26+ | 16+ | 6.1+ | 12+ |
| radial-gradient | 26+ | 16+ | 6.1+ | 12+ |
| conic-gradient | 69+ | 83+ | 12.1+ | 79+ |

> `conic-gradient` is not supported in older browsers — check compatibility requirements.

## Design Best Practices

### Color Selection Principles
1. **Analogous gradients**: Use adjacent hues on the color wheel for harmonious gradients
2. **Complementary gradients**: Use complementary colors for vibrant, energetic effects
3. **Limit color count**: 2-3 colors are most common; more than 5 often looks cluttered

### Readability Considerations
- When text overlays a gradient background, ensure sufficient contrast (WCAG standard: at least 4.5:1 for body text)
- Avoid placing important text in the middle transition zone

### Performance Benefits
- CSS gradients require no network requests, loading faster than images
- Can be combined with CSS variables and media queries for theme switching

