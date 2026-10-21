<template>
  <div class="diagram-tool">
    <ToolIntro toolKey="diagram" />

    <n-card :title="t('convert.diagram.title')" :bordered="false">
      <n-space vertical size="large">
        <!-- 工具栏：模板 + 主题 -->
        <n-space wrap align="center">
          <span class="toolbar-label">{{ t('convert.diagram.templateLabel') }}</span>
          <n-select
            v-model:value="selectedTemplate"
            :options="templateOptions"
            class="template-select"
            @update:value="applyTemplate"
          />
          <span class="toolbar-label">{{ t('convert.diagram.themeLabel') }}</span>
          <n-select
            v-model:value="themeChoice"
            :options="themeOptions"
            class="theme-select"
            @update:value="scheduleRender"
          />
        </n-space>

        <!-- 双栏：源码 + 预览 -->
        <div class="panes">
          <div class="pane">
            <div class="pane-title">{{ t('convert.diagram.sourceLabel') }}</div>
            <n-input
              v-model:value="source"
              type="textarea"
              :placeholder="t('convert.diagram.sourcePlaceholder')"
              :autosize="{ minRows: 16, maxRows: 30 }"
              class="source-input"
              @input="scheduleRender"
            />
          </div>

          <div class="pane">
            <div class="pane-title">{{ t('convert.diagram.previewLabel') }}</div>
            <div class="preview-box">
              <n-spin v-if="engineLoading || rendering" size="small" class="preview-spin">
                <template #description>
                  {{ engineLoading ? t('convert.diagram.engineLoading') : t('convert.diagram.rendering') }}
                </template>
              </n-spin>
              <div
                v-show="!engineLoading && !rendering && svgHtml"
                ref="previewEl"
                class="preview-svg"
                v-html="svgHtml"
              ></div>
              <div
                v-if="!engineLoading && !rendering && !svgHtml && !error"
                class="preview-empty"
              >
                {{ t('convert.diagram.emptyTip') }}
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <n-space justify="end" wrap>
          <n-button tertiary @click="copySource">{{ t('convert.diagram.copySource') }}</n-button>
          <n-button :disabled="!svgHtml" @click="exportSvg">{{ t('convert.diagram.downloadSvg') }}</n-button>
          <n-button type="primary" :disabled="!svgHtml" @click="exportPng">
            {{ t('convert.diagram.downloadPng') }}
          </n-button>
        </n-space>

        <!-- 错误提示 -->
        <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
          {{ error }}
        </n-alert>

        <!-- 隐私说明 -->
        <n-alert type="success" :show-icon="true" class="privacy-alert">
          {{ t('convert.diagram.privacyNote') }}
        </n-alert>
      </n-space>
    </n-card>

    <TutorialAndDocs toolKey="diagram" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import ToolIntro from '@/components/common/ToolIntro.vue'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
import { useTheme } from '@/composables/useTheme'

const { t } = useI18n()
const message = useMessage()
const { isDark } = useTheme()

const source = ref('')
const svgHtml = ref('')
const error = ref('')
const rendering = ref(false)
const engineLoading = ref(true)
const previewEl = ref(null)

const themeChoice = ref('auto')
const selectedTemplate = ref('flowchart')

let mermaid = null
let renderSeq = 0
let debounceTimer = null

// ---------- 示例模板 ----------
const TEMPLATES = {
  flowchart: `flowchart TD
    A[用户下单] --> B{库存充足?}
    B -->|是| C[创建订单]
    B -->|否| D[提示缺货]
    C --> E[支付]
    E --> F[发货]`,

  sequence: `sequenceDiagram
    participant U as 用户
    participant W as 前端
    participant S as 服务端
    U->>W: 点击登录
    W->>S: POST /login
    S-->>W: 返回 token
    W-->>U: 登录成功`,

  class: `classDiagram
    class User {
        +String name
        +String email
        +login()
    }
    class Order {
        +Number total
        +pay()
    }
    User "1" --> "*" Order : 下单`,

  state: `stateDiagram-v2
    [*] --> 待支付
    待支付 --> 已支付 : 支付成功
    已支付 --> 已发货 : 商家发货
    已发货 --> [*]
    待支付 --> 已取消 : 超时`,

  er: `erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
    USER {
        string name
        string email
    }
    ORDER {
        int id
        date createdAt
    }`,

  journey: `journey
    title 一次网购旅程
    section 浏览
      打开首页: 5: 用户
      搜索商品: 4: 用户
    section 下单
      加入购物车: 4: 用户
      提交订单: 3: 用户
    section 收货
      签收快递: 5: 用户`,

  gantt: `gantt
    title 项目排期
    dateFormat YYYY-MM-DD
    section 设计
    原型设计 :a1, 2026-01-01, 7d
    视觉稿   :a2, after a1, 5d
    section 开发
    前端开发 :b1, after a2, 10d
    后端开发 :b2, after a2, 12d`,

  pie: `pie title 浏览器占比
    "Chrome" : 65
    "Safari" : 18
    "Edge" : 9
    "其他" : 8`,

  git: `gitGraph
    commit id: "初始提交"
    branch feature
    checkout feature
    commit id: "新增功能"
    commit id: "补充测试"
    checkout main
    merge feature`,

  mindmap: `mindmap
  root((产品))
    功能
      登录注册
      数据看板
    性能
      加载速度
      并发能力
    运营
      用户增长`,

  timeline: `timeline
    title 公司发展时间线
    2020 : 成立
    2022 : 首款产品上线
    2024 : 用户破百万
    2026 : 走向国际化`,

  quadrant: `quadrantChart
    title 任务优先级评估
    x-axis "低投入" --> "高投入"
    y-axis "低收益" --> "高收益"
    quadrant-1 "重点推进"
    quadrant-2 "可考虑"
    quadrant-3 "尽量不做"
    quadrant-4 "快速见效"
    "重构核心模块": [0.8, 0.9]
    "修复小 bug": [0.2, 0.3]`
}

