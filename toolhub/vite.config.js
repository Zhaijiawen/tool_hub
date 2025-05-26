// Vite 构建工具配置文件
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// Vite 配置 - https://vite.dev/config/
export default defineConfig({
  // 插件配置
  plugins: [vue()], // Vue 3 插件
  
  // 路径解析配置
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src') // 设置 @ 别名指向 src 目录
    }
  },
  
  // 开发服务器配置
  server: {
    host: '0.0.0.0', // 允许外部访问
    port: 5173, // 默认端口
    open: true // 自动打开浏览器
  }
})
