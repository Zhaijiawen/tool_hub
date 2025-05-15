<template>
  <div class="date-calc">
    <n-card :title="t('convert.dateCalc.title')">
      <n-space vertical>
        <n-form :model="formData" label-placement="left" label-width="auto">
          <n-form-item :label="t('convert.dateCalc.date')">
            <n-date-picker
              v-model:value="formData.date"
              type="datetime"
              clearable
            />
          </n-form-item>

          <n-form-item :label="t('convert.dateCalc.operation')">
            <n-radio-group v-model:value="formData.operation">
              <n-radio-button value="add">
                {{ t('convert.dateCalc.add') }}
              </n-radio-button>
              <n-radio-button value="subtract">
                {{ t('convert.dateCalc.subtract') }}
              </n-radio-button>
            </n-radio-group>
          </n-form-item>

          <n-form-item :label="t('convert.dateCalc.value')">
            <n-input-number
              v-model:value="formData.value"
              :min="0"
              :precision="0"
            />
          </n-form-item>

          <n-form-item :label="t('convert.dateCalc.unit')">
            <n-select
              v-model:value="formData.unit"
              :options="unitOptions"
              :placeholder="t('convert.dateCalc.unitPlaceholder')"
            />
          </n-form-item>
        </n-form>

        <n-button @click="calculate" type="primary">
          {{ t('convert.dateCalc.calculate') }}
        </n-button>

        <n-text v-if="result" class="result">
          {{ t('convert.dateCalc.result') }}: {{ result }}
        </n-text>
      </n-space>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const formData = reactive({
  date: null,
  operation: 'add',
  value: 1,
  unit: 'day'
})

const result = ref('')

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
  if (!formData.date) return

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

  result.value = date.toLocaleString()
}
</script>

<style scoped>
.date-calc {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}

.result {
  font-size: 16px;
  font-weight: bold;
  color: #18a058;
}
</style> 