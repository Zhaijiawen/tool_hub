<template>
  <!-- 首页容器 -->
  <div class="home">
    <!-- 欢迎卡片 -->
    <n-card :title="t('home.welcome')">
      <!-- 网站介绍 -->
      <div class="welcome-intro">
        <p class="intro-text">
          {{ t('home.intro') }}
        </p>
        
        <div class="feature-highlights">
          <div class="highlight-item">
            <n-icon size="20" color="#18a058">
              <ShieldIcon />
            </n-icon>
            <span>{{ t('home.features.privacy') }}</span>
          </div>
          <div class="highlight-item">
            <n-icon size="20" color="#52c41a">
              <FlashIcon />
            </n-icon>
            <span>{{ t('home.features.fast') }}</span>
          </div>
          <div class="highlight-item">
            <n-icon size="20" color="#1890ff">
              <GiftIcon />
            </n-icon>
            <span>{{ t('home.features.free') }}</span>
          </div>
        </div>
      </div>

      <!-- 工具分类网格布局（响应式） -->
      <n-grid 
        :cols="gridCols" 
        :x-gap="16" 
        :y-gap="16"
        style="margin-top: 30px;"
      >
        <!-- 遍历工具分类 -->
        <n-grid-item v-for="category in categories" :key="category.key">
          <!-- 分类卡片 -->
          <n-card :title="t(`common.${category.key}`)" hoverable>
            <!-- 卡片头部额外内容：更多按钮 -->
            <template #header-extra>
              <n-button text @click="navigateToCategory(category.key)">
                {{ t('common.more') }}
              </n-button>
            </template>
            <!-- 工具列表 -->
            <n-list>
              <!-- 只展示前6个工具 -->
              <n-list-item v-for="tool in category.tools.slice(0, 6)" :key="tool.path">
                <router-link :to="tool.path">{{ t(tool.name) }}</router-link>
              </n-list-item>
            </n-list>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>

    <!-- 使用指南卡片 -->
    <n-card :title="t('home.usageGuide')" style="margin-top: 20px;">
      <div class="guide-content">
        <div class="guide-grid">
          <div class="guide-item">
            <h4>{{ t('home.guide.quickStart.title') }}</h4>
            <p>{{ t('home.guide.quickStart.desc') }}</p>
          </div>
          <div class="guide-item">
            <h4>{{ t('home.guide.dataSecurity.title') }}</h4>
            <p>{{ t('home.guide.dataSecurity.desc') }}</p>
          </div>
          <div class="guide-item">
            <h4>{{ t('home.guide.mobileFriendly.title') }}</h4>
            <p>{{ t('home.guide.mobileFriendly.desc') }}</p>
          </div>
          <div class="guide-item">
            <h4>{{ t('home.guide.professionalDesign.title') }}</h4>
            <p>{{ t('home.guide.professionalDesign.desc') }}</p>
          </div>
        </div>
      </div>
    </n-card>

    <!-- 最新文章卡片 -->
    <n-card style="margin-top: 20px;">
      <template #header>
        <div class="articles-header">
          <span>{{ t('home.devTips') }}</span>
          <router-link to="/blog" class="view-all-link">
            {{ t('home.viewAll') }} →
          </router-link>
        </div>
      </template>
      
      <div class="articles-preview">
        <div class="article-item" v-for="article in featuredArticles" :key="article.id">
          <div class="article-icon">
            <n-icon size="16" :color="article.iconColor">
              <component :is="article.icon" />
            </n-icon>
          </div>
          <div class="article-content">
            <h4>{{ article.title }}</h4>
            <p>{{ article.summary }}</p>
            <div class="article-tags">
              <n-tag v-for="tag in article.tags.slice(0, 2)" :key="tag" size="small" round>
                {{ tag }}
              </n-tag>
            </div>
          </div>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { getAllTools } from '@/api/tools'
import { 
  ShieldCheckmarkOutline as ShieldIcon,
  FlashOutline as FlashIcon,
  GiftOutline as GiftIcon,
  CodeOutline as CodeIcon,
  LockClosedOutline as LockIcon,
  TimeOutline as TimeIcon,
  DocumentTextOutline as DocIcon
} from '@vicons/ionicons5'

// 初始化国际化
const { t, locale } = useI18n()
const router = useRouter()

// 工具分类数据
const categories = ref([])

// 响应式网格列数
const gridCols = ref(3)

