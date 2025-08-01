# CSS Code Examples

## Basic CSS Structure Examples

### Simple CSS Reset

```css
/* CSS Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  line-height: 1.5;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  color: #333;
  background-color: #fff;
}

/* Remove list styles */
ul, ol {
  list-style: none;
}

/* Remove text decoration from links */
a {
  text-decoration: none;
  color: inherit;
}

/* Make images responsive */
img {
  max-width: 100%;
  height: auto;
}
```

### Basic Typography

```css
/* Heading styles */
h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
}

h2 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  color: #444;
}

h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.6rem;
  color: #555;
}

/* Paragraph styles */
p {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  color: #666;
}

/* Link styles */
a {
  color: #007bff;
  text-decoration: underline;
  transition: color 0.3s ease;
}

a:hover {
  color: #0056b3;
}

a:visited {
  color: #6f42c1;
}
```

## Layout Examples

### Flexbox Layout

```css
/* Basic flexbox container */
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  background-color: #f8f9fa;
}

.flex-item {
  flex: 1;
  min-width: 200px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Flexbox navigation */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #333;
  color: white;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-menu {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.nav-menu a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.nav-menu a:hover {
  background-color: #555;
}

/* Responsive flexbox */
@media (max-width: 768px) {
  .nav {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-menu {
    flex-direction: column;
    gap: 0.5rem;
  }
}
```

### CSS Grid Layout

```css
/* Basic grid container */
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
  background-color: #f8f9fa;
}

.grid-item {
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Complex grid layout */
.page-layout {
  display: grid;
  grid-template-areas: 
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 250px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header {
  grid-area: header;
  background-color: #333;
  color: white;
  padding: 1rem;
}

.sidebar {
  grid-area: sidebar;
  background-color: #f8f9fa;
  padding: 1rem;
}

.main {
  grid-area: main;
  padding: 2rem;
}

.footer {
  grid-area: footer;
  background-color: #333;
  color: white;
  padding: 1rem;
  text-align: center;
}

/* Responsive grid */
@media (max-width: 768px) {
  .page-layout {
    grid-template-areas: 
      "header"
      "main"
      "sidebar"
      "footer";
    grid-template-columns: 1fr;
  }
}
```

### Positioning Examples

```css
/* Relative positioning */
.relative-box {
  position: relative;
  top: 10px;
  left: 20px;
  background-color: #007bff;
  color: white;
  padding: 10px;
  border-radius: 4px;
}

/* Absolute positioning */
.absolute-box {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #dc3545;
  color: white;
  padding: 5px 10px;
  border-radius: 0 0 0 4px;
}

/* Fixed positioning */
.fixed-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  transition: transform 0.3s ease;
}

.fixed-button:hover {
  transform: scale(1.1);
}

/* Sticky positioning */
.sticky-header {
  position: sticky;
  top: 0;
  background-color: white;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  z-index: 100;
}
```

## Component Examples

### Button Styles

```css
/* Basic button */
.btn {
  display: inline-block;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Button variants */
.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover {
  background-color: #1e7e34;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

/* Button sizes */
.btn-sm {
  padding: 5px 10px;
  font-size: 0.875rem;
}

.btn-lg {
  padding: 15px 30px;
  font-size: 1.125rem;
}

/* Outline buttons */
.btn-outline {
  background-color: transparent;
  border: 2px solid #007bff;
  color: #007bff;
}

.btn-outline:hover {
  background-color: #007bff;
  color: white;
}
```

### Card Components

```css
/* Basic card */
.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.card-header {
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.card-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.card-body {
  padding: 1rem;
}

.card-text {
  margin: 0 0 1rem 0;
  color: #666;
  line-height: 1.6;
}

.card-footer {
  padding: 1rem;
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
}

/* Card with image */
.card-img-top {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

/* Card grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}
```

### Form Styles

```css
/* Form container */
.form-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Form groups */
.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

.form-control.error {
  border-color: #dc3545;
}

.form-text {
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
}

.form-error {
  font-size: 0.875rem;
  color: #dc3545;
  margin-top: 0.25rem;
}

/* Checkbox and radio */
.form-check {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.form-check-input {
  margin-right: 0.5rem;
}

.form-check-label {
  margin: 0;
  cursor: pointer;
}

/* Form buttons */
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-submit {
  background-color: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-submit:hover {
  background-color: #0056b3;
}

.btn-reset {
  background-color: #6c757d;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-reset:hover {
  background-color: #545b62;
}
```

## Responsive Design Examples

### Mobile-First Approach

```css
/* Base styles (mobile first) */
.container {
  width: 100%;
  padding: 0 15px;
  margin: 0 auto;
}

.nav {
  flex-direction: column;
  gap: 1rem;
}

.nav-menu {
  flex-direction: column;
  gap: 0.5rem;
}

/* Tablet styles */
@media (min-width: 768px) {
  .container {
    max-width: 750px;
  }
  
  .nav {
    flex-direction: row;
    justify-content: space-between;
  }
  
  .nav-menu {
    flex-direction: row;
    gap: 2rem;
  }
}

/* Desktop styles */
@media (min-width: 1024px) {
  .container {
    max-width: 1000px;
  }
}

/* Large desktop styles */
@media (min-width: 1200px) {
  .container {
    max-width: 1200px;
  }
}
```

