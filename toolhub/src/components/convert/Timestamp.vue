<template>
  <div class="timestamp-convert">
    <n-card :title="t('convert.timestamp.title')">
      <n-space vertical>
        <!-- 当前时间戳 -->
        <n-card>
          <template #header>
            {{ t('convert.timestamp.current') }}
          </template>
          <n-space>
            <n-text>{{ currentTimestamp }}</n-text>
            <n-button @click="copyCurrentTimestamp" size="small">
              {{ t('common.copy') }}
            </n-button>
          </n-space>
        </n-card>

        <!-- 时间戳转日期 -->
        <n-card>
          <template #header>
            {{ t('convert.timestamp.timestamp') }} → {{ t('convert.timestamp.date') }}
          </template>
          <n-space vertical>
            <n-input-group>
              <n-input
                v-model:value="timestampInput"
                :placeholder="t('convert.timestamp.timestamp')"
                type="number"
              />
              <n-select
                v-model:value="timestampUnit"
                :options="unitOptions"
                style="width: 120px"
              />
            </n-input-group>
            <n-select
              v-model:value="timezone"
              :options="timezoneOptions"
              :placeholder="t('convert.timestamp.timezone')"
            />
            <n-button @click="convertToDate" type="primary">
              {{ t('common.convert') }}
            </n-button>
            <n-text v-if="dateResult">
              {{ t('convert.timestamp.result') }}: {{ dateResult }}
            </n-text>
          </n-space>
        </n-card>

        <!-- 日期转时间戳 -->
        <n-card>
          <template #header>
            {{ t('convert.timestamp.date') }} → {{ t('convert.timestamp.timestamp') }}
          </template>
          <n-space vertical>
            <n-date-picker
              v-model:value="dateInput"
              type="datetime"
              clearable
            />
            <n-select
              v-model:value="timezone"
              :options="timezoneOptions"
              :placeholder="t('convert.timestamp.timezone')"
            />
            <n-button @click="convertToTimestamp" type="primary">
              {{ t('common.convert') }}
            </n-button>
            <n-space v-if="timestampResult">
              <n-text>{{ t('convert.timestamp.result') }}: {{ timestampResult }}</n-text>
              <n-button @click="copyTimestampResult" size="small">
                {{ t('common.copy') }}
              </n-button>
            </n-space>
          </n-space>
        </n-card>
      </n-space>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()

// 当前时间戳
const currentTimestamp = ref(Date.now())
let timer = null

// 时间戳转日期
const timestampInput = ref('')
const timestampUnit = ref('millisecond')
const timezone = ref('local')
const dateResult = ref('')

// 日期转时间戳
const dateInput = ref(null)
const timestampResult = ref('')

// 单位选项
const unitOptions = [
  { label: t('convert.timestamp.unit.second'), value: 'second' },
  { label: t('convert.timestamp.unit.millisecond'), value: 'millisecond' }
]

// 时区选项
const timezoneOptions = [
  { label: 'Local', value: 'local' },
  { label: 'UTC', value: 'utc' }
]

// 更新当前时间戳
const updateCurrentTimestamp = () => {
  currentTimestamp.value = Date.now()
}

// 复制当前时间戳
const copyCurrentTimestamp = () => {
  navigator.clipboard.writeText(currentTimestamp.value.toString())
  message.success(t('common.success'))
}

// 时间戳转日期
const convertToDate = () => {
  if (!timestampInput.value) return

  const timestamp = parseInt(timestampInput.value)
  const milliseconds = timestampUnit.value === 'second' ? timestamp * 1000 : timestamp
  const date = new Date(milliseconds)

  if (timezone.value === 'utc') {
    dateResult.value = date.toUTCString()
  } else {
    dateResult.value = date.toLocaleString()
  }
}

// 日期转时间戳
const convertToTimestamp = () => {
  if (!dateInput.value) return

  const timestamp = dateInput.value.getTime()
  timestampResult.value = timestamp.toString()
}

// 复制时间戳结果
const copyTimestampResult = () => {
  navigator.clipboard.writeText(timestampResult.value)
  message.success(t('common.success'))
}

onMounted(() => {
  timer = setInterval(updateCurrentTimestamp, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.timestamp-convert {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}
</style> 