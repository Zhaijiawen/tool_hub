# JavaScript — Using the Formatter

Paste messy JS on the left, get formatted code on the right. Consistent indentation, semicolons, and spacing.

Before:

```javascript
const greet=(name)=>{console.log("Hello, "+name);};const nums=[1,2,3];const doubled=nums.map(n=>n*2);
```

After:

```javascript
const greet = (name) => {
  console.log("Hello, " + name);
};

const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2);
```

## Modern JS Syntax

```javascript
// let/const (block-scoped), not var
const MAX = 100;
let count = 0;

// Arrow functions
const add = (a, b) => a + b;

// Template literals
const msg = `Hello, ${name}. You have ${count} items.`;

// Destructuring
const { name, age } = user;
const [first, ...rest] = array;

// Optional chaining and nullish coalescing
const city = user?.address?.city ?? "Unknown";

// Async/await
async function fetchData() {
  const res = await fetch("/api/data");
  const data = await res.json();
  return data;
}
```

## Classes

```javascript
class Person {
  #secret; // Private field (ES2022)

  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  get isAdult() { return this.age >= 18; }

  greet() {
    return `Hi, I'm ${this.name}.`;
  }
}

class Student extends Person {
  constructor(name, age, studentId) {
    super(name, age);
    this.studentId = studentId;
  }
}
```

## Array Methods

```javascript
const nums = [1, 2, 3, 4, 5];

nums.map(n => n * 2);          // [2, 4, 6, 8, 10]
nums.filter(n => n > 2);       // [3, 4, 5]
nums.find(n => n > 2);         // 3
nums.reduce((sum, n) => sum + n, 0); // 15
nums.some(n => n > 4);         // true
nums.every(n => n < 10);       // true
```

## Error Handling

```javascript
try {
  const data = JSON.parse('invalid json');
} catch (error) {
  console.error("Parse failed:", error.message);
}
```

## Practical Tips

- Use `const` by default, `let` only when reassignment is needed. Never `var`.
- Prefer `===` over `==` unless you explicitly want coercion.
- Async functions return Promises — always `await` or `.catch()` them.
- Use Prettier for formatting, ESLint for catching bugs — configure them to run on save.
