# Vue.js — Using the Formatter

Paste Vue SFC code on the left, get formatted `<template>`, `<script>`, and `<style>` sections on the right.

## Template Syntax

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

## Composition API (`<script setup>`)

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

## Props and Emits

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

## Scoped Styles

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

## Slots

```vue
<!-- Parent -->
<Card>
  <template #header>
    <h2>Custom Header</h2>
  </template>
  <p>Default slot content</p>
  <template #footer>
    <button>OK</button>
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
