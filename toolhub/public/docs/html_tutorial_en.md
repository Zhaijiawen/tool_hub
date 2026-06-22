# HTML — Using the Formatter

Paste messy HTML on the left, get clean, indented HTML on the right. The formatter validates your markup as you type.

Before:

```html
<!DOCTYPE html><html><head><title>My Page</title></head><body><h1>Welcome</h1><p>This is a paragraph with <strong>bold text</strong>.</p><ul><li>Item 1</li><li>Item 2</li></ul></body></html>
```

After:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <h1>Welcome</h1>
    <p>This is a paragraph with <strong>bold text</strong>.</p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
  </body>
</html>
```

## Common Errors

**Unclosed tags** — the formatter catches missing `</p>`, `</div>`, etc.

**Missing DOCTYPE** — HTML5 needs `<!DOCTYPE html>` at the top.

**Invalid attributes** — `alt` must have a value for validation.

## Semantic Structure

Format your document with semantic landmarks:

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
      <h1>Site Name</h1>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <article>
        <h2>Article Title</h2>
        <p>Content...</p>
      </article>

      <aside>
        <h3>Related</h3>
        <p>Sidebar content...</p>
      </aside>
    </main>

    <footer>
      <p>&copy; 2024</p>
    </footer>
  </body>
</html>
```

## Forms

```html
<form action="/submit" method="post">
  <fieldset>
    <legend>Contact Info</legend>

    <div class="form-group">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" required>
    </div>

    <div class="form-group">
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required>
    </div>

    <button type="submit">Submit</button>
  </fieldset>
</form>
```

## Meta Tags

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Page description">
  <title>Page Title</title>
  <meta property="og:title" content="Page Title">
  <meta property="og:image" content="https://example.com/image.jpg">
</head>
```
