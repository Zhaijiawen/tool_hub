# Gradient Color Generator - Tutorial

## Getting Started

The gradient color generator lets you create beautiful gradient effects through a visual interface — no CSS coding required — and instantly generates reusable CSS code.

## Basic Usage

### Step 1: Select Gradient Type

Choose the gradient type at the top:
- **Linear**: Colors transition along a straight line — the most common type
- **Radial**: Colors radiate outward from a center point
- **Conic**: Colors rotate around a center point

### Step 2: Set Colors

The tool starts with 2 color stops by default. Click a color swatch to open the color picker and choose your desired color.

- **Add a color stop**: Click the "+" button (up to 5 stops supported)
- **Remove a color stop**: Click the "×" button next to a color stop
- **Adjust position**: Drag the slider to adjust the percentage position of a color stop

### Step 3: Adjust Direction/Angle

- **Linear gradient**: Use the angle rotator (0°-360°) or direction shortcut buttons
- **Radial gradient**: Adjust the gradient center position (horizontal/vertical percentage)
- **Conic gradient**: Adjust the starting angle

### Step 4: Preview the Effect

The large preview block in the center shows the gradient in real time and updates instantly as you adjust parameters.

### Step 5: Copy the CSS Code

The code area at the bottom displays the final CSS property. Click the **Copy** button to copy it to your clipboard, then paste it directly into your CSS file.

## Common Direction Presets

| Button | Direction | CSS Equivalent |
|--------|-----------|---------------|
| → | Right | `to right` |
| ↓ | Down | `to bottom` |
| ↗ | Top right | `to top right` |
| ↘ | Bottom right | `to bottom right` |

## Color Selection Tips

### Analogous Gradients (recommended for beginners)
Choose similar colors, such as light blue → dark blue. The visual effect is natural and harmonious.

Example color pairs:
- Blue-purple: `#667eea` → `#764ba2`
- Orange: `#f7971e` → `#ffd200`
- Teal-green: `#11998e` → `#38ef7d`

### Complementary Gradients (vibrant look)
Use opposite colors on the color wheel for a strong visual impact.

Example color pairs:
- Purple → Orange: `#8360c3` → `#2ebf91`
- Blue → Pink: `#4facfe` → `#f77062`

### Multi-color Rainbow Gradient
Add 4-5 color stops arranged in rainbow order (red → orange → yellow → green → blue → purple).

## Sample Generated CSS Output

The tool generates CSS like the following based on your settings:

Linear gradient:
```
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

Radial gradient:
```
background: radial-gradient(circle, #f7971e 0%, #ffd200 100%);
```

Multi-color stop:
```
background: linear-gradient(to right, #f7971e 0%, #ffd200 33%, #21d4fd 66%, #b721ff 100%);
```

## Best Practices

1. **Focus on the preview**: When adjusting parameters, look at the large preview block rather than just the numbers
2. **Save frequently used gradients**: Copy the CSS code to a snippet library for easy reuse
3. **Test in dark mode**: Check whether the gradient still looks good in your project's dark mode
4. **Mind text readability**: When overlaying text, avoid placing important content in the middle color transition zone

