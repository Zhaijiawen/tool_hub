# CSS — What's Going On Under the Hood

CSS was first proposed by Hakon Wium Lie in 1994. The idea was radical at the time: separate content (HTML) from presentation (CSS). Before CSS, styling was done with `<font>` tags and table layouts. The first spec (CSS1) landed in 1996, and we've been iterating ever since.

## The Cascade Is the Whole Point

Three things determine which style wins when multiple rules target the same element:

1. **Origin** — browser defaults < user styles < author styles < `!important` author < `!important` user
2. **Specificity** — inline style > ID > class/attribute/pseudo-class > element/pseudo-element. Think of it as a four-digit number: (0,0,0,0).
3. **Source order** — last rule wins when specificity ties

```css
p { color: black; }              /* (0,0,0,1) */
.intro { color: blue; }         /* (0,0,1,0) */
#main p { color: red; }         /* (0,1,0,1) — this wins */
```

## The Box Model

Every element is a box: content, padding, border, margin. `box-sizing: border-box` includes padding and border in width/height calculations. This is the universal reset you want in every project:

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

## Modern Layout

**Flexbox** is for one-dimensional layouts (row or column). `display: flex`, `justify-content`, `align-items`, `gap`. It solves vertical centering, equal-height columns, and spacing — things that were absurdly hard before.

**Grid** is for two-dimensional layouts. `display: grid`, `grid-template-columns`, `grid-template-areas`. Define your layout in the parent and things just flow.

```css
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
}
```

## Custom Properties Changed Everything

```css
:root {
  --primary: #2563eb;
  --spacing: 1rem;
}

.card {
  padding: var(--spacing);
  background: var(--primary);
}
```

No preprocessor needed for variables, and they cascade (unlike Sass variables). Theme switching is trivial: change the values on a data attribute or class, everything updates.

## Responsive Design

Mobile-first means writing base styles for small screens, then `@media (min-width: ...)` for larger ones. `clamp()` is the modern way for fluid typography:

```css
h1 { font-size: clamp(1.5rem, 4vw, 3rem); }
```

## Things to Know

- CSS isn't a programming language — no loops, no if/else, no functions (though `@container` queries and `:has()` are closing the gap)
- Specificity wars are a code smell. If you're writing `#id .class div p span`, restructure.
- `z-index` only works on positioned elements (`position` not `static`)
- `will-change` tells the browser to optimize for upcoming animations, but overusing it wastes GPU memory
