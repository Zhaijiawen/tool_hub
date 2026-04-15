// Vite 构建工具配置文件
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression'

// Vite 配置 - https://vite.dev/config/
export default defineConfig({
  // 插件配置
  plugins: [
    vue(),
  
    // Naive UI 按需自动导入组件（无需在 main.js 全量注册）
    Components({
      resolvers: [NaiveUiResolver()]
    }),

    // 自动导入 Vue/Vue Router API，无需手动 import
    AutoImport({
      imports: ['vue', 'vue-router', 'vue-i18n', '@vueuse/core'],
      dts: false // 不生成类型声明文件
    }),

    // Gzip 预压缩（服务器需开启静态文件 gzip 支持）
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // 大于 10KB 才压缩
      deleteOriginFile: false
    }),

    // Brotli 压缩（现代浏览器优先使用，压缩率更高）
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false
    })
  ],

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
    // 代码分割阈值（调大以减少小文件数量）
    chunkSizeWarningLimit: 2000,
    // Rollup 配置
    rollupOptions: {
      output: {
        // 手动分割代码块
        manualChunks(id) {
          // Vue 核心库（最高优先级，几乎所有页面都需要）
          if (id.includes('node_modules/vue/') || id.includes('node_modules/vue-router/') || id.includes('node_modules/pinia/')) {
            return 'vue'
          }
          // vue-i18n 单独分离
          if (id.includes('node_modules/vue-i18n/') || id.includes('node_modules/@intlify/')) {
            return 'vue-i18n'
          }
          // Naive UI（按需加载插件会自动只引入使用到的组件，但 vueuc/css-render 等基础模块仍集中打包）
          if (id.includes('node_modules/naive-ui/') || id.includes('node_modules/vueuc/') ||
              id.includes('node_modules/css-render/') || id.includes('node_modules/@css-render/') ||
              id.includes('node_modules/seemly/') || id.includes('node_modules/treemate/') ||
              id.includes('node_modules/@juggle/')) {
            return 'ui'
          }
          // 图标库
          if (id.includes('node_modules/@vicons/')) {
            return 'icons'
          }
          // 工具库
          if (id.includes('node_modules/lodash-es/') || id.includes('node_modules/dayjs/') || id.includes('node_modules/axios/')) {
            return 'utils'
          }
          // 加密库（轻量）
          if (id.includes('node_modules/crypto-js/') || id.includes('node_modules/tweetnacl/') || id.includes('node_modules/elliptic/')) {
            return 'crypto'
          }
          // argon2（WASM 大库，单独分割）
          if (id.includes('node_modules/argon2/') || id.includes('node_modules/hash-wasm/')) {
            return 'argon2'
          }
          // bcrypt
          if (id.includes('node_modules/bcryptjs/')) {
            return 'bcrypt'
          }
          // CodeMirror 编辑器核心
          if (id.includes('node_modules/codemirror/') || id.includes('node_modules/@codemirror/view') ||
              id.includes('node_modules/@codemirror/state') || id.includes('node_modules/@codemirror/language') ||
              id.includes('node_modules/@codemirror/theme')) {
            return 'editor'
          }
          // CodeMirror 各语言包（懒加载，不集中打包）
          // markdown 和文档处理库
          if (id.includes('node_modules/markdown-it/') || id.includes('node_modules/marked/') || id.includes('node_modules/dompurify/')) {
            return 'markdown'
          }
          // 数学库
          if (id.includes('node_modules/mathjs/')) {
            return 'mathjs'
          }
          // 格式化库
          if (id.includes('node_modules/prettier/') || id.includes('node_modules/js-beautify/')) {
            return 'formatter'
          }
          // 二维码
          if (id.includes('node_modules/qrcode/') || id.includes('node_modules/qrcode.vue/')) {
            return 'qrcode'
          }
        },
        // 优化文件名（便于缓存）
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
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
        pure_funcs: ['console.log'],
        // 优化常量折叠
        passes: 2
      },
      mangle: {
        // 保留类名（避免某些库出错）
        keep_classnames: false,
        keep_fnames: false
      }
    },
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 构建后清理输出目录
    emptyOutDir: true,
    // 关闭压缩报告提升构建速度
    reportCompressedSize: false,
    // 资源内联阈值（小于4KB的资源会被内联）
    assetsInlineLimit: 4096
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
