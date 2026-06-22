# Color Picker & Converter -- How to Use

Pick a color visually or type a value in any format. The tool shows it in every format at once.

## Picking a Color

Use the color wheel or gradient panel to visually select a color. As you drag, all the format values update in real time: HEX, RGB, HSL, HSV, CMYK. You can also fine-tune with the sliders for each channel.

## Converting Between Formats

Already have a color value? Paste it in any supported format and the tool converts it to everything else instantly:

- **HEX**: `#3498db`, `#RGB` short form, 8-digit `#RRGGBBAA` for transparency
- **RGB**: `rgb(52, 152, 219)` or `rgba(52, 152, 219, 0.5)`
- **HSL**: `hsl(204, 70%, 53%)` or `hsla(204, 70%, 53%, 0.5)`
- **HSV**: hue, saturation, value as numbers

Click the copy icon next to any format to grab just that value.

## When Each Format Shines

- **HEX**: CSS, Tailwind config, design handoff docs. Most tools expect hex by default.
- **RGB/RGBA**: When you need alpha transparency in a widely supported format. Also useful for JS canvas operations.
- **HSL**: Generating color scales. Want 5 shades of the same blue? Keep H and S fixed, vary L from 90% to 10%. Way easier than tweaking RGB values.
- **HSV**: If you're collaborating with designers who use Photoshop or similar tools, this is likely what they're looking at.
- **CMYK**: Only relevant for print. The tool shows it for reference but the conversion is approximate -- actual print colors depend on paper, ink, and press calibration.

## Opacity Control

The alpha slider lets you set transparency for any color. This is independent of the color format -- you can have a HEX color with alpha (8-digit hex), RGBA, or HSLA. The tool shows all three.

## Quick Tip for Accessibility

If you're picking colors for text on a background, eyeball the contrast. For WCAG compliance you need specific contrast ratios (4.5:1 for normal text, 3:1 for large text). The tool doesn't calculate contrast ratio directly, but having the RGB values makes it easy to plug into a contrast checker.
