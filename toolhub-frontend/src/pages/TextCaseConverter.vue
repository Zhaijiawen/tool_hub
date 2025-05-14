<template>
  <div class="text-case-converter">
    <n-card :title="t('tools.textCaseConverter.title')">
      <n-input
        v-model:value="input"
        type="textarea"
        :placeholder="t('tools.textCaseConverter.inputPlaceholder')"
        :autosize="{ minRows: 8, maxRows: 20 }"
      />
      <div class="btn-group">
        <n-button @click="toUpperCase">{{ t('tools.textCaseConverter.toUpperCase') }}</n-button>
        <n-button @click="toLowerCase">{{ t('tools.textCaseConverter.toLowerCase') }}</n-button>
        <n-button @click="toTitleCase">{{ t('tools.textCaseConverter.toTitleCase') }}</n-button>
        <n-button @click="copyText">{{ t('common.copy') }}</n-button>
        <n-button @click="clearText">{{ t('common.clear') }}</n-button>
      </div>
      <n-alert v-if="copySuccess" type="success" class="copy-tip">{{ t('common.copySuccess') }}</n-alert>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useClipboard } from '@vueuse/core';

const { t } = useI18n();
const input = ref('');
const copySuccess = ref(false);
const { copy } = useClipboard();

function toUpperCase() {
  input.value = input.value.toUpperCase();
}

function toLowerCase() {
  input.value = input.value.toLowerCase();
}

function toTitleCase() {
  input.value = input.value
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function copyText() {
  copy(input.value);
  copySuccess.value = true;
  setTimeout(() => (copySuccess.value = false), 1500);
}

function clearText() {
  input.value = '';
}
</script>

<style scoped>
.text-case-converter {
  max-width: 800px;
  margin: 0 auto;
}
.btn-group {
  display: flex;
  gap: 12px;
  margin: 16px 0;
}
.copy-tip {
  margin-top: 8px;
}
</style> 