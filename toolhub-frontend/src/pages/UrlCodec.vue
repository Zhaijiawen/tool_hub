<template>
  <div class="url-codec">
    <n-card :title="t('tools.urlCodec.title')">
      <n-tabs type="line" animated>
        <!-- 编码 -->
        <n-tab-pane name="encode" :tab="t('tools.urlCodec.encode')">
          <n-form>
            <n-form-item :label="t('tools.urlCodec.input')">
              <n-input
                v-model:value="input"
                type="textarea"
                :placeholder="t('tools.urlCodec.inputPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="encode">
                {{ t('tools.urlCodec.encode') }}
              </n-button>
            </n-form-item>
            <n-form-item :label="t('tools.urlCodec.result')">
              <n-input
                v-model:value="result"
                type="textarea"
                :placeholder="t('tools.urlCodec.resultPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
                readonly
              />
            </n-form-item>
          </n-form>
        </n-tab-pane>

        <!-- 解码 -->
        <n-tab-pane name="decode" :tab="t('tools.urlCodec.decode')">
          <n-form>
            <n-form-item :label="t('tools.urlCodec.input')">
              <n-input
                v-model:value="input"
                type="textarea"
                :placeholder="t('tools.urlCodec.inputPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="decode">
                {{ t('tools.urlCodec.decode') }}
              </n-button>
            </n-form-item>
            <n-form-item :label="t('tools.urlCodec.result')">
              <n-input
                v-model:value="result"
                type="textarea"
                :placeholder="t('tools.urlCodec.resultPlaceholder')"
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

const { t } = useI18n();
const { copy } = useClipboard();

const input = ref('');
const result = ref('');
const error = ref('');
const copySuccess = ref(false);

function encode() {
  try {
    error.value = '';
    if (!input.value) {
      throw new Error(t('tools.urlCodec.inputRequired'));
    }
    result.value = encodeURIComponent(input.value);
  } catch (e) {
    error.value = e.message;
  }
}

function decode() {
  try {
    error.value = '';
    if (!input.value) {
      throw new Error(t('tools.urlCodec.inputRequired'));
    }
    result.value = decodeURIComponent(input.value);
  } catch (e) {
    error.value = t('tools.urlCodec.invalidInput');
  }
}

function copyResult() {
  if (result.value) {
    copy(result.value);
    copySuccess.value = true;
    setTimeout(() => (copySuccess.value = false), 1500);
  }
}

function clearInput() {
  input.value = '';
  result.value = '';
  error.value = '';
}
</script>

<style scoped>
.url-codec {
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