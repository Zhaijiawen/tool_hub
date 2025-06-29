<template>
  <div class="color-convert">
    <n-card :title="t('convert.color.title')" :bordered="false">
      <n-space vertical size="large">
        <!-- 操作类型选择 -->
        <div class="operation-section">
          <n-text class="section-title">{{ t('convert.color.operation') }}</n-text>
          <n-radio-group v-model:value="formData.operation" @update:value="handleOperationChange">
            <n-space>
              <n-radio value="picker">{{ t('convert.color.picker') }}</n-radio>
              <n-radio value="converter">{{ t('convert.color.converter') }}</n-radio>
            </n-space>
          </n-radio-group>
        </div>

        <!-- 颜色选择器模式 -->
        <template v-if="formData.operation === 'picker'">
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
                  <n-input 
                    v-model:value="formData.hex" 
                    :placeholder="t('convert.color.hexPlaceholder')" 
                    readonly 
                  />
                  <n-button @click="copyValue(formData.hex)" size="small" type="primary">
                    {{ t('common.copy') }}
                  </n-button>
                </div>
              </div>
              <div>
                <n-text class="section-title">{{ t('convert.color.rgb') }}</n-text>
                <div class="output-with-copy">
                  <n-input 
                    v-model:value="formData.rgb" 
                    :placeholder="t('convert.color.rgbPlaceholder')" 
                    readonly 
                  />
                  <n-button @click="copyValue(formData.rgb)" size="small" type="primary">
                    {{ t('common.copy') }}
                  </n-button>
                </div>
              </div>
              <div>
                <n-text class="section-title">{{ t('convert.color.hsl') }}</n-text>
                <div class="output-with-copy">
                  <n-input 
                    v-model:value="formData.hsl" 
                    :placeholder="t('convert.color.hslPlaceholder')" 
                    readonly 
                  />
                  <n-button @click="copyValue(formData.hsl)" size="small" type="primary">
                    {{ t('common.copy') }}
                  </n-button>
                </div>
              </div>
            </n-space>
          </div>
        </template>

        <!-- 颜色转换器模式 -->
        <template v-else>
          <div class="converter-section">
            <!-- 输入区域 -->
            <div class="input-section">
              <n-text class="section-title">{{ t('convert.color.input') }}</n-text>
              <n-input 
                v-model:value="formData.input" 
                :placeholder="t('convert.color.inputPlaceholder')"
                clearable
                @input="handleInput"
              />
            </div>

            <!-- 格式选择区域 -->
            <div class="format-section">
              <n-space vertical>
                <div>
                  <n-text class="section-title">{{ t('convert.color.fromFormat') }}</n-text>
                  <n-select 
                    v-model:value="formData.fromFormat" 
                    :options="formatOptions"
                    :placeholder="t('convert.color.formatPlaceholder')"
                    style="width: 100%"
                    @update:value="handleInput"
                  />
                </div>
                <div>
                  <n-text class="section-title">{{ t('convert.color.toFormat') }}</n-text>
                  <n-select 
                    v-model:value="formData.toFormat" 
                    :options="formatOptions"
                    :placeholder="t('convert.color.formatPlaceholder')"
                    style="width: 100%"
                    @update:value="handleInput"
                  />
                </div>
              </n-space>
            </div>

            <!-- 输出区域 -->
            <div class="output-section" v-if="formData.output">
              <n-text class="section-title">{{ t('convert.color.output') }}</n-text>
              <div class="output-with-copy">
                <n-input 
                  v-model:value="formData.output" 
                  :placeholder="t('convert.color.outputPlaceholder')" 
                  readonly
                />
                <n-button @click="copyOutput" size="small" type="primary">
                  {{ t('common.copy') }}
                </n-button>
              </div>
            </div>
          </div>
        </template>

        <!-- 错误提示 -->
        <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
          {{ error }}
        </n-alert>

        <!-- 使用说明 -->
        <div class="info-section">
          <n-alert type="info" :title="t('convert.color.infoTitle')" class="info-alert">
            {{ t('convert.color.infoContent') }}
          </n-alert>
        </div>
      </n-space>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()

