# HTML Code Examples

## Basic HTML Structure Examples

### Simple HTML Document

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Web Page</title>
  </head>
  <body>
    <h1>Welcome to My Website</h1>
    <p>This is my first web page.</p>
  </body>
</html>
```

### Complete HTML5 Document

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="A sample HTML5 page">
    <meta name="keywords" content="HTML, CSS, JavaScript">
    <meta name="author" content="John Doe">
    <title>Sample HTML5 Page</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <header>
      <h1>Website Title</h1>
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>
    
    <main>
      <section id="home">
        <h2>Welcome</h2>
        <p>Welcome to our website!</p>
      </section>
    </main>
    
    <footer>
      <p>&copy; 2024 Website. All rights reserved.</p>
    </footer>
  </body>
</html>
```

## Text and Typography Examples

### Headings and Paragraphs

```html
<h1>Main Heading (Level 1)</h1>
<h2>Subheading (Level 2)</h2>
<h3>Sub-subheading (Level 3)</h3>
<h4>Level 4 Heading</h4>
<h5>Level 5 Heading</h5>
<h6>Level 6 Heading</h6>

<p>This is a regular paragraph with some text content.</p>
<p>Another paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
<p>Text with <mark>highlighted content</mark> and <small>smaller text</small>.</p>
```

### Text Formatting

```html
<p>This is <strong>bold text</strong> and this is <em>italic text</em>.</p>
<p>This is <mark>highlighted text</mark> and this is <small>small text</small>.</p>
<p>This is <del>deleted text</del> and this is <ins>inserted text</ins>.</p>
<p>This is <sub>subscript</sub> and this is <sup>superscript</sup>.</p>
<p>This is <code>inline code</code> and this is <kbd>keyboard input</kbd>.</p>
<p>This is <abbr title="HyperText Markup Language">HTML</abbr>.</p>
<p>This is <cite>The Great Gatsby</cite> by F. Scott Fitzgerald.</p>
```

### Blockquotes and Code

```html
<blockquote>
  <p>This is a blockquote with some quoted text.</p>
  <cite>- Author Name</cite>
</blockquote>

<pre>
function greet() {
    console.log("Hello, World!");
}
</pre>

<code>console.log("Hello, World!");</code>
```

## List Examples

### Unordered Lists

```html
<ul>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ul>

<ul>
  <li>Fruits
    <ul>
      <li>Apples</li>
      <li>Bananas</li>
      <li>Oranges</li>
    </ul>
  </li>
  <li>Vegetables
    <ul>
      <li>Carrots</li>
      <li>Broccoli</li>
      <li>Spinach</li>
    </ul>
  </li>
</ul>
```

### Ordered Lists

```html
<ol>
  <li>First step</li>
  <li>Second step</li>
  <li>Third step</li>
</ol>

<ol type="A">
  <li>Step A</li>
  <li>Step B</li>
  <li>Step C</li>
</ol>

<ol start="5">
  <li>Step 5</li>
  <li>Step 6</li>
  <li>Step 7</li>
</ol>
```

### Definition Lists

```html
<dl>
  <dt>HTML</dt>
  <dd>HyperText Markup Language</dd>
  
  <dt>CSS</dt>
  <dd>Cascading Style Sheets</dd>
  
  <dt>JavaScript</dt>
  <dd>A programming language for the web</dd>
</dl>
```

## Link Examples

### Basic Links

```html
<!-- External link -->
<a href="https://example.com">Visit Example Website</a>

<!-- Internal link -->
<a href="#section">Go to section</a>

<!-- Email link -->
<a href="mailto:user@example.com">Send us an email</a>

<!-- Phone link -->
<a href="tel:+1234567890">Call us</a>

<!-- Download link -->
<a href="document.pdf" download>Download PDF</a>
```

### Advanced Links

```html
<!-- Link with target -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Open in new tab
</a>

<!-- Link with title -->
<a href="https://example.com" title="Visit our website">
  Example Website
</a>

<!-- Link with custom styling -->
<a href="#section" class="button">Click me</a>

<!-- Image link -->
<a href="https://example.com">
  <img src="logo.png" alt="Example Logo">
</a>
```

### Navigation Menu

