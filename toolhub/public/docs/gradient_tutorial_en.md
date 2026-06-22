# Gradient Color Generator - Tutorial

Visual editor for CSS gradients -- tweak colors, angles, and stops in real time, then copy the CSS when it looks right. No hand-coding required.

## The workflow

### Pick your gradient type

Three options at the top:

- **Linear** -- the one you'll use the most. Colors flow in a straight line.
- **Radial** -- colors radiate from a center point. Great for spotlights and avatars.
- **Conic** -- colors spin around a center. Pie charts, color wheels, that kind of thing.

### Set your colors

You start with two color stops. Click a swatch to open the color picker. Add more stops with the "+" button (up to 5), remove one by clicking the "x". Each stop has a position slider -- drag it to control where that color peaks in the gradient.

A tip: when you're doing a multi-stop gradient, think about the rhythm of the stops. Evenly spaced (0%, 33%, 66%, 100%) looks balanced; clustering stops close together creates sudden transitions.

### Dial in the direction

For linear gradients, spin the angle rotator or hit one of the direction presets (right, down, diagonal). Radial gradients let you move the center point around. Conic gradients have a starting angle you can offset.

### Preview and copy

The big preview block updates instantly as you tweak. When it looks good, grab the CSS from the code area at the bottom -- click Copy and paste it straight into your stylesheet.

## Direction presets

| Button | Direction | CSS |
|--------|-----------|-----|
| -> | Right | `to right` |
| v | Down | `to bottom` |
| diagonal up | Top right | `to top right` |
| diagonal down | Bottom right | `to bottom right` |

The presets cover the most common angles. For anything else, use the angle slider.

## Color combinations that work

Some tried-and-tested pairs to get you started:

**Analogous (safe, professional):**
- Blue-purple: `#667eea` to `#764ba2`
- Orange-gold: `#f7971e` to `#ffd200`
- Teal-green: `#11998e` to `#38ef7d`

**Complementary (vibrant, eye-catching):**
- Purple to green: `#8360c3` to `#2ebf91`
- Blue to coral: `#4facfe` to `#f77062`

**Rainbow (fun but easy to overdo):**
Stack 4-5 stops in rainbow order (red, orange, yellow, green, blue, purple). Looks great on a conic gradient, can get chaotic on a linear one.

## What you'll get

The tool outputs standard CSS `background` properties:

```
/* Linear */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Radial */
background: radial-gradient(circle, #f7971e 0%, #ffd200 100%);

/* Multi-stop */
background: linear-gradient(to right, #f7971e 0%, #ffd200 33%, #21d4fd 66%, #b721ff 100%);
```

## Practical notes

Trust the preview more than the numbers. A gradient that looks great at `47deg` might look weird at `45deg` -- the preview tells the truth. Save gradients you like as CSS custom properties in a snippet library so you're not reinventing them every project. And always test your gradient in both light and dark modes -- what looks subtle on a white background might be nearly invisible on a dark one, or vice versa.
