<template>
  <n-card :title="$t('text.reverse.title')">
    <n-form>
      <n-form-item :label="$t('text.reverse.input')">
        <n-input v-model:value="input" type="textarea" :placeholder="$t('text.reverse.inputPlaceholder')"
          :autosize="{ minRows: 3, maxRows: 10 }" />
      </n-form-item>

      <n-space>
        <n-button @click="reverseText">
          {{ $t('text.reverse.reverse') }}
        </n-button>
        <n-button @click="reverseWords">
          {{ $t('text.reverse.reverseWords') }}
        </n-button>
        <n-button @click="reverseLines">
          {{ $t('text.reverse.reverseLines') }}
        </n-button>
      </n-space>

      <n-form-item :label="$t('text.reverse.output')" class="mt-4">
        <n-input v-model:value="output" type="textarea" :placeholder="$t('text.reverse.outputPlaceholder')"
          :autosize="{ minRows: 3, maxRows: 10 }" readonly />
      </n-form-item>

      <n-space>
        <n-button @click="copyOutput" :disabled="!output">
          {{ $t('text.reverse.copy') }}
        </n-button>
        <n-button @click="clearAll">
          {{ $t('text.reverse.clear') }}
        </n-button>
      </n-space>
      <n-alert type="info" :title="$t('text.reverse.infoTitle')" class="info-section">
        {{$t('text.reverse.infoContent')}}
      </n-alert>
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

// 反转整个文本
function reverseText() {
  if (!input.value) {
    message.warning(t('text.reverse.noInput'))
    return
  }
  output.value = input.value.split('').reverse().join('')
}

// 反转单词顺序
function reverseWords() {
  if (!input.value) {
    message.warning(t('text.reverse.noInput'))
    return
  }
  output.value = input.value
    .split('\n')
    .map(line => line.split(' ').reverse().join(' '))
    .join('\n')
}

// 反转行顺序
function reverseLines() {
  if (!input.value) {
    message.warning(t('text.reverse.noInput'))
    return
  }
  output.value = input.value.split('\n').reverse().join('\n')
}

// 复制输出
function copyOutput() {
  if (!output.value) return
  navigator.clipboard.writeText(output.value)
  message.success(t('text.reverse.copied'))
}

// 清空所有
function clearAll() {
  input.value = ''
  output.value = ''
}
</script>

<style scoped>
.n-card {
  max-width: 1200px;
  margin: 0 auto;
}

.mt-4 {
  margin-top: 16px;
}

.info-section {
  margin-top: 16px;
}
</style>