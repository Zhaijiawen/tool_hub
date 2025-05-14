<template>
  <div class="char-converter">
    <n-card :title="t('tools.charConverter.title')">
      <n-tabs type="line" animated>
        <!-- ASCII 转 Unicode -->
        <n-tab-pane :name="1" :tab="t('tools.charConverter.asciiToUnicode')">
          <n-form>
            <n-form-item :label="t('tools.charConverter.input')">
              <n-input
                v-model:value="asciiInput"
                :placeholder="t('tools.charConverter.asciiPlaceholder')"
                @update:value="convertAsciiToUnicode"
              />
            </n-form-item>
            <n-form-item :label="t('tools.charConverter.result')">
              <n-input
                v-model:value="asciiResult"
                :placeholder="t('tools.charConverter.resultPlaceholder')"
                readonly
              />
            </n-form-item>
          </n-form>
          <div class="btn-group">
            <n-button @click="copyAsciiResult">{{ t('common.copy') }}</n-button>
            <n-button @click="clearAsciiInput">{{ t('common.clear') }}</n-button>
          </div>
        </n-tab-pane>

        <!-- Unicode 转 ASCII -->
        <n-tab-pane :name="2" :tab="t('tools.charConverter.unicodeToAscii')">
          <n-form>
            <n-form-item :label="t('tools.charConverter.input')">
              <n-input
                v-model:value="unicodeInput"
                :placeholder="t('tools.charConverter.unicodePlaceholder')"
                @update:value="convertUnicodeToAscii"
              />
            </n-form-item>
            <n-form-item :label="t('tools.charConverter.result')">
              <n-input
                v-model:value="unicodeResult"
                :placeholder="t('tools.charConverter.resultPlaceholder')"
                readonly
              />
            </n-form-item>
          </n-form>
          <div class="btn-group">
            <n-button @click="copyUnicodeResult">{{ t('common.copy') }}</n-button>
            <n-button @click="clearUnicodeInput">{{ t('common.clear') }}</n-button>
          </div>
        </n-tab-pane>
      </n-tabs>

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

const asciiInput = ref('');
const asciiResult = ref('');
const unicodeInput = ref('');
const unicodeResult = ref('');
const error = ref('');
const copySuccess = ref(false);

function convertAsciiToUnicode() {
  try {
    error.value = '';
    if (!asciiInput.value) {
      asciiResult.value = '';
      return;
    }

    const result = asciiInput.value
      .split('')
      .map(char => {
        const code = char.charCodeAt(0);
        return `U+${code.toString(16).toUpperCase().padStart(4, '0')}`;
      })
      .join(' ');

    asciiResult.value = result;
  } catch (e) {
    error.value = e.message;
    asciiResult.value = '';
  }
}

function convertUnicodeToAscii() {
  try {
    error.value = '';
    if (!unicodeInput.value) {
      unicodeResult.value = '';
      return;
    }

    const unicodeCodes = unicodeInput.value.match(/U\+[0-9A-Fa-f]{4}/g);
    if (!unicodeCodes) {
      throw new Error(t('tools.charConverter.invalidUnicode'));
    }

    const result = unicodeCodes
      .map(code => {
        const hex = code.substring(2);
        const charCode = parseInt(hex, 16);
        return String.fromCharCode(charCode);
      })
      .join('');

    unicodeResult.value = result;
  } catch (e) {
    error.value = e.message;
    unicodeResult.value = '';
  }
}

function copyAsciiResult() {
  if (asciiResult.value) {
    copy(asciiResult.value);
    copySuccess.value = true;
    setTimeout(() => (copySuccess.value = false), 1500);
  }
}

function copyUnicodeResult() {
  if (unicodeResult.value) {
    copy(unicodeResult.value);
    copySuccess.value = true;
    setTimeout(() => (copySuccess.value = false), 1500);
  }
}

function clearAsciiInput() {
  asciiInput.value = '';
  asciiResult.value = '';
  error.value = '';
}

function clearUnicodeInput() {
  unicodeInput.value = '';
  unicodeResult.value = '';
  error.value = '';
}
</script>

<style scoped>
.char-converter {
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