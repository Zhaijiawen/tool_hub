<template>
  <div class="number-base-converter">
    <n-card :title="t('tools.numberBaseConverter.title')">
      <n-form>
        <n-form-item :label="t('tools.numberBaseConverter.input')">
          <n-input
            v-model:value="input"
            :placeholder="t('tools.numberBaseConverter.inputPlaceholder')"
            @update:value="convert"
          />
        </n-form-item>
        <n-form-item :label="t('tools.numberBaseConverter.fromBase')">
          <n-select
            v-model:value="fromBase"
            :options="baseOptions"
            @update:value="convert"
          />
        </n-form-item>
        <n-form-item :label="t('tools.numberBaseConverter.toBase')">
          <n-select
            v-model:value="toBase"
            :options="baseOptions"
            @update:value="convert"
          />
        </n-form-item>
        <n-form-item :label="t('tools.numberBaseConverter.result')">
          <n-input
            v-model:value="result"
            :placeholder="t('tools.numberBaseConverter.resultPlaceholder')"
            readonly
          />
        </n-form-item>
      </n-form>

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
const fromBase = ref(10);
const toBase = ref(2);
const result = ref('');
const error = ref('');
const copySuccess = ref(false);

const baseOptions = [
  { label: t('tools.numberBaseConverter.binary'), value: 2 },
  { label: t('tools.numberBaseConverter.octal'), value: 8 },
  { label: t('tools.numberBaseConverter.decimal'), value: 10 },
  { label: t('tools.numberBaseConverter.hexadecimal'), value: 16 }
];

function convert() {
  try {
    error.value = '';
    if (!input.value) {
      result.value = '';
      return;
    }

    // 验证输入是否有效
    const validInput = validateInput(input.value, fromBase.value);
    if (!validInput) {
      throw new Error(t('tools.numberBaseConverter.invalidInput'));
    }

    // 转换为十进制
    const decimal = parseInt(input.value, fromBase.value);
    
    // 从十进制转换为目标进制
    result.value = decimal.toString(toBase.value).toUpperCase();
  } catch (e) {
    error.value = e.message;
    result.value = '';
  }
}

function validateInput(input: string, base: number): boolean {
  const validChars = {
    2: /^[01]+$/,
    8: /^[0-7]+$/,
    10: /^\d+$/,
    16: /^[0-9A-Fa-f]+$/
  };

  return validChars[base].test(input);
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
.number-base-converter {
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