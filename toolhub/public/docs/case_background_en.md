# Text Case Conversion — Technical Background

## What Is Text Case?

Text case refers to the capitalization style of letters in a string. Different programming languages, naming conventions, and writing standards use different case styles.

## Common Case Styles

### UPPERCASE
All letters are capitalized. Commonly used for constants, abbreviations, and emphasis.
- Example: `HELLO WORLD`, `MAX_VALUE`

### lowercase
All letters are in their smallest form. Used in URLs, CSS class names, and some programming identifiers.
- Example: `hello world`, `variable_name`

### Title Case
The first letter of each word is capitalized. Used for titles, headings, and proper nouns.
- Example: `Hello World`, `The Quick Brown Fox`

### Sentence Case
Only the first letter of the first word is capitalized. Used for regular sentences and paragraphs.
- Example: `Hello world`, `The quick brown fox`

### aLtErNaTiNg CaSe
Letters alternate between uppercase and lowercase. Used for stylistic or humorous purposes.
- Example: `hElLo WoRlD`

## Case in Programming

| Language | Convention | Example |
|---|---|---|
| JavaScript/TypeScript | camelCase | `myVariableName` |
| Python | snake_case | `my_variable_name` |
| Java/C# | PascalCase | `MyClassName` |
| CSS | kebab-case | `my-class-name` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_BUFFER_SIZE` |

## Unicode and Internationalization

Case conversion is straightforward for ASCII characters, but more complex for international text. Languages like German have special rules (e.g., `ß` becomes `SS` in uppercase). Modern JavaScript handles most Unicode case conversions correctly via `.toUpperCase()` and `.toLowerCase()`.

