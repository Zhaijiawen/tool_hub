<template>
  <div class="date-calc">
    <n-card :title="t('convert.dateCalc.title')">
      <!-- 日期输入区域 -->
      <div class="input-section">
        <n-text>{{ t('convert.dateCalc.date') }}</n-text>
        <n-date-picker 
          v-model:value="formData.date" 
          type="datetime" 
          clearable 
          :placeholder="t('convert.dateCalc.date')"
          :show-time="true"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="timestamp"
        />
      </div>

      <!-- 操作选择区域 -->
      <div class="input-section">
        <n-text>{{ t('convert.dateCalc.operation') }}</n-text>
        <n-radio-group v-model:value="formData.operation" name="operation">
          <n-radio value="add">{{ t('convert.dateCalc.add') }}</n-radio>
          <n-radio value="subtract">{{ t('convert.dateCalc.subtract') }}</n-radio>
        </n-radio-group>
      </div>

      <!-- 数值和单位输入区域 -->
      <div class="input-section">
        <n-text>{{ t('convert.dateCalc.value') }} & {{ t('convert.dateCalc.unit') }}</n-text>
        <div class="value-unit-row">
          <n-input-number 
            v-model:value="formData.value" 
            :min="0" 
            :precision="0"
            :placeholder="t('convert.dateCalc.value')"
            style="flex: 1;"
          />
          <n-select 
            v-model:value="formData.unit" 
            :options="unitOptions"
            :placeholder="t('convert.dateCalc.unitPlaceholder')"
            style="flex: 1;"
          />
        </div>
      </div>

      <!-- 时区选择区域 -->
      <div class="input-section">
        <n-text>{{ t('convert.timestamp.timezone') }}</n-text>
        <n-select 
          v-model:value="timezone" 
          :options="timezoneOptions"
          :placeholder="t('convert.timestamp.timezone')" 
        />
      </div>

      <!-- 计算按钮 -->
      <div class="button-row">
        <n-button @click="calculate" type="primary" :disabled="!formData.date">
          {{ t('convert.dateCalc.calculate') }}
        </n-button>
      </div>

      <!-- 结果显示 -->
      <div class="input-info" v-if="result">
        <n-text depth="3">{{ t('convert.dateCalc.result') }}: {{ result }}</n-text>
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
  date: null,
  operation: 'add',
  value: 1,
  unit: 'day'
})

const timezone = ref('local')
const result = ref('')
const error = ref('')

// 时区选项
const timezoneOptions = [
  { label: 'Local', value: 'local' },
  { label: 'UTC', value: 'utc' }
]

const unitOptions = [
  { label: t('convert.dateCalc.units.year'), value: 'year' },
  { label: t('convert.dateCalc.units.month'), value: 'month' },
  { label: t('convert.dateCalc.units.day'), value: 'day' },
  { label: t('convert.dateCalc.units.hour'), value: 'hour' },
  { label: t('convert.dateCalc.units.minute'), value: 'minute' },
  { label: t('convert.dateCalc.units.second'), value: 'second' },
  { label: t('convert.dateCalc.units.millisecond'), value: 'millisecond' }
]

const calculate = () => {
  try {
    if (!formData.date) {
      error.value = t('convert.dateCalc.inputRequired')
      return
    }

    error.value = ''
    const date = new Date(formData.date)
    const value = formData.operation === 'add' ? formData.value : -formData.value

    switch (formData.unit) {
      case 'year':
        date.setFullYear(date.getFullYear() + value)
        break
      case 'month':
        date.setMonth(date.getMonth() + value)
        break
      case 'day':
        date.setDate(date.getDate() + value)
        break
      case 'hour':
        date.setHours(date.getHours() + value)
        break
      case 'minute':
        date.setMinutes(date.getMinutes() + value)
        break
      case 'second':
        date.setSeconds(date.getSeconds() + value)
        break
      case 'millisecond':
        date.setMilliseconds(date.getMilliseconds() + value)
        break
    }

    // 格式化结果，包含毫秒
    const formatDate = (date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      const ms = String(date.getMilliseconds()).padStart(3, '0')
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${ms}`
    }

    if (timezone.value === 'utc') {
      // UTC格式
      const utcYear = date.getUTCFullYear()
      const utcMonth = String(date.getUTCMonth() + 1).padStart(2, '0')
      const utcDay = String(date.getUTCDate()).padStart(2, '0')
      const utcHours = String(date.getUTCHours()).padStart(2, '0')
      const utcMinutes = String(date.getUTCMinutes()).padStart(2, '0')
      const utcSeconds = String(date.getUTCSeconds()).padStart(2, '0')
      const utcMs = String(date.getUTCMilliseconds()).padStart(3, '0')
      
      result.value = `${utcYear}-${utcMonth}-${utcDay} ${utcHours}:${utcMinutes}:${utcSeconds}.${utcMs} UTC`
    } else {
      result.value = formatDate(date)
    }
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  }
}

// 复制结果
const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(result.value)
    message.success(t('common.copy') + ' ' + t('common.success'))
  } catch (e) {
    message.error(t('common.copy') + ' ' + t('common.error'))
  }
}
</script>

<style scoped>
.date-calc {
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

.value-unit-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
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
</style>