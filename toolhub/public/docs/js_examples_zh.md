# JavaScript 代码示例

## 基本 JavaScript 结构示例

### 简单变量声明

```javascript
// 使用 let（块作用域，可变）
let name = "John Doe";
let age = 30;
let isActive = true;

// 使用 const（块作用域，不可变引用）
const PI = 3.14159;
const API_URL = "https://api.example.com";

// 使用 var（函数作用域，提升 - 在现代代码中避免使用）
var oldWay = "函数作用域";
```

### 对象字面量

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

// 解构对象
const { name, age, email } = user;
const { address: { city, zip } } = user;
```

### 数组和数组方法

```javascript
const numbers = [1, 2, 3, 4, 5];
const fruits = ["apple", "banana", "orange"];

// 数组方法
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);

// 数组解构
const [first, second, ...rest] = numbers;
const [fruit1, fruit2] = fruits;
```

### 复杂数据结构

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

## 函数示例

### 基本函数

```javascript
// 函数声明
function greet(name) {
  return `Hello, ${name}!`;
}

// 函数表达式
const greetExpression = function(name) {
  return `Hello, ${name}!`;
};

// 箭头函数
const greetArrow = (name) => `Hello, ${name}!`;

// 带默认参数的函数
function createUser(name, age = 18, email = "default@example.com") {
  return { name, age, email };
}
```

### 高阶函数

```javascript
// 返回函数的函数
function createMultiplier(factor) {
  return function(value) {
    return value * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// 接受函数作为参数的函数
function processArray(array, processor) {
  return array.map(processor);
}

const numbers = [1, 2, 3, 4, 5];
const squared = processArray(numbers, x => x * x);
const doubled = processArray(numbers, x => x * 2);
```

### 异步函数

```javascript
// 基于 Promise 的函数
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

// Async/await 函数
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

// 带多个 await 调用的异步函数
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

## 类示例

### 基本类

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

### 继承

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

### 私有字段和方法

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

## 模块示例

### ES6 模块

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

## DOM 操作示例

### 基本 DOM 操作

```javascript
// 选择元素
const element = document.getElementById('myElement');
const elements = document.querySelectorAll('.myClass');
const firstElement = document.querySelector('.myClass');

// 创建元素
const newDiv = document.createElement('div');
newDiv.textContent = 'New element';
newDiv.className = 'myClass';
newDiv.id = 'newElement';

// 向 DOM 添加元素
document.body.appendChild(newDiv);
element.appendChild(newDiv);

// 移除元素
element.removeChild(newDiv);
newDiv.remove();

// 修改元素
element.textContent = 'New text';
element.innerHTML = '<span>HTML content</span>';
element.setAttribute('data-id', '123');
element.classList.add('newClass');
element.classList.remove('oldClass');
element.classList.toggle('active');
```

### 事件处理

```javascript
// 基本事件监听器
const button = document.getElementById('myButton');
button.addEventListener('click', function(event) {
  console.log('Button clicked!');
  console.log('Event:', event);
});

// 箭头函数事件监听器
button.addEventListener('click', (event) => {
  event.preventDefault();
  console.log('Button clicked with arrow function!');
});

// 事件委托
document.addEventListener('click', (event) => {
  if (event.target.matches('.delete-button')) {
    deleteItem(event.target.dataset.id);
  }
});

// 自定义事件
const customEvent = new CustomEvent('myCustomEvent', {
  detail: { message: 'Custom event data' }
});

element.addEventListener('myCustomEvent', (event) => {
  console.log('Custom event:', event.detail.message);
});

element.dispatchEvent(customEvent);
```

### 表单处理

```javascript
// 表单提交
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

// 实时表单验证
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

## API 集成示例

### Fetch API

```javascript
// 基本 GET 请求
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

// 带数据的 POST 请求
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

// 用于更新的 PUT 请求
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

// DELETE 请求
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

### 错误处理

```javascript
// 综合错误处理
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

// 使用
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

## 本地存储示例

```javascript
// 本地存储工具
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

// 使用示例
Storage.set('user', { name: 'John', id: 123 });
const user = Storage.get('user');
Storage.remove('user');
```

## 定时器和动画示例

```javascript
// setTimeout 和 setInterval
const delayedFunction = () => {
  console.log('This runs after 2 seconds');
};

const timeoutId = setTimeout(delayedFunction, 2000);

// 清除超时
clearTimeout(timeoutId);

// setInterval 用于重复任务
const intervalId = setInterval(() => {
  console.log('This runs every second');
}, 1000);

// 清除间隔
clearInterval(intervalId);

// 使用 requestAnimationFrame 的动画
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

## 错误处理示例

### Try-Catch 块

```javascript
// 基本错误处理
try {
  const result = riskyOperation();
  console.log('Result:', result);
} catch (error) {
  console.error('Error occurred:', error.message);
}

// 异步错误处理
async function handleAsyncOperation() {
  try {
    const result = await asyncRiskyOperation();
    return result;
  } catch (error) {
    console.error('Async error:', error);
    throw new Error('Custom error message');
  }
}

// 带 finally 的错误处理
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

### 自定义错误类

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

// 使用
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

这些示例演示了在 Web 开发、应用程序编程和现代 JavaScript 开发中常见的各种 JavaScript 模式和用例。 