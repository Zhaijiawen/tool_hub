<template>
  <div class="time-converter">
    <n-card :title="t('tools.timeConverter.title')">
      <n-tabs type="line" animated>
        <!-- 时间戳转换 -->
        <n-tab-pane name="timestamp" :tab="t('tools.timeConverter.timestamp')">
          <n-space vertical>
            <!-- 当前时间戳 -->
            <n-card>
              <template #header>
                <n-space justify="space-between">
                  <span>{{ t('tools.timeConverter.currentTimestamp') }}</span>
                  <n-button @click="refreshCurrentTimestamp">
                    {{ t('common.refresh') }}
                  </n-button>
                </n-space>
              </template>
              <n-space vertical>
                <n-text>{{ currentTimestamp }}</n-text>
                <n-text>{{ currentTimestampMs }}</n-text>
              </n-space>
            </n-card>

            <!-- 时间戳转日期 -->
            <n-card>
              <template #header>
                <span>{{ t('tools.timeConverter.timestampToDate') }}</span>
              </template>
              <n-form>
                <n-form-item :label="t('tools.timeConverter.timestamp')">
                  <n-input-number
                    v-model:value="timestampInput"
                    :placeholder="t('tools.timeConverter.timestampPlaceholder')"
                    style="width: 100%"
                  />
                </n-form-item>
                <n-form-item>
                  <n-radio-group v-model:value="timestampUnit">
                    <n-radio-button value="seconds">{{ t('tools.timeConverter.seconds') }}</n-radio-button>
                    <n-radio-button value="milliseconds">{{ t('tools.timeConverter.milliseconds') }}</n-radio-button>
                  </n-radio-group>
                </n-form-item>
                <n-form-item>
                  <n-select
                    v-model:value="timezone"
                    :options="timezoneOptions"
                    :placeholder="t('tools.timeConverter.timezonePlaceholder')"
                  />
                </n-form-item>
                <n-form-item>
                  <n-button type="primary" @click="convertTimestampToDate">
                    {{ t('tools.timeConverter.convert') }}
                  </n-button>
                </n-form-item>
                <n-form-item :label="t('tools.timeConverter.result')">
                  <n-input
                    v-model:value="timestampToDateResult"
                    type="textarea"
                    readonly
                    :autosize="{ minRows: 2, maxRows: 5 }"
                  />
                </n-form-item>
              </n-form>
            </n-card>

            <!-- 日期转时间戳 -->
            <n-card>
              <template #header>
                <span>{{ t('tools.timeConverter.dateToTimestamp') }}</span>
              </template>
              <n-form>
                <n-form-item :label="t('tools.timeConverter.dateTime')">
                  <n-date-picker
                    v-model:value="dateInput"
                    type="datetime"
                    :placeholder="t('tools.timeConverter.dateTimePlaceholder')"
                    style="width: 100%"
                  />
                </n-form-item>
                <n-form-item>
                  <n-select
                    v-model:value="timezone"
                    :options="timezoneOptions"
                    :placeholder="t('tools.timeConverter.timezonePlaceholder')"
                  />
                </n-form-item>
                <n-form-item>
                  <n-radio-group v-model:value="timestampUnit">
                    <n-radio-button value="seconds">{{ t('tools.timeConverter.seconds') }}</n-radio-button>
                    <n-radio-button value="milliseconds">{{ t('tools.timeConverter.milliseconds') }}</n-radio-button>
                  </n-radio-group>
                </n-form-item>
                <n-form-item>
                  <n-button type="primary" @click="convertDateToTimestamp">
                    {{ t('tools.timeConverter.convert') }}
                  </n-button>
                </n-form-item>
                <n-form-item :label="t('tools.timeConverter.result')">
                  <n-input
                    v-model:value="dateToTimestampResult"
                    type="textarea"
                    readonly
                    :autosize="{ minRows: 2, maxRows: 5 }"
                  />
                </n-form-item>
              </n-form>
            </n-card>
          </n-space>
        </n-tab-pane>

        <!-- 日期时间转换 -->
        <n-tab-pane name="datetime" :tab="t('tools.timeConverter.datetime')">
          <n-space vertical>
            <!-- 本地时间 -->
            <n-card>
              <template #header>
                <span>{{ t('tools.timeConverter.localDateTime') }}</span>
              </template>
              <n-form>
                <n-form-item :label="t('tools.timeConverter.dateTime')">
                  <n-date-picker
                    v-model:value="localDateTimeInput"
                    type="datetime"
                    :placeholder="t('tools.timeConverter.dateTimePlaceholder')"
                    style="width: 100%"
                  />
                </n-form-item>
                <n-form-item>
                  <n-button type="primary" @click="convertLocalDateTime">
                    {{ t('tools.timeConverter.convert') }}
                  </n-button>
                </n-form-item>
                <n-form-item :label="t('tools.timeConverter.result')">
                  <n-input
                    v-model:value="localDateTimeResult"
                    type="textarea"
                    readonly
                    :autosize="{ minRows: 2, maxRows: 5 }"
                  />
                </n-form-item>
              </n-form>
            </n-card>

            <!-- UTC时间 -->
            <n-card>
              <template #header>
                <span>{{ t('tools.timeConverter.utcDateTime') }}</span>
              </template>
              <n-form>
                <n-form-item :label="t('tools.timeConverter.dateTime')">
                  <n-date-picker
                    v-model:value="utcDateTimeInput"
                    type="datetime"
                    :placeholder="t('tools.timeConverter.dateTimePlaceholder')"
                    style="width: 100%"
                  />
                </n-form-item>
                <n-form-item>
                  <n-button type="primary" @click="convertUtcDateTime">
                    {{ t('tools.timeConverter.convert') }}
                  </n-button>
                </n-form-item>
                <n-form-item :label="t('tools.timeConverter.result')">
                  <n-input
                    v-model:value="utcDateTimeResult"
                    type="textarea"
                    readonly
                    :autosize="{ minRows: 2, maxRows: 5 }"
                  />
                </n-form-item>
              </n-form>
            </n-card>

            <!-- ISO时间 -->
            <n-card>
              <template #header>
                <span>{{ t('tools.timeConverter.isoDateTime') }}</span>
              </template>
              <n-form>
                <n-form-item :label="t('tools.timeConverter.dateTime')">
                  <n-date-picker
                    v-model:value="isoDateTimeInput"
                    type="datetime"
                    :placeholder="t('tools.timeConverter.dateTimePlaceholder')"
                    style="width: 100%"
                  />
                </n-form-item>
                <n-form-item>
                  <n-button type="primary" @click="convertIsoDateTime">
                    {{ t('tools.timeConverter.convert') }}
                  </n-button>
                </n-form-item>
                <n-form-item :label="t('tools.timeConverter.result')">
                  <n-input
                    v-model:value="isoDateTimeResult"
                    type="textarea"
                    readonly
                    :autosize="{ minRows: 2, maxRows: 5 }"
                  />
                </n-form-item>
              </n-form>
            </n-card>
          </n-space>
        </n-tab-pane>
      </n-tabs>

      <div class="btn-group">
        <n-button @click="copyResult">{{ t('common.copy') }}</n-button>
        <n-button @click="clearInput">{{ t('common.clear') }}</n-button>
      </div>
      <n-alert v-if="copySuccess" type="success" class="copy-tip">{{ t('common.copySuccess') }}</n-alert>
      <n-alert v-if="error" type="error" class="error-tip">{{ error }}</n-alert>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useClipboard } from '@vueuse/core';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const { t } = useI18n();
