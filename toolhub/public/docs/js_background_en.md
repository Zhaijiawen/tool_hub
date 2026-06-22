# JavaScript — What's Going On Under the Hood

JavaScript was created by Brendan Eich in 10 days at Netscape in 1995. It was supposed to be a simple scripting language for web pages. Nobody expected it to become the most widely-used programming language on Earth, running on servers, phones, robots, and spacecraft.

## The Event Loop Is Everything

JS is single-threaded. One call stack, one thing at a time. But it's non-blocking thanks to the event loop: async operations (network requests, timers, file I/O) get handed off to browser/Node APIs. When they complete, their callbacks go into a task queue. The event loop picks them up when the call stack is empty.

This is why `setTimeout(fn, 0)` doesn't run `fn` immediately — it gets queued, and the current execution finishes first.

## Prototypes, Not Classes

JavaScript's inheritance is prototypal, not classical. Every object has a hidden `[[Prototype]]` link to another object. When you access a property that doesn't exist on an object, JS walks up the prototype chain. The `class` syntax (ES6) is syntactic sugar over this:

```javascript
class Dog extends Animal {
  bark() { console.log('woof'); }
}
// This is really just:
// Dog.prototype = Object.create(Animal.prototype);
```

## Types and Coercion

JavaScript has 7 primitive types: `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, `null`. Everything else is an object.

Type coercion is the source of endless memes. `[] + [] === ""`, `[] + {} === "[object Object]"`, `{} + [] === 0`. The rules aren't random — they follow the Abstract Equality Comparison algorithm — but they're unintuitive enough that `===` should be your default.

## The Modern JS Stack

ES6 (2015) was the big one: `let`/`const`, arrow functions, classes, modules, template literals, destructuring, spread/rest, Promises. Since then, yearly releases add incrementally: async/await (ES2017), optional chaining `?.` and nullish coalescing `??` (ES2020), top-level await (ES2022).

**TypeScript** adds static types and has essentially become the standard for serious JS projects. It catches type errors at compile time that would be runtime bugs in plain JS.

**The ecosystem:** npm for packages, Vite/webpack for bundling, ESLint for linting, Prettier for formatting, Vitest/Jest for testing, Playwright/Cypress for e2e.

## Node.js

Ryan Dahl took Chrome's V8 engine and added filesystem, network, and OS APIs. Node.js made JS a server-side language. It's event-driven, non-blocking I/O model maps perfectly to the language's async-first design. npm, the package manager that ships with Node, hosts over 2 million packages.

## Things That Bite

- `this` binding depends on *how* a function is called, not where it's defined. Arrow functions capture `this` from the enclosing scope (lexical binding).
- `var` is function-scoped and hoisted. Use `let`/`const` (block-scoped).
- `==` does type coercion. Use `===`.
- Floating-point math: `0.1 + 0.2 !== 0.3`. Use integers or tolerance checks.
