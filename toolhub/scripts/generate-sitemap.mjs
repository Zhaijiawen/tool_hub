#!/usr/bin/env node
/**
 * Sitemap 生成器
 *
 * 以 src/router/index.js 为唯一事实源生成 public/sitemap.xml：
 *   - 解析路由树，输出全部可达 URL（首页 / 静态页 / 各分类工具页）
 *   - lastmod 取该页组件文件的 git 最后提交日期（内容变了日期才变，
 *     避免每次构建都全量刷新导致搜索引擎重复抓取）
 *   - 无 git 环境时退化为仓库最新提交日期，再退化为固定日期
 *
 * 用法: node scripts/generate-sitemap.mjs [--check]
 *   --check  仅校验 public/sitemap.xml 是否为最新（不写入），供 CI 用
 */
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join, relative } from 'path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'src')
const ROUTER = join(SRC, 'router/index.js')
const OUT = join(ROOT, 'public/sitemap.xml')
const BASE_URL = 'https://toolhubs.org'

// ---------- 1. 解析路由 ----------
function parseRoutes() {
  const src = readFileSync(ROUTER, 'utf8')
  const pathRe = /path:\s*'([^']+)'/g
  const entries = []
  let m
  while ((m = pathRe.exec(src))) {
    const path = m[1]
    if (path === '/') continue
    // 只在本条目范围内（到下一个 path: 或 children: 为止）找 import，避免把子路由的 import 误判给分类条目
    const rest = src.slice(m.index + m[0].length)
    const boundary = rest.search(/\n\s*(path:|children:)/)
    const slice = boundary === -1 ? rest : rest.slice(0, boundary)
    const imp = slice.match(/import\('(@\/[^']+)'\)/)
    entries.push({ path, importPath: imp ? imp[1] : null })
  }

  const routes = [] // { url, file, kind: 'home'|'static'|'tool' }
  let category = null
  for (const e of entries) {
    if (!e.importPath) {
      // 分类路由（component: BaseView）
      category = e.path
      continue
    }
    const file = e.importPath.replace('@/', '')
    if (file.startsWith('views/')) {
      routes.push({ url: `/${e.path}`, file: join('src', file), kind: 'static' })
    } else {
      routes.push({ url: `/${category}/${e.path}`, file: join('src', file), kind: 'tool' })
    }
  }
  return routes
}

// ---------- 2. git 日期 ----------
function buildGitDateMap() {
  const map = new Map()
  let appPrefix = ''
  try {
    // git 输出的文件名相对仓库根（如 toolhub/src/...），推导应用目录前缀再拼回
    const gitRoot = execSync('git rev-parse --show-toplevel', { cwd: ROOT, encoding: 'utf8' }).trim()
    appPrefix = relative(gitRoot, ROOT).replace(/\/?$/, '/')
    const out = execSync('git log --date=short --format=%ad --name-only -800', {
      cwd: ROOT,
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024
    })
    let date = null
    for (const line of out.split('\n')) {
      const t = line.trim()
      if (!t) continue
      if (/^\d{4}-\d{2}-\d{2}$/.test(t)) {
        date = t
      } else if (date && !map.has(t)) {
        map.set(t, date) // 首次出现 = 最后修改
      }
    }
  } catch {
    /* 非 git 环境，走退化路径 */
  }
  return { map, appPrefix }
}

function resolveDate(file, { map, appPrefix }, fallback) {
  const rel = relative(ROOT, join(ROOT, file))
  return map.get(appPrefix + rel) || map.get(rel) || null
}

function dateOr(date, fallback) {
  return date || fallback
}

// ---------- 3. 生成 XML ----------
function buildSitemap(routes, gitDates, fallback) {
  const homeDate = dateOr(resolveDate('src/views/Home.vue', gitDates, fallback), fallback)
  const staticPages = routes.filter(r => r.kind === 'static')
  const tools = routes.filter(r => r.kind === 'tool').sort((a, b) => a.url.localeCompare(b.url))

  const block = (url, lastmod, changefreq, priority) =>
    `    <url>\n        <loc>${BASE_URL}${url}</loc>\n        <lastmod>${lastmod}</lastmod>\n        <changefreq>${changefreq}</changefreq>\n        <priority>${priority}</priority>\n    </url>`

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
    '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9',
    '        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">',
    '',
    '    <!-- Home -->',
    block('/', homeDate, 'weekly', '1.0'),
    '',
    `    <!-- Static pages (${staticPages.length}) -->`
  ]
  const staticFreq = { '/privacy': 'yearly', '/terms': 'yearly' }
  for (const r of staticPages) {
    lines.push(block(r.url, dateOr(resolveDate(r.file, gitDates, fallback), fallback), staticFreq[r.url] || 'monthly', '0.3'))
  }
  lines.push('', `    <!-- Tools (${tools.length} total) -->`)
  for (const r of tools) {
    lines.push(block(r.url, dateOr(resolveDate(r.file, gitDates, fallback), fallback), 'monthly', '0.8'))
  }
  lines.push('', '</urlset>', '')
  return lines.join('\n')
}

// ---------- main ----------
const routes = parseRoutes()
const gitDates = buildGitDateMap()
const fallback = (() => {
  try {
    return execSync('git log -1 --date=short --format=%ad', { cwd: ROOT, encoding: 'utf8' }).trim()
  } catch {
    return '2026-01-01'
  }
})()
const xml = buildSitemap(routes, gitDates, fallback)

const tools = routes.filter(r => r.kind === 'tool')
const statics = routes.filter(r => r.kind === 'static')
const undated = routes.filter(r => resolveDate(r.file, gitDates, fallback) === null).length
console.log(`路由解析: ${tools.length} 个工具页 + ${statics.length} 个静态页 + 首页`)
console.log(`git 日期解析: ${routes.length - undated}/${routes.length}（${undated} 个用退化日期 ${fallback}）`)

if (process.argv.includes('--check')) {
  const current = existsSync(OUT) ? readFileSync(OUT, 'utf8') : ''
  if (current === xml) {
    console.log('sitemap.xml 已是最新 ✓')
    process.exit(0)
  }
  console.error('sitemap.xml 过期！请运行: pnpm sitemap')
  process.exit(1)
}

writeFileSync(OUT, xml)
console.log(`已写入 ${relative(ROOT, OUT)}（${xml.split('\n').length} 行）`)
