# JavaScript — Code Examples

## A Real Class

```javascript
class Person {
  #id; // Private field

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

// Parallel requests
const [user, posts] = await Promise.all([
  fetchUser(1),
  fetchUser(2)
]);
```

## Array Transformations

```javascript
const users = [
  { name: "Alice", age: 25, active: true },
  { name: "Bob", age: 17, active: false },
  { name: "Charlie", age: 30, active: true },
];

// Filter + map chain
const activeNames = users
  .filter(u => u.active)
  .map(u => u.name);
// ["Alice", "Charlie"]

// Reduce to an object
const byAge = users.reduce((acc, u) => {
  acc[u.name] = u.age;
  return acc;
}, {});
// { Alice: 25, Bob: 17, Charlie: 30 }

// Sort
const sorted = [...users].sort((a, b) => b.age - a.age);
```

## Promises

```javascript
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

await delay(1000);
console.log("1 second later");

// Promise chaining
fetch("/api/data")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err))
  .finally(() => console.log("done"));
```

## Destructuring and Spread

```javascript
// Object destructuring
const { name, age, ...rest } = user;

// Array destructuring
const [first, second, ...others] = [1, 2, 3, 4, 5];

// Spread for merging
const defaults = { timeout: 30, retries: 3 };
const config = { ...defaults, timeout: 60 };

// Spread arrays
const combined = [...arr1, ...arr2];
```

## Optional Chaining

```javascript
// Without optional chaining
const city = user && user.address && user.address.city;

// With optional chaining
const city = user?.address?.city ?? "Unknown";

// Safe method calling
const result = obj?.method?.();
```
