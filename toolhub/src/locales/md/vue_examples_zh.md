# Vue.js 代码示例

## 基本语法

### Hello World
```vue
<template>
  <div id="app">
    <h1>{{ message }}</h1>
    <p>Welcome to Vue.js!</p>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      message: 'Hello Vue!'
    }
  }
}
</script>
```

### 数据绑定
```vue
<template>
  <div>
    <!-- 文本插值 -->
    <p>{{ greeting }}</p>
    
    <!-- 属性绑定 -->
    <img :src="imageUrl" :alt="imageAlt" />
    
    <!-- 双向绑定 -->
    <input v-model="userInput" placeholder="Type something..." />
    <p>You typed: {{ userInput }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      greeting: 'Welcome to Vue!',
      imageUrl: 'https://example.com/image.jpg',
      imageAlt: 'Example image',
      userInput: ''
    }
  }
}
</script>
```

## 指令

### 条件渲染
```vue
<template>
  <div>
    <button @click="toggleVisibility">Toggle</button>
    
    <!-- v-if 指令 -->
    <div v-if="isVisible" class="conditional-block">
      This content is conditionally shown
    </div>
    
    <!-- v-show 指令 -->
    <div v-show="isVisible" class="conditional-block">
      This content is conditionally shown (v-show)
    </div>
    
    <!-- v-else -->
    <div v-else class="else-block">
      This shows when condition is false
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isVisible: true
    }
  },
  methods: {
    toggleVisibility() {
      this.isVisible = !this.isVisible
    }
  }
}
</script>
```

### 列表渲染
```vue
<template>
  <div>
    <h3>Users List</h3>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.name }} - {{ user.email }}
      </li>
    </ul>
    
    <!-- 带索引 -->
    <ul>
      <li v-for="(user, index) in users" :key="user.id">
        {{ index + 1 }}. {{ user.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
      ]
    }
  }
}
</script>
```

### 事件处理
```vue
<template>
  <div>
    <button @click="handleClick">Click me</button>
    <button @click="handleClickWithParam('Hello')">Click with param</button>
    
    <!-- 事件修饰符 -->
    <form @submit.prevent="handleSubmit">
      <input @keyup.enter="handleEnter" />
      <button type="submit">Submit</button>
    </form>
    
    <!-- 多个事件 -->
    <div 
      @click="handleClick"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      class="interactive-div"
    >
      Hover and click me
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleClick() {
      console.log('Button clicked!')
    },
    handleClickWithParam(message) {
      console.log(message)
    },
    handleSubmit() {
      console.log('Form submitted')
    },
    handleEnter() {
      console.log('Enter key pressed')
    },
    handleMouseEnter() {
      console.log('Mouse entered')
    },
    handleMouseLeave() {
      console.log('Mouse left')
    }
  }
}
</script>
```

## 组件

### 基本组件
```vue
<!-- UserCard.vue -->
<template>
  <div class="user-card">
    <img :src="user.avatar" :alt="user.name" class="avatar" />
    <div class="user-info">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <p>{{ user.role }}</p>
    </div>
    <button @click="handleContact">Contact</button>
  </div>
</template>

<script>
export default {
  name: 'UserCard',
  props: {
    user: {
      type: Object,
      required: true,
      validator: (value) => {
        return value.name && value.email
      }
    }
  },
  emits: ['contact'],
  methods: {
    handleContact() {
      this.$emit('contact', this.user)
    }
  }
}
</script>

<style scoped>
.user-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin: 8px;
  max-width: 300px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.user-info {
  margin: 12px 0;
}
</style>
```

### 父组件
```vue
<template>
  <div>
    <h2>User Directory</h2>
    <div class="users-grid">
      <UserCard
        v-for="user in users"
        :key="user.id"
        :user="user"
        @contact="handleUserContact"
      />
    </div>
  </div>
</template>

<script>
import UserCard from './UserCard.vue'

export default {
  components: {
    UserCard
  },
  data() {
    return {
      users: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'Developer',
          avatar: 'https://example.com/avatar1.jpg'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'Designer',
          avatar: 'https://example.com/avatar2.jpg'
        }
      ]
    }
  },
  methods: {
    handleUserContact(user) {
      console.log('Contacting user:', user.name)
      // Handle contact logic
    }
  }
}
</script>
```

## Composition API (Vue 3)

### 基本设置
```vue
<template>
  <div>
    <h2>Counter: {{ count }}</h2>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="reset">Reset</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 响应式状态
const count = ref(0)

// 计算属性
const doubleCount = computed(() => count.value * 2)

// 方法
const increment = () => count.value++
const decrement = () => count.value--
const reset = () => count.value = 0

// 生命周期
onMounted(() => {
  console.log('Component mounted')
})
</script>
```

