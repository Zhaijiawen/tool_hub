<template>
  <!-- WASM 标识：标记该工具由 WebAssembly 本地加速（首次使用需下载） -->
  <n-tag
    class="wasm-tag"
    size="tiny"
    round
    :bordered="false"
    :title="t('common.wasm.tip')"
  >
    <template #icon>
      <n-icon class="wasm-tag-icon"><cube-outline /></n-icon>
    </template>
    {{ t('common.wasm.label') }}
  </n-tag>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { CubeOutline } from '@vicons/ionicons5'

const { t } = useI18n()
</script>

<style scoped>
.wasm-tag {
  background-color: var(--primary-color);
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.02em;
  vertical-align: middle;
}
.wasm-tag-icon {
  font-size: 12px;
  color: #fff;
}
</style>
