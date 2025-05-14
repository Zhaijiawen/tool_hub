<template>
  <div class="text-space-handler">
    <n-card :title="t('tools.textSpaceHandler.title')">
      <n-input
        v-model:value="input"
        type="textarea"
        :placeholder="t('tools.textSpaceHandler.inputPlaceholder')"
        :autosize="{ minRows: 8, maxRows: 20 }"
      />
      <div class="btn-group">
        <n-button @click="trimSpaces">{{ t('tools.textSpaceHandler.trim') }}</n-button>
        <n-button @click="compressSpaces">{{ t('tools.textSpaceHandler.compress') }}</n-button>
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

function trimSpaces() {
  input.value = input.value.trim();
}

function compressSpaces() {
  input.value = input.value.replace(/\s+/g, ' ');
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
.text-space-handler {
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