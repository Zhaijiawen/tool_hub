# JavaScript Usage Tutorial

## Getting Started with JavaScript Formatting

The JavaScript formatter tool helps you organize and beautify JavaScript code, making it more readable and maintainable. This tutorial will guide you through the process of formatting JavaScript code effectively.

## Basic Formatting Process

### Step 1: Prepare Your JavaScript Code

Start by gathering the JavaScript code you want to format. This could be:
- Function definitions
- Class declarations
- Object literals
- Array operations
- Import/export statements
- Complex expressions

### Step 2: Input Your Code

1. Open the JavaScript formatter tool
2. Locate the input area (usually on the left side)
3. Paste your JavaScript code into the input box
4. Ensure your code is syntactically valid (the tool will validate it)

Example input:
```javascript
function calculateTotal(items){let total=0;for(let i=0;i<items.length;i++){total+=items[i].price;}return total;}const user={name:"John",age:30,email:"john@example.com"};const numbers=[1,2,3,4,5];const result=numbers.filter(n=>n>2).map(n=>n*2).reduce((sum,n)=>sum+n,0);
```

### Step 3: Choose Formatting Options

Before formatting, consider these options:

#### Indentation Settings
- **2 Spaces**: Standard indentation, good for most use cases
- **4 Spaces**: More readable for complex nested structures
- **Tab**: Traditional indentation method (less common in modern JavaScript)

#### Additional Options
- **Semicolon Insertion**: Automatically add missing semicolons
- **Quote Style**: Choose between single and double quotes
- **Trailing Commas**: Add trailing commas in objects and arrays
- **Bracket Spacing**: Control spacing inside object brackets
- **Arrow Function Parentheses**: Control parentheses around arrow function parameters

### Step 4: Format Your Code

1. Click the "Format" button
2. Wait for the tool to process your code
3. Review the formatted output on the right side

Expected output:
```javascript
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}

const user = {
  name: "John",
  age: 30,
  email: "john@example.com",
};

const numbers = [1, 2, 3, 4, 5];
const result = numbers
  .filter((n) => n > 2)
  .map((n) => n * 2)
  .reduce((sum, n) => sum + n, 0);
```

## Advanced Formatting Features

### Syntax Validation

The tool automatically validates your JavaScript syntax and provides helpful error messages:

#### Common Errors and Solutions

**Missing Semicolons**
```javascript
// Incorrect
const name = "John"
const age = 30

// Correct
const name = "John";
const age = 30;
```

**Incorrect Bracket Spacing**
```javascript
// Incorrect
const obj = {name: "John", age: 30};
const arr = [1, 2, 3];

// Correct
const obj = { name: "John", age: 30 };
const arr = [ 1, 2, 3 ];
```

**Inconsistent Indentation**
```javascript
// Incorrect
function example() {
const x = 1;
  const y = 2;
}

// Correct
function example() {
  const x = 1;
  const y = 2;
}
```

### Error Handling

When the tool encounters errors:

1. **Syntax Errors**: The tool will highlight the problematic line
2. **Validation Messages**: Clear explanations of what needs to be fixed
3. **Auto-correction**: Some tools can automatically fix common issues

## Tool Features

### Copy Functionality

1. Click the "Copy" button next to the formatted output
2. The formatted JavaScript is copied to your clipboard
3. Paste it wherever you need the formatted code

### Clear Function

1. Click the "Clear" button to reset both input and output areas
2. Useful when working with multiple code snippets

### Export Options

Some formatters offer additional export options:
- Download as `.js` file
- Export as formatted text
- Share via URL (if supported)

## Best Practices for JavaScript Formatting

### 1. Consistent Indentation

Choose an indentation style and stick to it:
```javascript
// Good - 2 spaces
function example() {
  if (condition) {
    doSomething();
  }
}
```

### 2. Proper Spacing

Use consistent spacing around operators and keywords:
```javascript
// Good
const sum = a + b;
const result = condition ? value1 : value2;

// Avoid
const sum=a+b;
const result=condition?value1:value2;
```