const { copy } = useClipboard();

// 当前时间戳
const currentTimestamp = ref('');
const currentTimestampMs = ref('');
let timer: number;

// 时间戳转换
const timestampInput = ref<number | null>(null);
const timestampUnit = ref<'seconds' | 'milliseconds'>('seconds');
const timezone = ref('UTC');
const timestampToDateResult = ref('');
const dateToTimestampResult = ref('');

// 日期时间转换
const localDateTimeInput = ref<number | null>(null);
const utcDateTimeInput = ref<number | null>(null);
const isoDateTimeInput = ref<number | null>(null);
const localDateTimeResult = ref('');
const utcDateTimeResult = ref('');
const isoDateTimeResult = ref('');

// 其他状态
const error = ref('');
const copySuccess = ref(false);

// 时区选项
const timezoneOptions = [
  { label: 'UTC', value: 'UTC' },
  { label: 'Local Time', value: dayjs.tz.guess() },
  // 可以添加更多时区选项
];

// 更新当前时间戳
function updateCurrentTimestamp() {
  const now = dayjs();
  currentTimestamp.value = now.unix().toString();
  currentTimestampMs.value = now.valueOf().toString();
}

// 刷新当前时间戳
function refreshCurrentTimestamp() {
  updateCurrentTimestamp();
}

