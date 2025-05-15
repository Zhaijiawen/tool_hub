<template>
  <div class="jwt-codec">
    <n-card :title="t('encrypt.jwt.title')">
      <n-space vertical>
        <n-input
          v-model:value="input"
          type="textarea"
          :placeholder="t('encrypt.jwt.inputPlaceholder')"
          :autosize="{ minRows: 5, maxRows: 10 }"
        />
        
        <n-form :model="formData" label-placement="left" label-width="auto">
          <n-form-item :label="t('encrypt.jwt.operation')">
            <n-select
              v-model:value="formData.operation"
              :options="operationOptions"
              :placeholder="t('encrypt.jwt.operationPlaceholder')"
            />
          </n-form-item>
          
          <n-form-item v-if="formData.operation === 'encode'" :label="t('encrypt.jwt.secret')">
            <n-input
              v-model:value="formData.secret"
              type="password"
              :placeholder="t('encrypt.jwt.secretPlaceholder')"
            />
          </n-form-item>
          
          <n-form-item v-if="formData.operation === 'encode'" :label="t('encrypt.jwt.algorithm')">
            <n-select
              v-model:value="formData.algorithm"
              :options="algorithmOptions"
              :placeholder="t('encrypt.jwt.algorithmPlaceholder')"
            />
          </n-form-item>
        </n-form>

        <n-space>
          <n-button @click="process" type="primary">
            {{ t('encrypt.jwt.process') }}
          </n-button>
          <n-button @click="copyToClipboard">
            {{ t('common.copy') }}
          </n-button>
        </n-space>

        <n-input
          v-model:value="output"
          type="textarea"
          :placeholder="t('encrypt.jwt.outputPlaceholder')"
          :autosize="{ minRows: 5, maxRows: 10 }"
          readonly
        />

        <n-alert
          v-if="error"
          type="error"
          :title="t('common.error')"
          :content="error"
          class="error-alert"
        />
      </n-space>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import jwt from 'jsonwebtoken'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const output = ref('')
const error = ref('')

const formData = reactive({
  operation: 'encode',
  secret: '',
  algorithm: 'HS256'
})

const operationOptions = [
  { label: t('encrypt.jwt.encode'), value: 'encode' },
  { label: t('encrypt.jwt.decode'), value: 'decode' }
]

const algorithmOptions = [
  { label: 'HS256', value: 'HS256' },
  { label: 'HS384', value: 'HS384' },
  { label: 'HS512', value: 'HS512' },
  { label: 'RS256', value: 'RS256' },
  { label: 'RS384', value: 'RS384' },
  { label: 'RS512', value: 'RS512' }
]

const process = () => {
  try {
    if (!input.value) {
      throw new Error(t('encrypt.jwt.inputRequired'))
    }

    if (formData.operation === 'encode') {
      if (!formData.secret) {
        throw new Error(t('encrypt.jwt.secretRequired'))
      }

      const payload = JSON.parse(input.value)
      output.value = jwt.sign(payload, formData.secret, { algorithm: formData.algorithm })
    } else {
      const decoded = jwt.decode(input.value, { complete: true })
      output.value = JSON.stringify(decoded, null, 2)
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
.jwt-codec {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.error-alert {
  margin-top: 16px;
}
</style> 