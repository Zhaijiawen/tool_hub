<template>
  <div class="blog-page">
    <n-card>
      <template #header>
        <h1>{{ getBlogText('title', locale) }}</h1>
        <p class="subtitle">{{ getBlogText('subtitle', locale) }}</p>
      </template>
      
      <div class="content">
        <div class="blog-grid">
          <!-- 文章卡片 -->
          <n-card v-for="article in articles" :key="article.id" hoverable>
            <template #header>
              <div class="article-header">
                <h3>{{ getBlogArticle(article.key, locale)?.title }}</h3>
                <div class="article-meta">
                  <n-tag size="small" :type="article.category.type">{{ getBlogText(`categories.${article.category.key}`, locale) }}</n-tag>
                  <span class="date">{{ article.date }}</span>
                </div>
              </div>
            </template>
            
            <div class="article-content">
              <p>{{ getBlogArticle(article.key, locale)?.summary }}</p>
              
              <div class="article-highlights" v-if="article.highlights">
                <h4>{{ getBlogText('highlights', locale) }}</h4>
                <ul>
                  <li v-for="(highlight, index) in article.highlights" :key="index">
                    {{ getBlogArticle(article.key, locale)?.highlights?.[index] }}
                  </li>
                </ul>
              </div>

              <div class="code-example" v-if="article.codeExample">
                <h4>{{ getBlogText('codeExample', locale) }}</h4>
                <pre><code v-html="getBlogArticle(article.key, locale)?.codeExample"></code></pre>
              </div>
            </div>
            
            <template #footer>
              <div class="article-footer">
                <div class="tags">
                  <n-tag v-for="tag in article.tags" :key="tag" size="small" round>{{ tag }}</n-tag>
                </div>
                <div class="read-time">
                  <n-icon><TimeIcon /></n-icon>
                  <span>{{ getBlogText('readTime', locale).replace('{minutes}', article.readTime) }}</span>
                </div>
              </div>
            </template>
          </n-card>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSeo } from '@/composables/useSeo'
import { getBlogText, getBlogArticle } from '@/locales/blog'
import { TimeOutline as TimeIcon } from '@vicons/ionicons5'

const { locale } = useI18n()

// SEO设置
useSeo({
  title: getBlogText('seo.title', locale.value),
  description: getBlogText('seo.description', locale.value),
  keywords: getBlogText('seo.keywords', locale.value)
})

// 文章数据
const articles = ref([
  {
    id: 1,
    key: 'jsonAdvanced',
    category: { key: 'format', type: 'info' },
    date: '2025-01-15',
    readTime: 5,
    tags: ['JSON', 'Format', 'Debug'],
    highlights: [0, 1, 2, 3],
    codeExample: true
  },
  {
    id: 2,
    key: 'base64Guide',
    category: { key: 'encrypt', type: 'warning' },
    date: '2025-01-14',
    readTime: 7,
    tags: ['Base64', 'Encoding', 'Data Transfer'],
    highlights: [0, 1, 2, 3],
    codeExample: true
  },
  {
    id: 3,
    key: 'timestampScenarios',
    category: { key: 'convert', type: 'success' },
    date: '2025-01-13',
    readTime: 6,
    tags: ['Timestamp', 'Date', 'Time Processing'],
    highlights: [0, 1, 2, 3],
    codeExample: true
  },
  {
    id: 4,
    key: 'aesSecurity',
    category: { key: 'security', type: 'error' },
    date: '2025-01-12',
    readTime: 8,
    tags: ['AES', 'Encryption', 'Security', 'Frontend'],
    highlights: [0, 1, 2, 3],
    codeExample: true
  },
  {
    id: 5,
    key: 'regexDebugging',
    category: { key: 'text', type: 'primary' },
    date: '2025-01-11',
    readTime: 6,
    tags: ['Regex', 'Text Processing', 'Debug'],
    highlights: [0, 1, 2, 3],
    codeExample: true
  },
  {
    id: 6,
    key: 'qrCodeTech',
    category: { key: 'other', type: 'default' },
    date: '2025-01-10',
    readTime: 5,
    tags: ['QR Code', 'Mobile Development'],
    highlights: [0, 1, 2, 3],
    codeExample: true
  },
  {
    id: 7,
    key: 'codeFormatting',
    category: { key: 'format', type: 'info' },
    date: '2025-01-09',
    readTime: 7,
    tags: ['Code Formatting', 'Prettier', 'ESLint'],
    highlights: [0, 1, 2, 3],
    codeExample: true
  },
  {
    id: 8,
    key: 'imageOptimization',
    category: { key: 'image', type: 'success' },
    date: '2025-01-08',
    readTime: 9,
    tags: ['Image Processing', 'Performance', 'WebP'],
    highlights: [0, 1, 2, 3],
    codeExample: true
  }
])
</script>

<style scoped>
.blog-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.subtitle {
  color: #666;
  font-size: 16px;
  margin: 10px 0 0 0;
  font-weight: normal;
}

.content {
  margin-top: 20px;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 25px;
}

.article-header h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 18px;
  line-height: 1.4;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 15px;
}

.date {
  color: #999;
  font-size: 13px;
}

.article-content {
  line-height: 1.7;
  color: #555;
}

.article-content p {
  margin-bottom: 20px;
  text-align: justify;
}

.article-highlights h4,
.code-example h4 {
  color: #333;
  margin: 20px 0 10px 0;
  font-size: 14px;
  font-weight: 600;
}

.article-highlights ul {
  margin: 10px 0 20px 20px;
  color: #666;
}

.article-highlights li {
  margin: 6px 0;
  font-size: 13px;
}

.code-example {
  margin: 20px 0;
}

.code-example pre {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 15px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.5;
}

.code-example code {
  color: #333;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.read-time {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #999;
  font-size: 12px;
}

@media (max-width: 768px) {
  .blog-grid {
    grid-template-columns: 1fr;
  }
  
  .article-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style> 