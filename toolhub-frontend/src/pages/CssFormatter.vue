<template>
  <code-formatter
    :title="t('tools.cssFormatter.title')"
    language="css"
    storage-key="css"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import CodeFormatter from '../components/CodeFormatter.vue';

const { t } = useI18n();
</script> 