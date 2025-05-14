<template>
  <div class="aes-encryptor">
    <n-card :title="t('tools.aesEncryptor.title')">
      <n-tabs type="line" animated>
        <!-- 加密 -->
        <n-tab-pane name="encrypt" :tab="t('tools.aesEncryptor.encrypt')">
          <n-form>
            <n-form-item :label="t('tools.aesEncryptor.plaintext')">
              <n-input
                v-model:value="plaintext"
                type="textarea"
                :placeholder="t('tools.aesEncryptor.plaintextPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </n-form-item>
            <n-form-item :label="t('tools.aesEncryptor.key')">
              <n-input
                v-model:value="key"
                :placeholder="t('tools.aesEncryptor.keyPlaceholder')"
                show-password-on="click"
              />
            </n-form-item>
            <n-form-item :label="t('tools.aesEncryptor.iv')">
              <n-input
                v-model:value="iv"
                :placeholder="t('tools.aesEncryptor.ivPlaceholder')"
                show-password-on="click"
              />
            </n-form-item>
            <n-form-item :label="t('tools.aesEncryptor.mode')">
              <n-select
                v-model:value="mode"
                :options="modeOptions"
                :placeholder="t('tools.aesEncryptor.modePlaceholder')"
              />
            </n-form-item>
            <n-form-item :label="t('tools.aesEncryptor.padding')">
              <n-select
                v-model:value="padding"
                :options="paddingOptions"
                :placeholder="t('tools.aesEncryptor.paddingPlaceholder')"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="encrypt">
                {{ t('tools.aesEncryptor.encrypt') }}
              </n-button>
            </n-form-item>
            <n-form-item :label="t('tools.aesEncryptor.ciphertext')">
              <n-input
                v-model:value="ciphertext"
                type="textarea"
                :placeholder="t('tools.aesEncryptor.ciphertextPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
                readonly
              />
            </n-form-item>
          </n-form>
        </n-tab-pane>

        <!-- 解密 -->
        <n-tab-pane name="decrypt" :tab="t('tools.aesEncryptor.decrypt')">
          <n-form>
            <n-form-item :label="t('tools.aesEncryptor.ciphertext')">
              <n-input
                v-model:value="decryptCiphertext"
                type="textarea"
                :placeholder="t('tools.aesEncryptor.ciphertextPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </n-form-item>
            <n-form-item :label="t('tools.aesEncryptor.key')">
              <n-input
                v-model:value="decryptKey"
                :placeholder="t('tools.aesEncryptor.keyPlaceholder')"
                show-password-on="click"
              />
            </n-form-item>
            <n-form-item :label="t('tools.aesEncryptor.iv')">
              <n-input
                v-model:value="decryptIv"
                :placeholder="t('tools.aesEncryptor.ivPlaceholder')"
                show-password-on="click"
              />
            </n-form-item>
            <n-form-item :label="t('tools.aesEncryptor.mode')">
              <n-select
                v-model:value="decryptMode"
                :options="modeOptions"
                :placeholder="t('tools.aesEncryptor.modePlaceholder')"
              />
            </n-form-item>
            <n-form-item :label="t('tools.aesEncryptor.padding')">
              <n-select
                v-model:value="decryptPadding"
                :options="paddingOptions"
                :placeholder="t('tools.aesEncryptor.paddingPlaceholder')"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="decrypt">
                {{ t('tools.aesEncryptor.decrypt') }}
              </n-button>
            </n-form-item>
            <n-form-item :label="t('tools.aesEncryptor.plaintext')">
              <n-input
                v-model:value="decryptPlaintext"
                type="textarea"
                :placeholder="t('tools.aesEncryptor.plaintextPlaceholder')"
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
import CryptoJS from 'crypto-js';

const { t } = useI18n();
const { copy } = useClipboard();

// 加密相关
const plaintext = ref('');
const key = ref('');
const iv = ref('');
const mode = ref('CBC');
const padding = ref('PKCS7');
const ciphertext = ref('');

// 解密相关
const decryptCiphertext = ref('');
const decryptKey = ref('');
const decryptIv = ref('');
const decryptMode = ref('CBC');
const decryptPadding = ref('PKCS7');
const decryptPlaintext = ref('');

// 通用
const error = ref('');
const copySuccess = ref(false);

const modeOptions = [
  { label: 'CBC', value: 'CBC' },
  { label: 'CFB', value: 'CFB' },
  { label: 'CTR', value: 'CTR' },
  { label: 'ECB', value: 'ECB' },
  { label: 'OFB', value: 'OFB' }
];

const paddingOptions = [
  { label: 'PKCS7', value: 'PKCS7' },
  { label: 'PKCS5', value: 'PKCS5' },
  { label: 'ZeroPadding', value: 'ZeroPadding' },
  { label: 'NoPadding', value: 'NoPadding' }
];

function encrypt() {
  try {
    error.value = '';
    if (!plaintext.value || !key.value) {
      throw new Error(t('tools.aesEncryptor.inputRequired'));
    }

    const keyWordArray = CryptoJS.enc.Utf8.parse(key.value);
    const ivWordArray = iv.value ? CryptoJS.enc.Utf8.parse(iv.value) : undefined;
    const plaintextWordArray = CryptoJS.enc.Utf8.parse(plaintext.value);

    const encrypted = CryptoJS.AES.encrypt(plaintextWordArray, keyWordArray, {
      iv: ivWordArray,
      mode: CryptoJS.mode[mode.value],
      padding: CryptoJS.pad[padding.value]
    });

    ciphertext.value = encrypted.toString();
  } catch (e) {
    error.value = e.message;
  }
}

function decrypt() {
  try {
    error.value = '';
    if (!decryptCiphertext.value || !decryptKey.value) {
      throw new Error(t('tools.aesEncryptor.inputRequired'));
    }

    const keyWordArray = CryptoJS.enc.Utf8.parse(decryptKey.value);
    const ivWordArray = decryptIv.value ? CryptoJS.enc.Utf8.parse(decryptIv.value) : undefined;

    const decrypted = CryptoJS.AES.decrypt(decryptCiphertext.value, keyWordArray, {
      iv: ivWordArray,
      mode: CryptoJS.mode[decryptMode.value],
      padding: CryptoJS.pad[decryptPadding.value]
    });

    decryptPlaintext.value = decrypted.toString(CryptoJS.enc.Utf8);
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
    iv.value = '';
    ciphertext.value = '';
  } else {
    decryptCiphertext.value = '';
    decryptKey.value = '';
    decryptIv.value = '';
    decryptPlaintext.value = '';
  }
  error.value = '';
}
</script>

<style scoped>
.aes-encryptor {
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