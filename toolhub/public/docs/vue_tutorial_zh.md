# Vue.js — 使用格式化工具

粘贴 Vue 单文件组件到编辑区，点格式化，`<template>`、`<script>`、`<style>` 区块自动整理。

## 模板语法

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p v-if="showMessage">{{ message }}</p>
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>
```

## Composition API（`<script setup>`）

```vue
<script setup>
import { ref, computed, onMounted } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)

const increment = () => count.value++

onMounted(() => {
  console.log('Component mounted')
})
</script>
```

## Props 和 Emits

```vue
<script setup>
const props = defineProps({
  title: String,
  items: { type: Array, default: () => [] }
})

const emit = defineEmits(['select', 'delete'])

const handleSelect = (item) => emit('select', item)
</script>

<template>
  <div>
    <h3>{{ title }}</h3>
    <button
      v-for="item in items"
      :key="item.id"
      @click="handleSelect(item)"
    >
      {{ item.name }}
    </button>
  </div>
</template>
```

## Scoped 样式

```vue
<style scoped>
.card {
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
}

.card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>
```

## 插槽

```vue
<!-- 父组件 -->
<Card>
  <template #header>
    <h2>自定义头部</h2>
  </template>
  <p>默认插槽内容</p>
  <template #footer>
    <button>确认</button>
  </template>
</Card>

<!-- Card.vue -->
<template>
  <div class="card">
    <header><slot name="header" /></header>
    <main><slot /></main>
    <footer><slot name="footer" /></footer>
  </div>
</template>
```
