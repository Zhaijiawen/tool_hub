<template>
  <div class="ecc-encrypt">
    <n-card :title="t('encrypt.ecc.title')">
      <n-input
        v-model:value="input"
        type="textarea"
        :placeholder="t('encrypt.ecc.placeholder')"
        :autosize="{ minRows: 10, maxRows: 20 }"
      />
      <div class="button-group">
        <n-button @click="encrypt" type="primary">
          {{ t('encrypt.ecc.encrypt') }}
        </n-button>
        <n-button @click="decrypt" type="primary">
          {{ t('encrypt.ecc.decrypt') }}
        </n-button>
        <n-button @click="copyToClipboard">
          {{ t('common.copy') }}
        </n-button>
      </div>
      <n-alert
        v-if="error"
        type="error"
        :title="t('common.error')"
        :content="error"
        class="error-alert"
      />
    </n-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { ec } from 'elliptic'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const error = ref('')

const encrypt = () => {
  try {
    const ellipticCurve = new ec('secp256k1')
    const keyPair = ellipticCurve.genKeyPair()
    const publicKey = keyPair.getPublic('hex')
    const privateKey = keyPair.getPrivate('hex')
    input.value = publicKey
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const decrypt = () => {
  try {
    const ellipticCurve = new ec('secp256k1')
    const keyPair = ellipticCurve.keyFromPrivate(input.value)
    const publicKey = keyPair.getPublic('hex')
    input.value = publicKey
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(input.value)
    message.success(t('common.success'))
  } catch (e) {
    message.error(t('common.error'))
  }
}
</script>

<style scoped>
.ecc-encrypt {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.button-group {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

.error-alert {
  margin-top: 16px;
}
</style> 