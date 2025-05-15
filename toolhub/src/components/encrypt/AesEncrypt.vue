<template>
  <div class="aes-encrypt">
    <n-card :title="t('encrypt.aes.title')">
      <n-space vertical>
        <n-input
          v-model:value="input"
          type="textarea"
          :placeholder="t('encrypt.aes.inputPlaceholder')"
          :autosize="{ minRows: 5, maxRows: 10 }"
        />
        
        <n-form :model="formData" label-placement="left" label-width="auto">
          <n-form-item :label="t('encrypt.aes.key')">
            <n-input v-model:value="formData.key" :placeholder="t('encrypt.aes.keyPlaceholder')" />
          </n-form-item>
          
          <n-form-item :label="t('encrypt.aes.iv')">
            <n-input v-model:value="formData.iv" :placeholder="t('encrypt.aes.ivPlaceholder')" />
          </n-form-item>
          
          <n-form-item :label="t('encrypt.aes.mode')">
            <n-select
              v-model:value="formData.mode"
              :options="modeOptions"
              :placeholder="t('encrypt.aes.modePlaceholder')"
            />
          </n-form-item>
          
          <n-form-item :label="t('encrypt.aes.padding')">
            <n-select
              v-model:value="formData.padding"
              :options="paddingOptions"
              :placeholder="t('encrypt.aes.paddingPlaceholder')"
            />
          </n-form-item>
        </n-form>

        <n-space>
          <n-button @click="encrypt" type="primary">
            {{ t('encrypt.aes.encrypt') }}
          </n-button>
          <n-button @click="decrypt">
            {{ t('encrypt.aes.decrypt') }}
          </n-button>
          <n-button @click="copyToClipboard">
            {{ t('common.copy') }}
          </n-button>
        </n-space>

        <n-input
          v-model:value="output"
          type="textarea"
          :placeholder="t('encrypt.aes.outputPlaceholder')"
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
import CryptoJS from 'crypto-js'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const output = ref('')
const error = ref('')

const formData = reactive({
  key: '',
  iv: '',
  mode: 'CBC',
  padding: 'PKCS7'
})

const modeOptions = [
  { label: 'CBC', value: 'CBC' },
  { label: 'CFB', value: 'CFB' },
  { label: 'CTR', value: 'CTR' },
  { label: 'ECB', value: 'ECB' },
  { label: 'OFB', value: 'OFB' }
]

const paddingOptions = [
  { label: 'PKCS7', value: 'PKCS7' },
  { label: 'PKCS5', value: 'PKCS5' },
  { label: 'ZeroPadding', value: 'ZeroPadding' },
  { label: 'NoPadding', value: 'NoPadding' }
]

const encrypt = () => {
  try {
    if (!formData.key) {
      throw new Error(t('encrypt.aes.keyRequired'))
    }

    const key = CryptoJS.enc.Utf8.parse(formData.key)
    const iv = formData.iv ? CryptoJS.enc.Utf8.parse(formData.iv) : undefined

    const encrypted = CryptoJS.AES.encrypt(input.value, key, {
      iv: iv,
      mode: CryptoJS.mode[formData.mode],
      padding: CryptoJS.pad[formData.padding]
    })

    output.value = encrypted.toString()
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const decrypt = () => {
  try {
    if (!formData.key) {
      throw new Error(t('encrypt.aes.keyRequired'))
    }

    const key = CryptoJS.enc.Utf8.parse(formData.key)
    const iv = formData.iv ? CryptoJS.enc.Utf8.parse(formData.iv) : undefined

    const decrypted = CryptoJS.AES.decrypt(input.value, key, {
      iv: iv,
      mode: CryptoJS.mode[formData.mode],
      padding: CryptoJS.pad[formData.padding]
    })

    output.value = decrypted.toString(CryptoJS.enc.Utf8)
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
.aes-encrypt {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.error-alert {
  margin-top: 16px;
}
</style> 