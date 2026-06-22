# JavaScript — 幕后原理

JavaScript 是 Brendan Eich 1995 年在 Netscape 花了 10 天写出来的。初衷只是给网页加点交互。谁也没想到它后来成了地球上使用最广泛的编程语言，跑在服务器、手机、机器人甚至飞船上。

## 事件循环是一切

JS 是单线程的。一个调用栈，一次做一件事。但它又是非阻塞的——异步操作（网络请求、定时器、文件 I/O）被交给浏览器/Node API。完成后，它们的回调进入任务队列。事件循环在调用栈为空时取出执行。

这就是为什么 `setTimeout(fn, 0)` 不会立即执行 `fn`——它先被排进队列，当前的执行先跑完。

## 原型，不是类

JavaScript 的继承是原型式的，不是传统的类继承。每个对象都有一个隐式的 `[[Prototype]]` 链接指向另一个对象。当你访问对象上不存在的属性时，JS 沿着原型链向上查找。`class` 语法（ES6）只是这层机制的语法糖：

```javascript
class Dog extends Animal {
  bark() { console.log('woof'); }
}
// 实际上就是：
// Dog.prototype = Object.create(Animal.prototype);
```

## 类型和隐式转换

JavaScript 有 7 种基本类型：`string`、`number`、`bigint`、`boolean`、`undefined`、`symbol`、`null`。其余全是对象。

类型隐式转换是无穷无尽的表情包素材。`[] + [] === ""`，`[] + {} === "[object Object]"`，`{} + [] === 0`。规则不是随机的——遵循抽象相等比较算法——但确实反直觉到你应该默认用 `===`。

## 现代 JS 技术栈

ES6（2015）是分水岭：`let`/`const`、箭头函数、class、模块、模板字面量、解构、展开/剩余运算符、Promise。之后每年增量更新：async/await（ES2017）、可选链 `?.` 和空值合并 `??`（ES2020）、顶层 await（ES2022）。

**TypeScript** 加了静态类型，基本已成为正经 JS 项目的标配。它在编译期就能抓到类型错误——这些错误在纯 JS 里要到运行时才暴露。

**生态：** npm 管包，Vite/webpack 做打包，ESLint 做检查，Prettier 做格式化，Vitest/Jest 做测试，Playwright/Cypress 做 e2e。

## Node.js

Ryan Dahl 拿了 Chrome 的 V8 引擎，加了文件系统、网络和操作系统 API。Node.js 让 JS 变成了服务器端语言。它事件驱动、非阻塞 I/O 的模型和 JS 异步优先的设计浑然一体。随 Node 一起分发的 npm 上托管了超过 200 万个包。

## 容易踩的坑

- `this` 的绑定取决于函数*怎么被调用*，而不是在哪定义。箭头函数从外围作用域捕获 `this`（词法绑定）。
- `var` 是函数作用域且会提升。用 `let`/`const`（块作用域）。
- `==` 做类型隐式转换。用 `===`。
- 浮点数运算：`0.1 + 0.2 !== 0.3`。用整数或容差检查。
