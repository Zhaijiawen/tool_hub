<template>
  <div class="legal-page">
    <n-card>
      <template #header>
        <h1>{{ getPrivacyText('title', locale) }}</h1>
      </template>
      
      <div class="content">
        <p class="last-updated">{{ getPrivacyText('lastUpdated', locale) }}</p>
        
        <section>
          <h2>{{ getPrivacyText('collection.title', locale) }}</h2>
          <p>{{ getPrivacyText('collection.intro', locale) }}</p>
          <ul>
            <li><strong>{{ getPrivacyText('collection.usage.title', locale) }}：</strong>{{ getPrivacyText('collection.usage.desc', locale) }}</li>
            <li><strong>{{ getPrivacyText('collection.technical.title', locale) }}：</strong>{{ getPrivacyText('collection.technical.desc', locale) }}</li>
            <li><strong>{{ getPrivacyText('collection.cookies.title', locale) }}：</strong>{{ getPrivacyText('collection.cookies.desc', locale) }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ getPrivacyText('usage.title', locale) }}</h2>
          <p>{{ getPrivacyText('usage.intro', locale) }}</p>
          <ul>
            <li>{{ getPrivacyText('usage.service.title', locale) }}</li>
            <li>{{ getPrivacyText('usage.improvement.title', locale) }}</li>
            <li>{{ getPrivacyText('usage.security.title', locale) }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ getPrivacyText('sharing.title', locale) }}</h2>
          <p>{{ getPrivacyText('sharing.intro', locale) }}</p>
          <ul>
            <li>{{ getPrivacyText('sharing.legal', locale) }}</li>
            <li>{{ getPrivacyText('sharing.service', locale) }}</li>
            <li>{{ getPrivacyText('sharing.consent', locale) }}</li>
          </ul>
          <p>{{ getPrivacyText('sharing.disclaimer', locale) }}</p>
        </section>

        <section>
          <h2>{{ getPrivacyText('security.title', locale) }}</h2>
          <p>{{ getPrivacyText('security.measures', locale) }}</p>
          <ul>
            <li>{{ getPrivacyText('security.encryption', locale) }}</li>
            <li>{{ getPrivacyText('security.access', locale) }}</li>
            <li>{{ getPrivacyText('security.monitoring', locale) }}</li>
            <li>{{ getPrivacyText('security.updates', locale) }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ getPrivacyText('clientSide.title', locale) }}</h2>
          <p>{{ getPrivacyText('clientSide.desc', locale) }}</p>
        </section>

        <section>
          <h2>{{ getPrivacyText('rights.title', locale) }}</h2>
          <ul>
            <li>{{ getPrivacyText('rights.access', locale) }}</li>
            <li>{{ getPrivacyText('rights.correction', locale) }}</li>
            <li>{{ getPrivacyText('rights.deletion', locale) }}</li>
            <li>{{ getPrivacyText('rights.portability', locale) }}</li>
            <li>{{ getPrivacyText('rights.contact', locale) }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ getPrivacyText('contact.title', locale) }}</h2>
          <p>{{ getPrivacyText('contact.intro', locale) }}</p>
          <ul>
            <li>{{ getPrivacyText('contact.email', locale) }}</li>
          </ul>
          <p>{{ getPrivacyText('contact.response', locale) }}</p>
        </section>

        <section>
          <h2>{{ getPrivacyText('updates.title', locale) }}</h2>
          <p>{{ getPrivacyText('updates.description', locale) }}</p>
        </section>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useSeo } from '@/composables/useSeo'
import { getPrivacyText } from '@/locales/privacy'
import { onMounted } from 'vue'

const { locale } = useI18n()

// SEO设置
const { updatePageMeta } = useSeo()

// 手动设置页面元数据
onMounted(() => {
  document.title = getPrivacyText('seo.title', locale.value)
  
  let metaDescription = document.querySelector('meta[name="description"]')
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.name = 'description'
    document.head.appendChild(metaDescription)
  }
  metaDescription.content = getPrivacyText('seo.description', locale.value)
  
  let metaKeywords = document.querySelector('meta[name="keywords"]')
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta')
    metaKeywords.name = 'keywords'
    document.head.appendChild(metaKeywords)
  }
  metaKeywords.content = getPrivacyText('seo.keywords', locale.value)
})
</script>

<style scoped>
.legal-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.content {
  line-height: 1.8;
  font-size: 14px;
}

.last-updated {
  color: #666;
  font-style: italic;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

section {
  margin-bottom: 30px;
}

h2 {
  color: #333;
  margin-bottom: 15px;
  font-size: 18px;
  border-left: 4px solid #18a058;
  padding-left: 15px;
}

ul {
  margin: 15px 0;
  padding-left: 25px;
}

li {
  margin: 8px 0;
}

strong {
  color: #333;
}

p {
  margin: 15px 0;
  color: #555;
}
</style> 