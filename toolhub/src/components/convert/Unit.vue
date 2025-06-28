<template>
  <n-card :title="$t('convert.unit.title')">
    <n-form>
      <n-form-item :label="$t('convert.unit.category')">
        <n-select v-model:value="formData.category" :options="categoryOptions"
          :placeholder="$t('convert.unit.categoryPlaceholder')" />
      </n-form-item>

      <n-form-item :label="$t('convert.unit.input')">
        <n-input-number v-model:value="formData.input" :placeholder="$t('convert.unit.inputPlaceholder')"
          style="width: 100%" />
      </n-form-item>

      <n-form-item :label="$t('convert.unit.fromUnit')">
        <n-select v-model:value="formData.fromUnit" :options="unitOptions"
          :placeholder="$t('convert.unit.unitPlaceholder')" />
      </n-form-item>

      <n-form-item :label="$t('convert.unit.toUnit')">
        <n-select v-model:value="formData.toUnit" :options="unitOptions"
          :placeholder="$t('convert.unit.unitPlaceholder')" />
      </n-form-item>

      <n-form-item :label="$t('convert.unit.output')">
        <n-input v-model:value="formData.output" :placeholder="$t('convert.unit.outputPlaceholder')" readonly />
      </n-form-item>

      <n-space>
        <n-button type="primary" @click="convert">
          {{ $t('convert.unit.convert') }}
        </n-button>
        <n-button @click="copyOutput">
          {{ $t('convert.unit.copy') }}
        </n-button>
      </n-space>
    </n-form>

    <n-alert v-if="error" type="error" :title="error" style="margin-top: 16px" />
  </n-card>
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

// 单位定义
const units = {
  length: [
    { label: '毫米', value: 'mm', factor: 0.001 },
    { label: '厘米', value: 'cm', factor: 0.01 },
    { label: '米', value: 'm', factor: 1 },
    { label: '千米', value: 'km', factor: 1000 },
    { label: '英寸', value: 'in', factor: 0.0254 },
    { label: '英尺', value: 'ft', factor: 0.3048 },
    { label: '码', value: 'yd', factor: 0.9144 },
    { label: '英里', value: 'mi', factor: 1609.344 }
  ],
  weight: [
    { label: '毫克', value: 'mg', factor: 0.001 },
    { label: '克', value: 'g', factor: 1 },
    { label: '千克', value: 'kg', factor: 1000 },
    { label: '吨', value: 't', factor: 1000000 },
    { label: '磅', value: 'lb', factor: 453.59237 },
    { label: '盎司', value: 'oz', factor: 28.349523125 }
  ],
  area: [
    { label: '平方毫米', value: 'mm2', factor: 0.000001 },
    { label: '平方厘米', value: 'cm2', factor: 0.0001 },
    { label: '平方米', value: 'm2', factor: 1 },
    { label: '平方千米', value: 'km2', factor: 1000000 },
    { label: '公顷', value: 'ha', factor: 10000 },
    { label: '平方英寸', value: 'in2', factor: 0.00064516 },
    { label: '平方英尺', value: 'ft2', factor: 0.09290304 },
    { label: '平方码', value: 'yd2', factor: 0.83612736 },
    { label: '英亩', value: 'ac', factor: 4046.8564224 }
  ],
  volume: [
    { label: '毫升', value: 'ml', factor: 0.001 },
    { label: '升', value: 'l', factor: 1 },
    { label: '立方米', value: 'm3', factor: 1000 },
    { label: '立方厘米', value: 'cm3', factor: 0.001 },
    { label: '立方英寸', value: 'in3', factor: 0.016387064 },
    { label: '立方英尺', value: 'ft3', factor: 28.316846592 },
    { label: '加仑', value: 'gal', factor: 3.785411784 }
  ]
}

const categoryOptions = [
  { label: t('convert.unit.categories.length'), value: 'length' },
  { label: t('convert.unit.categories.weight'), value: 'weight' },
  { label: t('convert.unit.categories.area'), value: 'area' },
  { label: t('convert.unit.categories.volume'), value: 'volume' }
]

const unitOptions = computed(() => {
  return units[formData.category] || []
})

function convert() {
  error.value = ''

  try {
    if (formData.input === null) {
      throw new Error(t('convert.unit.inputRequired'))
    }

    if (!formData.fromUnit || !formData.toUnit) {
      throw new Error(t('convert.unit.unitRequired'))
    }

    const fromUnit = units[formData.category].find(u => u.value === formData.fromUnit)
    const toUnit = units[formData.category].find(u => u.value === formData.toUnit)

    // 转换为基本单位，再转换为目标单位
    const baseValue = formData.input * fromUnit.factor
    const result = baseValue / toUnit.factor

    formData.output = result.toFixed(6)
  } catch (err) {
    error.value = err.message
  }
}

function copyOutput() {
  if (formData.output) {
    navigator.clipboard.writeText(formData.output)
    message.success(t('convert.unit.copied'))
  }
}
</script>

<style scoped>
.n-card {
  max-width: 800px;
  margin: 0 auto;
}
</style>