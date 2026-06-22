# HTML — Code Examples

## Complete HTML5 Document

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="A sample HTML5 page">
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

## Advanced Form

```html
<form action="/submit" method="post" enctype="multipart/form-data">
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
      <label for="birthdate">Birth Date:</label>
      <input type="date" id="birthdate" name="birthdate">
    </div>

    <div class="form-group">
      <label for="gender">Gender:</label>
      <select id="gender" name="gender">
        <option value="">Select...</option>
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
    </div>

    <div class="form-group">
      <label for="file">Upload File:</label>
      <input type="file" id="file" name="file" accept=".pdf,.doc,.docx">
    </div>

    <div class="form-group">
      <label for="message">Message:</label>
      <textarea id="message" name="message" rows="4" placeholder="Your message"></textarea>
    </div>

    <button type="submit">Submit</button>
    <button type="reset">Reset</button>
  </fieldset>
</form>
```

## Tables

```html
<table>
  <caption>Employee Information</caption>
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Department</th>
      <th>Salary</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>001</td>
      <td>John Doe</td>
      <td>Engineering</td>
      <td>$75,000</td>
    </tr>
    <tr>
      <td>002</td>
      <td>Jane Smith</td>
      <td>Marketing</td>
      <td>$65,000</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="3">Total Employees:</td>
      <td>2</td>
    </tr>
  </tfoot>
</table>
```

## Article Layout

```html
<article>
  <header>
    <h1>Article Title</h1>
    <p class="author">By <a href="#author">John Doe</a></p>
    <time datetime="2024-01-15">January 15, 2024</time>
  </header>

  <section>
    <h2>Introduction</h2>
    <p>This is the introduction...</p>
  </section>

  <section>
    <h2>Main Content</h2>
    <p>Main content here...</p>

    <figure>
      <img src="image.jpg" alt="Related image">
      <figcaption>Caption for the image</figcaption>
    </figure>

    <blockquote>
      <p>This is a quote.</p>
      <cite>- Source Name</cite>
    </blockquote>
  </section>

  <footer>
    <p>Tags: <a href="#html">HTML</a>, <a href="#css">CSS</a></p>
  </footer>
</article>
```

## Interactive Elements

```html
<details>
  <summary>Click to expand</summary>
  <p>This content is hidden by default and expands when clicked.</p>
</details>

<details open>
  <summary>This section is open by default</summary>
  <p>Visible content.</p>
</details>

<progress id="progress" value="70" max="100">70%</progress>

<meter value="0.6" min="0" max="1" low="0.3" high="0.8">60%</meter>
```
