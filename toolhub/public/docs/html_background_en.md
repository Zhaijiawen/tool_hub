# HTML — What's Going On Under the Hood

HTML was cooked up by Tim Berners-Lee at CERN in 1991. It's a markup language, not a programming language — it structures content, it doesn't compute. HTML5 (2014) is the current living standard, maintained by WHATWG.

## The DOM, Not Just Tags

Browsers parse HTML into a DOM tree — a living, JavaScript-mutable representation of the page. Write `<div><p>hello</p></div>` and the browser builds a tree with `div` as parent, `p` as child, text node as leaf. CSS and JS both operate on this tree, not on the raw HTML.

## Semantic HTML

Use elements that describe what content *is*, not how it looks:

```html
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>
<main>
  <article>
    <h1>Title</h1>
    <p>Content...</p>
  </article>
</main>
<footer>
  <p>&copy; 2024</p>
</footer>
```

Screen readers, search engines, and accessibility tools understand this structure. `<div>` soup tells them nothing.

## Forms

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

Always pair `<label>` with inputs via `for`/`id`. Screen readers need this. HTML5 input types (`email`, `url`, `tel`, `number`, `date`) bring built-in validation.

## Multimedia

```html
<video controls width="400">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  Your browser does not support video.
</video>

<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
</audio>
```

Multiple `<source>` elements let the browser pick the format it supports.

## Meta and SEO

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Page description">
  <title>Page Title</title>

  <meta property="og:title" content="Page Title">
  <meta property="og:description" content="Page description">
  <meta property="og:image" content="https://example.com/image.jpg">
</head>
```

The `viewport` meta tag is non-negotiable for mobile. Open Graph tags control how links look when shared on social media.

## Accessibility Basics

- Every `<img>` needs an `alt` attribute (empty `alt=""` for decorative images)
- Use heading levels in order: `h1` then `h2`, don't skip to `h4`
- `aria-label` and `aria-describedby` fill gaps where visible text isn't enough
- `<button>` for actions, `<a>` for navigation — don't mix them up
