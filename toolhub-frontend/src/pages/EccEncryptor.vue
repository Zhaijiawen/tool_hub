<template>
  <div class="ecc-encryptor">
    <n-card :title="t('tools.eccEncryptor.title')">
      <n-tabs type="line" animated>
        <!-- 密钥生成 -->
        <n-tab-pane name="generate" :tab="t('tools.eccEncryptor.generate')">
          <n-form>
            <n-form-item :label="t('tools.eccEncryptor.curve')">
              <n-select
                v-model:value="curve"
                :options="curveOptions"
                :placeholder="t('tools.eccEncryptor.curvePlaceholder')"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="generateKeys">
                {{ t('tools.eccEncryptor.generate') }}
              </n-button>
            </n-form-item>
            <n-form-item :label="t('tools.eccEncryptor.publicKey')">
              <n-input
                v-model:value="publicKey"
                type="textarea"
                :placeholder="t('tools.eccEncryptor.publicKeyPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
                readonly
              />
            </n-form-item>
            <n-form-item :label="t('tools.eccEncryptor.privateKey')">
              <n-input
                v-model:value="privateKey"
                type="textarea"
                :placeholder="t('tools.eccEncryptor.privateKeyPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
                readonly
              />
            </n-form-item>
          </n-form>
        </n-tab-pane>

        <!-- 加密 -->
        <n-tab-pane name="encrypt" :tab="t('tools.eccEncryptor.encrypt')">
          <n-form>
            <n-form-item :label="t('tools.eccEncryptor.plaintext')">
              <n-input
                v-model:value="plaintext"
                type="textarea"
                :placeholder="t('tools.eccEncryptor.plaintextPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </n-form-item>
            <n-form-item :label="t('tools.eccEncryptor.publicKey')">
              <n-input
                v-model:value="encryptPublicKey"
                type="textarea"
                :placeholder="t('tools.eccEncryptor.publicKeyPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="encrypt">
                {{ t('tools.eccEncryptor.encrypt') }}
              </n-button>
            </n-form-item>
            <n-form-item :label="t('tools.eccEncryptor.ciphertext')">
              <n-input
                v-model:value="ciphertext"
                type="textarea"
                :placeholder="t('tools.eccEncryptor.ciphertextPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
                readonly
              />
            </n-form-item>
          </n-form>
        </n-tab-pane>

        <!-- 解密 -->
        <n-tab-pane name="decrypt" :tab="t('tools.eccEncryptor.decrypt')">
          <n-form>
            <n-form-item :label="t('tools.eccEncryptor.ciphertext')">
              <n-input
                v-model:value="decryptCiphertext"
                type="textarea"
                :placeholder="t('tools.eccEncryptor.ciphertextPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </n-form-item>
            <n-form-item :label="t('tools.eccEncryptor.privateKey')">
              <n-input
                v-model:value="decryptPrivateKey"
                type="textarea"
                :placeholder="t('tools.eccEncryptor.privateKeyPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="decrypt">
                {{ t('tools.eccEncryptor.decrypt') }}
              </n-button>
            </n-form-item>
            <n-form-item :label="t('tools.eccEncryptor.plaintext')">
              <n-input
                v-model:value="decryptPlaintext"
                type="textarea"
                :placeholder="t('tools.eccEncryptor.plaintextPlaceholder')"
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
import { ec } from 'elliptic';

const { t } = useI18n();
const { copy } = useClipboard();

// 密钥生成相关
const curve = ref('secp256k1');
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

const curveOptions = [
  { label: 'secp256k1', value: 'secp256k1' },
  { label: 'p256', value: 'p256' },
  { label: 'p384', value: 'p384' },
  { label: 'p521', value: 'p521' }
];

function generateKeys() {
  try {
    error.value = '';
    const elliptic = new ec(curve.value);
    const keyPair = elliptic.genKeyPair();
    
    publicKey.value = keyPair.getPublic('hex');
    privateKey.value = keyPair.getPrivate('hex');
  } catch (e) {
    error.value = e.message;
  }
}

function encrypt() {
  try {
    error.value = '';
    if (!plaintext.value || !encryptPublicKey.value) {
      throw new Error(t('tools.eccEncryptor.inputRequired'));
    }

    const elliptic = new ec(curve.value);
    const publicKey = elliptic.keyFromPublic(encryptPublicKey.value, 'hex');
    const ephemeralKeyPair = elliptic.genKeyPair();
    
    const sharedSecret = ephemeralKeyPair.derive(publicKey.getPublic());
    const ciphertext = Buffer.from(plaintext.value).toString('hex');
    
    const result = {
      ephemeralPublicKey: ephemeralKeyPair.getPublic('hex'),
      ciphertext: ciphertext
    };

    ciphertext.value = JSON.stringify(result);
  } catch (e) {
    error.value = e.message;
  }
}

function decrypt() {
  try {
    error.value = '';
    if (!decryptCiphertext.value || !decryptPrivateKey.value) {
      throw new Error(t('tools.eccEncryptor.inputRequired'));
    }

    const elliptic = new ec(curve.value);
    const privateKey = elliptic.keyFromPrivate(decryptPrivateKey.value, 'hex');
    
    const { ephemeralPublicKey, ciphertext } = JSON.parse(decryptCiphertext.value);
    const ephemeralKey = elliptic.keyFromPublic(ephemeralPublicKey, 'hex');
    
    const sharedSecret = privateKey.derive(ephemeralKey.getPublic());
    const plaintext = Buffer.from(ciphertext, 'hex').toString();
    
    decryptPlaintext.value = plaintext;
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
    curve.value = 'secp256k1';
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
.ecc-encryptor {
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