### Responsive Images

```css
/* Responsive images */
.responsive-img {
  width: 100%;
  height: auto;
  max-width: 100%;
}

/* Picture element */
.picture-container {
  width: 100%;
  max-width: 600px;
}

.picture-container img {
  width: 100%;
  height: auto;
}

/* Background images */
.hero-section {
  background-image: url('hero-mobile.jpg');
  background-size: cover;
  background-position: center;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}

@media (min-width: 768px) {
  .hero-section {
    background-image: url('hero-desktop.jpg');
    height: 500px;
  }
}
```

### Responsive Typography

```css
/* Fluid typography */
.fluid-text {
  font-size: clamp(16px, 4vw, 24px);
  line-height: 1.4;
}

.fluid-heading {
  font-size: clamp(24px, 6vw, 48px);
  font-weight: bold;
  line-height: 1.2;
}

/* Responsive spacing */
.responsive-spacing {
  padding: clamp(1rem, 5vw, 3rem);
  margin: clamp(0.5rem, 2vw, 2rem);
}
```

## Animation and Transition Examples

### CSS Transitions

```css
/* Basic transitions */
.transition-element {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.transition-element:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

/* Multiple transitions */
.complex-transition {
  background-color: #28a745;
  color: white;
  padding: 15px 30px;
  border-radius: 4px;
  border: 2px solid #28a745;
  transition: 
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease,
    transform 0.2s ease;
}

.complex-transition:hover {
  background-color: transparent;
  color: #28a745;
  border-color: #28a745;
  transform: scale(1.05);
}

/* Transition delays */
.staggered-transition {
  opacity: 0;
  transform: translateY(20px);
  transition: 
    opacity 0.5s ease 0.2s,
    transform 0.5s ease 0.2s;
}

.staggered-transition.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### CSS Animations

```css
/* Keyframe animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.slide-in {
  animation: slideIn 0.5s ease-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.pulse {
  animation: pulse 2s infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.rotate {
  animation: rotate 2s linear infinite;
}

/* Animation properties */
.animated-element {
  animation: fadeIn 0.5s ease-out;
  animation-fill-mode: forwards;
  animation-delay: 0.2s;
  animation-iteration-count: 1;
}

/* Pause animations on reduced motion */
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none;
  }
}
```

### Transform Examples

```css
/* 2D transforms */
.transform-2d {
  transform: translateX(50px) translateY(20px) rotate(45deg) scale(1.2);
  transition: transform 0.3s ease;
}

.transform-2d:hover {
  transform: translateX(0) translateY(0) rotate(0deg) scale(1);
}

/* 3D transforms */
.transform-3d {
  perspective: 1000px;
  transform-style: preserve-3d;
}

.card-3d {
  transform: rotateY(45deg);
  transition: transform 0.5s ease;
}

.card-3d:hover {
  transform: rotateY(0deg);
}

/* Transform origin */
.transform-origin {
  transform-origin: center;
  transform: rotate(45deg);
}

.transform-origin-top-left {
  transform-origin: top left;
  transform: rotate(45deg);
}
```

## CSS Custom Properties Examples

### Variable Definitions

```css
/* Root variables */
:root {
  /* Colors */
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  --light-color: #f8f9fa;
  --dark-color: #343a40;
  
  /* Typography */
  --font-family-primary: 'Arial', sans-serif;
  --font-family-secondary: 'Georgia', serif;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-sm: 0.875rem;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 3rem;
  
  /* Border radius */
  --border-radius: 4px;
  --border-radius-lg: 8px;
  --border-radius-sm: 2px;
  
  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 8px rgba(0,0,0,0.1);
  --shadow-lg: 0 8px 16px rgba(0,0,0,0.1);
}

/* Theme variables */
.theme-dark {
  --primary-color: #0d6efd;
  --background-color: #212529;
  --text-color: #f8f9fa;
  --border-color: #495057;
}

.theme-light {
  --primary-color: #007bff;
  --background-color: #ffffff;
  --text-color: #212529;
  --border-color: #dee2e6;
}
```

### Using Variables

```css
/* Component using variables */
.button {
  background-color: var(--primary-color);
  color: white;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius);
  font-family: var(--font-family-primary);
  font-size: var(--font-size-base);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.button:hover {
  background-color: color-mix(in srgb, var(--primary-color) 80%, black);
  box-shadow: var(--shadow-md);
}

