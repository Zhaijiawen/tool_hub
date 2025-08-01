# CSS Usage Tutorial

## Getting Started with CSS Formatting

The CSS formatter tool helps you organize and beautify CSS code, making it more readable and maintainable. This tutorial will guide you through the process of formatting CSS code effectively.

## Basic Formatting Process

### Step 1: Prepare Your CSS Code

Start by gathering the CSS code you want to format. This could be:
- CSS stylesheets
- CSS fragments
- Inline styles
- CSS within HTML files
- Complex nested rules
- Media queries

### Step 2: Input Your Code

1. Open the CSS formatter tool
2. Locate the input area (usually on the left side)
3. Paste your CSS code into the input box
4. Ensure your code is syntactically valid (the tool will validate it)

Example input:
```css
body{margin:0;padding:0;font-family:Arial,sans-serif;}.container{width:100%;max-width:1200px;margin:0 auto;padding:20px;}.header{background-color:#333;color:white;padding:1rem;text-align:center;}.nav{display:flex;justify-content:space-between;align-items:center;}.nav a{color:white;text-decoration:none;padding:10px;}.nav a:hover{background-color:#555;}
```

### Step 3: Select Formatting Options

Before formatting, consider these options:

#### Indentation Settings
- **2 spaces**: Standard indentation, suitable for most use cases
- **4 spaces**: More readable for complex nested structures
- **Tabs**: Traditional indentation method (less common in modern CSS)

#### Other Options
- **Line breaks**: Break long property lists to multiple lines
- **Sort properties**: Alphabetically sort CSS properties
- **Remove comments**: Delete CSS comments
- **Preserve comments**: Keep CSS comments intact
- **Compress whitespace**: Remove unnecessary whitespace

### Step 4: Format Your Code

1. Click the "Format" button
2. Wait for the tool to process your code
3. View the formatted output on the right side

Expected output:
```css
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  background-color: #333;
  color: white;
  padding: 1rem;
  text-align: center;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav a {
  color: white;
  text-decoration: none;
  padding: 10px;
}

.nav a:hover {
  background-color: #555;
}
```

## Advanced Formatting Features

### Syntax Validation

The tool automatically validates your CSS syntax and provides helpful error messages:

#### Common Errors and Solutions

**Missing Semicolons**
```css
/* Error */
body {
  margin: 0
  padding: 0
}

/* Correct */
body {
  margin: 0;
  padding: 0;
}
```

**Invalid Property Values**
```css
/* Error */
.element {
  color: invalid-color;
  width: auto-px;
}

/* Correct */
.element {
  color: #ff0000;
  width: 100px;
}
```

**Unclosed Braces**
```css
/* Error */
.container {
  width: 100%;
  max-width: 1200px;

/* Correct */
.container {
  width: 100%;
  max-width: 1200px;
}
```

### Error Handling

When the tool encounters errors:

1. **Syntax errors**: The tool highlights problematic lines
2. **Validation messages**: Clearly explains what needs to be fixed
3. **Auto-correction**: Some tools can automatically fix common issues

## Tool Features

### Copy Function

1. Click the "Copy" button next to the formatted output
2. The formatted CSS is copied to your clipboard
3. Paste it wherever you need it

### Clear Function

1. Click the "Clear" button to reset input and output areas
2. Useful when processing multiple code snippets

### Export Options

Some formatters provide additional export options:
- Download as `.css` file
- Export as formatted text
- Share via URL (if supported)

## CSS Formatting Best Practices

### 1. Consistent Indentation

Choose an indentation style and stick to it:
```css
/* Good practice - 2 spaces */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
```

### 2. Logical Property Order

Organize properties logically:
```css
/* Good practice */
.element {
  /* Positioning */
  position: relative;
  top: 0;
  left: 0;
  
  /* Box model */
  width: 100px;
  height: 100px;
  margin: 10px;
  padding: 20px;
  border: 1px solid #ccc;
  
  /* Typography */
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: #333;
  
  /* Visual */
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

### 3. Meaningful Selector Names

Use descriptive class names:
```css
/* Good practice */
.article-header { }
.primary-button { }
.navigation-menu { }

/* Avoid */
.div1 { }
.red { }
.big { }
```

### 4. Proper Commenting

Use comments to document your CSS:
```css
/* Header styles */
.header {
  background-color: #333;
  color: white;
  padding: 1rem;
}

/* Navigation styles */
.nav {
  display: flex;
  justify-content: space-between;
}

