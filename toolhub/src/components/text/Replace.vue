<template>
  <n-card :title="$t('text.replace.title')">
    <n-form>
      <n-form-item :label="$t('text.replace.input')">
        <n-input v-model:value="input" type="textarea" :placeholder="$t('text.replace.inputPlaceholder')"
          :autosize="{ minRows: 3, maxRows: 10 }" />
      </n-form-item>

      <n-form-item :label="$t('text.replace.find')">
        <n-input v-model:value="find" :placeholder="$t('text.replace.findPlaceholder')" />
      </n-form-item>

      <n-form-item :label="$t('text.replace.replace')">
        <n-input v-model:value="replace" :placeholder="$t('text.replace.replacePlaceholder')" />
      </n-form-item>

      <n-space>
        <n-checkbox v-model:checked="caseSensitive">
          {{ $t('text.replace.caseSensitive') }}
        </n-checkbox>
        <n-checkbox v-model:checked="useRegex">
          {{ $t('text.replace.useRegex') }}
        </n-checkbox>
      </n-space>

      <n-space class="mt-4">
        <n-button @click="replaceText">
          {{ $t('text.replace.replace') }}
        </n-button>
        <n-button @click="replaceAll">
          {{ $t('text.replace.replaceAll') }}
        </n-button>
      </n-space>

      <n-form-item :label="$t('text.replace.output')" class="mt-4">
        <n-input v-model:value="output" type="textarea" :placeholder="$t('text.replace.outputPlaceholder')"
          :autosize="{ minRows: 3, maxRows: 10 }" readonly />
      </n-form-item>

      <n-space>
        <n-button @click="copyOutput" :disabled="!output">
          {{ $t('text.replace.copy') }}
        </n-button>
        <n-button @click="clearAll">
          {{ $t('text.replace.clear') }}
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
const find = ref('')
const replace = ref('')
const output = ref('')
const caseSensitive = ref(false)
const useRegex = ref(false)

// 替换文本
function replaceText() {
  if (!input.value || !find.value) {
    message.warning(t('text.replace.noInput'))
    return
  }

  try {
    let flags = 'g'
    if (!caseSensitive.value) {
      flags += 'i'
    }

    let pattern = find.value
    if (!useRegex.value) {
      pattern = find.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }

    const regex = new RegExp(pattern, flags)
    output.value = input.value.replace(regex, replace.value)
  } catch (e) {
    message.error(t('text.replace.invalidRegex'))
  }
}

// 替换所有
function replaceAll() {
  if (!input.value || !find.value) {
    message.warning(t('text.replace.noInput'))
    return
  }

  try {
    let flags = 'g'
    if (!caseSensitive.value) {
      flags += 'i'
    }

    let pattern = find.value
    if (!useRegex.value) {
      pattern = find.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }

    const regex = new RegExp(pattern, flags)
    output.value = input.value.replace(regex, replace.value)
  } catch (e) {
    message.error(t('text.replace.invalidRegex'))
  }
}

// 复制输出
function copyOutput() {
  if (!output.value) return
  navigator.clipboard.writeText(output.value)
  message.success(t('text.replace.copied'))
}

// 清空所有
function clearAll() {
  input.value = ''
  find.value = ''
  replace.value = ''
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