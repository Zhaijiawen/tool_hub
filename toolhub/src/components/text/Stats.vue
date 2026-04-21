<template>
  <div class="text-stats">
    <n-card :title="t('text.stats.title')" :bordered="false">
      <n-space vertical size="large">

        <!-- 输入区 -->
        <n-input
          v-model:value="inputText"
          type="textarea"
          :placeholder="t('text.stats.placeholder')"
          :rows="8"
          @input="analyze"
        />

        <!-- 统计卡片网格 -->
        <div v-if="inputText" class="stats-grid">
          <div class="stat-card" v-for="stat in mainStats" :key="stat.key">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>

        <!-- Tab 区（词频 / 字符分布） -->
        <n-tabs v-if="inputText" type="line" animated>
          <!-- 词频统计 -->
          <n-tab-pane name="freq" :tab="t('text.stats.tabFreq')">
            <div v-if="wordFreqList.length === 0" class="empty-hint">
              <n-text depth="3">{{ t('text.stats.noWords') }}</n-text>
            </div>
            <div v-else class="freq-list">
              <div v-for="item in wordFreqList" :key="item.word" class="freq-item">
                <span class="freq-word">{{ item.word }}</span>
                <n-progress
                  type="line"
                  :percentage="item.percent"
                  :show-indicator="false"
                  style="flex:1; margin: 0 10px"
                  :height="10"
                />
                <span class="freq-count">{{ item.count }}</span>
              </div>
            </div>
          </n-tab-pane>

          <!-- 字符分布 -->
          <n-tab-pane name="dist" :tab="t('text.stats.tabDist')">
            <div class="dist-list">
              <div v-for="item in charDistList" :key="item.key" class="dist-item">
                <span class="dist-label">{{ item.label }}</span>
                <n-progress
                  type="line"
                  :percentage="item.percent"
                  :show-indicator="false"
                  style="flex:1; margin: 0 10px"
                  :height="12"
                />
                <span class="dist-info">{{ item.count }} ({{ item.percent }}%)</span>
              </div>
            </div>
          </n-tab-pane>
        </n-tabs>

        <!-- 操作 -->
        <n-space v-if="inputText">
          <n-button @click="clearAll">{{ t('common.clear') }}</n-button>
        </n-space>

        <!-- 使用说明 -->
        <n-alert type="info" :title="t('text.stats.infoTitle')">
          <div>{{ t('text.stats.infoContent') }}</div>
        </n-alert>

      </n-space>
    </n-card>
  <TutorialAndDocs toolKey="textStats" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
const { t } = useI18n()

const inputText = ref('')

// ── 核心统计 ─────────────────────────────────────
const stats = ref({
  charTotal: 0,
  charNoSpace: 0,
  wordCount: 0,
  lineCount: 0,
  paraCount: 0,
  byteSize: 0,
  chineseCount: 0,
  englishCount: 0,
  digitCount: 0,
  sentenceCount: 0,
  readMinutes: 0
})