/* Card component */
.card {
  background-color: var(--background-color);
  color: var(--text-color);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

/* Responsive typography */
.fluid-text {
  font-size: clamp(var(--font-size-sm), 4vw, var(--font-size-lg));
  line-height: 1.4;
}

/* Fallback values */
.element {
  background-color: var(--primary-color, #007bff);
  padding: var(--spacing-md, 1rem);
}
```

## Utility Classes

### Spacing Utilities

```css
/* Margin utilities */
.m-0 { margin: 0; }
.m-1 { margin: var(--spacing-xs); }
.m-2 { margin: var(--spacing-sm); }
.m-3 { margin: var(--spacing-md); }
.m-4 { margin: var(--spacing-lg); }
.m-5 { margin: var(--spacing-xl); }

.mt-0 { margin-top: 0; }
.mt-1 { margin-top: var(--spacing-xs); }
.mt-2 { margin-top: var(--spacing-sm); }
.mt-3 { margin-top: var(--spacing-md); }
.mt-4 { margin-top: var(--spacing-lg); }
.mt-5 { margin-top: var(--spacing-xl); }

.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: var(--spacing-xs); }
.mb-2 { margin-bottom: var(--spacing-sm); }
.mb-3 { margin-bottom: var(--spacing-md); }
.mb-4 { margin-bottom: var(--spacing-lg); }
.mb-5 { margin-bottom: var(--spacing-xl); }

/* Padding utilities */
.p-0 { padding: 0; }
.p-1 { padding: var(--spacing-xs); }
.p-2 { padding: var(--spacing-sm); }
.p-3 { padding: var(--spacing-md); }
.p-4 { padding: var(--spacing-lg); }
.p-5 { padding: var(--spacing-xl); }

.pt-0 { padding-top: 0; }
.pt-1 { padding-top: var(--spacing-xs); }
.pt-2 { padding-top: var(--spacing-sm); }
.pt-3 { padding-top: var(--spacing-md); }
.pt-4 { padding-top: var(--spacing-lg); }
.pt-5 { padding-top: var(--spacing-xl); }

.pb-0 { padding-bottom: 0; }
.pb-1 { padding-bottom: var(--spacing-xs); }
.pb-2 { padding-bottom: var(--spacing-sm); }
.pb-3 { padding-bottom: var(--spacing-md); }
.pb-4 { padding-bottom: var(--spacing-lg); }
.pb-5 { padding-bottom: var(--spacing-xl); }
```

### Display Utilities

```css
/* Display utilities */
.d-none { display: none; }
.d-block { display: block; }
.d-inline { display: inline; }
.d-inline-block { display: inline-block; }
.d-flex { display: flex; }
.d-grid { display: grid; }

/* Flex utilities */
.flex-row { flex-direction: row; }
.flex-column { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }
.flex-nowrap { flex-wrap: nowrap; }

.justify-start { justify-content: flex-start; }
.justify-end { justify-content: flex-end; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }

.align-start { align-items: flex-start; }
.align-end { align-items: flex-end; }
.align-center { align-items: center; }
.align-stretch { align-items: stretch; }
.align-baseline { align-items: baseline; }

/* Grid utilities */
.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

.gap-1 { gap: var(--spacing-xs); }
.gap-2 { gap: var(--spacing-sm); }
.gap-3 { gap: var(--spacing-md); }
.gap-4 { gap: var(--spacing-lg); }
.gap-5 { gap: var(--spacing-xl); }
```

### Text Utilities

```css
/* Text alignment */
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-justify { text-align: justify; }

/* Text decoration */
.text-decoration-none { text-decoration: none; }
.text-decoration-underline { text-decoration: underline; }
.text-decoration-line-through { text-decoration: line-through; }

/* Text transform */
.text-lowercase { text-transform: lowercase; }
.text-uppercase { text-transform: uppercase; }
.text-capitalize { text-transform: capitalize; }

/* Font weight */
.font-weight-light { font-weight: 300; }
.font-weight-normal { font-weight: 400; }
.font-weight-bold { font-weight: 700; }

/* Font size */
.font-size-sm { font-size: var(--font-size-sm); }
.font-size-base { font-size: var(--font-size-base); }
.font-size-lg { font-size: var(--font-size-lg); }
```

### Color Utilities

```css
/* Text colors */
.text-primary { color: var(--primary-color); }
.text-secondary { color: var(--secondary-color); }
.text-success { color: var(--success-color); }
.text-danger { color: var(--danger-color); }
.text-warning { color: var(--warning-color); }
.text-info { color: var(--info-color); }
.text-light { color: var(--light-color); }
.text-dark { color: var(--dark-color); }

/* Background colors */
.bg-primary { background-color: var(--primary-color); }
.bg-secondary { background-color: var(--secondary-color); }
.bg-success { background-color: var(--success-color); }
.bg-danger { background-color: var(--danger-color); }
.bg-warning { background-color: var(--warning-color); }
.bg-info { background-color: var(--info-color); }
.bg-light { background-color: var(--light-color); }
.bg-dark { background-color: var(--dark-color); }
```

These examples demonstrate various CSS structures and patterns commonly used in web development, from basic styling to complex layouts and animations. 