<template>
  <div class="hex-codec">
    <n-card :title="t('encrypt.hex.title')">
      <n-space vertical>
        <n-input v-model:value="input" type="textarea" :placeholder="t('encrypt.hex.inputPlaceholder')"
          :autosize="{ minRows: 5, maxRows: 10 }" />

        <n-form :model="formData" label-placement="left" label-width="auto">
          <n-form-item :label="t('encrypt.hex.operation')">
            <n-select v-model:value="formData.operation" :options="operationOptions"
              :placeholder="t('encrypt.hex.operationPlaceholder')" />
          </n-form-item>
        </n-form>

        <n-space>
          <n-button @click="process" type="primary">
            {{ t('encrypt.hex.process') }}
          </n-button>
          <n-button @click="copyToClipboard">
            {{ t('common.copy') }}
          </n-button>
        </n-space>

        <n-input v-model:value="output" type="textarea" :placeholder="t('encrypt.hex.outputPlaceholder')"
          :autosize="{ minRows: 5, maxRows: 10 }" readonly />

        <!-- 错误提示 -->
        <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
          {{ error }}
        </n-alert>
      </n-space>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const output = ref('')
const error = ref('')

const formData = reactive({
  operation: 'encode'
})

const operationOptions = [
  { label: t('encrypt.hex.encode'), value: 'encode' },
  { label: t('encrypt.hex.decode'), value: 'decode' }
]

const process = () => {
  try {
    if (!input.value) {
      throw new Error(t('encrypt.hex.inputRequired'))
    }

    if (formData.operation === 'encode') {
      output.value = Array.from(input.value)
        .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    } else {
      const hex = input.value.replace(/[^0-9a-fA-F]/g, '')
      if (hex.length % 2 !== 0) {
        throw new Error(t('encrypt.hex.invalidHex'))
      }
      output.value = hex.match(/.{2}/g)
        .map(byte => String.fromCharCode(parseInt(byte, 16)))
        .join('')
    }

    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(output.value)
    message.success(t('common.success'))
  } catch (e) {
    message.error(t('common.error'))
  }
}
</script>

<style scoped>
.hex-codec {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.error-alert {
  margin-top: 16px;
}
</style>