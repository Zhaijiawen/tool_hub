<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-inner">
        <h1 class="hero-title">{{ t('home.hero.title') }}</h1>
        <p class="hero-subtitle">{{ t('home.hero.subtitle') }}</p>
        <div class="hero-badges">
          <span class="badge"><n-icon size="14"><ShieldIcon /></n-icon>{{ t('home.features.privacy') }}</span>
          <span class="badge"><n-icon size="14"><FlashIcon /></n-icon>{{ t('home.features.fast') }}</span>
          <span class="badge"><n-icon size="14"><GiftIcon /></n-icon>{{ t('home.features.free') }}</span>
        </div>
        <!-- 统计数据 -->
        <div class="hero-stats">
          <div class="hero-stat-item" v-for="s in heroStats" :key="s.label">
            <span class="hero-stat-num">{{ s.value }}</span>
            <span class="hero-stat-label">{{ s.label }}</span>
          </div>
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
            :class="['tool-card', `tool-card--${tool.category}`]"
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
          <div class="feature-icon">
            <n-icon size="22"><component :is="item.icon" /></n-icon>
          </div>
          <div class="feature-title">{{ item.title }}</div>
          <div class="feature-desc">{{ item.desc }}</div>
        </div>
      </div>
    </section>

    <!-- Why Choose ToolHub - 原创内容区块 -->
    <section class="why-us">
      <h2 class="section-title">{{ t('home.whyUs.title') }}</h2>
      <p class="why-us-desc">{{ t('home.whyUs.desc') }}</p>
      <div class="why-us-grid">
        <div class="why-us-card" v-for="(item, index) in whyUsItems" :key="index">
          <div class="why-us-card-title">{{ item.title }}</div>
          <div class="why-us-card-desc">{{ item.desc }}</div>
        </div>
      </div>
    </section>

    <!-- Tools Introduction - 工具分类详细说明 -->
    <section class="tools-intro">
      <h2 class="section-title">{{ t('home.toolsIntro.title') }}</h2>
      <p class="tools-intro-desc">{{ t('home.toolsIntro.desc') }}</p>
      <div class="tools-intro-list">
        <div class="tools-intro-item" v-for="(cat, index) in toolsIntroCategories" :key="index">
          <span class="tools-intro-name">{{ cat.name }}</span>
          <span class="tools-intro-sep">—</span>
          <span class="tools-intro-text">{{ cat.desc }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  ShieldCheckmarkOutline as ShieldIcon,
  FlashOutline as FlashIcon,
  GiftOutline as GiftIcon,
  RocketOutline,
  LockClosedOutline,
  PhonePortraitOutline,
  ConstructOutline
} from '@vicons/ionicons5'
import { getAllToolsSync } from '@/api/tools'
import { useSeo } from '@/composables/useSeo'

const { t, tm, locale } = useI18n()

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
  custom:  { icon: '🛠️', order: 7 },
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

const heroStats = computed(() => [
  { value: allTools.length, label: t('home.hero.toolsCount') },
  { value: categories.value.length, label: t('home.hero.categoriesCount') },
  { value: t('home.hero.localFirst'), label: '' },
])

const featureItems = computed(() => [
  { key: 'quickStart',         icon: RocketOutline,          title: t('home.guide.quickStart.title'),         desc: t('home.guide.quickStart.desc') },
  { key: 'dataSecurity',       icon: LockClosedOutline,       title: t('home.guide.dataSecurity.title'),       desc: t('home.guide.dataSecurity.desc') },
  { key: 'mobileFriendly',     icon: PhonePortraitOutline,    title: t('home.guide.mobileFriendly.title'),     desc: t('home.guide.mobileFriendly.desc') },
  { key: 'professionalDesign', icon: ConstructOutline,        title: t('home.guide.professionalDesign.title'), desc: t('home.guide.professionalDesign.desc') },
])

const whyUsItems = computed(() => tm('home.whyUs.items'))

