<template>
  <div class="storage-time-convert">
    <!-- 工具简介 -->
    <ToolIntro toolKey="storage" />


    <n-card :title="t('convert.storageTime.title')" :bordered="false">
      <n-space vertical size="large">
        <!-- 转换类型选择 -->
        <div class="category-section">
          <n-text class="section-title">{{ t('convert.storageTime.category') }}</n-text>
          <n-radio-group v-model:value="formData.category" @update:value="handleCategoryChange">
            <n-space>
              <n-radio value="storage">{{ t('convert.storageTime.categories.storage') }}</n-radio>
              <n-radio value="time">{{ t('convert.storageTime.categories.time') }}</n-radio>
            </n-space>
          </n-radio-group>
        </div>

        <!-- 输入区域 -->
        <div class="input-section">
          <n-text class="section-title">{{ t('convert.storageTime.input') }}</n-text>
          <n-input-number 
            v-model:value="formData.input" 
            :placeholder="t('convert.storageTime.inputPlaceholder')"
            style="width: 100%"
            clearable
            @update:value="handleInput"
          />
        </div>

        <!-- 单位选择区域 -->
        <div class="unit-section">
          <n-space vertical>
            <div>
              <n-text class="section-title">{{ t('convert.storageTime.fromUnit') }}</n-text>
              <n-select 
                v-model:value="formData.fromUnit" 
                :options="unitOptions"
                :placeholder="t('convert.storageTime.unitPlaceholder')"
                style="width: 100%"
                @update:value="handleInput"
              />
            </div>
            <div>
              <n-text class="section-title">{{ t('convert.storageTime.toUnit') }}</n-text>
              <n-select 
                v-model:value="formData.toUnit" 
                :options="unitOptions"
                :placeholder="t('convert.storageTime.unitPlaceholder')"
                style="width: 100%"
                @update:value="handleInput"
              />
            </div>
          </n-space>
        </div>

        <!-- 输出区域 -->
        <div class="output-section">
          <n-text class="section-title">{{ t('convert.storageTime.output') }}</n-text>
          <div class="output-with-copy">
            <n-input 
              v-model:value="formData.output" 
              :placeholder="t('convert.storageTime.outputPlaceholder')" 
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
          <n-alert type="info" :title="t('convert.storageTime.infoTitle')" class="info-alert">
            {{ t('convert.storageTime.infoContent') }}
          </n-alert>
        </div>
      </n-space>
    </n-card>

  </div>
  <TutorialAndDocs toolKey="storageTime" />
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
import ToolIntro from '@/components/common/ToolIntro.vue'

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
    { label: t('convert.storageTime.units.byte'), value: 'B', factor: 1 },
    { label: 'KB', value: 'KB', factor: 1024 },
    { label: 'MB', value: 'MB', factor: 1024 * 1024 },
    { label: 'GB', value: 'GB', factor: 1024 * 1024 * 1024 },
    { label: 'TB', value: 'TB', factor: 1024 * 1024 * 1024 * 1024 },
    { label: 'PB', value: 'PB', factor: 1024 * 1024 * 1024 * 1024 * 1024 }
  ],
  time: [
    { label: t('convert.storageTime.units.millisecond'), value: 'ms', factor: 1 },
    { label: t('convert.storageTime.units.second'), value: 's', factor: 1000 },
    { label: t('convert.storageTime.units.minute'), value: 'min', factor: 60 * 1000 },
    { label: t('convert.storageTime.units.hour'), value: 'h', factor: 60 * 60 * 1000 },
    { label: t('convert.storageTime.units.day'), value: 'd', factor: 24 * 60 * 60 * 1000 }
  ]
}

const unitOptions = computed(() => {
  return units[formData.category] || []
})

const canConvert = computed(() => {
  return formData.input !== null && formData.input !== '' && 
         formData.fromUnit && formData.toUnit
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
  if (canConvert.value) {
    convert()
  } else {
    formData.output = ''
  }
}

const convert = () => {
  try {
    if (formData.input === null || formData.input === '') {
      throw new Error(t('convert.storageTime.inputRequired'))
    }

    if (!formData.fromUnit || !formData.toUnit) {
      throw new Error(t('convert.storageTime.unitRequired'))
    }

    const fromUnit = units[formData.category].find(u => u.value === formData.fromUnit)
    const toUnit = units[formData.category].find(u => u.value === formData.toUnit)

    if (!fromUnit || !toUnit) {
      throw new Error(t('convert.storageTime.invalidUnit'))
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
.storage-time-convert {
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
