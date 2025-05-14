<template>
  <code-formatter
    :title="t('tools.rustFormatter.title')"
    language="rust"
    storage-key="rust"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import CodeFormatter from '../components/CodeFormatter.vue';

const { t } = useI18n();
</script> 