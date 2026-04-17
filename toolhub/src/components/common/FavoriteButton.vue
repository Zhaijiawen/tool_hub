<template>
  <n-button
    v-bind="buttonProps"
    :type="favorited ? 'warning' : 'default'"
    @click.stop="handleToggle"
    :title="favorited ? t('common.favorites.remove') : t('common.favorites.add')"
  >
    <template #icon>
      <n-icon>
        <star-filled-icon v-if="favorited" />
        <star-icon v-else />
      </n-icon>
    </template>
    <span v-if="showText" class="button-text">
      {{ favorited ? t('common.favorites.remove') : t('common.favorites.add') }}
    </span>
  </n-button>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { StarOutline as StarIcon, Star as StarFilledIcon } from '@vicons/ionicons5'
import { useFavorites } from '@/composables/useFavorites'

const props = defineProps({
  /** 工具路由路径，默认取当前路由 */
  toolPath: {
    type: String,
    default: null
  },
  /** 工具名称，用于显示在收藏列表 */
  toolName: {
    type: String,
    default: ''
  },
  /** 工具分类 */
  toolCategory: {
    type: String,
    default: ''
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
const { isFavorited, toggleFavorite } = useFavorites()

// 实际使用的路径（优先 props，否则取当前路由）
const path = computed(() => props.toolPath || route.path)

const favorited = computed(() => isFavorited(path.value))

function handleToggle() {
  const wasAlreadyFavorited = favorited.value
  toggleFavorite({
    path: path.value,
    name: props.toolName || document.title,
    category: props.toolCategory
  })
  if (wasAlreadyFavorited) {
    message.success(t('common.favorites.removeSuccess'))
  } else {
    message.success(t('common.favorites.addSuccess'))
  }
}
</script>

<style scoped>
.button-text {
  transition: all 0.2s ease;
}
</style>

