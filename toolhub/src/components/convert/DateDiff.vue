<template>
  <div class="date-diff">

    <n-card :title="t('convert.dateDiff.title')">
      <!-- 开始日期输入区域 -->
      <div class="input-section">
        <n-text>{{ t('convert.dateDiff.startDate') }}</n-text>
        <n-date-picker 
          v-model:value="formData.startDate" 
          type="datetime" 
          clearable 
          :placeholder="t('convert.dateDiff.startDate')"
          :show-time="true"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="timestamp"
        />
      </div>

      <!-- 结束日期输入区域 -->
      <div class="input-section">
        <n-text>{{ t('convert.dateDiff.endDate') }}</n-text>
        <n-date-picker 
          v-model:value="formData.endDate" 
          type="datetime" 
          clearable 
          :placeholder="t('convert.dateDiff.endDate')"
          :show-time="true"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="timestamp"
        />
      </div>

      <!-- 单位选择区域 -->
      <div class="input-section">
        <n-text>{{ t('convert.dateDiff.unit') }}</n-text>
        <n-select 
          v-model:value="formData.unit" 
          :options="unitOptions"
          :placeholder="t('convert.dateDiff.unitPlaceholder')" 
        />
      </div>

      <!-- 提示信息 -->
      <div class="info-section">
        <n-alert type="info" :title="t('convert.dateDiff.infoTitle')" class="info-alert">
          {{ t('convert.dateDiff.infoContent') }}
        </n-alert>
      </div>

      <!-- 计算按钮 -->
      <div class="button-row">
        <n-button @click="calculateDiff" type="primary" :disabled="!formData.startDate || !formData.endDate">
          {{ t('convert.dateDiff.calculate') }}
        </n-button>
      </div>

      <!-- 结果显示 -->
      <div class="input-info" v-if="diffResult">
        <n-text depth="3">{{ t('convert.dateDiff.result') }}: {{ diffResult }}</n-text>
        <n-button @click="copyResult" size="small" type="info">
          {{ t('common.copy') }}
        </n-button>
      </div>

      <!-- 错误提示 -->
      <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
        {{ error }}
      </n-alert>
    </n-card>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()

const formData = reactive({
  startDate: null,
  endDate: null,
  unit: 'day'
})

const diffResult = ref('')
const error = ref('')

const unitOptions = [
  { label: t('convert.dateDiff.units.year'), value: 'year' },
  { label: t('convert.dateDiff.units.month'), value: 'month' },
  { label: t('convert.dateDiff.units.day'), value: 'day' },
  { label: t('convert.dateDiff.units.hour'), value: 'hour' },
  { label: t('convert.dateDiff.units.minute'), value: 'minute' },
  { label: t('convert.dateDiff.units.second'), value: 'second' },
  { label: t('convert.dateDiff.units.millisecond'), value: 'millisecond' }
]

const calculateDiff = () => {
  try {
    if (!formData.startDate || !formData.endDate) {
      error.value = t('convert.dateDiff.inputRequired')
      return
    }

    error.value = ''
    const startDate = new Date(formData.startDate)
    const endDate = new Date(formData.endDate)
    const diff = endDate.getTime() - startDate.getTime()

    if (diff < 0) {
      error.value = t('convert.dateDiff.invalidRange')
      return
    }

    let result = ''

    switch (formData.unit) {
      case 'year':
        // 更精确的年计算
        const yearDiff = endDate.getFullYear() - startDate.getFullYear()
        const monthDiff = endDate.getMonth() - startDate.getMonth()
        const dayDiff = endDate.getDate() - startDate.getDate()
        result = (yearDiff + monthDiff / 12 + dayDiff / 365).toFixed(2)
        break
      case 'month':
        // 更精确的月计算
        const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                      (endDate.getMonth() - startDate.getMonth())
        const daysInMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate()
        const dayFraction = (endDate.getDate() - startDate.getDate()) / daysInMonth
        result = (months + dayFraction).toFixed(2)
        break
      case 'day':
        result = (diff / (24 * 60 * 60 * 1000)).toFixed(2)
        break
      case 'hour':
        result = (diff / (60 * 60 * 1000)).toFixed(2)
        break
      case 'minute':
        result = (diff / (60 * 1000)).toFixed(2)
        break
      case 'second':
        result = (diff / 1000).toFixed(2)
        break
      case 'millisecond':
        result = diff.toString()
        break
    }

    diffResult.value = `${result} ${t(`convert.dateDiff.units.${formData.unit}`)}`
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  }
}

// 复制结果
const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(diffResult.value)
    message.success(t('common.copy') + ' ' + t('common.success'))
  } catch (e) {
    message.error(t('common.copy') + ' ' + t('common.error'))
  }
}
</script>

<style scoped>
.date-diff {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.input-section {
  margin-bottom: 20px;
}

.input-section .n-text {
  display: block;
  margin-bottom: 8px;
}

.button-row {
  margin: 12px 0;
}

.input-info {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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