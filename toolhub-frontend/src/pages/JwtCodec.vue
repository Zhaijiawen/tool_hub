<template>
  <div class="jwt-codec">
    <n-card :title="t('tools.jwtCodec.title')">
      <n-tabs type="line" animated>
        <!-- 编码 -->
        <n-tab-pane name="encode" :tab="t('tools.jwtCodec.encode')">
          <n-form>
            <n-form-item :label="t('tools.jwtCodec.header')">
              <n-input
                v-model:value="header"
                type="textarea"
                :placeholder="t('tools.jwtCodec.headerPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </n-form-item>
            <n-form-item :label="t('tools.jwtCodec.payload')">
              <n-input
                v-model:value="payload"
                type="textarea"
                :placeholder="t('tools.jwtCodec.payloadPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </n-form-item>
            <n-form-item :label="t('tools.jwtCodec.secret')">
              <n-input
                v-model:value="secret"
                type="textarea"
                :placeholder="t('tools.jwtCodec.secretPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="encode">
                {{ t('tools.jwtCodec.encode') }}
              </n-button>
            </n-form-item>
            <n-form-item :label="t('tools.jwtCodec.token')">
              <n-input
                v-model:value="token"
                type="textarea"
                :placeholder="t('tools.jwtCodec.tokenPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
                readonly
              />
            </n-form-item>
          </n-form>
        </n-tab-pane>

        <!-- 解码 -->
        <n-tab-pane name="decode" :tab="t('tools.jwtCodec.decode')">
          <n-form>
            <n-form-item :label="t('tools.jwtCodec.token')">
              <n-input
                v-model:value="decodeToken"
                type="textarea"
                :placeholder="t('tools.jwtCodec.tokenPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="decode">
                {{ t('tools.jwtCodec.decode') }}
              </n-button>
            </n-form-item>
            <n-form-item :label="t('tools.jwtCodec.header')">
              <n-input
                v-model:value="decodedHeader"
                type="textarea"
                :placeholder="t('tools.jwtCodec.headerPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
                readonly
              />
            </n-form-item>
            <n-form-item :label="t('tools.jwtCodec.payload')">
              <n-input
                v-model:value="decodedPayload"
                type="textarea"
                :placeholder="t('tools.jwtCodec.payloadPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
                readonly
              />
            </n-form-item>
            <n-form-item :label="t('tools.jwtCodec.verify')">
              <n-input
                v-model:value="verifyResult"
                type="textarea"
                :placeholder="t('tools.jwtCodec.verifyPlaceholder')"
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
import * as jwt from 'jsonwebtoken';

const { t } = useI18n();
const { copy } = useClipboard();

// 编码相关
const header = ref('');
const payload = ref('');
const secret = ref('');
const token = ref('');

// 解码相关
const decodeToken = ref('');
const decodedHeader = ref('');
const decodedPayload = ref('');
const verifyResult = ref('');

// 通用
const error = ref('');
const copySuccess = ref(false);

function encode() {
  try {
    error.value = '';
    if (!header.value || !payload.value || !secret.value) {
      throw new Error(t('tools.jwtCodec.inputRequired'));
    }

    const headerObj = JSON.parse(header.value);
    const payloadObj = JSON.parse(payload.value);

    token.value = jwt.sign(payloadObj, secret.value, {
      algorithm: headerObj.alg,
      expiresIn: payloadObj.exp ? undefined : '1h',
      notBefore: payloadObj.nbf,
      audience: payloadObj.aud,
      issuer: payloadObj.iss,
      jwtid: payloadObj.jti,
      subject: payloadObj.sub,
      noTimestamp: !payloadObj.iat,
      header: headerObj
    });
  } catch (e) {
    error.value = e.message;
  }
}

function decode() {
  try {
    error.value = '';
    if (!decodeToken.value) {
      throw new Error(t('tools.jwtCodec.inputRequired'));
    }

    const decoded = jwt.decode(decodeToken.value, { complete: true });
    if (!decoded) {
      throw new Error(t('tools.jwtCodec.invalidToken'));
    }

    decodedHeader.value = JSON.stringify(decoded.header, null, 2);
    decodedPayload.value = JSON.stringify(decoded.payload, null, 2);

    try {
      jwt.verify(decodeToken.value, secret.value);
      verifyResult.value = t('tools.jwtCodec.verifySuccess');
    } catch (e) {
      verifyResult.value = t('tools.jwtCodec.verifyFailed');
    }
  } catch (e) {
    error.value = e.message;
  }
}

function copyResult() {
  const activeTab = document.querySelector('.n-tabs-tab--active')?.getAttribute('data-name');
  let textToCopy = '';

  if (activeTab === 'encode') {
    textToCopy = token.value;
  } else {
    textToCopy = `${decodedHeader.value}\n\n${decodedPayload.value}`;
  }

  if (textToCopy) {
    copy(textToCopy);
    copySuccess.value = true;
    setTimeout(() => (copySuccess.value = false), 1500);
  }
}

function clearInput() {
  const activeTab = document.querySelector('.n-tabs-tab--active')?.getAttribute('data-name');
  
  if (activeTab === 'encode') {
    header.value = '';
    payload.value = '';
    secret.value = '';
    token.value = '';
  } else {
    decodeToken.value = '';
    decodedHeader.value = '';
    decodedPayload.value = '';
    verifyResult.value = '';
  }
  error.value = '';
}
</script>

<style scoped>
.jwt-codec {
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