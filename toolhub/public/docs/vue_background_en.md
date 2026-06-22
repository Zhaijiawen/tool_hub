# Vue.js — What's Going On Under the Hood

Vue was created by Evan You in 2014. He'd worked on Angular at Google and wanted something that kept the reactive data binding he liked but stripped away the heavy conceptual overhead. Vue is "progressive" — you can drop it into an existing page with a `<script>` tag, or use it to build a full SPA with routing and state management.

## How Reactivity Works

Vue 2 used `Object.defineProperty` to intercept get/set on data properties. Vue 3 switched to JavaScript `Proxy`, which is faster and can detect property additions/deletions (Vue 2 couldn't). When you access a reactive property inside a computed or template, Vue records the dependency. When the property changes, everything that depends on it re-evaluates.

```javascript
import { ref, computed } from 'vue'

const count = ref(0)                    // Reactive primitive
const doubled = computed(() => count.value * 2) // Auto-updates

count.value++  // doubled recalculates automatically
```

## Options API vs Composition API

Options API (Vue 2 style):

```javascript
export default {
  data() { return { count: 0 } },
  methods: { increment() { this.count++ } },
  mounted() { console.log('ready') }
}
```

Composition API (Vue 3):

```javascript
import { ref, onMounted } from 'vue'

const count = ref(0)
const increment = () => count.value++

onMounted(() => console.log('ready'))
```

Composition API makes it easier to extract reusable logic into composables — plain functions that return reactive state. No mixins, no `this`, no namespace collisions.

## The Virtual DOM

Vue compiles templates into render functions that produce a virtual DOM tree (plain JS objects describing what the DOM should look like). When state changes, a new virtual tree is generated, diffed against the previous one, and only the changed parts are patched into the real DOM. Vue 3's compiler optimizes static content by hoisting it out of the render function — it never re-renders.

## Single-File Components

```vue
<script setup>
import { ref } from 'vue'
const message = ref('Hello')
</script>

<template>
  <h1>{{ message }}</h1>
</template>

<style scoped>
h1 { color: blue; }
</style>
```

`<script setup>` is Vue 3's compile-time sugar. Template, logic, and scoped styles in one file. `<style scoped>` auto-generates unique data attributes so your CSS never leaks.

## The Ecosystem

- **Vite** — the build tool. Crazy fast HMR, native ESM dev server, Rollup for production.
- **Pinia** — state management (replaced Vuex). TypeScript-first, no mutations, no namespacing.
- **Vue Router** — SPA routing with lazy-loaded routes, navigation guards, scroll behavior.
- **Nuxt** — meta-framework with SSR, SSG, file-based routing, auto-imports.
- **VueUse** — collection of composable utilities (useStorage, useMouse, useFetch, etc.).
