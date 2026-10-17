// 把 @imgly 之外的新增大型前端资源同步到 public/。
// Mermaid 的 prebuilt bundle（约 5.2MB）不适合交给 Rollup 参与打包：
// mermaid 12 的 ESM 依赖图约 1700 个模块，会让整站构建从 6735 涨到 8460 模块，
// Rollup 生成阶段远超 Node 默认堆并 OOM（本机实测 6GB 仍被杀）。
// 因此改为：运行时动态注入 <script> 加载自托管的 min bundle，
// 构建产物完全不含 mermaid，既保持构建轻量，也维持"不依赖 CDN"的原则。
// 资源 5.2MB，不入库；clone 或 CI 部署前运行 `npm run fetch:mermaid-assets` 即可。
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outDir = join(root, 'public', 'mermaid')
const outFile = join(outDir, 'mermaid.min.js')
const srcDir = join(root, 'node_modules', 'mermaid', 'dist')

// 已存在且非空视为已就绪，跳过
if (existsSync(outFile) && statSync(outFile).size > 0) {
  console.log('[fetch-mermaid-assets] public/mermaid/mermaid.min.js 已就绪，跳过。')
  process.exit(0)
}

if (!existsSync(srcDir)) {
  console.error(`[fetch-mermaid-assets] 未找到 ${srcDir}，请先执行 npm install。`)
  process.exit(1)
}

mkdirSync(outDir, { recursive: true })
copyFileSync(join(srcDir, 'mermaid.min.js'), outFile)

const sizeMB = (statSync(outFile).size / 1024 / 1024).toFixed(2)
console.log(`[fetch-mermaid-assets] 完成 -> ${outFile} (${sizeMB} MB)`)
