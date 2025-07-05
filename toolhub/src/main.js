// 导入Vue核心功能
import { createApp } from 'vue'
// 导入Pinia状态管理库
import { createPinia } from 'pinia'
// 导入根组件
import App from './App.vue'
// 导入路由配置
import router from './router'
// 导入国际化配置
import i18n from './locales'

// 导入全局样式
import './assets/main.css'

// 导入Naive UI
import naive from 'naive-ui'

// 创建Vue应用实例
const app = createApp(App)

// 使用Pinia进行状态管理
app.use(createPinia())
// 使用路由
app.use(router)
// 使用国际化
app.use(i18n)
// 使用Naive UI
app.use(naive)

// 挂载应用到DOM
app.mount('#app')
