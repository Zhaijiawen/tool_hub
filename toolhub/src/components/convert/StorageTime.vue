<template>
  <n-card :title="$t('convert.storageTime.title')">
    <n-form>
      <n-form-item :label="$t('convert.storageTime.category')">
        <n-radio-group v-model:value="formData.category">
          <n-space>
            <n-radio value="storage">{{ $t('convert.storageTime.categories.storage') }}</n-radio>
            <n-radio value="time">{{ $t('convert.storageTime.categories.time') }}</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>

      <n-form-item :label="$t('convert.storageTime.input')">
        <n-input-number v-model:value="formData.input" :placeholder="$t('convert.storageTime.inputPlaceholder')"
          style="width: 100%" />
      </n-form-item>

      <n-form-item :label="$t('convert.storageTime.fromUnit')">
        <n-select v-model:value="formData.fromUnit" :options="unitOptions"
          :placeholder="$t('convert.storageTime.unitPlaceholder')" />
      </n-form-item>

      <n-form-item :label="$t('convert.storageTime.toUnit')">
        <n-select v-model:value="formData.toUnit" :options="unitOptions"
          :placeholder="$t('convert.storageTime.unitPlaceholder')" />
      </n-form-item>

      <n-form-item :label="$t('convert.storageTime.output')">
        <n-input v-model:value="formData.output" :placeholder="$t('convert.storageTime.outputPlaceholder')" readonly />
      </n-form-item>

      <n-space>
        <n-button type="primary" @click="convert">
          {{ $t('convert.storageTime.convert') }}
        </n-button>
        <n-button @click="copyOutput">
          {{ $t('convert.storageTime.copy') }}
        </n-button>
      </n-space>
    </n-form>

    <!-- 错误提示 -->
    <n-alert v-if="error" type="t('common.error')" :title="error" class="error-alert">
      {{ error }}
    </n-alert>
  </n-card>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()

const formData = reactive({
  category: 'storage',
  input: null,
  fromUnit: '',
  toUnit: '',
  output: ''
})

const error = ref('')

// 单位定义
const units = {
  storage: [
    { label: '字节', value: 'B', factor: 1 },
    { label: 'KB', value: 'KB', factor: 1024 },
    { label: 'MB', value: 'MB', factor: 1024 * 1024 },
    { label: 'GB', value: 'GB', factor: 1024 * 1024 * 1024 },
    { label: 'TB', value: 'TB', factor: 1024 * 1024 * 1024 * 1024 },
    { label: 'PB', value: 'PB', factor: 1024 * 1024 * 1024 * 1024 * 1024 }
  ],
  time: [
    { label: '毫秒', value: 'ms', factor: 1 },
    { label: '秒', value: 's', factor: 1000 },
    { label: '分钟', value: 'min', factor: 60 * 1000 },
    { label: '小时', value: 'h', factor: 60 * 60 * 1000 },
    { label: '天', value: 'd', factor: 24 * 60 * 60 * 1000 }
  ]
}

const unitOptions = computed(() => {
  return units[formData.category] || []
})

function convert() {
  error.value = ''

  try {
    if (formData.input === null) {
      throw new Error(t('convert.storageTime.inputRequired'))
    }

    if (!formData.fromUnit || !formData.toUnit) {
      throw new Error(t('convert.storageTime.unitRequired'))
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
    message.success(t('convert.storageTime.copied'))
  }
}
</script>

<style scoped>
.n-card {
  max-width: 800px;
  margin: 0 auto;
}
</style>