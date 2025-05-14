<template>
  <code-formatter
    :title="t('tools.rubyFormatter.title')"
    language="ruby"
    storage-key="ruby"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import CodeFormatter from '../components/CodeFormatter.vue';

const { t } = useI18n();
</script> 