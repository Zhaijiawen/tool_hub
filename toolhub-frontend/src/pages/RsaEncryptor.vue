<template>
  <div class="rsa-encryptor">
    <n-card :title="t('tools.rsaEncryptor.title')">
      <n-tabs type="line" animated>
        <!-- 密钥生成 -->
        <n-tab-pane name="generate" :tab="t('tools.rsaEncryptor.generate')">
          <n-form>
            <n-form-item :label="t('tools.rsaEncryptor.keySize')">
              <n-select
                v-model:value="keySize"
                :options="keySizeOptions"
                :placeholder="t('tools.rsaEncryptor.keySizePlaceholder')"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="generateKeys">
                {{ t('tools.rsaEncryptor.generate') }}
              </n-button>
            </n-form-item>
            <n-form-item :label="t('tools.rsaEncryptor.publicKey')">
              <n-input
                v-model:value="publicKey"
                type="textarea"
                :placeholder="t('tools.rsaEncryptor.publicKeyPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
                readonly
              />
            </n-form-item>
            <n-form-item :label="t('tools.rsaEncryptor.privateKey')">
              <n-input
                v-model:value="privateKey"
                type="textarea"
                :placeholder="t('tools.rsaEncryptor.privateKeyPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
                readonly
              />
            </n-form-item>
          </n-form>
        </n-tab-pane>

        <!-- 加密 -->
        <n-tab-pane name="encrypt" :tab="t('tools.rsaEncryptor.encrypt')">
          <n-form>
            <n-form-item :label="t('tools.rsaEncryptor.plaintext')">
              <n-input
                v-model:value="plaintext"
                type="textarea"
                :placeholder="t('tools.rsaEncryptor.plaintextPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </n-form-item>
            <n-form-item :label="t('tools.rsaEncryptor.publicKey')">
              <n-input
                v-model:value="encryptPublicKey"
                type="textarea"
                :placeholder="t('tools.rsaEncryptor.publicKeyPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="encrypt">
                {{ t('tools.rsaEncryptor.encrypt') }}
              </n-button>
            </n-form-item>
            <n-form-item :label="t('tools.rsaEncryptor.ciphertext')">
              <n-input
                v-model:value="ciphertext"
                type="textarea"
                :placeholder="t('tools.rsaEncryptor.ciphertextPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
                readonly
              />
            </n-form-item>
          </n-form>
        </n-tab-pane>

        <!-- 解密 -->
        <n-tab-pane name="decrypt" :tab="t('tools.rsaEncryptor.decrypt')">
          <n-form>
            <n-form-item :label="t('tools.rsaEncryptor.ciphertext')">
              <n-input
                v-model:value="decryptCiphertext"
                type="textarea"
                :placeholder="t('tools.rsaEncryptor.ciphertextPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </n-form-item>
            <n-form-item :label="t('tools.rsaEncryptor.privateKey')">
              <n-input
                v-model:value="decryptPrivateKey"
                type="textarea"
                :placeholder="t('tools.rsaEncryptor.privateKeyPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="decrypt">
                {{ t('tools.rsaEncryptor.decrypt') }}
              </n-button>
            </n-form-item>
            <n-form-item :label="t('tools.rsaEncryptor.plaintext')">
              <n-input
                v-model:value="decryptPlaintext"
                type="textarea"
                :placeholder="t('tools.rsaEncryptor.plaintextPlaceholder')"
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
import { JSEncrypt } from 'jsencrypt';

const { t } = useI18n();
const { copy } = useClipboard();

// 密钥生成相关
const keySize = ref('2048');
const publicKey = ref('');
const privateKey = ref('');

// 加密相关
const plaintext = ref('');
const encryptPublicKey = ref('');
const ciphertext = ref('');

// 解密相关
const decryptCiphertext = ref('');
const decryptPrivateKey = ref('');
const decryptPlaintext = ref('');

// 通用
const error = ref('');
const copySuccess = ref(false);

const keySizeOptions = [
  { label: '1024 bits', value: '1024' },
  { label: '2048 bits', value: '2048' },
  { label: '4096 bits', value: '4096' }
];

function generateKeys() {
  try {
    error.value = '';
    const encrypt = new JSEncrypt();
    encrypt.getKey();
    publicKey.value = encrypt.getPublicKey();
    privateKey.value = encrypt.getPrivateKey();
  } catch (e) {
    error.value = e.message;
  }
}

function encrypt() {
  try {
    error.value = '';
    if (!plaintext.value || !encryptPublicKey.value) {
      throw new Error(t('tools.rsaEncryptor.inputRequired'));
    }

    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(encryptPublicKey.value);
    const encrypted = encrypt.encrypt(plaintext.value);
    
    if (!encrypted) {
      throw new Error(t('tools.rsaEncryptor.encryptFailed'));
    }

    ciphertext.value = encrypted;
  } catch (e) {
    error.value = e.message;
  }
}

function decrypt() {
  try {
    error.value = '';
    if (!decryptCiphertext.value || !decryptPrivateKey.value) {
      throw new Error(t('tools.rsaEncryptor.inputRequired'));
    }

    const encrypt = new JSEncrypt();
    encrypt.setPrivateKey(decryptPrivateKey.value);
    const decrypted = encrypt.decrypt(decryptCiphertext.value);
    
    if (!decrypted) {
      throw new Error(t('tools.rsaEncryptor.decryptFailed'));
    }

    decryptPlaintext.value = decrypted;
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
  } else if (activeTab === 'encrypt') {
    textToCopy = ciphertext.value;
  } else {
    textToCopy = decryptPlaintext.value;
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
    keySize.value = '2048';
    publicKey.value = '';
    privateKey.value = '';
  } else if (activeTab === 'encrypt') {
    plaintext.value = '';
    encryptPublicKey.value = '';
    ciphertext.value = '';
  } else {
    decryptCiphertext.value = '';
    decryptPrivateKey.value = '';
    decryptPlaintext.value = '';
  }
  error.value = '';
}
</script>

<style scoped>
.rsa-encryptor {
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