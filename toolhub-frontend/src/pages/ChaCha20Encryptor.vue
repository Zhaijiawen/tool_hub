<template>
  <div class="chacha20-encryptor">
    <n-card :title="t('tools.chacha20Encryptor.title')">
      <n-tabs type="line" animated>
        <!-- 加密 -->
        <n-tab-pane name="encrypt" :tab="t('tools.chacha20Encryptor.encrypt')">
          <n-form>
            <n-form-item :label="t('tools.chacha20Encryptor.plaintext')">
              <n-input
                v-model:value="plaintext"
                type="textarea"
                :placeholder="t('tools.chacha20Encryptor.plaintextPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </n-form-item>
            <n-form-item :label="t('tools.chacha20Encryptor.key')">
              <n-input
                v-model:value="key"
                :placeholder="t('tools.chacha20Encryptor.keyPlaceholder')"
                show-password-on="click"
              />
            </n-form-item>
            <n-form-item :label="t('tools.chacha20Encryptor.nonce')">
              <n-input
                v-model:value="nonce"
                :placeholder="t('tools.chacha20Encryptor.noncePlaceholder')"
                show-password-on="click"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="encrypt">
                {{ t('tools.chacha20Encryptor.encrypt') }}
              </n-button>
            </n-form-item>
            <n-form-item :label="t('tools.chacha20Encryptor.ciphertext')">
              <n-input
                v-model:value="ciphertext"
                type="textarea"
                :placeholder="t('tools.chacha20Encryptor.ciphertextPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
                readonly
              />
            </n-form-item>
          </n-form>
        </n-tab-pane>

        <!-- 解密 -->
        <n-tab-pane name="decrypt" :tab="t('tools.chacha20Encryptor.decrypt')">
          <n-form>
            <n-form-item :label="t('tools.chacha20Encryptor.ciphertext')">
              <n-input
                v-model:value="decryptCiphertext"
                type="textarea"
                :placeholder="t('tools.chacha20Encryptor.ciphertextPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </n-form-item>
            <n-form-item :label="t('tools.chacha20Encryptor.key')">
              <n-input
                v-model:value="decryptKey"
                :placeholder="t('tools.chacha20Encryptor.keyPlaceholder')"
                show-password-on="click"
              />
            </n-form-item>
            <n-form-item :label="t('tools.chacha20Encryptor.nonce')">
              <n-input
                v-model:value="decryptNonce"
                :placeholder="t('tools.chacha20Encryptor.noncePlaceholder')"
                show-password-on="click"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="decrypt">
                {{ t('tools.chacha20Encryptor.decrypt') }}
              </n-button>
            </n-form-item>
            <n-form-item :label="t('tools.chacha20Encryptor.plaintext')">
              <n-input
                v-model:value="decryptPlaintext"
                type="textarea"
                :placeholder="t('tools.chacha20Encryptor.plaintextPlaceholder')"
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
import { ChaCha20 } from 'crypto-js';

const { t } = useI18n();
const { copy } = useClipboard();

// 加密相关
const plaintext = ref('');
const key = ref('');
const nonce = ref('');
const ciphertext = ref('');

// 解密相关
const decryptCiphertext = ref('');
const decryptKey = ref('');
const decryptNonce = ref('');
const decryptPlaintext = ref('');

// 通用
const error = ref('');
const copySuccess = ref(false);

function encrypt() {
  try {
    error.value = '';
    if (!plaintext.value || !key.value || !nonce.value) {
      throw new Error(t('tools.chacha20Encryptor.inputRequired'));
    }

    // 使用 ChaCha20 加密
    const encrypted = ChaCha20.encrypt(plaintext.value, key.value, {
      nonce: nonce.value
    });

    ciphertext.value = encrypted.toString();
  } catch (e) {
    error.value = e.message;
  }
}

function decrypt() {
  try {
    error.value = '';
    if (!decryptCiphertext.value || !decryptKey.value || !decryptNonce.value) {
      throw new Error(t('tools.chacha20Encryptor.inputRequired'));
    }

    // 使用 ChaCha20 解密
    const decrypted = ChaCha20.decrypt(decryptCiphertext.value, decryptKey.value, {
      nonce: decryptNonce.value
    });

    decryptPlaintext.value = decrypted.toString();
  } catch (e) {
    error.value = e.message;
  }
}

function copyResult() {
  const activeTab = document.querySelector('.n-tabs-tab--active')?.getAttribute('data-name');
  let textToCopy = '';

  if (activeTab === 'encrypt') {
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
  
  if (activeTab === 'encrypt') {
    plaintext.value = '';
    key.value = '';
    nonce.value = '';
    ciphertext.value = '';
  } else {
    decryptCiphertext.value = '';
    decryptKey.value = '';
    decryptNonce.value = '';
    decryptPlaintext.value = '';
  }
  error.value = '';
}
</script>

<style scoped>
.chacha20-encryptor {
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