<template>
  <div class="ecdh">
    <n-card :title="t('encrypt.ecdh.title')">
      <n-form>
        <n-form-item :label="t('encrypt.ecdh.privateKey')">
          <n-input
            v-model:value="privateKey"
            type="textarea"
            :placeholder="t('encrypt.ecdh.privateKeyPlaceholder')"
            :autosize="{ minRows: 3, maxRows: 10 }"
          />
        </n-form-item>
        <n-form-item :label="t('encrypt.ecdh.publicKey')">
          <n-input
            v-model:value="publicKey"
            type="textarea"
            :placeholder="t('encrypt.ecdh.publicKeyPlaceholder')"
            :autosize="{ minRows: 3, maxRows: 10 }"
          />
        </n-form-item>
        <n-form-item :label="t('encrypt.ecdh.peerPublicKey')">
          <n-input
            v-model:value="peerPublicKey"
            type="textarea"
            :placeholder="t('encrypt.ecdh.peerPublicKeyPlaceholder')"
            :autosize="{ minRows: 3, maxRows: 10 }"
          />
        </n-form-item>
        <n-space>
          <n-button @click="generateKeyPair" type="primary">
            {{ t('encrypt.ecdh.generateKeyPair') }}
          </n-button>
          <n-button @click="computeSharedSecret" :disabled="!privateKey || !peerPublicKey">
            {{ t('encrypt.ecdh.computeSharedSecret') }}
          </n-button>
        </n-space>
        <n-form-item v-if="sharedSecret" :label="t('encrypt.ecdh.sharedSecret')">
          <n-input
            v-model:value="sharedSecret"
            type="textarea"
            readonly
            :autosize="{ minRows: 3, maxRows: 10 }"
          />
          <template #suffix>
            <n-button @click="copySharedSecret" quaternary circle>
              <template #icon>
                <n-icon><copy-icon /></n-icon>
              </template>
            </n-button>
          </template>
        </n-form-item>
        <n-alert
          v-if="error"
          type="error"
          :title="t('common.error')"
          :content="error"
          class="error-alert"
        />
      </n-form>
    </n-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { CopyOutline as CopyIcon } from '@vicons/ionicons5'
import * as nacl from 'tweetnacl'
import { encodeBase64, decodeBase64 } from 'tweetnacl-util'

const { t } = useI18n()
const message = useMessage()

const privateKey = ref('')
const publicKey = ref('')
const peerPublicKey = ref('')
const sharedSecret = ref('')
const error = ref('')

const generateKeyPair = () => {
  try {
    const keyPair = nacl.box.keyPair()
    privateKey.value = encodeBase64(keyPair.secretKey)
    publicKey.value = encodeBase64(keyPair.publicKey)
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const computeSharedSecret = () => {
  try {
    if (!privateKey.value || !peerPublicKey.value) {
      throw new Error(t('encrypt.ecdh.allFieldsRequired'))
    }

    const privateKeyBytes = decodeBase64(privateKey.value)
    const peerPublicKeyBytes = decodeBase64(peerPublicKey.value)
    const sharedSecretBytes = nacl.box.before(peerPublicKeyBytes, privateKeyBytes)
    sharedSecret.value = encodeBase64(sharedSecretBytes)
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const copySharedSecret = async () => {
  try {
    await navigator.clipboard.writeText(sharedSecret.value)
    message.success(t('common.copied'))
  } catch (e) {
    message.error(t('common.copyFailed'))
  }
}
</script>

<style scoped>
.ecdh {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}

.error-alert {
  margin-top: 16px;
}
</style> 