const analyze = () => {
  const text = inputText.value
  if (!text) {
    stats.value = { charTotal: 0, charNoSpace: 0, wordCount: 0, lineCount: 0, paraCount: 0, byteSize: 0, chineseCount: 0, englishCount: 0, digitCount: 0, sentenceCount: 0, readMinutes: 0 }
    return
  }

  const charTotal    = text.length
  const charNoSpace  = text.replace(/\s/g, '').length
  const lineCount    = text.split('\n').length
  const paraCount    = text.split(/\n\s*\n/).filter(p => p.trim()).length || (text.trim() ? 1 : 0)
  const byteSize     = new TextEncoder().encode(text).length
  const chineseCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishCount = (text.match(/[a-zA-Z]/g) || []).length
  const digitCount   = (text.match(/[0-9]/g) || []).length
  const sentenceCount = (text.match(/[.!?。！？]+/g) || []).length || (text.trim() ? 1 : 0)
  const wordCount    = (text.match(/\b[a-zA-Z'-]+\b/g) || []).length + chineseCount
  const readMinutes  = Math.max(1, Math.round(chineseCount / 500 + (wordCount - chineseCount) / 200))

  stats.value = { charTotal, charNoSpace, wordCount, lineCount, paraCount, byteSize, chineseCount, englishCount, digitCount, sentenceCount, readMinutes }
}

// ── 统计卡片 ─────────────────────────────────────
const mainStats = computed(() => [
  { key: 'charTotal',    value: stats.value.charTotal,    label: t('text.stats.charTotal') },
  { key: 'charNoSpace',  value: stats.value.charNoSpace,  label: t('text.stats.charNoSpace') },
  { key: 'wordCount',    value: stats.value.wordCount,    label: t('text.stats.wordCount') },
  { key: 'lineCount',    value: stats.value.lineCount,    label: t('text.stats.lineCount') },
  { key: 'paraCount',    value: stats.value.paraCount,    label: t('text.stats.paraCount') },
  { key: 'byteSize',     value: formatBytes(stats.value.byteSize), label: t('text.stats.byteSize') },
  { key: 'chineseCount', value: stats.value.chineseCount, label: t('text.stats.chineseCount') },
  { key: 'englishCount', value: stats.value.englishCount, label: t('text.stats.englishCount') },
  { key: 'digitCount',   value: stats.value.digitCount,   label: t('text.stats.digitCount') },
  { key: 'sentenceCount',value: stats.value.sentenceCount,label: t('text.stats.sentenceCount') },
  { key: 'readMinutes',  value: `~${stats.value.readMinutes} min`, label: t('text.stats.readMinutes') }
])

const formatBytes = (b) => {
  if (b < 1024) return b + ' B'
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB'
  return (b / 1024 / 1024).toFixed(2) + ' MB'
}

// ── 词频统计 ─────────────────────────────────────
const wordFreqList = computed(() => {
  const text = inputText.value
  if (!text) return []
  // 中英文分词：英文按单词，中文每字
  const tokens = []
  const enWords = text.match(/\b[a-zA-Z'-]{2,}\b/g) || []
  const zhChars = text.match(/[\u4e00-\u9fa5]{1}/g) || []
  enWords.forEach(w => tokens.push(w.toLowerCase()))
  zhChars.forEach(c => tokens.push(c))

  const freq = {}
  tokens.forEach(w => { freq[w] = (freq[w] || 0) + 1 })
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 20)
  const maxCount = sorted[0]?.[1] || 1
  return sorted.map(([word, count]) => ({
    word,
    count,
    percent: Math.round(count / maxCount * 100)
  }))
})

// ── 字符分布 ─────────────────────────────────────
const charDistList = computed(() => {
  const s = stats.value
  const total = s.charTotal || 1
  const punctCount = (inputText.value.match(/[^\w\s\u4e00-\u9fa5]/g) || []).length
  const spaceCount = (inputText.value.match(/\s/g) || []).length
  return [
    { key: 'chinese', label: t('text.stats.distChinese'), count: s.chineseCount, percent: Math.round(s.chineseCount / total * 100) },
    { key: 'english', label: t('text.stats.distEnglish'), count: s.englishCount, percent: Math.round(s.englishCount / total * 100) },
    { key: 'digit',   label: t('text.stats.distDigit'),   count: s.digitCount,   percent: Math.round(s.digitCount   / total * 100) },
    { key: 'punct',   label: t('text.stats.distPunct'),   count: punctCount,     percent: Math.round(punctCount     / total * 100) },
    { key: 'space',   label: t('text.stats.distSpace'),   count: spaceCount,     percent: Math.round(spaceCount     / total * 100) }
  ]
})

// ── 清空 ─────────────────────────────────────────
const clearAll = () => {
  inputText.value = ''
  analyze()
}
</script>

<style scoped>
.text-stats {
  max-width: 1000px;
  margin: 20px auto;
  padding: 0 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 12px;
}

.stat-card {
  background: var(--code-color, #f8f8f8);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  padding: 12px 14px;
  text-align: center;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--primary-color, #18a058);
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
  color: var(--text-color-3, #999);
  margin-top: 4px;
}

.empty-hint {
  text-align: center;
  padding: 24px 0;
}

.freq-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 340px;
  overflow-y: auto;
}

.freq-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.freq-word {
  min-width: 80px;
  font-size: 13px;
  font-weight: 500;
}

.freq-count {
  min-width: 32px;
  text-align: right;
  font-size: 13px;
  color: var(--text-color-3, #999);
}

.dist-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dist-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.dist-label {
  min-width: 80px;
  font-size: 13px;
}

.dist-info {
  min-width: 90px;
  text-align: right;
  font-size: 12px;
  color: var(--text-color-3, #999);
}

@media (max-width: 768px) {
  .text-stats {
    padding: 0 12px;
  }
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>

