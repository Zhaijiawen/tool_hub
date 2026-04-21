<template>
  <div class="color-convert">
    <n-card :title="t('convert.color.title')" :bordered="false">
      <n-tabs v-model:value="activeTab" type="segment" animated>

        <!-- ═══ Tab 1: 颜色选择器 ═══ -->
        <n-tab-pane name="picker" :tab="t('convert.color.picker')">
          <n-space vertical size="large">
            <div class="picker-section">
              <n-text class="section-title">{{ t('convert.color.pickColor') }}</n-text>
              <n-color-picker
                v-model:value="formData.color"
                :show-alpha="true"
                :modes="['hex', 'rgb', 'hsl']"
                @update:value="handleColorChange"
              />
            </div>

            <!-- 颜色值显示 -->
            <div class="color-values-section">
              <n-space vertical>
                <div>
                  <n-text class="section-title">{{ t('convert.color.hex') }}</n-text>
                  <div class="output-with-copy">
                    <n-input v-model:value="formData.hex" :placeholder="t('convert.color.hexPlaceholder')" readonly />
                    <n-button @click="copyValue(formData.hex)" size="small" type="primary">{{ t('common.copy') }}</n-button>
                  </div>
                </div>
                <div>
                  <n-text class="section-title">{{ t('convert.color.rgb') }}</n-text>
                  <div class="output-with-copy">
                    <n-input v-model:value="formData.rgb" :placeholder="t('convert.color.rgbPlaceholder')" readonly />
                    <n-button @click="copyValue(formData.rgb)" size="small" type="primary">{{ t('common.copy') }}</n-button>
                  </div>
                </div>
                <div>
                  <n-text class="section-title">{{ t('convert.color.hsl') }}</n-text>
                  <div class="output-with-copy">
                    <n-input v-model:value="formData.hsl" :placeholder="t('convert.color.hslPlaceholder')" readonly />
                    <n-button @click="copyValue(formData.hsl)" size="small" type="primary">{{ t('common.copy') }}</n-button>
                  </div>
                </div>
              </n-space>
            </div>
          </n-space>
        </n-tab-pane>

        <!-- ═══ Tab 2: 颜色格式转换 ═══ -->
        <n-tab-pane name="converter" :tab="t('convert.color.converter')">
          <n-space vertical size="large">
            <div class="converter-section">
              <div class="input-section">
                <n-text class="section-title">{{ t('convert.color.input') }}</n-text>
                <n-input
                  v-model:value="formData.input"
                  :placeholder="t('convert.color.inputPlaceholder')"
                  clearable
                  @input="handleInput"
                />
              </div>
              <div class="format-section">
                <n-space vertical>
                  <div>
                    <n-text class="section-title">{{ t('convert.color.fromFormat') }}</n-text>
                    <n-select v-model:value="formData.fromFormat" :options="formatOptions" :placeholder="t('convert.color.formatPlaceholder')" style="width: 100%" @update:value="handleInput" />
                  </div>
                  <div>
                    <n-text class="section-title">{{ t('convert.color.toFormat') }}</n-text>
                    <n-select v-model:value="formData.toFormat" :options="formatOptions" :placeholder="t('convert.color.formatPlaceholder')" style="width: 100%" @update:value="handleInput" />
                  </div>
                </n-space>
              </div>
              <div class="output-section" v-if="formData.output">
                <n-text class="section-title">{{ t('convert.color.output') }}</n-text>
                <div class="output-with-copy">
                  <n-input v-model:value="formData.output" :placeholder="t('convert.color.outputPlaceholder')" readonly />
                  <n-button @click="copyOutput" size="small" type="primary">{{ t('common.copy') }}</n-button>
                </div>
              </div>
            </div>
            <n-alert v-if="error" type="error" :title="t('common.error')">{{ error }}</n-alert>
          </n-space>
        </n-tab-pane>

        <!-- ═══ Tab 3: 配色方案生成器 ═══ -->
        <n-tab-pane name="palette" :tab="t('convert.color.palette')">
          <n-space vertical size="large">

            <!-- 基准颜色 + 方案类型 + 生成 -->
            <n-grid :cols="3" :x-gap="12" responsive="screen">
              <n-grid-item>
                <n-form-item :label="t('convert.color.paletteInput')" :show-feedback="false">
                  <n-color-picker
                    v-model:value="palette.baseColor"
                    :show-alpha="false"
                    :modes="['hex']"
                    style="width: 100%"
                  />
                </n-form-item>
              </n-grid-item>
              <n-grid-item>
                <n-form-item :label="t('convert.color.paletteMode')" :show-feedback="false">
                  <n-select v-model:value="palette.mode" :options="paletteModeOptions" style="width: 100%" />
                </n-form-item>
              </n-grid-item>
              <n-grid-item>
                <n-form-item :label="t('convert.color.paletteCount')" :show-feedback="false">
                  <n-input-number v-model:value="palette.count" :min="3" :max="12" style="width: 100%" />
                </n-form-item>
              </n-grid-item>
            </n-grid>

            <n-space>
              <n-button type="primary" @click="generatePalette">{{ t('convert.color.paletteGenerate') }}</n-button>
              <n-button @click="copyAllHex" :disabled="palette.colors.length === 0">{{ t('convert.color.paletteCopyAll') }}</n-button>
              <n-button @click="exportCssVars" :disabled="palette.colors.length === 0">{{ t('convert.color.paletteExportCss') }}</n-button>
            </n-space>

            <!-- 色板展示 -->
            <div v-if="palette.colors.length > 0" class="palette-swatches">
              <div
                v-for="(hex, idx) in palette.colors"
                :key="idx"
                class="swatch"
                :style="{ background: hex }"
                @click="copySwatch(hex)"
                :title="hex"
              >
                <span class="swatch-hex">{{ hex }}</span>
              </div>
            </div>

            <!-- CSS 变量预览 -->
            <div v-if="palette.cssOutput">
              <n-text class="section-title">CSS Variables</n-text>
              <n-input
                type="textarea"
                :value="palette.cssOutput"
                readonly
                :rows="6"
                style="font-family: monospace; font-size: 13px"
              />
            </div>

            <n-alert type="info" :title="t('convert.color.paletteInfoTitle')">
              {{ t('convert.color.paletteInfoContent') }}
            </n-alert>

          </n-space>
        </n-tab-pane>

      </n-tabs>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()

