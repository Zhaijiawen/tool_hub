# JavaScript Code Examples

## Basic JavaScript Structure Examples

### Simple Variable Declarations

```javascript
// Using let (block-scoped, mutable)
let name = "John Doe";
let age = 30;
let isActive = true;

// Using const (block-scoped, immutable reference)
const PI = 3.14159;
const API_URL = "https://api.example.com";

// Using var (function-scoped, hoisted - avoid in modern code)
var oldWay = "function scope";
```

### Object Literals

```javascript
const user = {
  name: "Jane Smith",
  age: 25,
  email: "jane@example.com",
  address: {
    street: "123 Main St",
    city: "New York",
    zip: "10001"
  },
  hobbies: ["reading", "swimming", "coding"],
  greet() {
    return `Hello, I'm ${this.name}`;
  }
};

// Destructuring objects
const { name, age, email } = user;
const { address: { city, zip } } = user;
```

### Arrays and Array Methods

```javascript
const numbers = [1, 2, 3, 4, 5];
const fruits = ["apple", "banana", "orange"];

// Array methods
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);

// Array destructuring
const [first, second, ...rest] = numbers;
const [fruit1, fruit2] = fruits;
```

### Complex Data Structures

```javascript
const company = {
  name: "TechCorp",
  founded: 2020,
  employees: [
    {
      name: "John Doe",
      position: "Senior Developer",
      department: "Engineering",
      skills: ["JavaScript", "Python", "React"],
      projects: [
        {
          name: "E-commerce Platform",
          status: "in-progress",
          progress: 75
        }
      ]
    },
    {
      name: "Jane Smith",
      position: "Product Manager",
      department: "Product",
      skills: ["Product Strategy", "User Research", "Agile"]
    }
  ],
  departments: {
    engineering: {
      head: "John Doe",
      budget: 500000
    },
    product: {
      head: "Jane Smith",
      budget: 200000
    }
  }
};
```

## Function Examples

### Basic Functions

```javascript
// Function declaration
function greet(name) {
  return `Hello, ${name}!`;
}

// Function expression
const greetExpression = function(name) {
  return `Hello, ${name}!`;
};

// Arrow function
const greetArrow = (name) => `Hello, ${name}!`;

// Function with default parameters
function createUser(name, age = 18, email = "default@example.com") {
  return { name, age, email };
}
```

### Higher-Order Functions

```javascript
// Function that returns a function
function createMultiplier(factor) {
  return function(value) {
    return value * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// Function that takes a function as parameter
function processArray(array, processor) {
  return array.map(processor);
}

const numbers = [1, 2, 3, 4, 5];
const squared = processArray(numbers, x => x * x);
const doubled = processArray(numbers, x => x * 2);
```

### Async Functions

```javascript
// Promise-based function
function fetchUserData(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = {
        id: userId,
        name: "John Doe",
        email: "john@example.com"
      };
      resolve(user);
    }, 1000);
  });
}

// Async/await function
async function getUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

// Async function with multiple await calls
async function processUserData(userId) {
  const user = await getUserData(userId);
  const posts = await fetchUserPosts(userId);
  const settings = await fetchUserSettings(userId);
  
  return {
    ...user,
    posts,
    settings
  };
}
```

## Class Examples

### Basic Classes

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hello, I'm ${this.name}`;
  }

  getInfo() {
    return `${this.name} is ${this.age} years old`;
  }

  static create(name, age) {
    return new Person(name, age);
  }
}

const person = new Person("John", 30);
console.log(person.greet()); // "Hello, I'm John"
```

### Inheritance

```javascript
class Employee extends Person {
  constructor(name, age, role, salary) {
    super(name, age);
    this.role = role;
    this.salary = salary;
  }

  work() {
    return `${this.name} is working as ${this.role}`;
  }

  getSalary() {
    return `${this.name} earns $${this.salary}`;
  }

  static createEmployee(name, age, role, salary) {
    return new Employee(name, age, role, salary);
  }
}

const employee = new Employee("Jane", 25, "Developer", 75000);
console.log(employee.work()); // "Jane is working as Developer"
```

### Private Fields and Methods

```javascript
class BankAccount {
  #balance = 0;
  #transactions = [];

  constructor(accountNumber, initialBalance = 0) {
    this.accountNumber = accountNumber;
    this.#balance = initialBalance;
  }

  deposit(amount) {
    if (amount > 0) {
      this.#balance += amount;
      this.#addTransaction("deposit", amount);
      return true;
    }
    return false;
  }

  withdraw(amount) {
    if (amount > 0 && amount <= this.#balance) {
      this.#balance -= amount;
      this.#addTransaction("withdrawal", amount);
      return true;
    }
    return false;
  }

  getBalance() {
    return this.#balance;
  }

  #addTransaction(type, amount) {
    this.#transactions.push({
      type,
      amount,
      timestamp: new Date()
    });
  }

  getTransactionHistory() {
    return [...this.#transactions];
  }
}
```

## Module Examples

### ES6 Modules

```javascript
// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => a / b;

export default class Calculator {
  add(a, b) { return a + b; }
  subtract(a, b) { return a - b; }
  multiply(a, b) { return a * b; }
  divide(a, b) { return a / b; }
}

// utils.js
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// main.js
import Calculator, { add, subtract, multiply, divide } from './math.js';
import { formatCurrency, validateEmail } from './utils.js';

