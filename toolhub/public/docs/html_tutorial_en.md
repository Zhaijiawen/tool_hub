# HTML Usage Tutorial

## Getting Started with HTML Formatting

The HTML formatter tool helps you organize and beautify HTML code, making it more readable and maintainable. This tutorial will guide you through the process of formatting HTML code effectively.

## Basic Formatting Process

### Step 1: Prepare Your HTML Code

Start by gathering the HTML code you want to format. This could be:
- HTML documents
- HTML fragments
- Template files
- Email templates
- Form structures
- Complex nested elements

### Step 2: Input Your Code

1. Open the HTML formatter tool
2. Locate the input area (usually on the left side)
3. Paste your HTML code into the input box
4. Ensure your code is syntactically valid (the tool will validate it)

Example input:
```html
<!DOCTYPE html><html><head><title>My Page</title></head><body><h1>Welcome</h1><p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>.</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul></body></html>
```

### Step 3: Choose Formatting Options

Before formatting, consider these options:

#### Indentation Settings
- **2 Spaces**: Standard indentation, good for most use cases
- **4 Spaces**: More readable for complex nested structures
- **Tab**: Traditional indentation method (less common in modern HTML)

#### Additional Options
- **Wrap Attributes**: Wrap long attribute lists to multiple lines
- **Sort Attributes**: Alphabetically sort attributes
- **Remove Comments**: Strip HTML comments
- **Preserve Comments**: Keep HTML comments intact
- **Collapse Whitespace**: Remove unnecessary whitespace

### Step 4: Format Your Code

1. Click the "Format" button
2. Wait for the tool to process your code
3. Review the formatted output on the right side

Expected output:
```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <h1>Welcome</h1>
    <p>
      This is a paragraph with <strong>bold text</strong> and
      <em>italic text</em>.
    </p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  </body>
</html>
```

## Advanced Formatting Features

### Syntax Validation

The tool automatically validates your HTML syntax and provides helpful error messages:

#### Common Errors and Solutions

**Unclosed Tags**
```html
<!-- Incorrect -->
<p>This is a paragraph
<div>This is a div

<!-- Correct -->
<p>This is a paragraph</p>
<div>This is a div</div>
```

**Missing DOCTYPE**
```html
<!-- Incorrect -->
<html>
<head>
<title>Page</title>
</head>

<!-- Correct -->
<!DOCTYPE html>
<html>
<head>
<title>Page</title>
</head>
```

**Invalid Attributes**
```html
<!-- Incorrect -->
<img src="image.jpg" alt>

<!-- Correct -->
<img src="image.jpg" alt="Description">
```

### Error Handling

When the tool encounters errors:

1. **Syntax Errors**: The tool will highlight the problematic line
2. **Validation Messages**: Clear explanations of what needs to be fixed
3. **Auto-correction**: Some tools can automatically fix common issues

## Tool Features

### Copy Functionality

1. Click the "Copy" button next to the formatted output
2. The formatted HTML is copied to your clipboard
3. Paste it wherever you need the formatted code

### Clear Function

1. Click the "Clear" button to reset both input and output areas
2. Useful when working with multiple code snippets

### Export Options

Some formatters offer additional export options:
- Download as `.html` file
- Export as formatted text
- Share via URL (if supported)

## Best Practices for HTML Formatting

### 1. Consistent Indentation

Choose an indentation style and stick to it:
```html
<!-- Good - 2 spaces -->
<div>
  <h1>Title</h1>
  <p>Content</p>
</div>
```

### 2. Proper Tag Nesting

Ensure proper nesting of HTML elements:
```html
<!-- Good -->
<div>
  <p>Paragraph inside div</p>
</div>

<!-- Avoid -->
<div>
<p>Paragraph inside div
</div>
```

### 3. Meaningful Attribute Order

Organize attributes logically:
```html
<!-- Good -->
<img src="image.jpg" alt="Description" width="300" height="200" class="responsive">

<!-- Avoid -->
<img class="responsive" width="300" height="200" alt="Description" src="image.jpg">
```

### 4. Proper Self-Closing Tags

Use proper self-closing tag syntax:
```html
<!-- Good -->
<img src="image.jpg" alt="Description">
<input type="text" name="username">
<br>

<!-- Avoid -->
<img src="image.jpg" alt="Description" />
<input type="text" name="username" />
<br />
```

## Troubleshooting Common Issues

### Issue: "Invalid HTML" Error

**Possible Causes:**
- Unclosed tags
- Missing DOCTYPE
- Invalid attributes
- Malformed structure

**Solution:**
1. Check the error message for the line number
2. Verify all tags are properly closed
3. Add missing DOCTYPE declaration
4. Check for invalid attribute values

### Issue: Indentation Problems

**Problem:** Inconsistent indentation makes code hard to read

**Solutions:**
1. Use consistent indentation (2 spaces recommended)
2. Configure your editor to use spaces instead of tabs
3. Use a linter to catch indentation issues
4. Enable "format on save" in your editor