const formData = reactive({
  operation: 'picker',
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

const handleOperationChange = () => {
  // 切换操作类型时清空相关数据
  if (formData.operation === 'picker') {
    formData.input = ''
    formData.output = ''
    formData.fromFormat = 'hex'
    formData.toFormat = 'rgb'
    // 重新初始化颜色值
    handleColorChange(formData.color)
  } else {
    formData.hex = ''
    formData.rgb = ''
    formData.hsl = ''
  }
  error.value = ''
}

const handleInput = () => {
  error.value = ''
  if (formData.input.trim() && formData.fromFormat && formData.toFormat) {
    convert()
  } else {
    formData.output = ''
  }
}

// 处理颜色选择器变化
const handleColorChange = (color) => {
  console.log('Color changed:', color) // 调试信息
  if (color) {
    // 标准化HEX颜色值
    let normalizedColor = color
    if (color.startsWith('#')) {
      // 处理3位HEX格式
      if (color.length === 4) {
        normalizedColor = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3]
      }
      // 处理带alpha的8位HEX格式，去掉alpha
      if (color.length === 9) {
        normalizedColor = color.substring(0, 7)
      }
    }
    
    formData.hex = normalizedColor
    formData.rgb = hexToRgb(normalizedColor)
    formData.hsl = hexToHsl(normalizedColor)
    
    console.log('Normalized color:', normalizedColor) // 调试信息
    console.log('RGB:', formData.rgb) // 调试信息
    console.log('HSL:', formData.hsl) // 调试信息
  }
}

// HEX转RGB
const hexToRgb = (hex) => {
  if (!hex || !/^#[0-9A-F]{6}$/i.test(hex)) {
    console.log('Invalid HEX format:', hex) // 调试信息
    return ''
  }
  
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${r}, ${g}, ${b})`
}

// HEX转HSL
const hexToHsl = (hex) => {
  if (!hex || !/^#[0-9A-F]{6}$/i.test(hex)) {
    console.log('Invalid HEX format for HSL:', hex) // 调试信息
    return ''
  }
  
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
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

  h = Math.round(h * 360)
  s = Math.round(s * 100)
  l = Math.round(l * 100)

  return `hsl(${h}, ${s}%, ${l}%)`
}

// RGB转HEX
const rgbToHex = (rgb) => {
  const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
  if (!match) return ''

  const r = parseInt(match[1])
  const g = parseInt(match[2])
  const b = parseInt(match[3])

  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) return ''

  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

// HSL转HEX
const hslToHex = (hsl) => {
  const match = hsl.match(/^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/)
  if (!match) return ''

  const h = parseInt(match[1])
  const s = parseInt(match[2])
  const l = parseInt(match[3])

  if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) return ''

  const hue = h / 360
  const sat = s / 100
  const light = l / 100

  let r, g, b

  if (sat === 0) {
    r = g = b = light
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat
    const p = 2 * light - q
    r = hue2rgb(p, q, hue + 1 / 3)
    g = hue2rgb(p, q, hue)
    b = hue2rgb(p, q, hue - 1 / 3)
  }

  const toHex = x => {
    const hex = Math.round(x * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return '#' + toHex(r) + toHex(g) + toHex(b)
}

const convert = () => {
  try {
    if (!formData.input.trim()) {
      throw new Error(t('convert.color.inputRequired'))
    }

    let hex
    switch (formData.fromFormat) {
      case 'hex':
        if (!/^#[0-9A-F]{6}$/i.test(formData.input)) {
          throw new Error(t('convert.color.invalidHex'))
        }
        hex = formData.input
        break
      case 'rgb':
        if (!/^rgb\(\d+,\s*\d+,\s*\d+\)$/.test(formData.input)) {
          throw new Error(t('convert.color.invalidRgb'))
        }
        hex = rgbToHex(formData.input)
        break
      case 'hsl':
        if (!/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/.test(formData.input)) {
          throw new Error(t('convert.color.invalidHsl'))
        }
        hex = hslToHex(formData.input)
        break
    }

    if (!hex) {
      throw new Error(t('convert.color.invalidInput'))
    }

    switch (formData.toFormat) {
      case 'hex':
        formData.output = hex
        break
      case 'rgb':
        formData.output = hexToRgb(hex)
        break
      case 'hsl':
        formData.output = hexToHsl(hex)
        break
    }
    error.value = ''
  } catch (err) {
    error.value = err.message
    formData.output = ''
    message.error(t('common.error'))
  }
}

const copyValue = (value) => {
  if (value) {
    try {
      navigator.clipboard.writeText(value)
      message.success(t('common.copy') + ' ' + t('common.success'))
    } catch (e) {
      message.error(t('common.copy') + ' ' + t('common.error'))
    }
  }
}

const copyOutput = () => {
  if (formData.output) {
    try {
      navigator.clipboard.writeText(formData.output)
      message.success(t('common.copy') + ' ' + t('common.success'))
    } catch (e) {
      message.error(t('common.copy') + ' ' + t('common.error'))
    }
  }
}
</script>

<style scoped>
.color-convert {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.operation-section {
  margin-bottom: 20px;
}

.picker-section {
  margin-bottom: 20px;
}

.color-values-section {
  margin-bottom: 20px;
}

.converter-section {
  margin-bottom: 20px;
}

.input-section {
  margin-bottom: 20px;
}

.format-section {
  margin-bottom: 20px;
}

.output-section {
  margin-bottom: 20px;
}

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

.output-with-copy .n-input {
  flex: 1;
}

.error-alert {
  margin-top: 16px;
}

.info-section {
  margin-bottom: 20px;
}

.info-alert {
  margin-top: 8px;
}
</style>