// 精选文章数据
const featuredArticles = computed(() => [
  {
    id: 1,
    title: t('home.featuredArticles.jsonAdvanced.title'),
    summary: t('home.featuredArticles.jsonAdvanced.summary'),
    tags: locale.value === 'zh-CN' ? ['JSON', '格式化'] : ['JSON', 'Formatting'],
    icon: CodeIcon,
    iconColor: '#18a058'
  },
  {
    id: 2,
    title: t('home.featuredArticles.base64Guide.title'),
    summary: t('home.featuredArticles.base64Guide.summary'),
    tags: locale.value === 'zh-CN' ? ['Base64', '编码'] : ['Base64', 'Encoding'],
    icon: LockIcon,
    iconColor: '#f39c12'
  },
  {
    id: 3,
    title: t('home.featuredArticles.timestampScenarios.title'),
    summary: t('home.featuredArticles.timestampScenarios.summary'),
    tags: locale.value === 'zh-CN' ? ['时间戳', '日期'] : ['Timestamp', 'Date'],
    icon: TimeIcon,
    iconColor: '#3498db'
  }
])

// 更新网格列数的函数
const updateGridCols = () => {
  const width = window.innerWidth
  if (width < 640) {
    gridCols.value = 1  // 小屏幕：1列
  } else if (width < 1024) {
    gridCols.value = 2  // 中等屏幕：2列
  } else {
    gridCols.value = 3  // 大屏幕：3列
  }
}

// 获取工具列表
const fetchTools = async () => {
  try {
    const tools = await getAllTools(locale.value)
    
    // 按分类组织工具
    const toolsByCategory = tools.reduce((acc, tool) => {
      const category = tool.category
      if (!acc[category]) {
        acc[category] = {
          key: category,
          tools: []
        }
      }
      acc[category].tools.push({
        name: tool.name,
        path: tool.path
      })
      return acc
    }, {})

    categories.value = Object.values(toolsByCategory)
  } catch (error) {
    console.error('Failed to fetch tools:', error)
  }
}

// 导航到分类页面
const navigateToCategory = (category) => {
  router.push(`/${category}`)
}

// 组件挂载时获取工具列表和初始化响应式布局
onMounted(() => {
  fetchTools()
  updateGridCols()  // 初始化网格列数
  window.addEventListener('resize', updateGridCols)  // 监听窗口大小变化
})

// 组件卸载时清理监听器
onUnmounted(() => {
  window.removeEventListener('resize', updateGridCols)
})
</script>

<style scoped>
/* 首页容器样式 */
.home {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .home {
    margin: 10px auto;
    padding: 0 12px;
  }
  
  /* 确保卡片标题不换行 */
  :deep(.n-card-header__main) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }
  
  /* 优化卡片内间距 */
  :deep(.n-card) {
    margin-bottom: 12px;
  }
  
  /* 确保工具链接不换行 */
  :deep(.n-list-item) {
    padding: 8px 0;
  }
  
  :deep(.n-list-item a) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    width: 100%;
  }
}

/* 小屏幕进一步优化 */
@media (max-width: 480px) {
  .home {
    padding: 0 8px;
    margin: 8px auto;
  }
  
  /* 减少卡片内边距 */
  :deep(.n-card-header) {
    padding: 16px 12px 8px 12px;
  }
  
  :deep(.n-card__content) {
    padding: 8px 12px 16px 12px;
  }
}

/* 欢迎介绍样式 */
.welcome-intro {
  margin-bottom: 30px;
}

.intro-text {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 20px;
  text-align: center;
}

.feature-highlights {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #555;
}

/* 使用指南样式 */
.guide-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.guide-item {
  padding: 20px;
  border-radius: 8px;
  background: linear-gradient(135deg, #f6f8fc 0%, #ffffff 100%);
  border: 1px solid #e1e5e9;
}

.guide-item h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
}

.guide-item p {
  margin: 0;
  color: #666;
  line-height: 1.6;
  font-size: 14px;
}

/* 文章预览样式 */
.articles-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-all-link {
  color: #18a058;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.view-all-link:hover {
  text-decoration: underline;
}

.articles-preview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.article-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
}

.article-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.article-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: rgba(24, 160, 88, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.article-content h4 {
  margin: 0 0 8px 0;
  font-size: 15px;
  color: #333;
  line-height: 1.3;
}

.article-content p {
  margin: 0 0 12px 0;
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.article-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .feature-highlights {
    gap: 15px;
    justify-content: space-around;
  }
  
  .highlight-item {
    font-size: 13px;
  }
  
  .guide-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .articles-preview {
    grid-template-columns: 1fr;
  }
  
  .articles-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .feature-highlights {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
}
</style>