```html
<nav>
  <ul>
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#services">Services</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>

<nav>
  <ul>
    <li><a href="#home">Home</a></li>
    <li>
      <a href="#products">Products</a>
      <ul>
        <li><a href="#software">Software</a></li>
        <li><a href="#hardware">Hardware</a></li>
        <li><a href="#services">Services</a></li>
      </ul>
    </li>
    <li><a href="#about">About</a></li>
  </ul>
</nav>
```

## Image and Media Examples

### Basic Images

```html
<!-- Simple image -->
<img src="image.jpg" alt="Description of the image">

<!-- Image with dimensions -->
<img src="image.jpg" alt="Description" width="300" height="200">

<!-- Responsive image -->
<img src="image.jpg" alt="Description" style="max-width: 100%; height: auto;">

<!-- Image with title -->
<img src="image.jpg" alt="Description" title="Image title">
```

### Advanced Images

```html
<!-- Image with multiple sources -->
<picture>
  <source media="(min-width: 800px)" srcset="large.jpg">
  <source media="(min-width: 400px)" srcset="medium.jpg">
  <img src="small.jpg" alt="Responsive image">
</picture>

<!-- Figure with caption -->
<figure>
  <img src="image.jpg" alt="Description">
  <figcaption>This is the image caption</figcaption>
</figure>

<!-- Image map -->
<img src="image.jpg" alt="Image map" usemap="#imagemap">
<map name="imagemap">
  <area shape="rect" coords="0,0,100,100" href="#section1" alt="Section 1">
  <area shape="circle" coords="150,150,50" href="#section2" alt="Section 2">
</map>
```

### Video Examples

```html
<!-- Basic video -->
<video controls width="400" height="300">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  Your browser does not support video.
</video>

<!-- Video with poster -->
<video controls poster="poster.jpg" width="400" height="300">
  <source src="video.mp4" type="video/mp4">
  Your browser does not support video.
</video>

<!-- Video with subtitles -->
<video controls width="400" height="300">
  <source src="video.mp4" type="video/mp4">
  <track kind="subtitles" src="subtitles.vtt" srclang="en" label="English">
  <track kind="subtitles" src="subtitles-es.vtt" srclang="es" label="Spanish">
  Your browser does not support video.
</video>
```

### Audio Examples

```html
<!-- Basic audio -->
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
  Your browser does not support audio.
</audio>

<!-- Audio with preload -->
<audio controls preload="metadata">
  <source src="audio.mp3" type="audio/mpeg">
  Your browser does not support audio.
</audio>
```

## Form Examples

### Basic Form

```html
<form action="/submit" method="post">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required>
  
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>
  
  <label for="message">Message:</label>
  <textarea id="message" name="message" rows="4"></textarea>
  
  <button type="submit">Submit</button>
</form>
```

### Advanced Form

```html
<form action="/submit" method="post" enctype="multipart/form-data">
  <fieldset>
    <legend>Personal Information</legend>
    
    <div class="form-group">
      <label for="firstname">First Name:</label>
      <input type="text" id="firstname" name="firstname" required>
    </div>
    
    <div class="form-group">
      <label for="lastname">Last Name:</label>
      <input type="text" id="lastname" name="lastname" required>
    </div>
    
    <div class="form-group">
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required>
    </div>
    
    <div class="form-group">
      <label for="phone">Phone:</label>
      <input type="tel" id="phone" name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}">
    </div>
    
    <div class="form-group">
      <label for="birthdate">Birth Date:</label>
      <input type="date" id="birthdate" name="birthdate">
    </div>
    
    <div class="form-group">
      <label for="gender">Gender:</label>
      <select id="gender" name="gender">
        <option value="">Select gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </div>
    
    <div class="form-group">
      <label>Interests:</label>
      <div>
        <input type="checkbox" id="sports" name="interests" value="sports">
        <label for="sports">Sports</label>
      </div>
      <div>
        <input type="checkbox" id="music" name="interests" value="music">
        <label for="music">Music</label>
      </div>
      <div>
        <input type="checkbox" id="reading" name="interests" value="reading">
        <label for="reading">Reading</label>
      </div>
    </div>
    
    <div class="form-group">
      <label>Newsletter:</label>
      <div>
        <input type="radio" id="yes" name="newsletter" value="yes">
        <label for="yes">Yes</label>
      </div>
      <div>
        <input type="radio" id="no" name="newsletter" value="no">
        <label for="no">No</label>
      </div>
    </div>
    
    <div class="form-group">
      <label for="file">Upload File:</label>
      <input type="file" id="file" name="file" accept=".pdf,.doc,.docx">
    </div>
    
    <div class="form-group">
      <label for="message">Message:</label>
      <textarea id="message" name="message" rows="4" placeholder="Enter your message"></textarea>
    </div>
    
    <button type="submit">Submit</button>
    <button type="reset">Reset</button>
  </fieldset>
</form>
```

