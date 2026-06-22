# JavaScript — 代码示例

## 一个实际的类

```javascript
class Person {
  #id; // 私有字段

  constructor(name, age) {
    this.name = name;
    this.age = age;
    this.#id = crypto.randomUUID();
  }

  get isAdult() { return this.age >= 18; }

  greet() {
    return `Hi, I'm ${this.name}, ${this.age} years old.`;
  }
}

const user = new Person("John", 25);
console.log(user.greet());
```

## Async/Await

```javascript
async function fetchUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch user:", err.message);
    throw err;
  }
}

// 并行请求
const [user, posts] = await Promise.all([
  fetchUser(1),
  fetchUser(2)
]);
```

## 数组转换

```javascript
const users = [
  { name: "Alice", age: 25, active: true },
  { name: "Bob", age: 17, active: false },
  { name: "Charlie", age: 30, active: true },
];

// Filter + map 链
const activeNames = users
  .filter(u => u.active)
  .map(u => u.name);
// ["Alice", "Charlie"]

// Reduce 转成对象
const byAge = users.reduce((acc, u) => {
  acc[u.name] = u.age;
  return acc;
}, {});
// { Alice: 25, Bob: 17, Charlie: 30 }

// 排序
const sorted = [...users].sort((a, b) => b.age - a.age);
```

## Promises

```javascript
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

await delay(1000);
console.log("1 second later");

// Promise 链
fetch("/api/data")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err))
  .finally(() => console.log("done"));
```

## 解构和展开

```javascript
// 对象解构
const { name, age, ...rest } = user;

// 数组解构
const [first, second, ...others] = [1, 2, 3, 4, 5];

// 展开合并
const defaults = { timeout: 30, retries: 3 };
const config = { ...defaults, timeout: 60 };

// 展开数组
const combined = [...arr1, ...arr2];
```

## 可选链

```javascript
// 没有可选链
const city = user && user.address && user.address.city;

// 使用可选链
const city = user?.address?.city ?? "Unknown";

// 安全方法调用
const result = obj?.method?.();
```
