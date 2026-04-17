<template>
  <n-button v-bind="buttonProps" @click="copyUrl">
    <template #icon>
      <n-icon><share-icon /></n-icon>
    </template>
    <span v-if="showText" class="button-text">{{ t('common.share.label') }}</span>
  </n-button>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { ShareSocialOutline as ShareIcon } from '@vicons/ionicons5'

const props = defineProps({
  /** 自定义分享 URL，默认使用当前页面 URL */
  url: {
    type: String,
    default: null
  },
  /** 是否在按钮上显示文字 */
  showText: {
    type: Boolean,
    default: false
  },
  /** 透传给 n-button 的属性 */
  buttonProps: {
    type: Object,
    default: () => ({})
  }
})

const { t } = useI18n()
const message = useMessage()
const route = useRoute()

const currentUrl = computed(() => {
  if (props.url) return props.url
  return window.location.origin + route.fullPath
})

async function copyUrl() {
  try {
    await navigator.clipboard.writeText(currentUrl.value)
    message.success(t('common.share.copySuccess'))
  } catch {
    message.error(t('common.copyFailed'))
  }
}
</script>