### HTML5 Form Input Types

```html
<form>
  <!-- Text inputs -->
  <input type="text" placeholder="Text input">
  <input type="email" placeholder="Email input">
  <input type="url" placeholder="URL input">
  <input type="tel" placeholder="Phone input">
  <input type="password" placeholder="Password input">
  <input type="search" placeholder="Search input">
  
  <!-- Numeric inputs -->
  <input type="number" min="0" max="100" step="1" placeholder="Number input">
  <input type="range" min="0" max="100" value="50">
  
  <!-- Date and time inputs -->
  <input type="date">
  <input type="time">
  <input type="datetime-local">
  <input type="month">
  <input type="week">
  
  <!-- Other inputs -->
  <input type="color">
  <input type="file" accept="image/*">
  
  <!-- Datalist -->
  <input list="browsers" placeholder="Choose browser">
  <datalist id="browsers">
    <option value="Chrome">
    <option value="Firefox">
    <option value="Safari">
    <option value="Edge">
  </datalist>
  
  <!-- Output -->
  <input type="range" id="volume" min="0" max="100" value="50">
  <output for="volume">50</output>
</form>
```

## Table Examples

### Basic Table

```html
<table>
  <tr>
    <th>Name</th>
    <th>Email</th>
    <th>Phone</th>
  </tr>
  <tr>
    <td>John Doe</td>
    <td>john@example.com</td>
    <td>123-456-7890</td>
  </tr>
  <tr>
    <td>Jane Smith</td>
    <td>jane@example.com</td>
    <td>098-765-4321</td>
  </tr>
</table>
```

### Advanced Table

```html
<table>
  <caption>Employee Information</caption>
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Department</th>
      <th>Salary</th>
      <th>Start Date</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>001</td>
      <td>John Doe</td>
      <td>Engineering</td>
      <td>$75,000</td>
      <td>2023-01-15</td>
    </tr>
    <tr>
      <td>002</td>
      <td>Jane Smith</td>
      <td>Marketing</td>
      <td>$65,000</td>
      <td>2023-02-20</td>
    </tr>
    <tr>
      <td>003</td>
      <td>Bob Johnson</td>
      <td>Sales</td>
      <td>$70,000</td>
      <td>2023-03-10</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="3">Total Employees:</td>
      <td colspan="2">3</td>
    </tr>
  </tfoot>
</table>
```

### Complex Table

```html
<table>
  <thead>
    <tr>
      <th rowspan="2">Product</th>
      <th colspan="3">Sales by Quarter</th>
      <th rowspan="2">Total</th>
    </tr>
    <tr>
      <th>Q1</th>
      <th>Q2</th>
      <th>Q3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Product A</td>
      <td>100</td>
      <td>150</td>
      <td>200</td>
      <td>450</td>
    </tr>
    <tr>
      <td>Product B</td>
      <td>80</td>
      <td>120</td>
      <td>180</td>
      <td>380</td>
    </tr>
    <tr>
      <td>Product C</td>
      <td>90</td>
      <td>110</td>
      <td>160</td>
      <td>360</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td><strong>Total</strong></td>
      <td><strong>270</strong></td>
      <td><strong>380</strong></td>
      <td><strong>540</strong></td>
      <td><strong>1190</strong></td>
    </tr>
  </tfoot>
</table>
```

## Semantic HTML Examples

### Article Structure

```html
<article>
  <header>
    <h1>Article Title</h1>
    <p class="author">By <a href="#author">John Doe</a></p>
    <time datetime="2024-01-15">January 15, 2024</time>
  </header>
  
  <section>
    <h2>Introduction</h2>
    <p>This is the introduction to the article...</p>
  </section>
  
  <section>
    <h2>Main Content</h2>
    <p>This is the main content of the article...</p>
    
    <figure>
      <img src="image.jpg" alt="Related image">
      <figcaption>Caption for the image</figcaption>
    </figure>
    
    <blockquote>
      <p>This is a quote from the article.</p>
      <cite>- Source Name</cite>
    </blockquote>
  </section>
  
  <footer>
    <p>Tags: <a href="#tag1">HTML</a>, <a href="#tag2">CSS</a></p>
    <p>Category: <a href="#category">Web Development</a></p>
  </footer>
</article>
```