const calc = new Calculator();
console.log(calc.add(5, 3)); // 8
console.log(formatCurrency(1234.56)); // "$1,234.56"
console.log(validateEmail("test@example.com")); // true
```

## DOM Manipulation Examples

### Basic DOM Operations

```javascript
// Selecting elements
const element = document.getElementById('myElement');
const elements = document.querySelectorAll('.myClass');
const firstElement = document.querySelector('.myClass');

// Creating elements
const newDiv = document.createElement('div');
newDiv.textContent = 'New element';
newDiv.className = 'myClass';
newDiv.id = 'newElement';

// Adding elements to DOM
document.body.appendChild(newDiv);
element.appendChild(newDiv);

// Removing elements
element.removeChild(newDiv);
newDiv.remove();

// Modifying elements
element.textContent = 'New text';
element.innerHTML = '<span>HTML content</span>';
element.setAttribute('data-id', '123');
element.classList.add('newClass');
element.classList.remove('oldClass');
element.classList.toggle('active');
```

### Event Handling

```javascript
// Basic event listener
const button = document.getElementById('myButton');
button.addEventListener('click', function(event) {
  console.log('Button clicked!');
  console.log('Event:', event);
});

// Arrow function event listener
button.addEventListener('click', (event) => {
  event.preventDefault();
  console.log('Button clicked with arrow function!');
});

// Event delegation
document.addEventListener('click', (event) => {
  if (event.target.matches('.delete-button')) {
    deleteItem(event.target.dataset.id);
  }
});

// Custom events
const customEvent = new CustomEvent('myCustomEvent', {
  detail: { message: 'Custom event data' }
});

element.addEventListener('myCustomEvent', (event) => {
  console.log('Custom event:', event.detail.message);
});

element.dispatchEvent(customEvent);
```

### Form Handling

```javascript
// Form submission
const form = document.getElementById('myForm');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Success:', result);
    } else {
      throw new Error('Submission failed');
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

// Real-time form validation
const emailInput = document.getElementById('email');
emailInput.addEventListener('input', (event) => {
  const email = event.target.value;
  const isValid = validateEmail(email);
  
  if (isValid) {
    event.target.classList.remove('error');
    event.target.classList.add('valid');
  } else {
    event.target.classList.remove('valid');
    event.target.classList.add('error');
  }
});
```

## API Integration Examples

### Fetch API

```javascript
// Basic GET request
async function fetchUsers() {
  try {
    const response = await fetch('https://api.example.com/users');
    const users = await response.json();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// POST request with data
async function createUser(userData) {
  try {
    const response = await fetch('https://api.example.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const newUser = await response.json();
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// PUT request for updating
async function updateUser(userId, userData) {
  try {
    const response = await fetch(`https://api.example.com/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// DELETE request
async function deleteUser(userId) {
  try {
    const response = await fetch(`https://api.example.com/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}
```

### Error Handling

```javascript
// Comprehensive error handling
class APIError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.response = response;
  }
}

async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Network error', 0, { originalError: error });
  }
}

// Usage
try {
  const users = await apiRequest('https://api.example.com/users');
  console.log('Users:', users);
} catch (error) {
  if (error instanceof APIError) {
    console.error(`API Error ${error.status}:`, error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Local Storage Examples

```javascript
// Local storage utilities
const Storage = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },
  
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },
  
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

// Usage examples
Storage.set('user', { name: 'John', id: 123 });
const user = Storage.get('user');
Storage.remove('user');
```

## Timer and Animation Examples

```javascript
// setTimeout and setInterval
const delayedFunction = () => {
  console.log('This runs after 2 seconds');
};

const timeoutId = setTimeout(delayedFunction, 2000);

// Clear timeout
clearTimeout(timeoutId);

// setInterval for recurring tasks
const intervalId = setInterval(() => {
  console.log('This runs every second');
}, 1000);

// Clear interval
clearInterval(intervalId);

// Animation with requestAnimationFrame
function animate() {
  const element = document.getElementById('animated');
  let position = 0;
  
  function step() {
    position += 1;
    element.style.left = position + 'px';
    
    if (position < 200) {
      requestAnimationFrame(step);
    }
  }
  
  requestAnimationFrame(step);
}
```

## Error Handling Examples

### Try-Catch Blocks

```javascript
// Basic error handling
try {
  const result = riskyOperation();
  console.log('Result:', result);
} catch (error) {
  console.error('Error occurred:', error.message);
}

// Async error handling
async function handleAsyncOperation() {
  try {
    const result = await asyncRiskyOperation();
    return result;
  } catch (error) {
    console.error('Async error:', error);
    throw new Error('Custom error message');
  }
}

// Error handling with finally
function processData(data) {
  let result;
  try {
    result = process(data);
  } catch (error) {
    console.error('Processing error:', error);
    result = null;
  } finally {
    cleanup();
  }
  return result;
}
```

### Custom Error Classes

```javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class NetworkError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'NetworkError';
    this.status = status;
  }
}

// Usage
function validateUser(user) {
  if (!user.name) {
    throw new ValidationError('Name is required', 'name');
  }
  if (!user.email) {
    throw new ValidationError('Email is required', 'email');
  }
  if (!validateEmail(user.email)) {
    throw new ValidationError('Invalid email format', 'email');
  }
}

try {
  validateUser({ name: 'John' });
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(`Validation error in ${error.field}:`, error.message);
  }
}
```

These examples demonstrate various JavaScript patterns and use cases commonly encountered in web development, application programming, and modern JavaScript development. 