const toolsIntroCategories = computed(() => tm('home.toolsIntro.categories'))
</script>

<style scoped>
.home-page {
  padding-bottom: 48px;
}

/* ── Hero ─────────────────────────────── */
.hero {
  padding: 56px 0 40px;
  text-align: center;
  background: linear-gradient(
    180deg,
    rgba(24, 160, 88, 0.04) 0%,
    transparent 100%
  );
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
/* Hero 统计数字 */
.hero-stats {
  display: flex;
  justify-content: center;
  gap: 36px;
  flex-wrap: wrap;
  margin-top: 18px;
}
.hero-stat-item {
  text-align: center;
}
.hero-stat-num {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1.2;
}
.hero-stat-label {
  font-size: 12px;
  color: var(--text-color-2);
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

.category-block:nth-child(even) {
  background: var(--code-color);
  border-radius: 12px;
  padding: 16px;
  margin: 0 -12px;
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
  border-left: 3px solid transparent;
  background: var(--card-color);
  box-shadow: var(--shadow-sm);
  text-decoration: none;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
  cursor: pointer;
}

/* Category-colored left borders */
.tool-card--format  { border-left-color: #18a058; }
.tool-card--encrypt { border-left-color: #f0a020; }
.tool-card--convert { border-left-color: #2080f0; }
.tool-card--image   { border-left-color: #d03050; }
.tool-card--text    { border-left-color: #7c3aed; }
.tool-card--other   { border-left-color: #ea580c; }
.tool-card--custom  { border-left-color: #0891b2; }

.tool-card:hover {
  border-top-color: var(--primary-color);
  border-right-color: var(--primary-color);
  border-bottom-color: var(--primary-color);
  box-shadow: var(--shadow-primary);
  transform: translateY(-2px);
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
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.2s ease, transform 0.15s ease;
}

.feature-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--code-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: var(--primary-color);
}

.feature-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
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

/* ── Why Us ───────────────────────────── */
.why-us {
  margin-top: 44px;
  background: var(--code-color);
  border-radius: 12px;
  padding: 32px 24px;
}

.why-us .section-title {
  border-bottom: none;
}
.why-us-desc {
  font-size: 13px;
  color: var(--text-color-2);
  line-height: 1.7;
  margin: 0 0 18px;
}
.why-us-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}
.why-us-card {
  padding: 16px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--card-color);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.2s ease, transform 0.15s ease;
}

.why-us-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}
.why-us-card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 6px;
}
.why-us-card-desc {
  font-size: 12px;
  color: var(--text-color-2);
  line-height: 1.6;
}

/* ── Tools Intro ──────────────────────── */
.tools-intro {
  margin-top: 44px;
}
.tools-intro-desc {
  font-size: 13px;
  color: var(--text-color-2);
  line-height: 1.7;
  margin: 0 0 14px;
}
.tools-intro-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.tools-intro-item {
  display: flex;
  gap: 8px;
  align-items: baseline;
  font-size: 13px;
  line-height: 1.6;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--card-color);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.2s ease, transform 0.15s ease;
}

.tools-intro-item:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.tools-intro-name {
  font-weight: 600;
  color: var(--text-color);
  white-space: nowrap;
  flex-shrink: 0;
}
.tools-intro-sep {
  color: var(--text-color-2);
  flex-shrink: 0;
}
.tools-intro-text {
  color: var(--text-color-2);
}

/* ── Responsive ───────────────────────── */
@media (max-width: 640px) {
  .hero { padding: 28px 0 20px; }
  .hero-stats { gap: 20px; }
  .hero-stat-num { font-size: 1.2rem; }
  .tool-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px; }
  .feature-grid { grid-template-columns: 1fr 1fr; }
  .category-block:nth-child(even) { padding: 12px; margin: 0 -8px; }
  .why-us { padding: 20px 16px; }
}
@media (max-width: 400px) {
  .tool-grid { grid-template-columns: 1fr 1fr; }
  .feature-grid { grid-template-columns: 1fr; }
}
</style>

