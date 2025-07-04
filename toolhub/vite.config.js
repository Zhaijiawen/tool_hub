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
  
  // 构建配置（生产环境优化）
  build: {
    // 输出目录
    outDir: 'dist',
    // 生成 source map（可选，调试用）
    sourcemap: false,
    // 代码分割阈值
    chunkSizeWarningLimit: 1000,
    // Rollup 配置
    rollupOptions: {
      output: {
        // 手动分割代码块
        manualChunks: {
          // 将 Vue 相关库分离
          vue: ['vue', 'vue-router', 'pinia'],
          // 将 UI 库分离
          ui: ['naive-ui', '@vicons/antd', '@vicons/ionicons5'],
          // 将工具库分离
          utils: ['lodash-es', 'dayjs', 'axios'],
          // 将加密库分离
          crypto: ['crypto-js', 'bcryptjs', 'argon2', 'tweetnacl', 'elliptic'],
          // 将编辑器库分离
          editor: ['codemirror', '@codemirror/lang-css', '@codemirror/lang-html', '@codemirror/lang-javascript', '@codemirror/lang-json'],
          // 将其他大型库分离
          vendors: ['markdown-it', 'marked', 'mathjs', 'prettier', 'qrcode']
        }
      }
    },
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        // 移除 console
        drop_console: true,
        // 移除 debugger
        drop_debugger: true,
        // 移除无用代码
        pure_funcs: ['console.log']
      }
    },
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 构建后清理输出目录
    emptyOutDir: true
  },
  
  // 开发服务器配置
  server: {
    host: '0.0.0.0', // 允许外部访问
    port: 5173, // 开发环境端口
    open: true, // 自动打开浏览器
    proxy: {
      // 代理 API 请求到后端服务器
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  
  // 预览服务器配置（生产环境）
  preview: {
    host: '0.0.0.0', // 允许外部访问
    port: 4173, // 生产环境端口
    open: true, // 自动打开浏览器
    allowedHosts: [
      'toolhub.studio',
      'www.toolhub.studio',
      'localhost',
      '127.0.0.1'
    ]
  }
})
