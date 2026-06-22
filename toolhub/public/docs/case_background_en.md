# What Even Is Text Case

Case conversion seems trivial -- uppercase, lowercase, done. But once you start thinking about it as a developer, there's actually a decent amount of convention and edge-case territory here.

## The Styles You Actually Use

### UPPERCASE
All caps. Constants in code (`MAX_BUFFER_SIZE`), acronyms, or when you need to yell in an email subject line. Example: `HELLO WORLD`.

### lowercase
The default for most things on the web. URLs, CSS class names, file names. Example: `hello world`.

### Title Case
Every word starts with a capital. Think headlines, book titles, button labels. Example: `Hello World`.

### Sentence case
Just the first letter is capitalized, like a normal sentence. Example: `Hello world`.

### aLtErNaTiNg CaSe
Letters flip between upper and lower. Mostly for memes and mocking people online. Example: `hElLo WoRlD`.

## Naming Conventions by Language

Different ecosystems have different habits. If you're working across languages you'll hit all of these:

| Language / Context | Convention | Example |
|---|---|---|
| JavaScript/TypeScript | camelCase | `myVariableName` |
| Python | snake_case | `my_variable_name` |
| Java/C# | PascalCase | `MyClassName` |
| CSS | kebab-case | `my-class-name` |
| Constants (most languages) | SCREAMING_SNAKE_CASE | `MAX_BUFFER_SIZE` |

## Unicode: The Tricky Part

For plain ASCII, case conversion is straightforward -- each letter has a well-known uppercase and lowercase counterpart. Unicode makes it more interesting. The German `ß` becomes `SS` when uppercased. Turkish has dotted and dotless `i` characters that behave differently. JavaScript's `.toUpperCase()` and `.toLowerCase()` handle most of these correctly these days, but edge cases exist -- especially with locale-specific rules.

This tool works at the character level, so it'll handle Unicode text, but for locale-sensitive transformations (like Turkish i) you might need a more specialized tool.
