<template>
  <code-formatter
    :title="t('tools.pythonFormatter.title')"
    language="python"
    storage-key="python"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import CodeFormatter from '../components/CodeFormatter.vue';

const { t } = useI18n();
</script> 