const activeTab = ref('picker')

// ── 选择器 & 转换（原有逻辑保留） ─────────────────
const formData = reactive({
  color: '#18a058',
  hex: '#18a058',
  rgb: 'rgb(24, 160, 88)',
  hsl: 'hsl(142, 74%, 36%)',
  input: '',
  fromFormat: 'hex',
  toFormat: 'rgb',
  output: ''
})
const error = ref('')

const formatOptions = computed(() => [
  { label: t('convert.color.formats.hex'), value: 'hex' },
  { label: t('convert.color.formats.rgb'), value: 'rgb' },
  { label: t('convert.color.formats.hsl'), value: 'hsl' }
])

const handleInput = () => {
  error.value = ''
  if (formData.input.trim() && formData.fromFormat && formData.toFormat) {
    convert()
  } else {
    formData.output = ''
  }
}

const handleColorChange = (color) => {
  if (!color) return
  let normalizedColor = color
  if (color.startsWith('#')) {
    if (color.length === 4)  normalizedColor = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3]
    if (color.length === 9)  normalizedColor = color.substring(0, 7)
  }
  formData.hex = normalizedColor
  formData.rgb = hexToRgb(normalizedColor)
  formData.hsl = hexToHsl(normalizedColor)
}

const hexToRgb = (hex) => {
  if (!hex || !/^#[0-9A-F]{6}$/i.test(hex)) return ''
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${r}, ${g}, ${b})`
}

const hexToHsl = (hex) => {
  if (!hex || !/^#[0-9A-F]{6}$/i.test(hex)) return ''
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
}

const rgbToHex = (rgb) => {
  const m = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
  if (!m) return ''
  const r = parseInt(m[1]), g = parseInt(m[2]), b = parseInt(m[3])
  if ([r,g,b].some(v => v < 0 || v > 255)) return ''
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

const hslToHex = (hsl) => {
  const m = hsl.match(/^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/)
  if (!m) return ''
  const h = parseInt(m[1]) / 360, s = parseInt(m[2]) / 100, l = parseInt(m[3]) / 100
  if (h < 0 || h > 1 || s < 0 || s > 1 || l < 0 || l > 1) return ''
  let r, g, b
  if (s === 0) { r = g = b = l } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1; if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1/3)
  }
  const toHex = x => { const v = Math.round(x * 255).toString(16); return v.length === 1 ? '0' + v : v }
  return '#' + toHex(r) + toHex(g) + toHex(b)
}

const convert = () => {
  try {
    if (!formData.input.trim()) throw new Error(t('convert.color.inputRequired'))
    let hex
    switch (formData.fromFormat) {
      case 'hex':
        if (!/^#[0-9A-F]{6}$/i.test(formData.input)) throw new Error(t('convert.color.invalidHex'))
        hex = formData.input; break
      case 'rgb':
        if (!/^rgb\(\d+,\s*\d+,\s*\d+\)$/.test(formData.input)) throw new Error(t('convert.color.invalidRgb'))
        hex = rgbToHex(formData.input); break
      case 'hsl':
        if (!/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/.test(formData.input)) throw new Error(t('convert.color.invalidHsl'))
        hex = hslToHex(formData.input); break
    }
    if (!hex) throw new Error(t('convert.color.invalidInput'))
    switch (formData.toFormat) {
      case 'hex': formData.output = hex; break
      case 'rgb': formData.output = hexToRgb(hex); break
      case 'hsl': formData.output = hexToHsl(hex); break
    }
    error.value = ''
  } catch (err) {
    error.value = err.message
    formData.output = ''
  }
}

const copyValue = (value) => {
  if (!value) return
  navigator.clipboard.writeText(value).then(() => message.success(t('common.copy') + ' ' + t('common.success')))
}

const copyOutput = () => copyValue(formData.output)

// ── 配色方案 ─────────────────────────────────────
const palette = reactive({
  baseColor: '#18a058',
  mode: 'analogous',
  count: 6,
  colors: [],
  cssOutput: ''
})

const paletteModeOptions = computed(() => [
  { label: t('convert.color.paletteModeComp'),        value: 'complementary'  },
  { label: t('convert.color.paletteModeTriad'),       value: 'triadic'        },
  { label: t('convert.color.paletteModeAnalog'),      value: 'analogous'      },
  { label: t('convert.color.paletteModeShades'),      value: 'shades'         },
  { label: t('convert.color.paletteModeMonochrome'),  value: 'monochromatic'  },
  { label: t('convert.color.paletteModeSquare'),      value: 'square'         }
])

// 颜色工具：hex ↔ hsl（数值）
const hexToHslArr = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  if (max === min) { h = s = 0 } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  return [h * 360, s * 100, l * 100]
}

const hslArrToHex = (h, s, l) => {
  h = ((h % 360) + 360) % 360
  s = Math.max(0, Math.min(100, s))
  l = Math.max(5, Math.min(95, l))
  return hslToHex(`hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`)
}

const generatePalette = () => {
  const hex = palette.baseColor
  if (!/^#[0-9A-F]{6}$/i.test(hex)) { message.error(t('convert.color.invalidHex')); return }
  const [h, s, l] = hexToHslArr(hex)
  const n = palette.count
  let colors = []

  switch (palette.mode) {
    case 'complementary': {
      const step = 360 / (n - 1)
      for (let i = 0; i < n; i++) colors.push(hslArrToHex(h + i * step, s, l))
      break
    }
    case 'triadic': {
      const bases = [h, h + 120, h + 240]
      const perBase = Math.ceil(n / 3)
      for (let b of bases) for (let i = 0; i < perBase && colors.length < n; i++) colors.push(hslArrToHex(b, s, l - 20 + i * (40 / perBase)))
      break
    }
    case 'analogous': {
      const spread = 60
      for (let i = 0; i < n; i++) colors.push(hslArrToHex(h - spread / 2 + i * (spread / (n - 1)), s, l))
      break
    }
    case 'shades': {
      for (let i = 0; i < n; i++) colors.push(hslArrToHex(h, s, 15 + i * (70 / (n - 1))))
      break
    }
    case 'monochromatic': {
      for (let i = 0; i < n; i++) {
        const si = 20 + i * (80 / (n - 1))
        const li = 30 + i * (40 / (n - 1))
        colors.push(hslArrToHex(h, si, li))
      }
      break
    }
    case 'square': {
      const bases = [h, h + 90, h + 180, h + 270]
      const perBase = Math.ceil(n / 4)
      for (let b of bases) for (let i = 0; i < perBase && colors.length < n; i++) colors.push(hslArrToHex(b, s, l - 10 + i * (20 / perBase)))
      break
    }
  }

  palette.colors = colors.slice(0, n)
  palette.cssOutput = ':root {\n' + palette.colors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n') + '\n}'
}

const copySwatch = (hex) => {
  navigator.clipboard.writeText(hex).then(() => message.success(hex + ' ' + t('convert.color.paletteCopied')))
}

const copyAllHex = () => {
  navigator.clipboard.writeText(palette.colors.join(', ')).then(() => message.success(t('convert.color.paletteCopyAll') + ' ✓'))
}

const exportCssVars = () => {
  navigator.clipboard.writeText(palette.cssOutput).then(() => message.success(t('convert.color.paletteCopied')))
}
</script>

<style scoped>
.color-convert {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.picker-section { margin-bottom: 20px; }
.color-values-section { margin-bottom: 20px; }
.converter-section { margin-bottom: 20px; }
.input-section { margin-bottom: 20px; }
.format-section { margin-bottom: 20px; }
.output-section { margin-bottom: 20px; }

.section-title {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.output-with-copy {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}
.output-with-copy .n-input { flex: 1; }

/* 配色方案 */
.palette-swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.swatch {
  width: 90px;
  height: 90px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: transform 0.15s;
  position: relative;
}
.swatch:hover { transform: scale(1.08); }

.swatch-hex {
  font-size: 11px;
  color: rgba(255,255,255,0.95);
  text-shadow: 0 1px 2px rgba(0,0,0,0.6);
  font-family: monospace;
  user-select: none;
}

@media (max-width: 768px) {
  .color-convert { padding: 0 12px; }
  .swatch { width: 70px; height: 70px; }
}
</style>