<template>
  <!-- 迭代标记：标识本次发布新增或升级的工具，方便用户与维护者核对迭代范围 -->
  <n-tag
    class="new-tag"
    size="tiny"
    round
    :bordered="false"
    :title="t('common.new.tip')"
  >
    <template #icon>
      <n-icon class="new-tag-icon"><sparkles-outline /></n-icon>
    </template>
    {{ t('common.new.label') }}
  </n-tag>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { SparklesOutline } from '@vicons/ionicons5'

const { t } = useI18n()
</script>

<style scoped>
.new-tag {
  background-color: var(--error-color, #d03050);
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.02em;
  vertical-align: middle;
}
.new-tag-icon {
  font-size: 12px;
  color: #fff;
}
</style>
