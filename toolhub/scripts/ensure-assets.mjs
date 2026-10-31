// 构建前资产自检：若本地缺失被 gitignore 的大体积资产（imgly 模型/onnxruntime、
// mermaid、pandoc、whisper），则自动从官方 CDN / node_modules 生成。
//
// 设计动机：这些资产故意不入库（见 .gitignore），由对应的 fetch:* 脚本生成。
// 但生产构建（npm run build）此前并未触发生成，导致从干净仓库部署时
// public/imgly-bg/resources.json 等缺失，被 SPA 回退成 index.html，
// 运行时 fetch().json() 解析到 <!doctype 而报错。本脚本让构建自愈。
//
// 关键约束：
// - 幂等：marker 文件存在即跳过，本地已生成的不会重复下载 334MB。
// - 非阻断：任一外部 CDN 拉取失败只告警、不中止构建，
//   避免 imgly/mermaid/whisper 的 CDN 抖动导致整站部署失败。
//   （失败的资产组对应功能在生产环境会不可用，但其它功能照常。）

import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const ROOT = process.cwd()

const groups = [
  {
    key: 'imgly（抠图模型 + onnxruntime-web）',
    marker: 'public/imgly-bg/resources.json',
    script: 'fetch:imgly-assets'
  },
  {
    key: 'mermaid',
    marker: 'public/mermaid/mermaid.min.js',
    script: 'fetch:mermaid-assets'
  },
  {
    key: 'pandoc',
    marker: 'public/wasm/pandoc.wasm.gz',
    script: 'fetch:pandoc-assets'
  },
  {
    key: 'whisper（语音识别 onnxruntime）',
    marker: 'public/wasm/ort/ort-wasm-simd-threaded.wasm',
    script: 'fetch:whisper-assets'
  }
]

const npmBin = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const failed = []

console.log('[ensure-assets] 检查构建所需的大体积资产（缺失才生成）...')
for (const g of groups) {
  const markerPath = `${ROOT}/${g.marker}`
  if (existsSync(markerPath)) {
    console.log(`  ✓ ${g.key}：已存在，跳过`)
    continue
  }
  console.log(`  … ${g.key}：缺失，执行 \`npm run ${g.script}\``)
  const r = spawnSync(npmBin, ['run', g.script], { stdio: 'inherit' })
  if (r.status !== 0) {
    console.warn(
      `  ⚠ ${g.key}：生成失败（退出码 ${r.status}）。相关功能在生产环境可能不可用；` +
        `请检查网络或手动运行 \`npm run fetch:assets\`。`
    )
    failed.push(g.key)
  }
}

if (failed.length) {
  console.warn(
    `[ensure-assets] 以下资产组生成失败，已跳过以避免阻断整站构建：${failed.join('；')}`
  )
}

// 始终以 0 退出：资产缺失不应让整站部署失败（同上，非阻断）。
process.exit(0)
