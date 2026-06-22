# Why Calculators Aren't as Simple as They Look

You'd think a calculator just does math -- you press buttons, numbers come out. But there's actually some interesting stuff happening under the hood, especially in JavaScript.

## The Floating-Point Elephant in the Room

If you've ever typed `0.1 + 0.2` into a browser console and gotten `0.30000000000000004`, you've met IEEE 754. Computers store numbers in binary, and some decimals -- like 0.1 and 0.2 -- are repeating fractions in binary. They can't be stored exactly, just like 1/3 can't be written exactly as a decimal.

```javascript
0.1 + 0.2 === 0.3   // false -- yep, still false
0.1 + 0.2           // 0.30000000000000004
```

For most day-to-day calculations this doesn't matter. But if you're doing financial math or anything that needs exact decimal precision, you'd want a library like decimal.js or big.js. Our calculator runs in JavaScript so the same IEEE 754 rules apply -- just something to keep in the back of your mind.

## Why 2 + 3 × 4 Is 14, Not 20

Operator precedence -- PEMDAS if you learned it in the US, BODMAS in the UK, same thing really. Multiplication and division happen before addition and subtraction. When they're at the same level, you go left to right.

So `2 + 3 × 4` is `2 + 12 = 14`. If you meant `(2 + 3) × 4`, that's what parentheses are for. The calculator respects this order, so use `(` and `)` when you need to override it.

## Division: It's Always a Float Here

Some languages do integer division when you divide two integers -- Python's `7 // 2` gives you `3`. JavaScript doesn't play that game. The `/` operator always returns a float: `7 / 2 = 3.5`. If you want integer division in the calculator, you can do `Math.floor(7/2)` but honestly it's easier to just read the decimal result.

## Scientific Notation at a Glance

`1.5e6` means 1.5 times 10 to the 6th power -- that's 1,500,000. `2.5e-3` means 0.0025. The calculator handles both, which is handy when you're dealing with very large or very small numbers.

## Constants Worth Knowing

| Constant | Approximate Value |
|---|---|
| π (pi) | 3.14159265358979 |
| e (Euler's number) | 2.71828182845905 |
| √2 | 1.41421356237310 |
| φ (golden ratio) | 1.61803398874989 |

You won't need these every day, but when you're calculating circle areas or compound interest, having π and e built in saves you from typing out long decimals.