### Page Layout

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Semantic HTML Layout</title>
  </head>
  <body>
    <header>
      <h1>Website Title</h1>
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>
    
    <main>
      <section id="hero">
        <h2>Welcome to Our Website</h2>
        <p>This is the main hero section of our website.</p>
      </section>
      
      <section id="features">
        <h2>Our Features</h2>
        <article>
          <h3>Feature 1</h3>
          <p>Description of feature 1.</p>
        </article>
        <article>
          <h3>Feature 2</h3>
          <p>Description of feature 2.</p>
        </article>
        <article>
          <h3>Feature 3</h3>
          <p>Description of feature 3.</p>
        </article>
      </section>
      
      <aside>
        <h3>Related Information</h3>
        <ul>
          <li><a href="#link1">Related Link 1</a></li>
          <li><a href="#link2">Related Link 2</a></li>
          <li><a href="#link3">Related Link 3</a></li>
        </ul>
      </aside>
    </main>
    
    <footer>
      <section>
        <h3>Contact Information</h3>
        <p>Email: <a href="mailto:contact@example.com">contact@example.com</a></p>
        <p>Phone: <a href="tel:+1234567890">123-456-7890</a></p>
      </section>
      <section>
        <h3>Follow Us</h3>
        <ul>
          <li><a href="#facebook">Facebook</a></li>
          <li><a href="#twitter">Twitter</a></li>
          <li><a href="#linkedin">LinkedIn</a></li>
        </ul>
      </section>
      <p>&copy; 2024 Website. All rights reserved.</p>
    </footer>
  </body>
</html>
```

## Interactive Elements

### Details and Summary

```html
<details>
  <summary>Click to expand</summary>
  <p>This content is hidden by default and can be expanded by clicking the summary.</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
</details>

<details open>
  <summary>This section is open by default</summary>
  <p>This content is visible by default.</p>
</details>
```

### Progress and Meter

```html
<!-- Progress bar -->
<label for="progress">Download Progress:</label>
<progress id="progress" value="70" max="100">70%</progress>

<!-- Meter -->
<label for="disk-usage">Disk Usage:</label>
<meter id="disk-usage" value="0.6" min="0" max="1" low="0.3" high="0.8" optimum="0.5">
  60%
</meter>
```

### Canvas and SVG

```html
<!-- Canvas -->
<canvas id="myCanvas" width="400" height="200">
  Your browser does not support canvas.
</canvas>

<!-- SVG -->
<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red"/>
  <rect x="10" y="10" width="30" height="30" fill="blue"/>
  <line x1="0" y1="0" x2="100" y2="100" stroke="green" stroke-width="2"/>
</svg>
```

## Meta and SEO Examples

### Complete Head Section

```html
<head>
  <!-- Basic meta tags -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="A comprehensive guide to HTML">
  <meta name="keywords" content="HTML, CSS, JavaScript, web development">
  <meta name="author" content="John Doe">
  <meta name="robots" content="index, follow">
  
  <!-- Open Graph tags -->
  <meta property="og:title" content="HTML Guide">
  <meta property="og:description" content="A comprehensive guide to HTML">
  <meta property="og:image" content="https://example.com/image.jpg">
  <meta property="og:url" content="https://example.com/page">
  <meta property="og:type" content="website">
  
  <!-- Twitter Card tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="HTML Guide">
  <meta name="twitter:description" content="A comprehensive guide to HTML">
  <meta name="twitter:image" content="https://example.com/image.jpg">
  
  <!-- Favicon -->
  <link rel="icon" href="favicon.ico" type="image/x-icon">
  <link rel="apple-touch-icon" href="apple-touch-icon.png">
  
  <!-- Stylesheets -->
  <link rel="stylesheet" href="styles.css">
  <link rel="preload" href="critical.css" as="style">
  
  <!-- Title -->
  <title>HTML Guide - Complete Tutorial</title>
</head>
```

These examples demonstrate various HTML structures and patterns commonly used in web development, from basic elements to complex semantic layouts. 