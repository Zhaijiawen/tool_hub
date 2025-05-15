<template>
  <div class="argon2-hash">
    <n-card :title="t('encrypt.argon2.title')">
      <n-space vertical>
        <n-input
          v-model:value="input"
          type="textarea"
          :placeholder="t('encrypt.argon2.inputPlaceholder')"
          :autosize="{ minRows: 5, maxRows: 10 }"
        />
        
        <n-form :model="formData" label-placement="left" label-width="auto">
          <n-form-item :label="t('encrypt.argon2.type')">
            <n-select
              v-model:value="formData.type"
              :options="typeOptions"
              :placeholder="t('encrypt.argon2.typePlaceholder')"
            />
          </n-form-item>
          
          <n-form-item :label="t('encrypt.argon2.memoryCost')">
            <n-input-number
              v-model:value="formData.memoryCost"
              :min="1"
              :max="65536"
              :placeholder="t('encrypt.argon2.memoryCostPlaceholder')"
            />
          </n-form-item>
          
          <n-form-item :label="t('encrypt.argon2.timeCost')">
            <n-input-number
              v-model:value="formData.timeCost"
              :min="1"
              :max="100"
              :placeholder="t('encrypt.argon2.timeCostPlaceholder')"
            />
          </n-form-item>
          
          <n-form-item :label="t('encrypt.argon2.parallelism')">
            <n-input-number
              v-model:value="formData.parallelism"
              :min="1"
              :max="32"
              :placeholder="t('encrypt.argon2.parallelismPlaceholder')"
            />
          </n-form-item>
        </n-form>

        <n-space>
          <n-button @click="hash" type="primary">
            {{ t('encrypt.argon2.hash') }}
          </n-button>
          <n-button @click="verify">
            {{ t('encrypt.argon2.verify') }}
          </n-button>
          <n-button @click="copyToClipboard">
            {{ t('common.copy') }}
          </n-button>
        </n-space>

        <n-input
          v-model:value="output"
          type="textarea"
          :placeholder="t('encrypt.argon2.outputPlaceholder')"
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
import argon2 from 'argon2'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const output = ref('')
const error = ref('')

const formData = reactive({
  type: 'argon2id',
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 4
})

const typeOptions = [
  { label: 'Argon2id', value: 'argon2id' },
  { label: 'Argon2i', value: 'argon2i' },
  { label: 'Argon2d', value: 'argon2d' }
]

const hash = async () => {
  try {
    if (!input.value) {
      throw new Error(t('encrypt.argon2.inputRequired'))
    }

    const hashed = await argon2.hash(input.value, {
      type: argon2[formData.type.toUpperCase()],
      memoryCost: formData.memoryCost,
      timeCost: formData.timeCost,
      parallelism: formData.parallelism
    })
    
    output.value = hashed
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const verify = async () => {
  try {
    if (!input.value || !output.value) {
      throw new Error(t('encrypt.argon2.bothInputsRequired'))
    }

    const isValid = await argon2.verify(output.value, input.value)
    output.value = isValid 
      ? t('encrypt.argon2.verificationSuccess')
      : t('encrypt.argon2.verificationFailed')
    
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
.argon2-hash {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.error-alert {
  margin-top: 16px;
}
</style> 