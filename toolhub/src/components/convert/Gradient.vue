<template>
  <div class="gradient-tool">
    <n-card :title="t('convert.gradient.title')" :bordered="false">
      <n-space vertical size="large">

        <!-- 渐变类型 -->
        <div class="type-section">
          <n-text class="section-title">{{ t('convert.gradient.type') }}</n-text>
          <n-radio-group v-model:value="gradientType" @update:value="updateGradient">
            <n-space>
              <n-radio value="linear">{{ t('convert.gradient.linear') }}</n-radio>
              <n-radio value="radial">{{ t('convert.gradient.radial') }}</n-radio>
              <n-radio value="conic">{{ t('convert.gradient.conic') }}</n-radio>
            </n-space>
          </n-radio-group>
        </div>

        <!-- 方向（仅 linear） -->
        <div v-if="gradientType === 'linear'" class="direction-section">
          <n-text class="section-title">{{ t('convert.gradient.direction') }}: {{ angle }}°</n-text>
          <n-space align="center" wrap>
            <n-slider v-model:value="angle" :min="0" :max="360" :step="15" style="width: 200px" @update:value="updateGradient" />
            <n-space>
              <n-button
                v-for="preset in directionPresets"
                :key="preset.angle"
                size="small"
                :type="angle === preset.angle ? 'primary' : 'default'"
                @click="setAngle(preset.angle)"
              >{{ preset.label }}</n-button>
            </n-space>
          </n-space>
        </div>

        <!-- 颜色点 -->
        <div class="colors-section">
          <div class="colors-header">
            <n-text class="section-title">{{ t('convert.gradient.colorStops') }}</n-text>
            <n-button size="small" @click="addColor" :disabled="colorStops.length >= 5">
              + {{ t('convert.gradient.addColor') }}
            </n-button>
          </div>
          <div class="color-stops">
            <div v-for="(stop, index) in colorStops" :key="index" class="color-stop-row">
              <n-color-picker
                v-model:value="stop.color"
                :modes="['hex', 'rgb', 'hsl']"
                style="width: 180px"
                @update:value="updateGradient"
              />
              <div class="stop-position">
                <n-text depth="3" class="position-label">{{ t('convert.gradient.position') }}</n-text>
                <n-input-number
                  v-model:value="stop.position"
                  :min="0"
                  :max="100"
                  :step="5"
                  size="small"
                  style="width: 90px"
                  @update:value="updateGradient"
                />
                <n-text depth="3">%</n-text>
              </div>
              <n-button
                size="small"
                quaternary
                type="error"
                :disabled="colorStops.length <= 2"
                @click="removeColor(index)"
              >✕</n-button>
            </div>
          </div>
        </div>

        <!-- 预览 -->
        <div class="preview-section">
          <n-text class="section-title">{{ t('convert.gradient.preview') }}</n-text>
          <div class="gradient-preview" :style="{ background: cssGradient }"></div>
        </div>

        <!-- CSS 输出 -->
        <div class="output-section">
          <n-text class="section-title">{{ t('convert.gradient.cssOutput') }}</n-text>
          <n-input-group>
            <n-input :value="cssGradientOutput" readonly />
            <n-button type="primary" @click="copyCss">{{ t('common.copy') }}</n-button>
          </n-input-group>
          <div class="full-css">
            <n-input :value="fullCssOutput" type="textarea" readonly :autosize="{ minRows: 2, maxRows: 4 }" />
          </div>
        </div>

        <!-- 预设渐变 -->
        <div class="presets-section">
          <n-text class="section-title">{{ t('convert.gradient.presets') }}</n-text>
          <div class="preset-grid">
            <div
              v-for="preset in gradientPresets"
              :key="preset.name"
              class="preset-item"
              :style="{ background: preset.css }"
              :title="preset.name"
              @click="applyPreset(preset)"
            ></div>
          </div>
        </div>

      </n-space>
    </n-card>
    <TutorialAndDocs toolKey="gradient" />
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'

const { t } = useI18n()
const message = useMessage()

const STORAGE_KEY = 'toolhub_gradient_input'

const gradientType = ref('linear')
const angle = ref(90)

const colorStops = ref([
  { color: '#4f46e5', position: 0 },
  { color: '#ec4899', position: 100 }
])

const directionPresets = computed(() => [
  { label: '→', angle: 90 },
  { label: '↓', angle: 180 },
  { label: '↗', angle: 45 },
  { label: '↘', angle: 135 }
])