### Issue: Long Lines

**Problem:** Very long lines can be hard to read

**Solutions:**
1. Break long attribute lists across multiple lines
2. Use proper line breaks for readability
3. Consider using CSS classes instead of inline styles
4. Use semantic HTML elements

## Tips for Efficient HTML Formatting

### 1. Use Keyboard Shortcuts

Most HTML formatters support keyboard shortcuts:
- `Ctrl+Shift+F` (Windows/Linux) or `Cmd+Shift+F` (Mac) for formatting
- `Ctrl+C` and `Ctrl+V` for copy/paste operations

### 2. Validate Before Formatting

Always validate your HTML before formatting to catch errors early.

### 3. Keep Backups

Before making extensive changes, keep a backup of your original code.

### 4. Use Version Control

If working with HTML files, use version control to track changes.

### 5. Consider Linting

For important HTML code, consider using HTML linters to ensure code quality.

## HTML Comments

Use comments to document your code:

```html
<!-- Single-line comment -->
<div class="container">
  <!-- This is the main content area -->
  <h1>Page Title</h1>
  
  <!-- Navigation section -->
  <nav>
    <ul>
      <li><a href="#home">Home</a></li>
      <li><a href="#about">About</a></li>
    </ul>
  </nav>
</div>

<!--
  Multi-line comment
  for complex explanations
  or section headers
-->
```

## Semantic HTML Structure

Format semantic HTML properly:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
  </head>
  <body>
    <header>
      <h1>Website Title</h1>
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
        </ul>
      </nav>
    </header>
    
    <main>
      <article>
        <h2>Article Title</h2>
        <p>Article content...</p>
      </article>
      
      <aside>
        <h3>Related Information</h3>
        <p>Sidebar content...</p>
      </aside>
    </main>
    
    <footer>
      <p>&copy; 2024 Website</p>
    </footer>
  </body>
</html>
```

## Forms

Format forms consistently:

```html
<form action="/submit" method="post">
  <fieldset>
    <legend>Personal Information</legend>
    
    <div class="form-group">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" required>
    </div>
    
    <div class="form-group">
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required>
    </div>
    
    <div class="form-group">
      <label for="message">Message:</label>
      <textarea id="message" name="message" rows="4"></textarea>
    </div>
    
    <button type="submit">Submit</button>
  </fieldset>
</form>
```

## Tables

Format tables properly:

```html
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Phone</th>
    </tr>
  </thead>
  <tbody>
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
  </tbody>
  <tfoot>
    <tr>
      <td colspan="3">Total: 2 contacts</td>
    </tr>
  </tfoot>
</table>
```

## Lists

Format lists consistently:

```html
<!-- Unordered list -->
<ul>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ul>

<!-- Ordered list -->
<ol>
  <li>First step</li>
  <li>Second step</li>
  <li>Third step</li>
</ol>

<!-- Definition list -->
<dl>
  <dt>Term 1</dt>
  <dd>Definition 1</dd>
  <dt>Term 2</dt>
  <dd>Definition 2</dd>
</dl>
```

## Links and Navigation

Format links properly:

```html
<!-- Basic link -->
<a href="https://example.com">Visit Example</a>

<!-- Internal link -->
<a href="#section">Go to section</a>

<!-- Email link -->
<a href="mailto:user@example.com">Send email</a>

<!-- Phone link -->
<a href="tel:+1234567890">Call us</a>

<!-- Navigation menu -->
<nav>
  <ul>
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>
```

## Images and Media

Format media elements properly:

```html
<!-- Image -->
<img src="image.jpg" alt="Description" width="300" height="200">

<!-- Video -->
<video controls width="400" height="300">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  Your browser does not support video.
</video>

<!-- Audio -->
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
  Your browser does not support audio.
</audio>

<!-- Figure with caption -->
<figure>
  <img src="image.jpg" alt="Description">
  <figcaption>Image caption</figcaption>
</figure>
```

## Meta Tags

Format meta tags properly:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Page description">
  <meta name="keywords" content="relevant, keywords">
  <meta name="author" content="Author Name">
  <meta name="robots" content="index, follow">
  
  <!-- Open Graph tags -->
  <meta property="og:title" content="Page Title">
  <meta property="og:description" content="Page description">
  <meta property="og:image" content="image.jpg">
  
  <!-- Twitter Card tags -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="Page Title">
  <meta name="twitter:description" content="Page description">
</head>
```

## Scripts and Styles

Format script and style tags properly:

```html
<head>
  <!-- External CSS -->
  <link rel="stylesheet" href="styles.css">
  
  <!-- Internal CSS -->
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
  </style>
</head>

<body>
  <!-- Content here -->
  
  <!-- External JavaScript -->
  <script src="script.js"></script>
  
  <!-- Internal JavaScript -->
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      console.log('Page loaded');
    });
  </script>
</body>
```

This tutorial should help you effectively use HTML formatting tools to create clean, readable, and properly structured HTML code. 