/* Responsive design */
@media (max-width: 768px) {
  .nav {
    flex-direction: column;
  }
}
```

## Common Issues Troubleshooting

### Problem: "Invalid CSS" Error

**Possible causes:**
- Missing semicolons
- Invalid property values
- Unclosed braces
- Malformed selectors

**Solutions:**
1. Check error messages for line numbers
2. Verify syntax correctness
3. Add missing semicolons
4. Check for invalid property values

### Problem: Indentation Issues

**Problem:** Inconsistent indentation makes code hard to read

**Solutions:**
1. Use consistent indentation (recommend 2 spaces)
2. Configure your editor to use spaces instead of tabs
3. Use code linting tools to catch indentation issues
4. Enable "format on save" in your editor

### Problem: Long Lines

**Problem:** Very long lines may be difficult to read

**Solutions:**
1. Break long lines at logical points
2. Use appropriate line breaks for readability
3. Consider using CSS custom properties for repeated values
4. Use semantic CSS selectors

## Efficient CSS Formatting Tips

### 1. Use Keyboard Shortcuts

Most CSS formatters support keyboard shortcuts:
- `Ctrl+Shift+F` (Windows/Linux) or `Cmd+Shift+F` (Mac) for formatting
- `Ctrl+C` and `Ctrl+V` for copy/paste operations

### 2. Validate Before Formatting

Always validate your CSS before formatting to catch errors early.

### 3. Keep Backups

Keep backups of original code before making extensive changes.

### 4. Use Version Control

If working with CSS files, use version control to track changes.

### 5. Consider Code Linting

For important CSS code, consider using CSS linters to ensure code quality.

## CSS Comments

Use comments to document your code:

```css
/* Single line comment */
.container {
  /* This is the main container */
  width: 100%;
  max-width: 1200px;
}

/* 
  Multi-line comment
  for complex explanations
  or section headers
*/

/* Header section */
.header {
  background-color: #333;
  color: white;
}
```

## CSS Organization

### 1. Logical Grouping

Organize CSS rules logically:

```css
/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

/* Layout components */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header styles */
.header {
  background-color: #333;
  color: white;
  padding: 1rem;
}

/* Navigation styles */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav a {
  color: white;
  text-decoration: none;
  padding: 10px;
}

.nav a:hover {
  background-color: #555;
}

/* Main content */
.main {
  padding: 2rem 0;
}

/* Footer styles */
.footer {
  background-color: #f5f5f5;
  padding: 1rem;
  text-align: center;
}

/* Responsive design */
@media (max-width: 768px) {
  .nav {
    flex-direction: column;
  }
  
  .container {
    padding: 0 10px;
  }
}
```

### 2. CSS Methodologies

Consider using CSS methodologies for large projects:

#### BEM (Block Element Modifier)
```css
.card { }
.card__title { }
.card__title--large { }
.card__button { }
.card__button--primary { }
```

#### SMACSS (Scalable and Modular Architecture for CSS)
```css
/* Base */
html, body { }
h1, h2, h3 { }

/* Layout */
.l-header { }
.l-main { }
.l-sidebar { }

/* Module */
.btn { }
.btn--primary { }
.btn--secondary { }

/* State */
.is-hidden { }
.is-active { }

/* Theme */
.t-dark { }
.t-light { }
```

## CSS Custom Properties

Format CSS custom properties consistently:

```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --font-family: 'Arial', sans-serif;
  --spacing-unit: 1rem;
  --border-radius: 4px;
}

.button {
  background-color: var(--primary-color);
  font-family: var(--font-family);
  padding: var(--spacing-unit);
  border-radius: var(--border-radius);
}

.button:hover {
  background-color: color-mix(in srgb, var(--primary-color) 80%, black);
}
```

## Media Queries

Format media queries consistently:

```css
/* Mobile first approach */
.container {
  width: 100%;
  padding: 10px;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    width: 750px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    width: 1000px;
  }
}

/* Large desktop */
@media (min-width: 1200px) {
  .container {
    width: 1200px;
  }
}
```

## Flexbox and Grid

Format modern layout systems:

```css
/* Flexbox */
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.flex-item {
  flex: 1;
  min-width: 200px;
}

/* Grid */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  grid-template-areas: 
    "header header header"
    "sidebar main main"
    "footer footer footer";
}

.grid-item {
  grid-column: span 2;
  grid-row: 1 / 3;
}
```

## Animations and Transitions

Format animations and transitions:

```css
/* Transitions */
.button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

/* Animations */
@keyframes slide-in {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animated {
  animation: slide-in 0.5s ease-out;
  animation-fill-mode: forwards;
}
```

## CSS Preprocessors

Format preprocessor code:

### Sass/SCSS
```scss
// Variables
$primary-color: #007bff;
$font-stack: Arial, sans-serif;

// Mixins
@mixin button-style($bg-color) {
  background-color: $bg-color;
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: darken($bg-color, 10%);
  }
}

// Usage
.button {
  @include button-style($primary-color);
}
```

### Less
```less
// Variables
@primary-color: #007bff;
@font-stack: Arial, sans-serif;

// Mixins
.button-style(@bg-color) {
  background-color: @bg-color;
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: darken(@bg-color, 10%);
  }
}

// Usage
.button {
  .button-style(@primary-color);
}
```

## Performance Considerations

Format CSS with performance in mind:

```css
/* Good - Specific selectors */
.nav .nav-item { }

/* Avoid - Overly specific */
body div.container nav ul li a { }

/* Good - Use CSS custom properties */
:root {
  --primary-color: #007bff;
  --spacing-unit: 1rem;
}

.button {
  background-color: var(--primary-color);
  padding: var(--spacing-unit);
}

/* Good - Efficient animations */
.animated {
  transform: translateZ(0); /* Hardware acceleration */
  will-change: transform;
}
```

## Accessibility Considerations

Format CSS with accessibility in mind:

```css
/* Focus indicators */
.button:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .text {
    color: #000;
    background-color: #fff;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .animated {
    animation: none;
    transition: none;
  }
}

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

This tutorial should help you effectively use CSS formatting tools to create clean, readable, and well-structured CSS code. 