// 时间戳转日期
function convertTimestampToDate() {
  try {
    error.value = '';
    if (!timestampInput.value) {
      throw new Error(t('tools.timeConverter.inputRequired'));
    }

    const timestamp = timestampUnit.value === 'seconds' 
      ? timestampInput.value * 1000 
      : timestampInput.value;
    
    const date = dayjs(timestamp).tz(timezone.value);
    timestampToDateResult.value = date.format('YYYY-MM-DD HH:mm:ss');
  } catch (e) {
    error.value = e.message;
  }
}

// 日期转时间戳
function convertDateToTimestamp() {
  try {
    error.value = '';
    if (!dateInput.value) {
      throw new Error(t('tools.timeConverter.inputRequired'));
    }

    const date = dayjs(dateInput.value).tz(timezone.value);
    const timestamp = timestampUnit.value === 'seconds' 
      ? date.unix() 
      : date.valueOf();
    
    dateToTimestampResult.value = timestamp.toString();
  } catch (e) {
    error.value = e.message;
  }
}

// 本地时间转换
function convertLocalDateTime() {
  try {
    error.value = '';
    if (!localDateTimeInput.value) {
      throw new Error(t('tools.timeConverter.inputRequired'));
    }

    const date = dayjs(localDateTimeInput.value);
    localDateTimeResult.value = date.format('YYYY-MM-DD HH:mm:ss');
  } catch (e) {
    error.value = e.message;
  }
}

// UTC时间转换
function convertUtcDateTime() {
  try {
    error.value = '';
    if (!utcDateTimeInput.value) {
      throw new Error(t('tools.timeConverter.inputRequired'));
    }

    const date = dayjs(utcDateTimeInput.value).utc();
    utcDateTimeResult.value = date.format('YYYY-MM-DD HH:mm:ss');
  } catch (e) {
    error.value = e.message;
  }
}

// ISO时间转换
function convertIsoDateTime() {
  try {
    error.value = '';
    if (!isoDateTimeInput.value) {
      throw new Error(t('tools.timeConverter.inputRequired'));
    }

    const date = dayjs(isoDateTimeInput.value);
    isoDateTimeResult.value = date.toISOString();
  } catch (e) {
    error.value = e.message;
  }
}

// 复制结果
function copyResult() {
  const result = timestampToDateResult.value || 
                 dateToTimestampResult.value || 
                 localDateTimeResult.value || 
                 utcDateTimeResult.value || 
                 isoDateTimeResult.value;
  
  if (result) {
    copy(result);
    copySuccess.value = true;
    setTimeout(() => (copySuccess.value = false), 1500);
  }
}

// 清空输入
function clearInput() {
  timestampInput.value = null;
  dateInput.value = null;
  localDateTimeInput.value = null;
  utcDateTimeInput.value = null;
  isoDateTimeInput.value = null;
  timestampToDateResult.value = '';
  dateToTimestampResult.value = '';
  localDateTimeResult.value = '';
  utcDateTimeResult.value = '';
  isoDateTimeResult.value = '';
  error.value = '';
}

// 组件挂载时启动定时器
onMounted(() => {
  updateCurrentTimestamp();
  timer = window.setInterval(updateCurrentTimestamp, 1000);
});

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.time-converter {
  max-width: 800px;
  margin: 0 auto;
}
.btn-group {
  display: flex;
  gap: 12px;
  margin: 16px 0;
}
.copy-tip,
.error-tip {
  margin-top: 8px;
}
</style> 
</style> 