### 3. Meaningful Variable Names

Use descriptive and meaningful variable names:
```javascript
// Good
const userName = "John Doe";
const userEmail = "john@example.com";
const isActive = true;

// Avoid
const u = "John Doe";
const e = "john@example.com";
const flag = true;
```

### 4. Proper Function Formatting

Format functions consistently:
```javascript
// Function declaration
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Arrow function
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// Single-line arrow function
const double = (x) => x * 2;
```

## Troubleshooting Common Issues

### Issue: "Invalid JavaScript" Error

**Possible Causes:**
- Missing semicolons
- Incorrect bracket placement
- Invalid syntax
- Unclosed strings or comments

**Solution:**
1. Check the error message for the line number
2. Verify syntax is correct
3. Add missing semicolons or brackets
4. Check for unclosed strings or comments

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
1. Break long lines at logical points
2. Use template literals for long strings
3. Chain methods on separate lines
4. Use object destructuring for long parameter lists

## Tips for Efficient JavaScript Formatting

### 1. Use Keyboard Shortcuts

Most JavaScript formatters support keyboard shortcuts:
- `Ctrl+Shift+F` (Windows/Linux) or `Cmd+Shift+F` (Mac) for formatting
- `Ctrl+C` and `Ctrl+V` for copy/paste operations

### 2. Validate Before Formatting

Always validate your JavaScript before formatting to catch errors early.

### 3. Keep Backups

Before making extensive changes, keep a backup of your original code.

### 4. Use Version Control

If working with JavaScript files, use version control to track changes.

### 5. Consider Linting

For important JavaScript code, consider using ESLint to ensure code quality.

## JavaScript Comments

Use comments to document your code:

```javascript
// Single-line comment
const name = "John"; // Inline comment

/*
 * Multi-line comment
 * for complex explanations
 */

/**
 * JSDoc comment for functions
 * @param {string} name - The user's name
 * @param {number} age - The user's age
 * @returns {string} A greeting message
 */
function greet(name, age) {
  return `Hello, ${name}! You are ${age} years old.`;
}
```

## Template Literals

Use template literals for string interpolation:

```javascript
const name = "World";
const greeting = `Hello, ${name}!`;

const multiline = `
  This is a
  multiline string
  with ${name}
`;

const expression = `The result is ${2 + 2}`;
```

## Destructuring

Use destructuring for cleaner code:

```javascript
// Object destructuring
const { name, age, email } = user;

// Array destructuring
const [first, second, ...rest] = array;

// Function parameter destructuring
function processUser({ name, age, email = 'default@example.com' }) {
  console.log(name, age, email);
}
```

## Arrow Functions

Use arrow functions for concise syntax:

```javascript
// Single parameter
const double = x => x * 2;

// Multiple parameters
const add = (a, b) => a + b;

// Multiple lines
const process = (data) => {
  const result = data.map(item => item * 2);
  return result.filter(item => item > 10);
};

// Object return
const createUser = (name, age) => ({ name, age });
```

## Async/Await

Format async functions properly:

```javascript
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

// Arrow function with async
const fetchData = async (url) => {
  const response = await fetch(url);
  return response.json();
};
```

## Classes

Format classes consistently:

```javascript
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  greet() {
    return `Hello, I'm ${this.name}`;
  }

  static create(name, email) {
    return new User(name, email);
  }
}

class Admin extends User {
  constructor(name, email, permissions) {
    super(name, email);
    this.permissions = permissions;
  }

  hasPermission(permission) {
    return this.permissions.includes(permission);
  }
}
```

## Modules

Format import/export statements:

```javascript
// Named imports
import { useState, useEffect } from 'react';

// Default import
import React from 'react';

// Mixed imports
import React, { useState, useEffect } from 'react';

// Named exports
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// Default export
export default class Calculator {
  add(a, b) {
    return a + b;
  }
}

// Re-export
export { add, subtract } from './math.js';
```

This tutorial should help you effectively use JavaScript formatting tools to create clean, readable, and properly structured JavaScript code. 