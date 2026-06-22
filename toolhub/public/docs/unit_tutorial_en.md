# Unit Converter — Usage Tutorial

The unit converter works the same way across all categories — pick what you're converting, enter a value, and get the result. But there are a few details worth knowing that'll save you time.

Start by selecting a category. The converter covers length, mass, temperature, area, volume, speed, pressure, energy, power, data storage, time, and more. The category determines which units appear in the dropdowns, so pick this first.

Enter the number you want to convert. The field handles decimals, so `2.5` miles works just as well as `100` kilometers. For very large or small numbers, you can use scientific notation — `1.5e6` is 1.5 million.

Pick your "from" unit in the left dropdown, your "to" unit in the right dropdown. The result updates instantly as you change any of these.

Hit the swap button (the two arrows) to flip the from/to units. This is faster than manually reselecting when you're going back and forth between two units.

## Temperature is different (again)

Temperature conversions don't use a simple ratio, so the math works differently. When converting `100degC` to `degF`, the converter applies the full formula `(100 x 9/5) + 32 = 212degF`. When converting `32degF` to `degC`, it applies `(32 - 32) x 5/9 = 0degC`.

This means you can't just eyeball the ratio and estimate. 30degC is 86degF — not "about 60" if you just doubled it. The converter does the real math so you don't have to.

## Digital storage: the GB vs GiB trap

The data storage category includes both decimal units (KB, MB, GB, TB — powers of 1000) and binary units (KiB, MiB, GiB, TiB — powers of 1024). If you're checking how much space a file will actually take on disk, use the binary units. If you're reading specs from a manufacturer, they're almost certainly using decimal.

1 GB = 1000 MB = 1,000,000,000 bytes
1 GiB = 1024 MiB = 1,073,741,824 bytes

The difference grows with scale. A 1 TB hard drive is about 0.909 TiB (or 931 GiB). At the petabyte scale, the gap is over 12%. The converter helps you figure out exactly what the marketing copy means in the units your OS actually displays.

## Precision and display

The converter rounds results to a practical number of decimal places — usually 4 to 6 significant digits. For most everyday conversions (cooking, travel, shopping), this is more than enough. For scientific work where precision matters to 10+ decimal places, you'd want a purpose-built tool anyway.

When results are very large or very small, they'll show in scientific notation (like `1.234e-5`). This prevents the display from being a long string of zeros.

## Practical uses beyond the obvious

Cooking and travel are the obvious ones, but there are others:
- **Shipping and logistics**: Converting between kilograms and pounds for package weight, or between centimeters and inches for box dimensions.
- **Fitness**: Body weight in kg vs lb, running distances in km vs miles, pool lengths in meters vs yards.
- **Electronics**: Component dimensions are often specified in mils (thousandths of an inch) or millimeters depending on the manufacturer.
- **Gaming**: Monitor refresh rates in Hz, mouse DPI conversions, screen size in inches vs centimeters for fitting a desk setup.
