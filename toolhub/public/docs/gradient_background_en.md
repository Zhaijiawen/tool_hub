# Gradient Color Generator - Technical Background

CSS gradients have been around long enough that it's easy to forget how useful they are. No image files, no HTTP requests, no blurry scaling -- the browser renders them natively at any resolution. If you're still slicing gradient PNGs from Figma, it's time to stop.

## The three gradient types

### Linear gradients

The one you use 90% of the time. Colors flow along a straight line. The angle system takes a minute to memorize: `0deg` goes bottom-to-top, `90deg` goes left-to-right, `180deg` is top-to-bottom. Or just use `to right`, `to bottom left`, etc. -- way more readable.

```css
/* Basic two-color */
background: linear-gradient(#e66465, #9198e5);

/* Angled */
background: linear-gradient(45deg, #ff6b6b, #4ecdc4);

/* Direction keywords -- easier to parse at a glance */
background: linear-gradient(to right, #667eea, #764ba2);

/* Multiple stops */
background: linear-gradient(to right, #f7971e, #ffd200, #21d4fd, #b721ff);
```

### Radial gradients

Colors spread outward from a center point. You can control the shape (`circle` vs `ellipse`), the size (`closest-side`, `farthest-corner`, etc.), and where the center sits.

```css
/* Simple radial */
background: radial-gradient(circle, #ff6b6b, #4ecdc4);

/* Offset the center -- great for spotlight effects */
background: radial-gradient(circle at top left, #f7971e, #ffd200);

/* Control the spread */
background: radial-gradient(circle closest-side, #ee9ca7, #ffdde1);
```

### Conic gradients

Added in CSS Level 4, so check your browser targets. Colors rotate around a center point like a pie chart or color wheel. Super useful for circular progress indicators and color pickers, but older browsers (pre-2020-ish) won't render them.

```css
/* Pie chart effect */
background: conic-gradient(red 0%, yellow 33%, green 67%);

/* Start from a specific angle */
background: conic-gradient(from 90deg, #ff6b6b, #4ecdc4, #ff6b6b);

/* Full color wheel */
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

## Color stops

Every gradient is defined by color stops -- positions along the gradient line where a color sits. If you don't specify positions, the browser spaces them evenly. But you can get creative:

```css
/* Even spacing (default) */
background: linear-gradient(red, yellow, green);

/* Pin colors to specific spots */
background: linear-gradient(red 0%, yellow 30%, green 100%);

/* Hard stops -- two colors at the same position creates a sharp edge */
background: linear-gradient(red 50%, blue 50%);
```

## Design tips that actually matter

Pick 2-3 colors max. More than that usually looks like a messy rainbow unless you really know what you're doing. Adjacent colors on the wheel (analogous) give you a smooth, professional look. Opposite colors (complementary) create energy and pop.

When text sits on a gradient, watch the contrast in the middle transition zone. Colors blend there and can create low-contrast spots you don't notice until you actually put text over them. WCAG says 4.5:1 minimum for body text -- test it.

And here's a performance detail people overlook: gradients defined as CSS custom properties can be swapped in dark mode without re-rendering the whole page. Way smoother than toggling class-based overrides:

```css
:root {
  --card-bg: linear-gradient(135deg, #f5f7fa, #c3cfe2);
}
[data-theme="dark"] {
  --card-bg: linear-gradient(135deg, #1a1a2e, #16213e);
}
```
