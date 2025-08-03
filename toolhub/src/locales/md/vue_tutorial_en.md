# Vue.js Usage Tutorial

## Environment Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager
- Modern web browser with developer tools

### Installation Options

#### Vue CLI (Traditional)
```bash
npm install -g @vue/cli
vue create my-vue-app
cd my-vue-app
npm run serve
```

#### Vite (Modern)
```bash
npm create vue@latest my-vue-app
cd my-vue-app
npm install
npm run dev
```

#### CDN (Quick Start)
```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

## Basic Concepts

### Vue Instance
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

### Template Syntax
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

### Data Binding
```javascript
// One-way binding
<div>{{ message }}</div>

// Two-way binding
<input v-model="message" />

// Attribute binding
<img :src="imageUrl" :alt="imageAlt" />
```

## Component Development

### Single File Components
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

### Composition API (Vue 3)
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

### Props and Events
```vue
<!-- Parent Component -->
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

### Installation
```bash
npm install vue-router@4
```

### Basic Setup
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

### Navigation
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

## State Management

### Pinia (Vue 3)
```bash
npm install pinia
```

### Store Setup
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

### Using Stores
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

## Forms and Validation

### Basic Form
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

### Form Validation
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

## HTTP Requests

### Using Fetch
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

### Using Axios
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

## Testing

### Unit Testing with Vitest
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

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
```javascript
// .env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=Vue App

// Usage in components
console.log(import.meta.env.VITE_API_URL)
```

### Docker Deployment
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

## Best Practices

### Performance
- Use `v-show` for frequently toggled elements
- Implement lazy loading for routes and components
- Use `key` attribute with `v-for`
- Optimize computed properties and watchers
- Use `v-once` for static content

### Code Organization
- Keep components small and focused
- Use consistent naming conventions
- Separate business logic from UI components
- Implement proper error handling
- Use TypeScript for better type safety

### Security
- Validate all user inputs
- Sanitize data before rendering
- Use HTTPS in production
- Implement proper authentication
- Follow OWASP security guidelines 