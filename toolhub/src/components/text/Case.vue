<template>
  <n-card :title="$t('text.case.title')">
    <n-form>
      <n-form-item :label="$t('text.case.input')">
        <n-input
          v-model:value="input"
          type="textarea"
          :placeholder="$t('text.case.inputPlaceholder')"
          :autosize="{ minRows: 3, maxRows: 10 }"
        />
      </n-form-item>

      <n-space>
        <n-button @click="toUpperCase">
          {{ $t('text.case.upperCase') }}
        </n-button>
        <n-button @click="toLowerCase">
          {{ $t('text.case.lowerCase') }}
        </n-button>
        <n-button @click="toTitleCase">
          {{ $t('text.case.titleCase') }}
        </n-button>
        <n-button @click="toSentenceCase">
          {{ $t('text.case.sentenceCase') }}
        </n-button>
        <n-button @click="toAlternatingCase">
          {{ $t('text.case.alternatingCase') }}
        </n-button>
      </n-space>

      <n-form-item :label="$t('text.case.output')" class="mt-4">
        <n-input
          v-model:value="output"
          type="textarea"
          :placeholder="$t('text.case.outputPlaceholder')"
          :autosize="{ minRows: 3, maxRows: 10 }"
          readonly
        />
      </n-form-item>

      <n-space>
        <n-button @click="copyOutput" :disabled="!output">
          {{ $t('text.case.copy') }}
        </n-button>
        <n-button @click="clearAll">
          {{ $t('text.case.clear') }}
        </n-button>
      </n-space>
    </n-form>
  </n-card>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()

// 状态变量
const input = ref('')
const output = ref('')

// 转换为大写
function toUpperCase() {
  if (!input.value) {
    message.warning(t('text.case.noInput'))
    return
  }
  output.value = input.value.toUpperCase()
}

// 转换为小写
function toLowerCase() {
  if (!input.value) {
    message.warning(t('text.case.noInput'))
    return
  }
  output.value = input.value.toLowerCase()
}

// 转换为标题格式
function toTitleCase() {
  if (!input.value) {
    message.warning(t('text.case.noInput'))
    return
  }
  output.value = input.value
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// 转换为句子格式
function toSentenceCase() {
  if (!input.value) {
    message.warning(t('text.case.noInput'))
    return
  }
  output.value = input.value
    .toLowerCase()
    .split('. ')
    .map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1))
    .join('. ')
}

// 转换为交替大小写
function toAlternatingCase() {
  if (!input.value) {
    message.warning(t('text.case.noInput'))
    return
  }
  output.value = input.value
    .split('')
    .map((char, index) => index % 2 === 0 ? char.toUpperCase() : char.toLowerCase())
    .join('')
}

// 复制输出
function copyOutput() {
  if (!output.value) return
  navigator.clipboard.writeText(output.value)
  message.success(t('text.case.copied'))
}

// 清空所有
function clearAll() {
  input.value = ''
  output.value = ''
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