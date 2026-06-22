# Vue.js — 幕后原理

Vue 由尤雨溪在 2014 年创建。他之前在 Google 参与过 Angular 的开发，想要保留响应式数据绑定的优点，但去掉沉重的概念负担。Vue 是"渐进式"的——你可以用 `<script>` 标签引入到现有页面里，也可以拿它构建带路由和状态管理的完整 SPA。

## 响应式系统怎么工作

Vue 2 用 `Object.defineProperty` 拦截数据属性的 get/set。Vue 3 换成了 JavaScript `Proxy`，更快，而且能检测属性的新增和删除（Vue 2 做不到）。当你在 computed 或模板里访问一个响应式属性时，Vue 记下依赖关系。属性一变，所有依赖它的地方自动重新求值。

```javascript
import { ref, computed } from 'vue'

const count = ref(0)                    // 响应式基本值
const doubled = computed(() => count.value * 2) // 自动更新

count.value++  // doubled 自动重新计算
```

## Options API vs Composition API

Options API（Vue 2 风格）：

```javascript
export default {
  data() { return { count: 0 } },
  methods: { increment() { this.count++ } },
  mounted() { console.log('ready') }
}
```

Composition API（Vue 3）：

```javascript
import { ref, onMounted } from 'vue'

const count = ref(0)
const increment = () => count.value++

onMounted(() => console.log('ready'))
```

Composition API 更容易把可复用逻辑抽成 composable——就是返回响应式状态的普通函数。没有 mixin，没有 `this`，没有命名冲突。

## 虚拟 DOM

Vue 把模板编译成渲染函数，产生虚拟 DOM 树（描述 DOM 结构的普通 JS 对象）。状态变化时，生成新的虚拟树，和旧的做 diff，只把变化的部分 patch 到真实 DOM。Vue 3 的编译器会把静态内容提升到渲染函数外面——这部分永远不会重新渲染。

## 单文件组件

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

`<script setup>` 是 Vue 3 的编译期语法糖。模板、逻辑、作用域样式都在一个文件里。`<style scoped>` 自动生成唯一 data 属性，CSS 绝不会泄漏到外面。

## 生态

- **Vite** — 构建工具。HMR 飞快，开发服务器用原生 ESM，生产用 Rollup。
- **Pinia** — 状态管理（取代了 Vuex）。TypeScript 优先，没有 mutation，不用 namespace。
- **Vue Router** — SPA 路由，支持懒加载、导航守卫、滚动行为控制。
- **Nuxt** — 元框架，支持 SSR、SSG、文件路由、自动导入。
- **VueUse** — 组合式工具函数集（useStorage、useMouse、useFetch 等）。
