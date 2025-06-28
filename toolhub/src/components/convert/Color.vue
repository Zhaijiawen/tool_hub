<template>
  <n-card :title="$t('convert.color.title')">
    <n-form>
      <n-form-item :label="$t('convert.color.operation')">
        <n-radio-group v-model:value="formData.operation">
          <n-space>
            <n-radio value="picker">{{ $t('convert.color.picker') }}</n-radio>
            <n-radio value="converter">{{ $t('convert.color.converter') }}</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>

      <template v-if="formData.operation === 'picker'">
        <n-form-item :label="$t('convert.color.pickColor')">
          <n-color-picker v-model:value="formData.color" :show-alpha="true" :modes="['hex', 'rgb', 'hsl']"
            @update:value="handleColorChange" />
        </n-form-item>

        <n-form-item :label="$t('convert.color.hex')">
          <n-input v-model:value="formData.hex" :placeholder="$t('convert.color.hexPlaceholder')" readonly />
        </n-form-item>

        <n-form-item :label="$t('convert.color.rgb')">
          <n-input v-model:value="formData.rgb" :placeholder="$t('convert.color.rgbPlaceholder')" readonly />
        </n-form-item>

        <n-form-item :label="$t('convert.color.hsl')">
          <n-input v-model:value="formData.hsl" :placeholder="$t('convert.color.hslPlaceholder')" readonly />
        </n-form-item>
      </template>

      <template v-else>
        <n-form-item :label="$t('convert.color.input')">
          <n-input v-model:value="formData.input" :placeholder="$t('convert.color.inputPlaceholder')" />
        </n-form-item>

        <n-form-item :label="$t('convert.color.fromFormat')">
          <n-select v-model:value="formData.fromFormat" :options="formatOptions"
            :placeholder="$t('convert.color.formatPlaceholder')" />
        </n-form-item>

        <n-form-item :label="$t('convert.color.toFormat')">
          <n-select v-model:value="formData.toFormat" :options="formatOptions"
            :placeholder="$t('convert.color.formatPlaceholder')" />
        </n-form-item>

        <n-form-item :label="$t('convert.color.output')">
          <n-input v-model:value="formData.output" :placeholder="$t('convert.color.outputPlaceholder')" readonly />
        </n-form-item>

        <n-space>
          <n-button type="primary" @click="convert">
            {{ $t('convert.color.convert') }}
          </n-button>
          <n-button @click="copyOutput">
            {{ $t('convert.color.copy') }}
          </n-button>
        </n-space>
      </template>
    </n-form>

    <n-alert v-if="error" type="error" :title="error" style="margin-top: 16px" />
  </n-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()

const formData = reactive({
  operation: 'picker',
  color: '#18a058',
  hex: '',
  rgb: '',
  hsl: '',
  input: '',
  fromFormat: 'hex',
  toFormat: 'rgb',
  output: ''
})

const error = ref('')

const formatOptions = [
  { label: 'HEX', value: 'hex' },
  { label: 'RGB', value: 'rgb' },
  { label: 'HSL', value: 'hsl' }
]

// 处理颜色选择器变化
function handleColorChange(color) {
  formData.hex = color
  formData.rgb = hexToRgb(color)
  formData.hsl = hexToHsl(color)
}

// HEX转RGB
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${r}, ${g}, ${b})`
}

// HEX转HSL
function hexToHsl(hex) {
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
function rgbToHex(rgb) {
  const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
  if (!match) return ''

  const r = parseInt(match[1])
  const g = parseInt(match[2])
  const b = parseInt(match[3])

  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

// HSL转HEX
function hslToHex(hsl) {
  const match = hsl.match(/^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/)
  if (!match) return ''

  const h = parseInt(match[1]) / 360
  const s = parseInt(match[2]) / 100
  const l = parseInt(match[3]) / 100

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  const toHex = x => {
    const hex = Math.round(x * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return '#' + toHex(r) + toHex(g) + toHex(b)
}

function convert() {
  error.value = ''

  try {
    if (!formData.input) {
      throw new Error(t('convert.color.inputRequired'))
    }

    let hex
    switch (formData.fromFormat) {
      case 'hex':
        hex = formData.input
        break
      case 'rgb':
        hex = rgbToHex(formData.input)
        break
      case 'hsl':
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
  } catch (err) {
    error.value = err.message
  }
}

function copyOutput() {
  if (formData.output) {
    navigator.clipboard.writeText(formData.output)
    message.success(t('convert.color.copied'))
  }
}
</script>

<style scoped>
.n-card {
  max-width: 800px;
  margin: 0 auto;
}
</style>