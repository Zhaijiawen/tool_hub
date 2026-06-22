# JavaScript — 使用格式化工具

左边粘贴乱掉的 JS，右边出格式化后的代码。缩进、分号、间距统一处理。

格式化前：

```javascript
const greet=(name)=>{console.log("Hello, "+name);};const nums=[1,2,3];const doubled=nums.map(n=>n*2);
```

格式化后：

```javascript
const greet = (name) => {
  console.log("Hello, " + name);
};

const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2);
```

## 现代 JS 语法

```javascript
// let/const（块作用域），别用 var
const MAX = 100;
let count = 0;

// 箭头函数
const add = (a, b) => a + b;

// 模板字面量
const msg = `Hello, ${name}. You have ${count} items.`;

// 解构
const { name, age } = user;
const [first, ...rest] = array;

// 可选链和空值合并
const city = user?.address?.city ?? "Unknown";

// Async/await
async function fetchData() {
  const res = await fetch("/api/data");
  const data = await res.json();
  return data;
}
```

## 类

```javascript
class Person {
  #secret; // 私有字段（ES2022）

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

## 数组方法

```javascript
const nums = [1, 2, 3, 4, 5];

nums.map(n => n * 2);          // [2, 4, 6, 8, 10]
nums.filter(n => n > 2);       // [3, 4, 5]
nums.find(n => n > 2);         // 3
nums.reduce((sum, n) => sum + n, 0); // 15
nums.some(n => n > 4);         // true
nums.every(n => n < 10);       // true
```

## 错误处理

```javascript
try {
  const data = JSON.parse('invalid json');
} catch (error) {
  console.error("Parse failed:", error.message);
}
```

## 实用建议

- 默认用 `const`，需要重新赋值时用 `let`。别碰 `var`。
- 用 `===`，不用 `==`，除非你明确需要类型转换。
- Async 函数返回 Promise——记得 `await` 或 `.catch()` 它。
- 用 Prettier 做格式化，ESLint 抓 bug——配置保存时自动运行。
