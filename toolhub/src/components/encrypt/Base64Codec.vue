<template>
  <div class="base64-codec">
    <n-card :title="t('encrypt.base64.title')">
      <n-space vertical>
        <n-input v-model:value="input" type="textarea" :placeholder="t('encrypt.base64.inputPlaceholder')"
          :autosize="{ minRows: 5, maxRows: 10 }" />

        <n-form :model="formData" label-placement="left" label-width="auto">
          <n-form-item :label="t('encrypt.base64.operation')">
            <n-select v-model:value="formData.operation" :options="operationOptions"
              :placeholder="t('encrypt.base64.operationPlaceholder')" />
          </n-form-item>
        </n-form>

        <n-space>
          <n-button @click="process" type="primary">
            {{ t('encrypt.base64.process') }}
          </n-button>
          <n-button @click="copyToClipboard">
            {{ t('common.copy') }}
          </n-button>
        </n-space>

        <n-input v-model:value="output" type="textarea" :placeholder="t('encrypt.base64.outputPlaceholder')"
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
  { label: t('encrypt.base64.encode'), value: 'encode' },
  { label: t('encrypt.base64.decode'), value: 'decode' }
]

const process = () => {
  try {
    if (!input.value) {
      throw new Error(t('encrypt.base64.inputRequired'))
    }

    if (formData.operation === 'encode') {
      output.value = btoa(input.value)
    } else {
      output.value = atob(input.value)
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
.base64-codec {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.error-alert {
  margin-top: 16px;
}
</style>