const templateOptions = computed(() => [
  { label: t('convert.diagram.templates.flowchart'), value: 'flowchart' },
  { label: t('convert.diagram.templates.sequence'), value: 'sequence' },
  { label: t('convert.diagram.templates.class'), value: 'class' },
  { label: t('convert.diagram.templates.state'), value: 'state' },
  { label: t('convert.diagram.templates.er'), value: 'er' },
  { label: t('convert.diagram.templates.journey'), value: 'journey' },
  { label: t('convert.diagram.templates.gantt'), value: 'gantt' },
  { label: t('convert.diagram.templates.pie'), value: 'pie' },
  { label: t('convert.diagram.templates.git'), value: 'git' },
  { label: t('convert.diagram.templates.mindmap'), value: 'mindmap' },
  { label: t('convert.diagram.templates.timeline'), value: 'timeline' },
  { label: t('convert.diagram.templates.quadrant'), value: 'quadrant' }
])

const themeOptions = computed(() => [
  { label: t('convert.diagram.themeAuto'), value: 'auto' },
  { label: t('convert.diagram.themeLight'), value: 'default' },
  { label: t('convert.diagram.themeDark'), value: 'dark' },
  { label: t('convert.diagram.themeForest'), value: 'forest' },
  { label: t('convert.diagram.themeNeutral'), value: 'neutral' }
])

// 站点暗色模式变化时，auto 主题需要重渲染
const effectiveTheme = computed(() => {
  return themeChoice.value === 'auto' ? (isDark.value ? 'dark' : 'default') : themeChoice.value
})

watch(isDark, () => {
  if (themeChoice.value === 'auto') scheduleRender()
})

function applyTemplate(key) {
  source.value = TEMPLATES[key] || ''
  error.value = ''
  scheduleRender()
}

function scheduleRender() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(renderDiagram, 300)
}

async function renderDiagram() {
  if (!mermaid) return
  const code = (source.value || '').trim()
  if (!code) {
    svgHtml.value = ''
    error.value = ''
    return
  }
  rendering.value = true
  error.value = ''
  try {
    // 每次渲染前重新初始化，确保主题/配置生效
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: effectiveTheme.value,
      flowchart: { curve: 'basis' },
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif'
    })
    const id = 'diagram-' + Date.now() + '-' + ++renderSeq
    const { svg, bindFunctions } = await mermaid.render(id, code)
    svgHtml.value = svg
    await nextTick()
    if (typeof bindFunctions === 'function' && previewEl.value) {
      try { bindFunctions(previewEl.value) } catch { /* ignore */ }
    }
  } catch (e) {
    error.value = (e && e.message) ? e.message : String(e)
    svgHtml.value = ''
  } finally {
    rendering.value = false
  }
}

