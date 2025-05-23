<template>
  <!-- 首页容器 -->
  <div class="home">
    <!-- 欢迎卡片 -->
    <n-card title="欢迎使用 ToolHub">
      <!-- 工具分类网格布局 -->
      <n-grid :cols="3" :x-gap="16" :y-gap="16">
        <!-- 遍历工具分类 -->
        <n-grid-item v-for="category in categories" :key="category.key">
          <!-- 分类卡片 -->
          <n-card :title="t(category.title)" hoverable>
            <!-- 卡片头部额外内容：更多按钮 -->
            <template #header-extra>
              <n-button text>
                {{ t('common.more') }}
              </n-button>
            </template>
            <!-- 工具列表 -->
            <n-list>
              <!-- 遍历分类下的工具 -->
              <n-list-item v-for="tool in category.tools" :key="tool.key">
                <router-link :to="tool.path">{{ t(tool.title) }}</router-link>
              </n-list-item>
            </n-list>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script setup>
// 导入国际化功能
import { useI18n } from 'vue-i18n'

// 初始化国际化
const { t } = useI18n()

// 工具分类数据
const categories = [
  {
    key: 'format',                // 格式化工具分类
    title: 'common.format',       // 分类标题
    tools: [                      // 分类下的工具列表
      { key: 'json', title: 'format.json.title', path: '/format/json' },
      { key: 'xml', title: 'format.xml.title', path: '/format/xml' }
    ]
  },
  {
    key: 'encrypt',               // 加密工具分类
    title: 'common.encrypt',      // 分类标题
    tools: [                      // 分类下的工具列表
      { key: 'aes', title: 'encrypt.aes.title', path: '/encrypt/aes' }
    ]
  },
  {
    key: 'convert',               // 转换工具分类
    title: 'common.convert',      // 分类标题
    tools: [                      // 分类下的工具列表
      { key: 'timestamp', title: 'convert.timestamp.title', path: '/convert/timestamp' }
    ]
  }
]
</script>

<style scoped>
/* 首页容器样式 */
.home {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}
</style> 