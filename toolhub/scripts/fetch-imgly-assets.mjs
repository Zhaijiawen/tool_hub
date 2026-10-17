// 一次性拉取 @imgly/background-removal 的模型权重（ONNX + onnxruntime wasm）。
// 这些资源采用内容寻址存储，需整包解压到 public/imgly-bg/ 才能被运行时加载。
// 权重 334MB，不入库；clone 或 CI 部署前运行 `npm run fetch:imgly-assets` 即可。
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outDir = join(root, 'public', 'imgly-bg')
const VERSION = '1.7.0'
const DATA_URL = `https://staticimgly.com/@imgly/background-removal-data/${VERSION}/package.tgz`
const tmpTgz = join(tmpdir(), `imgly-bg-data-${VERSION}.tgz`)
const tmpExtract = join(tmpdir(), `imgly-bg-extract-${VERSION}`)

// 已存在 resources.json 视为已就绪，跳过
if (existsSync(outDir) && existsSync(join(outDir, 'resources.json'))) {
  console.log('[fetch-imgly-assets] public/imgly-bg 已就绪，跳过下载。')
  process.exit(0)
}

console.log(`[fetch-imgly-assets] 下载权重包 ${DATA_URL}`)
execSync(`curl -L -o "${tmpTgz}" "${DATA_URL}"`, { stdio: 'inherit' })

console.log('[fetch-imgly-assets] 解压...')
rmSync(tmpExtract, { recursive: true, force: true })
mkdirSync(tmpExtract, { recursive: true })
execSync(`tar xzf "${tmpTgz}" -C "${tmpExtract}"`, { stdio: 'inherit' })

mkdirSync(outDir, { recursive: true })
execSync(`cp -R "${join(tmpExtract, 'package', 'dist')}/." "${outDir}/"`, { stdio: 'inherit' })

console.log(`[fetch-imgly-assets] 完成 -> ${outDir}`)
rmSync(tmpExtract, { recursive: true, force: true })
