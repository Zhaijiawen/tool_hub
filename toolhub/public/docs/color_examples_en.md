# Color Conversion Examples

Practical examples of converting between color formats.

## HEX to Everything

**Input:** `#3498db` (that nice blue everyone uses)

**Output across formats:**
- RGB: `rgb(52, 152, 219)`
- HSL: `hsl(204, 70%, 53%)`
- HSV: `hsv(204, 76%, 86%)`
- CMYK: `cmyk(76%, 31%, 0%, 14%)`

Notice that the CMYK values add up to more than 100% -- that's normal for the subtractive model.

## HSL to HEX and RGB

**Input:** `hsl(120, 100%, 25%)` (pure green, relatively dark)

**Output:**
- HEX: `#007F00`
- RGB: `rgb(0, 127, 0)`

At 25% lightness with full saturation, you get a dark green that's richer than just lowering the G channel in RGB would give you.

## Working with Transparency

**Input:** `rgba(255, 99, 71, 0.6)` (Tomato red at 60% opacity)

**Output:**
- HEX (8-digit): `#FF634799` -- the last two hex digits are the alpha
- HSL with alpha: `hsla(9, 100%, 64%, 0.6)`

The 8-digit hex format is supported in all modern browsers but it's less common to see in the wild than RGBA.

## Common Web Colors Reference

| Color | HEX | RGB |
|---|---|---|
| Red | `#FF0000` | `rgb(255, 0, 0)` |
| Green | `#008000` | `rgb(0, 128, 0)` |
| Blue | `#0000FF` | `rgb(0, 0, 255)` |
| White | `#FFFFFF` | `rgb(255, 255, 255)` |
| Black | `#000000` | `rgb(0, 0, 0)` |
| Gray | `#808080` | `rgb(128, 128, 128)` |

These six are worth keeping in muscle memory. You'll type them a lot.

## Real-World Tip: Generating a Monochromatic Palette with HSL

Want 5 shades of the same blue for a design system? Instead of guessing RGB values:

1. Pick your base blue: `hsl(210, 80%, 50%)`
2. Lighter shades: `hsl(210, 80%, 70%)`, `hsl(210, 80%, 85%)`
3. Darker shades: `hsl(210, 80%, 35%)`, `hsl(210, 80%, 20%)`

Same hue, same saturation, just different lightness. The colors are guaranteed to look cohesive because they're mathematically related. Use the converter to get the HEX values you need for your CSS variables or Tailwind config.
