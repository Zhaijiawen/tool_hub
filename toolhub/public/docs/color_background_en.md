# Color Models: HEX, RGB, HSL and Why There Are So Many

Working with color on the web means jumping between formats constantly. Here's what each one is for and why they all exist.

## RGB: What Your Screen Actually Uses

RGB is the additive color model -- mix red, green, and blue light at different intensities and you get any color. Each channel goes from 0 to 255, giving you 16.7 million possible colors. In CSS it's `rgb(255, 0, 0)` for pure red.

With alpha (opacity), it's `rgba(255, 0, 0, 0.5)` for 50% transparent red. The alpha channel goes from 0 (fully transparent) to 1 (fully opaque).

## HEX: RGB in Base-16

HEX is just RGB written in hexadecimal instead of decimal. `#FF0000` means R=255, G=0, B=0 -- same as `rgb(255, 0, 0)`. It's the most compact format, which is why CSS and design tools default to it.

Short hex exists too: `#F00` is the same as `#FF0000`. Each digit gets doubled. With alpha, you get 8-digit hex: `#FF000080` is red at 50% opacity.

## HSL: Designed for Humans, Not Machines

RGB and HEX are great for computers but terrible for humans. Want "a slightly lighter blue"? With HSL you just tweak the Lightness value. With RGB you'd need a calculator.

- **Hue**: The color on the wheel, 0-360 degrees. 0=red, 120=green, 240=blue.
- **Saturation**: How intense the color is. 0% is gray, 100% is full color.
- **Lightness**: How bright. 0% is black, 50% is the pure hue, 100% is white.

`hsl(210, 100%, 56%)` gives you a nice sky blue. Change the third number and you get lighter or darker variants of the same color -- perfect for generating color palettes programmatically.

## HSV/HSB: Similar but Different

HSV (or HSB, same thing) uses Value/Brightness instead of Lightness. `hsv(0, 100%, 100%)` is pure red. It's common in design tools like Photoshop's color picker. The difference from HSL matters most when you're converting between them -- the math is non-trivial.

## CMYK: For Print

The subtractive model used in printing. Four channels: Cyan, Magenta, Yellow, and Key (black). If you're designing something that'll be printed, you care about CMYK. For screen-only work you can safely ignore it.

## Quick Conversion Reference

```
#3498db = rgb(52, 152, 219) = hsl(204, 70%, 53%)
```

Converting between these is straightforward for HEX/RGB (just base conversion) but requires actual math for HSL/HSV. That's what the tool handles for you.
