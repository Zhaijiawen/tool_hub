<template>
  <div class="bcrypt-hash">
    <n-card :title="t('encrypt.bcrypt.title')">
      <n-space vertical>
        <n-input
          v-model:value="input"
          type="textarea"
          :placeholder="t('encrypt.bcrypt.inputPlaceholder')"
          :autosize="{ minRows: 5, maxRows: 10 }"
        />
        
        <n-form :model="formData" label-placement="left" label-width="auto">
          <n-form-item :label="t('encrypt.bcrypt.saltRounds')">
            <n-input-number
              v-model:value="formData.saltRounds"
              :min="4"
              :max="31"
              :placeholder="t('encrypt.bcrypt.saltRoundsPlaceholder')"
            />
          </n-form-item>
        </n-form>

        <n-space>
          <n-button @click="hash" type="primary">
            {{ t('encrypt.bcrypt.hash') }}
          </n-button>
          <n-button @click="verify">
            {{ t('encrypt.bcrypt.verify') }}
          </n-button>
          <n-button @click="copyToClipboard">
            {{ t('common.copy') }}
          </n-button>
        </n-space>

        <n-input
          v-model:value="output"
          type="textarea"
          :placeholder="t('encrypt.bcrypt.outputPlaceholder')"
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
import bcrypt from 'bcryptjs'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const output = ref('')
const error = ref('')

const formData = reactive({
  saltRounds: 10
})

const hash = async () => {
  try {
    if (!input.value) {
      throw new Error(t('encrypt.bcrypt.inputRequired'))
    }

    const salt = await bcrypt.genSalt(formData.saltRounds)
    const hashed = await bcrypt.hash(input.value, salt)
    
    output.value = hashed
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const verify = async () => {
  try {
    if (!input.value || !output.value) {
      throw new Error(t('encrypt.bcrypt.bothInputsRequired'))
    }

    const isValid = await bcrypt.compare(input.value, output.value)
    output.value = isValid 
      ? t('encrypt.bcrypt.verificationSuccess')
      : t('encrypt.bcrypt.verificationFailed')
    
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
.bcrypt-hash {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.error-alert {
  margin-top: 16px;
}
</style> 