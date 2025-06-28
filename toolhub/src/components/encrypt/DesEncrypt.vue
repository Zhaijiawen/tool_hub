<template>
  <div class="des-encrypt">
    <n-card :title="t('encrypt.des.title')">
      <n-space vertical>
        <n-input v-model:value="input" type="textarea" :placeholder="t('encrypt.des.inputPlaceholder')"
          :autosize="{ minRows: 5, maxRows: 10 }" />

        <n-form :model="formData" label-placement="left" label-width="auto">
          <n-form-item :label="t('encrypt.des.key')">
            <n-input v-model:value="formData.key" :placeholder="t('encrypt.des.keyPlaceholder')" />
          </n-form-item>

          <n-form-item :label="t('encrypt.des.iv')">
            <n-input v-model:value="formData.iv" :placeholder="t('encrypt.des.ivPlaceholder')" />
          </n-form-item>

          <n-form-item :label="t('encrypt.des.mode')">
            <n-select v-model:value="formData.mode" :options="modeOptions"
              :placeholder="t('encrypt.des.modePlaceholder')" />
          </n-form-item>

          <n-form-item :label="t('encrypt.des.type')">
            <n-select v-model:value="formData.type" :options="typeOptions"
              :placeholder="t('encrypt.des.typePlaceholder')" />
          </n-form-item>
        </n-form>

        <n-space>
          <n-button @click="encrypt" type="primary">
            {{ t('encrypt.des.encrypt') }}
          </n-button>
          <n-button @click="decrypt">
            {{ t('encrypt.des.decrypt') }}
          </n-button>
          <n-button @click="copyToClipboard">
            {{ t('common.copy') }}
          </n-button>
        </n-space>

        <n-input v-model:value="output" type="textarea" :placeholder="t('encrypt.des.outputPlaceholder')"
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
  type: 'DES'
})

const modeOptions = [
  { label: 'CBC', value: 'CBC' },
  { label: 'CFB', value: 'CFB' },
  { label: 'CTR', value: 'CTR' },
  { label: 'ECB', value: 'ECB' },
  { label: 'OFB', value: 'OFB' }
]

const typeOptions = [
  { label: 'DES', value: 'DES' },
  { label: 'TripleDES', value: 'TripleDES' }
]

const encrypt = () => {
  try {
    if (!formData.key) {
      throw new Error(t('encrypt.des.keyRequired'))
    }

    const key = CryptoJS.enc.Utf8.parse(formData.key)
    const iv = formData.iv ? CryptoJS.enc.Utf8.parse(formData.iv) : undefined

    const encrypted = formData.type === 'DES'
      ? CryptoJS.DES.encrypt(input.value, key, {
        iv: iv,
        mode: CryptoJS.mode[formData.mode]
      })
      : CryptoJS.TripleDES.encrypt(input.value, key, {
        iv: iv,
        mode: CryptoJS.mode[formData.mode]
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
      throw new Error(t('encrypt.des.keyRequired'))
    }

    const key = CryptoJS.enc.Utf8.parse(formData.key)
    const iv = formData.iv ? CryptoJS.enc.Utf8.parse(formData.iv) : undefined

    const decrypted = formData.type === 'DES'
      ? CryptoJS.DES.decrypt(input.value, key, {
        iv: iv,
        mode: CryptoJS.mode[formData.mode]
      })
      : CryptoJS.TripleDES.decrypt(input.value, key, {
        iv: iv,
        mode: CryptoJS.mode[formData.mode]
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
.des-encrypt {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.error-alert {
  margin-top: 16px;
}
</style>