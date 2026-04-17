<template>
  <div class="cron-tool">
    <n-card :title="t('convert.cron.title')" :bordered="false">
      <n-space vertical size="large">

        <!-- 表达式输入 -->
        <div class="input-section">
          <n-text class="section-title">{{ t('convert.cron.expression') }}</n-text>
          <n-input
            v-model:value="cronExpr"
            :placeholder="t('convert.cron.placeholder')"
            clearable
            @input="handleInput"
          />
          <!-- 人话描述 -->
          <div v-if="humanDesc" class="human-desc">
            <n-tag type="info" size="large">📅 {{ humanDesc }}</n-tag>
          </div>
          <n-alert v-if="parseError" type="error" :title="t('convert.cron.invalidExpr')" class="error-alert">
            {{ parseError }}
          </n-alert>
        </div>

        <!-- 下次执行时间 -->
        <div v-if="nextTimes.length > 0" class="next-times-section">
          <n-text class="section-title">{{ t('convert.cron.nextTimes') }}</n-text>
          <n-list bordered>
            <n-list-item v-for="(time, index) in nextTimes" :key="index">
              <n-space align="center">
                <n-tag :type="index === 0 ? 'success' : 'default'" size="small">{{ index + 1 }}</n-tag>
                <n-text>{{ time }}</n-text>
              </n-space>
            </n-list-item>
          </n-list>
        </div>

        <!-- 快速示例 -->
        <div class="examples-section">
          <n-text class="section-title">{{ t('convert.cron.quickExamples') }}</n-text>
          <n-space wrap>
            <n-button
              v-for="example in quickExamples"
              :key="example.expr"
              size="small"
              @click="loadExample(example.expr)"
            >
              {{ example.label }}
            </n-button>
          </n-space>
        </div>

        <!-- 反向生成器 -->
        <div class="builder-section">
          <n-text class="section-title">{{ t('convert.cron.builder') }}</n-text>
          <n-grid :cols="2" :x-gap="16" :y-gap="12" responsive="screen">
            <n-gi>
              <n-form-item :label="t('convert.cron.minute')">
                <n-input v-model:value="builder.minute" @input="buildCron" placeholder="0-59, *, */5" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item :label="t('convert.cron.hour')">
                <n-input v-model:value="builder.hour" @input="buildCron" placeholder="0-23, *, */2" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item :label="t('convert.cron.dayOfMonth')">
                <n-input v-model:value="builder.dayOfMonth" @input="buildCron" placeholder="1-31, *, ?" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item :label="t('convert.cron.month')">
                <n-input v-model:value="builder.month" @input="buildCron" placeholder="1-12, *, JAN-DEC" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item :label="t('convert.cron.dayOfWeek')">
                <n-input v-model:value="builder.dayOfWeek" @input="buildCron" placeholder="0-6, *, MON-SUN" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <div class="builder-result">
                <n-text class="section-title">{{ t('convert.cron.generated') }}</n-text>
                <n-input-group>
                  <n-input :value="builtCron" readonly />
                  <n-button @click="copyBuilt">{{ t('common.copy') }}</n-button>
                </n-input-group>
              </div>
            </n-gi>
          </n-grid>
        </div>

        <!-- 字段说明 -->
        <n-alert type="info" :title="t('convert.cron.fieldGuide')" class="guide-alert">
          <n-text>{{ t('convert.cron.fieldGuideContent') }}</n-text>
        </n-alert>

      </n-space>
    </n-card>
    <TutorialAndDocs toolKey="cron" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
import { useMessage } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()

const STORAGE_KEY = 'toolhub_cron_input'

const cronExpr = ref('')
const humanDesc = ref('')
const parseError = ref('')
const nextTimes = ref([])

const builder = reactive({
  minute: '0',
  hour: '3',
  dayOfMonth: '*',
  month: '*',
  dayOfWeek: '*'
})

const builtCron = computed(() => {
  return `${builder.minute} ${builder.hour} ${builder.dayOfMonth} ${builder.month} ${builder.dayOfWeek}`
})

const quickExamples = computed(() => [
  { expr: '* * * * *', label: t('convert.cron.everyMinute') },
  { expr: '*/5 * * * *', label: t('convert.cron.every5Minutes') },
  { expr: '0 * * * *', label: t('convert.cron.everyHour') },
  { expr: '0 3 * * *', label: t('convert.cron.everyDayAt3') },
  { expr: '0 9 * * 1', label: t('convert.cron.everyMonday9') },
  { expr: '0 0 1 * *', label: t('convert.cron.firstDayOfMonth') },
  { expr: '0 0 1 1 *', label: t('convert.cron.newYear') },
  { expr: '30 18 * * 1-5', label: t('convert.cron.weekdaysAt18_30') }
])

const handleInput = async () => {
  const expr = cronExpr.value.trim()
  localStorage.setItem(STORAGE_KEY, expr)
  parseError.value = ''
  humanDesc.value = ''
  nextTimes.value = []

  if (!expr) return

  await parseCron(expr)
}

const parseCron = async (expr) => {
  try {
    // 动态导入 cronstrue
    const cronstrue = (await import('cronstrue')).default
    await import('cronstrue/locales/zh_CN')
    try {
      const lang = document.documentElement.lang || 'zh'
      const locale = lang.startsWith('zh') ? 'zh_CN' : 'en'
      humanDesc.value = cronstrue.toString(expr, { locale, throwExceptionOnParseError: true })
    } catch (e) {
      humanDesc.value = ''
      parseError.value = e.message || t('convert.cron.parseError')
    }
  } catch (e) {
    humanDesc.value = ''
  }

  try {
    // 动态导入 cron-parser v5，使用 CronExpressionParser.parse API
    const cronParser = await import('cron-parser')
    const CronExpressionParser = cronParser.CronExpressionParser || cronParser.default?.CronExpressionParser
    if (!CronExpressionParser) throw new Error('cron-parser API unavailable')
    const interval = CronExpressionParser.parse(expr)
    const times = []
    for (let i = 0; i < 5; i++) {
      times.push(interval.next().toDate().toLocaleString())
    }
    nextTimes.value = times
  } catch (e) {
    if (!parseError.value) {
      parseError.value = e.message || t('convert.cron.parseError')
    }
  }
}

const loadExample = (expr) => {
  cronExpr.value = expr
  handleInput()
}

const buildCron = () => {
  // 将构建好的表达式同步到解析区
}

const copyBuilt = () => {
  navigator.clipboard.writeText(builtCron.value).then(() => {
    message.success(t('common.copySuccess'))
    cronExpr.value = builtCron.value
    handleInput()
  })
}

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    cronExpr.value = saved
    handleInput()
  }
})
</script>

<style scoped>
.cron-tool {
  max-width: 1000px;
  margin: 20px auto;
  padding: 0 20px;
}

.section-title {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.input-section {
  margin-bottom: 4px;
}

.human-desc {
  margin-top: 12px;
}

.error-alert {
  margin-top: 12px;
}

.next-times-section,
.examples-section,
.builder-section {
  margin-bottom: 4px;
}

.builder-result {
  display: flex;
  flex-direction: column;
}

.guide-alert {
  margin-top: 4px;
}

@media (max-width: 768px) {
  .cron-tool {
    padding: 0 12px;
  }
}
</style>

