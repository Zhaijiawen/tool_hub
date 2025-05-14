<template>
  <div class="ed25519-encryptor">
    <n-card :title="t('tools.ed25519Encryptor.title')">
      <n-tabs type="line" animated>
        <!-- 密钥生成 -->
        <n-tab-pane name="generate" :tab="t('tools.ed25519Encryptor.generate')">
          <n-form>
            <n-form-item>
              <n-button type="primary" @click="generateKeys">
                {{ t('tools.ed25519Encryptor.generate') }}
              </n-button>
            </n-form-item>
            <n-form-item :label="t('tools.ed25519Encryptor.publicKey')">
              <n-input
                v-model:value="publicKey"
                type="textarea"
                :placeholder="t('tools.ed25519Encryptor.publicKeyPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
                readonly
              />
            </n-form-item>
            <n-form-item :label="t('tools.ed25519Encryptor.privateKey')">
              <n-input
                v-model:value="privateKey"
                type="textarea"
                :placeholder="t('tools.ed25519Encryptor.privateKeyPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
                readonly
              />
            </n-form-item>
          </n-form>
        </n-tab-pane>

        <!-- 签名 -->
        <n-tab-pane name="sign" :tab="t('tools.ed25519Encryptor.sign')">
          <n-form>
            <n-form-item :label="t('tools.ed25519Encryptor.message')">
              <n-input
                v-model:value="message"
                type="textarea"
                :placeholder="t('tools.ed25519Encryptor.messagePlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </n-form-item>
            <n-form-item :label="t('tools.ed25519Encryptor.privateKey')">
              <n-input
                v-model:value="signPrivateKey"
                type="textarea"
                :placeholder="t('tools.ed25519Encryptor.privateKeyPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="sign">
                {{ t('tools.ed25519Encryptor.sign') }}
              </n-button>
            </n-form-item>
            <n-form-item :label="t('tools.ed25519Encryptor.signature')">
              <n-input
                v-model:value="signature"
                type="textarea"
                :placeholder="t('tools.ed25519Encryptor.signaturePlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
                readonly
              />
            </n-form-item>
          </n-form>
        </n-tab-pane>

        <!-- 验证 -->
        <n-tab-pane name="verify" :tab="t('tools.ed25519Encryptor.verify')">
          <n-form>
            <n-form-item :label="t('tools.ed25519Encryptor.message')">
              <n-input
                v-model:value="verifyMessage"
                type="textarea"
                :placeholder="t('tools.ed25519Encryptor.messagePlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </n-form-item>
            <n-form-item :label="t('tools.ed25519Encryptor.signature')">
              <n-input
                v-model:value="verifySignature"
                type="textarea"
                :placeholder="t('tools.ed25519Encryptor.signaturePlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </n-form-item>
            <n-form-item :label="t('tools.ed25519Encryptor.publicKey')">
              <n-input
                v-model:value="verifyPublicKey"
                type="textarea"
                :placeholder="t('tools.ed25519Encryptor.publicKeyPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="verify">
                {{ t('tools.ed25519Encryptor.verify') }}
              </n-button>
            </n-form-item>
            <n-form-item :label="t('tools.ed25519Encryptor.verificationResult')">
              <n-input
                v-model:value="verificationResult"
                type="textarea"
                :placeholder="t('tools.ed25519Encryptor.verificationResultPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
                readonly
              />
            </n-form-item>
          </n-form>
        </n-tab-pane>
      </n-tabs>

      <div class="btn-group">
        <n-button @click="copyResult">{{ t('common.copy') }}</n-button>
        <n-button @click="clearInput">{{ t('common.clear') }}</n-button>
      </div>
      <n-alert v-if="copySuccess" type="success" class="copy-tip">{{ t('common.copySuccess') }}</n-alert>
      <n-alert v-if="error" type="error" class="error-tip">{{ error }}</n-alert>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useClipboard } from '@vueuse/core';
import { createSign, createVerify } from 'crypto';

const { t } = useI18n();
const { copy } = useClipboard();

// 密钥生成相关
const publicKey = ref('');
const privateKey = ref('');

// 签名相关
const message = ref('');
const signPrivateKey = ref('');
const signature = ref('');

// 验证相关
const verifyMessage = ref('');
const verifySignature = ref('');
const verifyPublicKey = ref('');
const verificationResult = ref('');

// 通用
const error = ref('');
const copySuccess = ref(false);

function generateKeys() {
  try {
    error.value = '';
    const { publicKey: pubKey, privateKey: privKey } = crypto.subtle.generateKey(
      {
        name: 'Ed25519',
        namedCurve: 'Ed25519'
      },
      true,
      ['sign', 'verify']
    );

    publicKey.value = pubKey;
    privateKey.value = privKey;
  } catch (e) {
    error.value = e.message;
  }
}

function sign() {
  try {
    error.value = '';
    if (!message.value || !signPrivateKey.value) {
      throw new Error(t('tools.ed25519Encryptor.inputRequired'));
    }

    const sign = createSign('ed25519');
    sign.update(message.value);
    signature.value = sign.sign(signPrivateKey.value, 'hex');
  } catch (e) {
    error.value = e.message;
  }
}

function verify() {
  try {
    error.value = '';
    if (!verifyMessage.value || !verifySignature.value || !verifyPublicKey.value) {
      throw new Error(t('tools.ed25519Encryptor.inputRequired'));
    }

    const verify = createVerify('ed25519');
    verify.update(verifyMessage.value);
    const isValid = verify.verify(verifyPublicKey.value, verifySignature.value, 'hex');
    
    verificationResult.value = isValid 
      ? t('tools.ed25519Encryptor.verificationSuccess')
      : t('tools.ed25519Encryptor.verificationFailed');
  } catch (e) {
    error.value = e.message;
  }
}

function copyResult() {
  const activeTab = document.querySelector('.n-tabs-tab--active')?.getAttribute('data-name');
  let textToCopy = '';

  if (activeTab === 'generate') {
    const isPublicKey = document.querySelector('.n-tabs-tab--active')?.getAttribute('data-name') === 'publicKey';
    textToCopy = isPublicKey ? publicKey.value : privateKey.value;
  } else if (activeTab === 'sign') {
    textToCopy = signature.value;
  } else {
    textToCopy = verificationResult.value;
  }

  if (textToCopy) {
    copy(textToCopy);
    copySuccess.value = true;
    setTimeout(() => (copySuccess.value = false), 1500);
  }
}

function clearInput() {
  const activeTab = document.querySelector('.n-tabs-tab--active')?.getAttribute('data-name');
  
  if (activeTab === 'generate') {
    publicKey.value = '';
    privateKey.value = '';
  } else if (activeTab === 'sign') {
    message.value = '';
    signPrivateKey.value = '';
    signature.value = '';
  } else {
    verifyMessage.value = '';
    verifySignature.value = '';
    verifyPublicKey.value = '';
    verificationResult.value = '';
  }
  error.value = '';
}
</script>

<style scoped>
.ed25519-encryptor {
  max-width: 800px;
  margin: 0 auto;
}
.btn-group {
  display: flex;
  gap: 12px;
  margin: 16px 0;
}
.copy-tip,
.error-tip {
  margin-top: 8px;
}
</style> 