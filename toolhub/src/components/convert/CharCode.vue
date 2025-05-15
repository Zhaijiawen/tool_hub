<template>
  <n-card :title="$t('convert.charCode.title')">
    <n-form>
      <n-form-item :label="$t('convert.charCode.input')">
        <n-input
          v-model:value="input"
          type="textarea"
          :placeholder="$t('convert.charCode.inputPlaceholder')"
          :autosize="{ minRows: 3, maxRows: 10 }"
        />
      </n-form-item>

      <n-space>
        <n-button @click="toCode">
          {{ $t('convert.charCode.toCode') }}
        </n-button>
        <n-button @click="toChar">
          {{ $t('convert.charCode.toChar') }}
        </n-button>
      </n-space>

      <n-form-item :label="$t('convert.charCode.output')" class="mt-4">
        <n-input
          v-model:value="output"
          type="textarea"
          :placeholder="$t('convert.charCode.outputPlaceholder')"
          :autosize="{ minRows: 3, maxRows: 10 }"
          readonly
        />
      </n-form-item>

      <n-space>
        <n-button @click="copyOutput" :disabled="!output">
          {{ $t('common.copy') }}
        </n-button>
        <n-button @click="clearAll">
          {{ $t('common.clear') }}
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

// 字符转编码
function toCode() {
  if (!input.value) {
    message.warning(t('convert.charCode.inputRequired'))
    return
  }

  try {
    const result = []
    for (let i = 0; i < input.value.length; i++) {
      const char = input.value[i]
      const code = char.charCodeAt(0)
      result.push(`U+${code.toString(16).toUpperCase().padStart(4, '0')}`)
    }
    output.value = result.join(' ')
  } catch (e) {
    message.error(t('convert.charCode.invalidInput'))
  }
}

// 编码转字符
function toChar() {
  if (!input.value) {
    message.warning(t('convert.charCode.inputRequired'))
    return
  }

  try {
    const codes = input.value.trim().split(/\s+/)
    const result = codes.map(code => {
      // 处理 U+ 前缀
      const hex = code.replace(/^U\+/i, '')
      const num = parseInt(hex, 16)
      if (isNaN(num)) {
        throw new Error(t('convert.charCode.invalidCode'))
      }
      return String.fromCharCode(num)
    })
    output.value = result.join('')
  } catch (e) {
    message.error(e.message || t('convert.charCode.invalidInput'))
  }
}

// 复制输出
function copyOutput() {
  if (!output.value) return
  navigator.clipboard.writeText(output.value)
  message.success(t('common.copied'))
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