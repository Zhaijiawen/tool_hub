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
    // 数组形式而非对象：正则 find（锚定裸限定符）无法作为对象字面量键，
    // 必须走 [{ find, replacement }] 形式（@rollup/plugin-alias 支持）。
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') }, // 设置 @ 别名指向 src 目录
      // pandoc-wasm 的 package.json 用 exports 限制了深导入，拿不到它内部的
      // src/core.js；而浏览器入口（src/index.browser.js）会在 import 时把 56MB
      // 的 wasm 一次性拉下来、且带顶层 await，无法接入我们「Worker + 进度 + 取消」
      // 的加载体系。这里用别名直取纯逻辑的 core.js，由我们自己的 worker 负责
      // 实例化，从而在懒加载的同时保留进度条与取消能力。
      { find: 'pandoc-wasm-core', replacement: resolve(__dirname, 'node_modules/pandoc-wasm/src/core.js') },
      // @xenova/transformers 无条件静态 import onnxruntime-node（Node 专用，
      // 含原生二进制）。浏览器分支只用 onnxruntime-web，换成空桩避免拖包。
      // 锚定正则只匹配裸限定符：字符串别名会连带重写 onnxruntime-node/xxx
      // 子路径导入，正则保证其他解析方式不受影响。
      { find: /^onnxruntime-node$/, replacement: resolve(__dirname, 'src/vendor/onnxruntime-node-stub.js') }
      // 注意：这里**不能**给裸限定符 onnxruntime-web 加别名。
      // @xenova/transformers 2.17.2 的 dist 是 webpack 预打包，内部以路径
      // 字符串 "./node_modules/onnxruntime-web/dist/ort-web.min.js" 硬引用——
      // ort-web.min.js 只存在于 1.14.x（1.17+ 已改名 ort.wasm.min.js 等），
      // 因此该路径天然只会命中嵌套安装的 1.14.0，无需（也不能）用 alias 干预：
      // 一旦 alias 裸限定符，@imgly/background-removal 的 import("onnxruntime-web")
      // 也会被改写到 1.14 的 ort.wasm.min.js，与它自托管的 1.21 wasm 不匹配，
      // 实例化直接失败（实机验证：expected magic word ... found 3c 21 64 6f）。
    ]
  },
  
  // Web Worker 构建配置
  worker: {
    // 输出 ES 模块：项目启用了代码分割（manualChunks），IIFE 格式不支持
    format: 'es'
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
          // 语言包单独拆出，业务代码变更不影响其缓存
          // （i18n 已按分类拆分至 src/locales/messages/，此处匹配整个目录；
          //   zh.js / en.js 仅为合并索引，体积可忽略）
          if (id.includes('src/locales/messages/')) {
            return 'locales'
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
    // 跨源隔离（与 public/_headers 的生产配置保持一致）：
    // SQLite OPFS 持久化要求 SharedArrayBuffer + 专用 Worker，
    // dev 环境缺这两个响应头会静默降级为内存库。官方文档要求 Vite 显式配置。
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless'
    }
  },

  // 预览服务器配置（生产环境）
  preview: {
    host: '0.0.0.0', // 允许外部访问
    port: 4173, // 生产环境端口
    open: true, // 自动打开浏览器
    allowedHosts: [
      'toolhubs.org',
      'www.toolhubs.org',
      'localhost',
      '127.0.0.1'
    ]
  }
})
