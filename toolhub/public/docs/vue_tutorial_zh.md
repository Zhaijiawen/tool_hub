# Vue.js 使用教程

## 环境设置

### 前置要求
- Node.js（版本14或更高）
- npm 或 yarn 包管理器
- 具有开发者工具的现代网页浏览器

### 安装选项

#### Vue CLI（传统方式）
```bash
npm install -g @vue/cli
vue create my-vue-app
cd my-vue-app
npm run serve
```

#### Vite（现代方式）
```bash
npm create vue@latest my-vue-app
cd my-vue-app
npm install
npm run dev
```

#### CDN（快速开始）
```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

## 基本概念

### Vue 实例
```javascript
const app = Vue.createApp({
  data() {
    return {
      message: 'Hello Vue!'
    }
  }
})
app.mount('#app')
```

### 模板语法
```html
<div id="app">
  <h1>{{ message }}</h1>
  <p v-if="showText">This text is conditionally shown</p>
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
  </ul>
</div>
```

### 数据绑定
```javascript
// 单向绑定
<div>{{ message }}</div>

// 双向绑定
<input v-model="message" />

// 属性绑定
<img :src="imageUrl" :alt="imageAlt" />
```

## 组件开发

### 单文件组件
```vue
<template>
  <div class="user-card">
    <h3>{{ user.name }}</h3>
    <p>{{ user.email }}</p>
    <button @click="handleClick">Contact</button>
  </div>
</template>

<script>
export default {
  name: 'UserCard',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  emits: ['contact'],
  methods: {
    handleClick() {
      this.$emit('contact', this.user)
    }
  }
}
</script>

<style scoped>
.user-card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
}
</style>
```

### Composition API（Vue 3）
```vue
<template>
  <div class="counter">
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
    <button @click="decrement">Decrement</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)

const increment = () => count.value++
const decrement = () => count.value--
</script>
```

### Props 和事件
```vue
<!-- 父组件 -->
<template>
  <UserList 
    :users="users" 
    @user-selected="handleUserSelection"
  />
</template>

<script>
export default {
  data() {
    return {
      users: [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' }
      ]
    }
  },
  methods: {
    handleUserSelection(user) {
      console.log('Selected user:', user)
    }
  }
}
</script>
```

## Vue Router

### 安装
```bash
npm install vue-router@4
```

### 基本设置
```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/user/:id',
    name: 'User',
    component: () => import('../views/User.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

### 导航
```vue
<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-link :to="{ name: 'User', params: { id: userId }}">
      Profile
    </router-link>
  </nav>
  
  <router-view />
</template>

<script>
export default {
  data() {
    return {
      userId: 123
    }
  }
}
</script>
```

## 状态管理

### Pinia（Vue 3）
```bash
npm install pinia
```

### Store 设置
```javascript
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'Counter Store'
  }),
  
  getters: {
    doubleCount: (state) => state.count * 2,
    countPlusOne: (state) => state.count + 1
  },
  
  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
    async fetchCount() {
      const response = await fetch('/api/count')
      this.count = await response.json()
    }
  }
})
```

### 使用 Store
```vue
<template>
  <div>
    <p>Count: {{ counter.count }}</p>
    <p>Double: {{ counter.doubleCount }}</p>
    <button @click="counter.increment">+</button>
    <button @click="counter.decrement">-</button>
  </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()
</script>
```

## 表单和验证

### 基本表单
```vue
<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label>Name:</label>
      <input 
        v-model="form.name" 
        type="text" 
        required 
      />
    </div>
    
    <div>
      <label>Email:</label>
      <input 
        v-model="form.email" 
        type="email" 
        required 
      />
    </div>
    
    <button type="submit">Submit</button>
  </form>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  name: '',
  email: ''
})

const handleSubmit = () => {
  console.log('Form submitted:', form)
  // Handle form submission
}
</script>
```

### 表单验证
```vue
<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <input 
        v-model="form.name" 
        :class="{ error: errors.name }"
      />
      <span v-if="errors.name" class="error-text">
        {{ errors.name }}
      </span>
    </div>
    
    <button type="submit" :disabled="!isValid">
      Submit
    </button>
  </form>
</template>

<script setup>
import { reactive, computed } from 'vue'

const form = reactive({
  name: '',
  email: ''
})

const errors = reactive({
  name: '',
  email: ''
})

const isValid = computed(() => {
  return form.name && form.email && !errors.name && !errors.email
})

const validateForm = () => {
  errors.name = form.name.length < 2 ? 'Name too short' : ''
  errors.email = !form.email.includes('@') ? 'Invalid email' : ''
}

const handleSubmit = () => {
  validateForm()
  if (isValid.value) {
    console.log('Form valid:', form)
  }
}
</script>
```

## HTTP 请求

### 使用 Fetch
```vue
<script setup>
import { ref, onMounted } from 'vue'

const users = ref([])
const loading = ref(false)
const error = ref(null)

const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/users')
    users.value = await response.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)
</script>
```

### 使用 Axios
```bash
npm install axios
```

```javascript
// services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000
})

export const userService = {
  getUsers() {
    return api.get('/users')
  },
  
  getUser(id) {
    return api.get(`/users/${id}`)
  },
  
  createUser(userData) {
    return api.post('/users', userData)
  }
}
```

## 测试

### 使用 Vitest 进行单元测试
```bash
npm install -D vitest @vue/test-utils
```

```javascript
// tests/Counter.test.js
import { mount } from '@vue/test-utils'
import Counter from '../components/Counter.vue'

describe('Counter', () => {
  test('increments count when button is clicked', async () => {
    const wrapper = mount(Counter)
    
    expect(wrapper.text()).toContain('Count: 0')
    
    await wrapper.find('button').trigger('click')
    
    expect(wrapper.text()).toContain('Count: 1')
  })
})
```

## 部署

### 生产环境构建
```bash
npm run build
```

### 环境变量
```javascript
// .env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=Vue App

// 在组件中使用
console.log(import.meta.env.VITE_API_URL)
```

### Docker 部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 80
CMD ["npm", "run", "preview"]
```

## 最佳实践

### 性能
- 对频繁切换的元素使用 `v-show` 而不是 `v-if`
- 对路由和组件实现懒加载
- 在 `v-for` 中使用 `key` 属性
- 优化计算属性和侦听器
- 对静态内容使用 `v-once`

### 代码组织
- 保持组件小而专注
- 使用一致的命名约定
- 将业务逻辑与 UI 组件分离
- 实现适当的错误处理
- 使用 TypeScript 获得更好的类型安全性

### 安全性
- 验证所有用户输入
- 在渲染前清理数据
- 在生产环境中使用 HTTPS
- 实现适当的身份验证
- 遵循 OWASP 安全指南 