<template>
  <div class="timestamp-convert">

    <n-card :title="t('convert.timestamp.title')">
      <!-- 时间戳格式选择 -->
      <div class="format-section">
        <n-text>{{ t('convert.timestamp.format') }}</n-text>
        <n-radio-group v-model:value="timestampFormat" name="timestampFormat">
          <n-radio value="second">{{ t('convert.timestamp.unit.second') }} (10{{ t('convert.timestamp.unit.digit') }})</n-radio>
          <n-radio value="millisecond">{{ t('convert.timestamp.unit.millisecond') }} (13{{ t('convert.timestamp.unit.digit') }})</n-radio>
        </n-radio-group>
      </div>

      <!-- 当前时间戳区域 -->
      <div class="input-section">
        <n-text>{{ t('convert.timestamp.current') }}</n-text>
        <n-input 
          v-model:value="currentTimestamp" 
          :placeholder="t('convert.timestamp.current')"
          readonly 
        />
        <div class="input-info">
          <n-text depth="3">{{ formatLabel }}</n-text>
          <n-button @click="copyCurrentTimestamp" size="small" type="info">
            {{ t('common.copy') }}
          </n-button>
        </div>
      </div>

      <!-- 时间戳转日期区域 -->
      <div class="input-section">
        <n-text>{{ t('convert.timestamp.timestamp') }} → {{ t('convert.timestamp.date') }}</n-text>
        <n-input 
          v-model:value="timestampInput" 
          :placeholder="t('convert.timestamp.timestamp')" 
          type="number" 
        />
        <n-select 
          v-model:value="timezoneToDate" 
          :options="timezoneOptions"
          :placeholder="t('convert.timestamp.timezone')" 
        />
        <div class="button-row">
          <n-button @click="convertToDate" type="primary" :disabled="!timestampInput">
            {{ t('common.convert') }}
          </n-button>
        </div>
        <div class="input-info" v-if="dateResult">
          <n-text depth="3">{{ t('convert.timestamp.result') }}: {{ dateResult }}</n-text>
          <n-button @click="copyDateResult" size="small" type="info">
            {{ t('common.copy') }}
          </n-button>
        </div>
      </div>

      <!-- 日期转时间戳区域 -->
      <div class="input-section">
        <n-text>{{ t('convert.timestamp.date') }} → {{ t('convert.timestamp.timestamp') }}</n-text>
        <n-date-picker 
          v-model:value="dateInput" 
          type="datetime" 
          clearable 
          :placeholder="t('convert.timestamp.date')"
          :show-time="true"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="timestamp"
        />
        <n-select 
          v-model:value="timezoneToTimestamp" 
          :options="timezoneOptions"
          :placeholder="t('convert.timestamp.timezone')" 
        />
        <div class="button-row">
          <n-button @click="convertToTimestamp" type="primary" :disabled="!dateInput">
            {{ t('common.convert') }}
          </n-button>
        </div>
        <div class="input-info" v-if="timestampResult">
          <n-text depth="3">{{ t('convert.timestamp.result') }}: {{ timestampResult }}</n-text>
          <n-button @click="copyTimestampResult" size="small" type="info">
            {{ t('common.copy') }}
          </n-button>
        </div>
      </div>

      <!-- 错误提示 -->
      <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
        {{ error }}
      </n-alert>
    </n-card>
    <TutorialAndDocs toolKey="timestamp" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
const { t } = useI18n()
const message = useMessage()

// 响应式数据
const timestampFormat = ref('second') // 默认秒级
const currentTimestamp = ref('')
const timestampInput = ref('')
const timezoneToDate = ref('local')
const timezoneToTimestamp = ref('local')
const dateResult = ref('')
const dateInput = ref(null)
const timestampResult = ref('')
const error = ref('')

let timer = null

// 计算属性
const formatLabel = computed(() => {
  return timestampFormat.value === 'second' 
    ? t('convert.timestamp.unit.second') + ' (10' + t('convert.timestamp.unit.digit') + ')'
    : t('convert.timestamp.unit.millisecond') + ' (13' + t('convert.timestamp.unit.digit') + ')'
})

// 时区选项
const timezoneOptions = [
  { label: 'Local', value: 'local' },
  { label: 'UTC', value: 'utc' }
]

