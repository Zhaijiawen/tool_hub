<template>
  <n-card :title="$t('regex.title')">
    <n-form>
      <n-form-item :label="$t('regex.pattern')">
        <n-input v-model:value="pattern" :placeholder="$t('regex.patternPlaceholder')" />
      </n-form-item>

      <n-form-item :label="$t('regex.flags')">
        <n-space>
          <n-checkbox v-model:checked="flags.global">g (全局匹配)</n-checkbox>
          <n-checkbox v-model:checked="flags.ignoreCase">i (忽略大小写)</n-checkbox>
          <n-checkbox v-model:checked="flags.multiline">m (多行匹配)</n-checkbox>
          <n-checkbox v-model:checked="flags.sticky">y (粘性匹配)</n-checkbox>
          <n-checkbox v-model:checked="flags.unicode">u (Unicode)</n-checkbox>
        </n-space>
      </n-form-item>

      <n-form-item :label="$t('regex.testString')">
        <n-input v-model:value="testString" type="textarea" :placeholder="$t('regex.testStringPlaceholder')"
          :autosize="{ minRows: 3, maxRows: 10 }" />
      </n-form-item>

      <n-space>
        <n-button @click="testRegex">
          {{ $t('regex.test') }}
        </n-button>
        <n-button @click="generateRegex">
          {{ $t('regex.generate') }}
        </n-button>
      </n-space>

      <n-form-item :label="$t('regex.result')" class="mt-4">
        <n-input v-model:value="result" type="textarea" :placeholder="$t('regex.resultPlaceholder')"
          :autosize="{ minRows: 3, maxRows: 10 }" readonly />
      </n-form-item>

      <n-space>
        <n-button @click="copyResult" :disabled="!result">
          {{ $t('regex.copy') }}
        </n-button>
        <n-button @click="clearAll">
          {{ $t('common.clear') }}
        </n-button>
      </n-space>
    </n-form>
  </n-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()

// 状态变量
const pattern = ref('')
const testString = ref('')
const result = ref('')
const flags = reactive({
  global: true,
  ignoreCase: false,
  multiline: false,
  sticky: false,
  unicode: false
})

// 获取正则表达式标志
function getFlags() {
  return Object.entries(flags)
    .filter(([_, value]) => value)
    .map(([key]) => key[0])
    .join('')
}

// 测试正则表达式
function testRegex() {
  if (!pattern.value) {
    message.warning(t('regex.patternRequired'))
    return
  }
  if (!testString.value) {
    message.warning(t('regex.testStringRequired'))
    return
  }

  try {
    const regex = new RegExp(pattern.value, getFlags())
    const matches = testString.value.matchAll(regex)
    const results = []

    for (const match of matches) {
      results.push({
        match: match[0],
        index: match.index,
        groups: match.groups || {},
        indices: match.indices
      })
    }

    if (results.length === 0) {
      result.value = t('regex.noMatch')
    } else {
      result.value = JSON.stringify(results, null, 2)
    }
  } catch (e) {
    message.error(e.message)
  }
}

// 生成正则表达式
function generateRegex() {
  if (!testString.value) {
    message.warning(t('regex.testStringRequired'))
    return
  }

  try {
    // 转义特殊字符
    const escaped = testString.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    pattern.value = escaped
    result.value = t('regex.generated', { pattern: escaped })
  } catch (e) {
    message.error(e.message)
  }
}

// 复制结果
function copyResult() {
  if (!result.value) return
  navigator.clipboard.writeText(result.value)
  message.success(t('regex.copied'))
}

// 清空所有
function clearAll() {
  pattern.value = ''
  testString.value = ''
  result.value = ''
  Object.keys(flags).forEach(key => {
    flags[key] = key === 'global'
  })
}
</script>

<style scoped>
.n-card {
  max-width: 800px;
  margin: 0 auto;
}

.mt-4 {
  margin-top: 16px;
}
</style>