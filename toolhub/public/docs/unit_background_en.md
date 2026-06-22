# Unit Converter — Technical Background

Unit conversion is one of those things that sounds trivial until you're staring at a recipe in metric when your measuring cups are imperial, or trying to figure out whether 100 km/h is fast enough for the Autobahn. The converter covers length, mass, temperature, area, volume, speed, pressure, energy, power, data storage, and time — basically every conversion you'd need outside of a specialized engineering tool.

## The measurement systems

There are really two systems you keep running into:

**SI (metric)** is what most of the world uses and what science runs on. Base units are meter (length), kilogram (mass), second (time), kelvin (temperature). Everything else derives from these. The beauty of metric is that units scale by powers of 10 — kilo means 1,000, centi means 1/100, and so on. No weird ratios to memorize.

**Imperial / US Customary** is what the US, Liberia, and Myanmar use. It's messier: 12 inches in a foot, 3 feet in a yard, 1,760 yards in a mile. None of these numbers are powers of anything. It's not going anywhere though — American recipes, construction, and speed limits all use imperial.

The converter handles both directions for all categories, so you don't need to remember that a pound is 453.592 grams or that an acre is 4,047 square meters.

## Temperature is special

Most unit conversions are simple multiplication by a constant factor — 1 inch = 2.54 cm, always. Temperature isn't like that. Celsius and Fahrenheit have different zero points (water freezes at 0degC but 32degF), so conversion requires an offset:

- degF = (degC x 9/5) + 32
- degC = (degF - 32) x 5/9

Kelvin starts at absolute zero (-273.15degC), so K = degC + 273.15. No multiplication needed between Celsius and Kelvin — they use the same "degree size," just different starting points.

This is why the converter handles temperature separately from other categories. You can't just multiply by a ratio and call it done.

## Common conversion factors

The ones you'll actually use:

| Category | From | To | Factor |
|---|---|---|---|
| Length | inch | cm | x 2.54 |
| Length | mile | km | x 1.60934 |
| Length | foot | meter | x 0.3048 |
| Mass | pound | kg | x 0.453592 |
| Mass | ounce | gram | x 28.3495 |
| Volume | US gallon | liter | x 3.78541 |
| Volume | US cup | mL | x 236.588 |
| Speed | mph | km/h | x 1.60934 |
| Speed | knot | km/h | x 1.852 |
| Area | acre | m^2 | x 4046.86 |
| Area | sq foot | m^2 | x 0.092903 |
| Data | GB | GiB | x 0.931323 |

Wait, that last one — GB vs GiB? Yep. Hard drive manufacturers use decimal gigabytes (1 GB = 10^9 bytes), while operating systems report in binary gibibytes (1 GiB = 2^30 bytes = 1,073,741,824 bytes). That's why your "1 TB" drive shows up as 931 GB in Windows. The converter includes both so you can verify you're not being shortchanged (you're not — it's just different units).

## The costly conversion failures

The Mars Climate Orbiter (1999) — a $125 million spacecraft — burned up in the Martian atmosphere because Lockheed Martin's navigation software output thrust data in pound-force seconds (imperial) while NASA's JPL expected newton-seconds (metric). The spacecraft entered the atmosphere 57 km too low and disintegrated.

In 1983, Air Canada Flight 143 ran out of fuel mid-flight because the ground crew calculated fuel load in pounds instead of kilograms — the plane had half the fuel it needed. The pilots managed to glide to an emergency landing on a decommissioned runway in Gimli, Manitoba. The incident is now known as the "Gimli Glider."

These aren't just trivia — they're why a unit converter isn't a luxury tool. Getting the conversion right matters.