// ---------- 导出 ----------
function download(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function exportSvg() {
  if (!svgHtml.value) return
  download(new Blob([svgHtml.value], { type: 'image/svg+xml;charset=utf-8' }), 'diagram.svg')
}

// 把 SVG 字符串规范化为可直接栅格化的形式：补全 xmlns 与显式宽高。
// 若缺 viewBox 则回退到解析出的 width/height，保证 drawImage 尺寸正确。
function serializeSvg(svgString, w, h) {
  const doc = new DOMParser().parseFromString(svgString, 'image/svg+xml')
  const svg = doc.querySelector('svg')
  if (svg) {
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    if (w) svg.setAttribute('width', String(w))
    if (h) svg.setAttribute('height', String(h))
  }
  return new XMLSerializer().serializeToString(doc.documentElement)
}

function exportPng() {
  if (!svgHtml.value || !mermaid) return
  const code = (source.value || '').trim()
  if (!code) return
  try {
    // 关键点：用 htmlLabels:false 重新渲染一份纯矢量 SVG。
    // mermaid 默认用 <foreignObject> 渲染文字标签，而含 <foreignObject> 的 SVG
    // 被当成 <img> 画到 canvas 后，浏览器会判定画布被污染（tainted），
    // toBlob() 抛 SecurityError，PNG 导出静默失败。关闭 htmlLabels 后标签改为
    // <text>/<tspan>，无 foreignObject，导出即可正常。预览仍用原配置，不受影响。
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: effectiveTheme.value,
      htmlLabels: false,
      flowchart: { curve: 'basis' },
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif'
    })
    mermaid
      .render('diagram-export-' + Date.now(), code)
      .then(({ svg }) => {
        const parsed = new DOMParser().parseFromString(svg, 'image/svg+xml')
        const svgEl = parsed.querySelector('svg')
        const vb = svgEl && svgEl.viewBox && svgEl.viewBox.baseVal
        const width = (vb && vb.width) || svgEl?.width?.baseVal?.value || 800
        const height = (vb && vb.height) || svgEl?.height?.baseVal?.value || 600
        const scale = 2
        const outW = Math.max(1, Math.round(width * scale))
        const outH = Math.max(1, Math.round(height * scale))
        const outSvg = serializeSvg(svg, outW, outH)
        const blob = new Blob([outSvg], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const img = new Image()
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas')
            canvas.width = outW
            canvas.height = outH
            const ctx = canvas.getContext('2d')
            ctx.fillStyle = effectiveTheme.value === 'dark' ? '#1f1f1f' : '#ffffff'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            URL.revokeObjectURL(url)
            canvas.toBlob((pngBlob) => {
              if (pngBlob) download(pngBlob, 'diagram.png')
              else message.error(t('convert.diagram.pngFailed'))
            }, 'image/png')
          } catch (e) {
            // 极端情况下（如仍被污染）避免静默失败，给出可见提示
            URL.revokeObjectURL(url)
            message.error(t('convert.diagram.pngFailed'))
          }
        }
        img.onerror = () => {
          URL.revokeObjectURL(url)
          message.error(t('convert.diagram.pngFailed'))
        }
        img.src = url
      })
      .catch(() => {
        message.error(t('convert.diagram.pngFailed'))
      })
  } catch (e) {
    message.error(t('convert.diagram.pngFailed'))
  }
}

function copySource() {
  navigator.clipboard?.writeText(source.value).then(() => {
    message.success(t('convert.diagram.copied'))
  }).catch(() => {})
}

// ---------- 运行时懒加载 Mermaid ----------
// 说明：不通过 `import 'mermaid'` 打包 —— mermaid 12 的 ESM 依赖图约 1700 个模块，
// 会让整站 Rollup 构建超内存（实测 OOM）。改为自托管 prebuilt bundle + 动态注入脚本，
// 构建产物不含 mermaid，且仍然不依赖任何 CDN。
const MERMAID_SRC = '/mermaid/mermaid.min.js'
const MERMAID_FLAG = 'data-toolhub-mermaid'

function loadMermaid() {
  if (window.mermaid) return Promise.resolve(window.mermaid)
  const existing = document.querySelector(`script[${MERMAID_FLAG}]`)
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(window.mermaid))
      existing.addEventListener('error', () => reject(new Error('mermaid load failed')))
    })
  }
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = MERMAID_SRC
    s.async = true
    s.setAttribute(MERMAID_FLAG, '1')
    s.onload = () => resolve(window.mermaid)
    s.onerror = () => reject(new Error('mermaid load failed'))
    document.head.appendChild(s)
  })
}

onMounted(async () => {
  try {
    mermaid = await loadMermaid()
    engineLoading.value = false
    source.value = TEMPLATES.flowchart
    selectedTemplate.value = 'flowchart'
    await renderDiagram()
  } catch (e) {
    engineLoading.value = false
    error.value = t('convert.diagram.engineFailed')
  }
})

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<style scoped>
.diagram-tool {
  max-width: 1180px;
  margin: 0 auto;
}
.toolbar-label {
  font-size: 14px;
  color: #5a5f6b;
}
.template-select {
  min-width: 180px;
}
.theme-select {
  min-width: 140px;
}
.panes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.pane {
  min-width: 0;
}
.pane-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-color-2, #5a5f6b);
}
.source-input {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
}
.preview-box {
  border: 1px solid var(--n-border-color, #dcdfe6);
  border-radius: 8px;
  min-height: 420px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
}
.preview-svg {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.preview-svg :deep(svg) {
  max-width: 100%;
  height: auto;
}
.preview-empty {
  color: #8a8f99;
  font-size: 14px;
}
.preview-spin {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.error-alert,
.privacy-alert {
  margin-top: 4px;
}
@media (max-width: 900px) {
  .panes {
    grid-template-columns: 1fr;
  }
  .preview-box {
    min-height: 320px;
  }
}
</style>
