<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-inner">
        <h1 class="hero-title">{{ t('home.hero.title') }}</h1>
        <p class="hero-subtitle">{{ t('home.hero.subtitle') }}</p>
        <div class="hero-badges">
          <span class="badge"><n-icon size="14"><shield-icon /></n-icon>{{ t('home.features.privacy') }}</span>
          <span class="badge"><n-icon size="14"><flash-icon /></n-icon>{{ t('home.features.fast') }}</span>
          <span class="badge"><n-icon size="14"><gift-icon /></n-icon>{{ t('home.features.free') }}</span>
        </div>
      </div>
    </section>

    <!-- Tool Categories -->
    <section class="categories">
      <div v-for="cat in categories" :key="cat.key" class="category-block">
        <div class="category-header">
          <span class="category-icon">{{ cat.icon }}</span>
          <h2 class="category-title">{{ cat.label }}</h2>
          <span class="category-count">{{ cat.tools.length }} {{ t('home.toolCount') }}</span>
        </div>
        <div class="tool-grid">
          <router-link
            v-for="tool in cat.tools"
            :key="tool.path"
            :to="tool.path"
            class="tool-card"
          >
            <span class="tool-name">{{ t(tool.name) }}</span>
            <span class="tool-desc">{{ t(tool.description) }}</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Feature Highlights -->
    <section class="features">
      <h2 class="section-title">{{ t('home.usageGuide') }}</h2>
      <div class="feature-grid">
        <div class="feature-card" v-for="item in featureItems" :key="item.key">
          <div class="feature-title">{{ item.title }}</div>
          <div class="feature-desc">{{ item.desc }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ShieldCheckmarkOutline as ShieldIcon, FlashOutline as FlashIcon, GiftOutline as GiftIcon } from '@vicons/ionicons5'
import { getAllToolsSync } from '@/api/tools'
import { useSeo } from '@/composables/useSeo'

const { t, locale } = useI18n()

// SEO：首页专属元数据更新
const { updatePageMeta } = useSeo()
onMounted(() => updatePageMeta())
// 语言切换时重新更新 SEO
watch(locale, () => updatePageMeta())

// 工具列表（同步获取，避免异步白屏）
const allTools = getAllToolsSync()

// 分类配置（图标 + 顺序）
const CATEGORY_META = {
  format:  { icon: '🔧', order: 1 },
  encrypt: { icon: '🔐', order: 2 },
  convert: { icon: '🔄', order: 3 },
  image:   { icon: '🖼️', order: 4 },
  text:    { icon: '📝', order: 5 },
  other:   { icon: '⚙️', order: 6 },
}

const categories = computed(() => {
  const map = {}
  for (const tool of allTools) {
    if (!map[tool.category]) {
      map[tool.category] = []
    }
    map[tool.category].push(tool)
  }
  return Object.entries(map)
    .sort((a, b) => (CATEGORY_META[a[0]]?.order ?? 99) - (CATEGORY_META[b[0]]?.order ?? 99))
    .map(([key, toolList]) => ({
      key,
      label: t(`common.${key}`),
      icon: CATEGORY_META[key]?.icon ?? '🔩',
      tools: toolList
    }))
})

const featureItems = computed(() => [
  { key: 'quickStart',         title: t('home.guide.quickStart.title'),         desc: t('home.guide.quickStart.desc') },
  { key: 'dataSecurity',       title: t('home.guide.dataSecurity.title'),       desc: t('home.guide.dataSecurity.desc') },
  { key: 'mobileFriendly',     title: t('home.guide.mobileFriendly.title'),     desc: t('home.guide.mobileFriendly.desc') },
  { key: 'professionalDesign', title: t('home.guide.professionalDesign.title'), desc: t('home.guide.professionalDesign.desc') },
])
</script>

<style scoped>
.home-page {
  padding-bottom: 48px;
}

/* ── Hero ─────────────────────────────── */
.hero {
  padding: 48px 0 36px;
  text-align: center;
}
.hero-title {
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  font-weight: 700;
  margin: 0 0 12px;
  color: var(--text-color);
  line-height: 1.25;
}
.hero-subtitle {
  font-size: clamp(0.9rem, 2vw, 1.05rem);
  color: var(--text-color-2);
  max-width: 600px;
  margin: 0 auto 20px;
  line-height: 1.6;
}
.hero-badges {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  background: var(--code-color);
  color: var(--text-color-2);
  border: 1px solid var(--border-color);
}

/* ── Categories ───────────────────────── */
.categories {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.category-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 10px;
}
.category-icon {
  font-size: 18px;
  line-height: 1;
}
.category-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-color);
}
.category-count {
  margin-left: auto;
  font-size: 12px;
  color: var(--text-color-2);
}
.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
}
.tool-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--card-color);
  text-decoration: none;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
  cursor: pointer;
}
.tool-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 10px rgba(24, 160, 88, 0.12);
  transform: translateY(-1px);
}
.tool-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tool-desc {
  font-size: 11px;
  color: var(--text-color-2);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Features ─────────────────────────── */
.features {
  margin-top: 44px;
}
.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 18px;
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 10px;
}
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}
.feature-card {
  padding: 16px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--card-color);
}
.feature-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 6px;
}
.feature-desc {
  font-size: 12px;
  color: var(--text-color-2);
  line-height: 1.6;
}

/* ── Responsive ───────────────────────── */
@media (max-width: 640px) {
  .hero { padding: 28px 0 20px; }
  .tool-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px; }
  .feature-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 400px) {
  .tool-grid { grid-template-columns: 1fr 1fr; }
  .feature-grid { grid-template-columns: 1fr; }
}
</style>

