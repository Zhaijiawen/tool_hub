# Color Picker & Converter — Technical Background

## Color Models

### RGB (Red, Green, Blue)
The additive color model used by screens and digital displays. Each channel ranges from 0 to 255.
- `rgb(255, 0, 0)` — pure red
- `rgb(0, 128, 255)` — sky blue

### HEX (Hexadecimal)
A compact representation of RGB using base-16 notation. Widely used in web development.
- `#FF0000` — red
- `#0080FF` — sky blue
- Short form: `#F00` is equivalent to `#FF0000`

### HSL (Hue, Saturation, Lightness)
A more intuitive model for humans:
- **Hue**: color angle on the color wheel (0°–360°)
- **Saturation**: color intensity (0%–100%)
- **Lightness**: brightness from black to white (0%–100%)

`hsl(0, 100%, 50%)` — pure red
`hsl(210, 100%, 56%)` — sky blue

### HSV / HSB (Hue, Saturation, Value/Brightness)
Similar to HSL but uses Value (brightness) instead of Lightness. Common in design tools like Photoshop.

### CMYK (Cyan, Magenta, Yellow, Key/Black)
The subtractive color model used in printing. Channels are expressed as percentages.

## Alpha (Opacity)

Colors can include an alpha channel to define transparency:
- `rgba(255, 0, 0, 0.5)` — 50% transparent red
- `#FF000080` — red with 50% alpha in 8-digit hex

## Color in CSS

```css
color: #3498db;
background: rgb(52, 152, 219);
border: 2px solid hsl(204, 70%, 53%);
```

## Web-Safe Colors

Historically, 216 colors were considered "web-safe" because they rendered consistently across 8-bit monitors. With modern 24-bit displays, this restriction is no longer relevant.