// 更新当前时间戳
const updateCurrentTimestamp = () => {
  const now = Date.now()
  currentTimestamp.value = timestampFormat.value === 'second' 
    ? Math.floor(now / 1000).toString()
    : now.toString()
}

// 复制当前时间戳
const copyCurrentTimestamp = async () => {
  try {
    await navigator.clipboard.writeText(currentTimestamp.value)
    message.success(t('common.copy') + ' ' + t('common.success'))
  } catch (e) {
    message.error(t('common.copy') + ' ' + t('common.error'))
  }
}

// 时间戳转日期
const convertToDate = () => {
  try {
    if (!timestampInput.value) {
      error.value = t('convert.timestamp.inputRequired')
      return
    }

    error.value = ''
    const timestamp = parseInt(timestampInput.value)
    
    if (isNaN(timestamp)) {
      error.value = t('convert.timestamp.invalidTimestamp')
      return
    }

    // 根据选择的格式转换时间戳
    const milliseconds = timestampFormat.value === 'second' ? timestamp * 1000 : timestamp
    const date = new Date(milliseconds)

    // 格式化日期，根据时间戳格式决定是否包含毫秒
    const formatDate = (date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      
      if (timestampFormat.value === 'millisecond') {
        const ms = String(date.getMilliseconds()).padStart(3, '0')
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${ms}`
      } else {
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
      }
    }

    if (timezoneToDate.value === 'utc') {
      // UTC格式，根据时间戳格式决定是否包含毫秒
      const utcYear = date.getUTCFullYear()
      const utcMonth = String(date.getUTCMonth() + 1).padStart(2, '0')
      const utcDay = String(date.getUTCDate()).padStart(2, '0')
      const utcHours = String(date.getUTCHours()).padStart(2, '0')
      const utcMinutes = String(date.getUTCMinutes()).padStart(2, '0')
      const utcSeconds = String(date.getUTCSeconds()).padStart(2, '0')
      
      if (timestampFormat.value === 'millisecond') {
        const utcMs = String(date.getUTCMilliseconds()).padStart(3, '0')
        dateResult.value = `${utcYear}-${utcMonth}-${utcDay} ${utcHours}:${utcMinutes}:${utcSeconds}.${utcMs} UTC`
      } else {
        dateResult.value = `${utcYear}-${utcMonth}-${utcDay} ${utcHours}:${utcMinutes}:${utcSeconds} UTC`
      }
    } else {
      dateResult.value = formatDate(date)
    }
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  }
}

// 日期转时间戳
const convertToTimestamp = () => {
  try {
    if (!dateInput.value) {
      error.value = t('convert.timestamp.inputRequired')
      return
    }

    error.value = ''
    let timestamp
    const date = new Date(dateInput.value)
    if (timezoneToTimestamp.value === 'utc') {
      // 取本地年月日时分秒，按UTC方式转时间戳
      timestamp = Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
      )
    } else {
      // 本地时间戳
      timestamp = dateInput.value
    }
    timestampResult.value = timestampFormat.value === 'second'
      ? Math.floor(timestamp / 1000).toString()
      : timestamp.toString()
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  }
}

// 复制日期结果
const copyDateResult = async () => {
  try {
    await navigator.clipboard.writeText(dateResult.value)
    message.success(t('common.copy') + ' ' + t('common.success'))
  } catch (e) {
    message.error(t('common.copy') + ' ' + t('common.error'))
  }
}

// 复制时间戳结果
const copyTimestampResult = async () => {
  try {
    await navigator.clipboard.writeText(timestampResult.value)
    message.success(t('common.copy') + ' ' + t('common.success'))
  } catch (e) {
    message.error(t('common.copy') + ' ' + t('common.error'))
  }
}

onMounted(() => {
  updateCurrentTimestamp()
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
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.format-section {
  margin-bottom: 20px;
  padding: 16px;
  background-color: var(--n-color);
  border-radius: 6px;
}

.format-section .n-text {
  display: block;
  margin-bottom: 12px;
  font-weight: 500;
}

.input-section {
  margin-bottom: 20px;
}

.input-section .n-text {
  display: block;
  margin-bottom: 8px;
}

.input-info {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-with-copy {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.input-with-copy .n-input {
  flex: 1;
}

.button-row {
  margin: 12px 0;
}

.error-alert {
  margin-top: 16px;
}
</style>