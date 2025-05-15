<template>
  <div class="date-diff">
    <n-card :title="t('convert.dateDiff.title')">
      <n-space vertical>
        <n-form :model="formData" label-placement="left" label-width="auto">
          <n-form-item :label="t('convert.dateDiff.startDate')">
            <n-date-picker
              v-model:value="formData.startDate"
              type="datetime"
              clearable
            />
          </n-form-item>

          <n-form-item :label="t('convert.dateDiff.endDate')">
            <n-date-picker
              v-model:value="formData.endDate"
              type="datetime"
              clearable
            />
          </n-form-item>

          <n-form-item :label="t('convert.dateDiff.unit')">
            <n-select
              v-model:value="formData.unit"
              :options="unitOptions"
              :placeholder="t('convert.dateDiff.unitPlaceholder')"
            />
          </n-form-item>
        </n-form>

        <n-button @click="calculateDiff" type="primary">
          {{ t('convert.dateDiff.calculate') }}
        </n-button>

        <n-text v-if="diffResult" class="result">
          {{ t('convert.dateDiff.result') }}: {{ diffResult }}
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
  startDate: null,
  endDate: null,
  unit: 'day'
})

const diffResult = ref('')

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
  if (!formData.startDate || !formData.endDate) return

  const diff = formData.endDate.getTime() - formData.startDate.getTime()
  let result = ''

  switch (formData.unit) {
    case 'year':
      result = (diff / (365 * 24 * 60 * 60 * 1000)).toFixed(2)
      break
    case 'month':
      result = (diff / (30 * 24 * 60 * 60 * 1000)).toFixed(2)
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
}
</script>

<style scoped>
.date-diff {
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