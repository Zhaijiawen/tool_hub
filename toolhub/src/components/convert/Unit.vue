<template>
  <div class="unit-convert">
    <n-card :title="t('convert.unit.title')" :bordered="false">
      <n-space vertical size="large">
        <!-- 转换类型选择 -->
        <div class="category-section">
          <n-text class="section-title">{{ t('convert.unit.category') }}</n-text>
          <n-select 
            v-model:value="formData.category" 
            :options="categoryOptions"
            :placeholder="t('convert.unit.categoryPlaceholder')"
            @update:value="handleCategoryChange"
          />
        </div>

        <!-- 输入区域 -->
        <div class="input-section">
          <n-text class="section-title">{{ t('convert.unit.input') }}</n-text>
          <n-input-number 
            v-model:value="formData.input" 
            :placeholder="t('convert.unit.inputPlaceholder')"
            style="width: 100%"
            clearable
            @update:value="handleInput"
          />
        </div>

        <!-- 单位选择区域 -->
        <div class="unit-section">
          <n-space vertical>
            <div>
              <n-text class="section-title">{{ t('convert.unit.fromUnit') }}</n-text>
              <n-select 
                v-model:value="formData.fromUnit" 
                :options="unitOptions"
                :placeholder="t('convert.unit.unitPlaceholder')"
                style="width: 100%"
                @update:value="handleInput"
              />
            </div>
            <div>
              <n-text class="section-title">{{ t('convert.unit.toUnit') }}</n-text>
              <n-select 
                v-model:value="formData.toUnit" 
                :options="unitOptions"
                :placeholder="t('convert.unit.unitPlaceholder')"
                style="width: 100%"
                @update:value="handleInput"
              />
            </div>
          </n-space>
        </div>

        <!-- 输出区域 -->
        <div class="output-section">
          <n-text class="section-title">{{ t('convert.unit.output') }}</n-text>
          <div class="output-with-copy">
            <n-input 
              v-model:value="formData.output" 
              :placeholder="t('convert.unit.outputPlaceholder')" 
              readonly
            />
            <n-button @click="copyOutput" size="small" type="primary">
              {{ t('common.copy') }}
            </n-button>
          </div>
        </div>

        <!-- 错误提示 -->
        <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
          {{ error }}
        </n-alert>

        <!-- 使用说明 -->
        <div class="info-section">
          <n-alert type="info" :title="t('convert.unit.infoTitle')" class="info-alert">
            {{ t('convert.unit.infoContent') }}
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
  category: 'length',
  input: null,
  fromUnit: '',
  toUnit: '',
  output: ''
})

const error = ref('')

// 单位定义改为计算属性
const units = computed(() => ({
  length: [
    { label: t('convert.unit.units.millimeter'), value: 'mm', factor: 0.001 },
    { label: t('convert.unit.units.centimeter'), value: 'cm', factor: 0.01 },
    { label: t('convert.unit.units.meter'), value: 'm', factor: 1 },
    { label: t('convert.unit.units.kilometer'), value: 'km', factor: 1000 },
    { label: t('convert.unit.units.inch'), value: 'in', factor: 0.0254 },
    { label: t('convert.unit.units.foot'), value: 'ft', factor: 0.3048 },
    { label: t('convert.unit.units.yard'), value: 'yd', factor: 0.9144 },
    { label: t('convert.unit.units.mile'), value: 'mi', factor: 1609.344 }
  ],
  weight: [
    { label: t('convert.unit.units.milligram'), value: 'mg', factor: 0.001 },
    { label: t('convert.unit.units.gram'), value: 'g', factor: 1 },
    { label: t('convert.unit.units.kilogram'), value: 'kg', factor: 1000 },
    { label: t('convert.unit.units.ton'), value: 't', factor: 1000000 },
    { label: t('convert.unit.units.pound'), value: 'lb', factor: 453.59237 },
    { label: t('convert.unit.units.ounce'), value: 'oz', factor: 28.349523125 }
  ],
  area: [
    { label: t('convert.unit.units.squareMillimeter'), value: 'mm2', factor: 0.000001 },
    { label: t('convert.unit.units.squareCentimeter'), value: 'cm2', factor: 0.0001 },
    { label: t('convert.unit.units.squareMeter'), value: 'm2', factor: 1 },
    { label: t('convert.unit.units.squareKilometer'), value: 'km2', factor: 1000000 },
    { label: t('convert.unit.units.hectare'), value: 'ha', factor: 10000 },
    { label: t('convert.unit.units.squareInch'), value: 'in2', factor: 0.00064516 },
    { label: t('convert.unit.units.squareFoot'), value: 'ft2', factor: 0.09290304 },
    { label: t('convert.unit.units.squareYard'), value: 'yd2', factor: 0.83612736 },
    { label: t('convert.unit.units.acre'), value: 'ac', factor: 4046.8564224 }
  ],
  volume: [
    { label: t('convert.unit.units.milliliter'), value: 'ml', factor: 0.001 },
    { label: t('convert.unit.units.liter'), value: 'l', factor: 1 },
    { label: t('convert.unit.units.cubicMeter'), value: 'm3', factor: 1000 },
    { label: t('convert.unit.units.cubicCentimeter'), value: 'cm3', factor: 0.001 },
    { label: t('convert.unit.units.cubicInch'), value: 'in3', factor: 0.016387064 },
    { label: t('convert.unit.units.cubicFoot'), value: 'ft3', factor: 28.316846592 },
    { label: t('convert.unit.units.gallon'), value: 'gal', factor: 3.785411784 }
  ]
}))

const categoryOptions = computed(() => [
  { label: t('convert.unit.categories.length'), value: 'length' },
  { label: t('convert.unit.categories.weight'), value: 'weight' },
  { label: t('convert.unit.categories.area'), value: 'area' },
  { label: t('convert.unit.categories.volume'), value: 'volume' }
])

const unitOptions = computed(() => {
  return units.value[formData.category] || []
})

const handleCategoryChange = () => {
  // 切换类型时清空单位和输出
  formData.fromUnit = ''
  formData.toUnit = ''
  formData.output = ''
  error.value = ''
}

const handleInput = () => {
  error.value = ''
  if (formData.input !== null && formData.input !== '' && 
      formData.fromUnit && formData.toUnit) {
    convert()
  } else {
    formData.output = ''
  }
}

const convert = () => {
  try {
    if (formData.input === null || formData.input === '') {
      throw new Error(t('convert.unit.inputRequired'))
    }

    if (!formData.fromUnit || !formData.toUnit) {
      throw new Error(t('convert.unit.unitRequired'))
    }

    const fromUnit = units.value[formData.category].find(u => u.value === formData.fromUnit)
    const toUnit = units.value[formData.category].find(u => u.value === formData.toUnit)

    if (!fromUnit || !toUnit) {
      throw new Error(t('convert.unit.invalidUnit'))
    }

    // 转换为基本单位，再转换为目标单位
    const baseValue = formData.input * fromUnit.factor
    const result = baseValue / toUnit.factor

    // 根据结果大小调整精度
    let precision = 6
    if (result >= 1000) precision = 2
    else if (result >= 100) precision = 3
    else if (result >= 10) precision = 4
    else if (result >= 1) precision = 5

    formData.output = result.toFixed(precision)
    error.value = ''
  } catch (err) {
    error.value = err.message
    formData.output = ''
    message.error(t('common.error'))
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
.unit-convert {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.category-section {
  margin-bottom: 20px;
}

.input-section {
  margin-bottom: 20px;
}

.unit-section {
  margin-bottom: 20px;
}

.section-title {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.output-section {
  margin-bottom: 20px;
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