const gradientPresets = [
  { name: 'Sunset', css: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', stops: [{ color: '#f093fb', position: 0 }, { color: '#f5576c', position: 100 }], angle: 135, type: 'linear' },
  { name: 'Ocean', css: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', stops: [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }], angle: 135, type: 'linear' },
  { name: 'Forest', css: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', stops: [{ color: '#11998e', position: 0 }, { color: '#38ef7d', position: 100 }], angle: 135, type: 'linear' },
  { name: 'Fire', css: 'linear-gradient(135deg, #f46b45 0%, #eea849 100%)', stops: [{ color: '#f46b45', position: 0 }, { color: '#eea849', position: 100 }], angle: 135, type: 'linear' },
  { name: 'Sky', css: 'linear-gradient(135deg, #2bc0e4 0%, #eaecc6 100%)', stops: [{ color: '#2bc0e4', position: 0 }, { color: '#eaecc6', position: 100 }], angle: 135, type: 'linear' },
  { name: 'Purple', css: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', stops: [{ color: '#a18cd1', position: 0 }, { color: '#fbc2eb', position: 100 }], angle: 135, type: 'linear' },
  { name: 'Aurora', css: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)', stops: [{ color: '#43e97b', position: 0 }, { color: '#38f9d7', position: 100 }], angle: 90, type: 'linear' },
  { name: 'Night', css: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)', stops: [{ color: '#0c0c0c', position: 0 }, { color: '#1a1a2e', position: 50 }, { color: '#16213e', position: 100 }], angle: 135, type: 'linear' }
]

const cssGradient = computed(() => {
  const stops = colorStops.value
    .slice()
    .sort((a, b) => a.position - b.position)
    .map(s => `${s.color} ${s.position}%`)
    .join(', ')

  if (gradientType.value === 'linear') {
    return `linear-gradient(${angle.value}deg, ${stops})`
  } else if (gradientType.value === 'radial') {
    return `radial-gradient(circle, ${stops})`
  } else {
    return `conic-gradient(from ${angle.value}deg, ${stops})`
  }
})

const cssGradientOutput = computed(() => cssGradient.value)

const fullCssOutput = computed(() => `background: ${cssGradient.value};`)

const updateGradient = () => {
  saveToStorage()
}

const setAngle = (a) => {
  angle.value = a
  updateGradient()
}

const addColor = () => {
  if (colorStops.value.length >= 5) return
  const midPos = Math.round((colorStops.value[colorStops.value.length - 1].position + 100) / 2)
  colorStops.value.push({ color: '#64748b', position: Math.min(midPos, 100) })
  updateGradient()
}

const removeColor = (index) => {
  if (colorStops.value.length <= 2) return
  colorStops.value.splice(index, 1)
  updateGradient()
}

const applyPreset = (preset) => {
  gradientType.value = preset.type
  angle.value = preset.angle
  colorStops.value = preset.stops.map(s => ({ ...s }))
  updateGradient()
}

const copyCss = () => {
  navigator.clipboard.writeText(fullCssOutput.value).then(() => {
    message.success(t('common.copySuccess'))
  })
}

const saveToStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      gradientType: gradientType.value,
      angle: angle.value,
      colorStops: colorStops.value
    }))
  } catch (e) { /* ignore */ }
}

onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const { gradientType: gt, angle: a, colorStops: cs } = JSON.parse(saved)
      if (gt) gradientType.value = gt
      if (a !== undefined) angle.value = a
      if (cs && cs.length >= 2) colorStops.value = cs
    }
  } catch (e) { /* ignore */ }
})
</script>

<style scoped>
.gradient-tool {
  max-width: 900px;
  margin: 20px auto;
  padding: 0 20px;
}

.section-title {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.colors-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.color-stops {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.color-stop-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.stop-position {
  display: flex;
  align-items: center;
  gap: 6px;
}

.position-label {
  font-size: 13px;
}

.gradient-preview {
  width: 100%;
  height: 120px;
  border-radius: 8px;
  border: 1px solid var(--border-color, #e0e0e0);
}

.full-css {
  margin-top: 8px;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
}

.preset-item {
  height: 60px;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s, transform 0.1s;
}

.preset-item:hover {
  border-color: var(--primary-color, #4f46e5);
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .gradient-tool {
    padding: 0 12px;
  }
  .color-stop-row {
    gap: 8px;
  }
}
</style>