### 响应式对象
```vue
<template>
  <div>
    <h3>User Form</h3>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>Name:</label>
        <input v-model="user.name" type="text" required />
      </div>
      <div>
        <label>Email:</label>
        <input v-model="user.email" type="email" required />
      </div>
      <div>
        <label>Age:</label>
        <input v-model.number="user.age" type="number" min="0" />
      </div>
      <button type="submit">Submit</button>
    </form>
    
    <div v-if="isValid" class="preview">
      <h4>Preview:</h4>
      <p>Name: {{ user.name }}</p>
      <p>Email: {{ user.email }}</p>
      <p>Age: {{ user.age }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'

const user = reactive({
  name: '',
  email: '',
  age: 0
})

const isValid = computed(() => {
  return user.name && user.email && user.age > 0
})

const handleSubmit = () => {
  if (isValid.value) {
    console.log('User data:', user)
    // Submit logic
  }
}
</script>
```

## Vue Router

### 路由配置
```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import UserProfile from '../views/UserProfile.vue'

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
    name: 'UserProfile',
    component: UserProfile,
    props: true
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 导航守卫
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login')
  } else {
    next()
  }
})

export default router
```

### 导航组件
```vue
<template>
  <nav class="navigation">
    <router-link to="/" class="nav-link">Home</router-link>
    <router-link to="/about" class="nav-link">About</router-link>
    <router-link :to="{ name: 'UserProfile', params: { id: userId }}">
      Profile
    </router-link>
    
    <button @click="goToPage('/admin')">Admin</button>
    <button @click="goBack">Back</button>
  </nav>
  
  <router-view />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userId = ref(123)

const goToPage = (path) => {
  router.push(path)
}

const goBack = () => {
  router.go(-1)
}
</script>
```

## 状态管理 (Pinia)

### Store 定义
```javascript
// stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    currentUser: null,
    loading: false,
    error: null
  }),
  
  getters: {
    activeUsers: (state) => state.users.filter(user => user.active),
    userCount: (state) => state.users.length,
    getUserById: (state) => (id) => state.users.find(user => user.id === id)
  },
  
  actions: {
    async fetchUsers() {
      this.loading = true
      try {
        const response = await fetch('/api/users')
        this.users = await response.json()
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    addUser(user) {
      this.users.push(user)
    },
    
    updateUser(id, updates) {
      const index = this.users.findIndex(user => user.id === id)
      if (index !== -1) {
        this.users[index] = { ...this.users[index], ...updates }
      }
    },
    
    deleteUser(id) {
      this.users = this.users.filter(user => user.id !== id)
    }
  }
})
```

### 在组件中使用 Store
```vue
<template>
  <div>
    <h2>User Management</h2>
    
    <div v-if="userStore.loading">Loading...</div>
    <div v-else-if="userStore.error">Error: {{ userStore.error }}</div>
    <div v-else>
      <p>Total users: {{ userStore.userCount }}</p>
      <p>Active users: {{ userStore.activeUsers.length }}</p>
      
      <ul>
        <li v-for="user in userStore.users" :key="user.id">
          {{ user.name }} - {{ user.email }}
          <button @click="editUser(user)">Edit</button>
          <button @click="deleteUser(user.id)">Delete</button>
        </li>
      </ul>
    </div>
    
    <button @click="userStore.fetchUsers">Refresh Users</button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const editUser = (user) => {
  // Edit logic
  console.log('Editing user:', user)
}

const deleteUser = (id) => {
  userStore.deleteUser(id)
}

onMounted(() => {
  userStore.fetchUsers()
})
</script>
```

## 高级特性

### 自定义指令
```vue
<template>
  <div>
    <input v-focus v-highlight="'yellow'" />
    <p v-highlight="'lightblue'">This text will be highlighted</p>
  </div>
</template>

<script setup>
import { directive } from 'vue'

// 自定义 focus 指令
const vFocus = {
  mounted: (el) => el.focus()
}

// 自定义 highlight 指令
const vHighlight = {
  mounted: (el, binding) => {
    el.style.backgroundColor = binding.value
  },
  updated: (el, binding) => {
    el.style.backgroundColor = binding.value
  }
}
</script>
```

### Teleport
```vue
<template>
  <div>
    <button @click="showModal = true">Open Modal</button>
    
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <h3>Modal Title</h3>
          <p>This modal is teleported to body</p>
          <button @click="showModal = false">Close</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showModal = ref(false)
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
}
</style>
``` 