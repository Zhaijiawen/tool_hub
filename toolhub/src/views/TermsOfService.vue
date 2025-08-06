<template>
  <div class="legal-page">
    <n-card>
      <template #header>
        <h1>{{ getTermsText('title', locale) }}</h1>
      </template>
      
      <div class="content">
        <p class="last-updated">{{ getTermsText('lastUpdated', locale) }}</p>
        
        <section>
          <p>{{ getTermsText('agreement', locale) }}</p>
        </section>

        <section>
          <h2>{{ getTermsText('service.title', locale) }}</h2>
          <p>{{ getTermsText('service.description', locale) }}</p>
          <p>{{ getTermsText('service.availability', locale) }}</p>
          <p>{{ getTermsText('service.changes', locale) }}</p>
        </section>

        <section>
          <h2>{{ getTermsText('usage.title', locale) }}</h2>
          <ul>
            <li>{{ getTermsText('usage.lawful', locale) }}</li>
            <li>{{ getTermsText('usage.responsible', locale) }}</li>
            <li>{{ getTermsText('usage.interference', locale) }}</li>
            <li>{{ getTermsText('usage.security', locale) }}</li>
            <li>{{ getTermsText('usage.content', locale) }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ getTermsText('intellectual.title', locale) }}</h2>
          <p>{{ getTermsText('intellectual.ownership', locale) }}</p>
          <p>{{ getTermsText('intellectual.license', locale) }}</p>
          <p>{{ getTermsText('intellectual.restrictions', locale) }}</p>
          <p>{{ getTermsText('intellectual.userContent', locale) }}</p>
        </section>

        <section>
          <h2>{{ getTermsText('liability.title', locale) }}</h2>
          <p>{{ getTermsText('liability.disclaimer', locale) }}</p>
          <p>{{ getTermsText('liability.damages', locale) }}</p>
          <p>{{ getTermsText('liability.maximum', locale) }}</p>
        </section>

        <section>
          <h2>{{ getTermsText('privacy.title', locale) }}</h2>
          <p>{{ getTermsText('privacy.intro', locale) }}</p>
          <ul>
            <li>{{ getTermsText('privacy.policy', locale) }}</li>
            <li>{{ getTermsText('privacy.data', locale) }}</li>
            <li>{{ getTermsText('privacy.policyLink', locale) }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ getTermsText('changes.title', locale) }}</h2>
          <p>{{ getTermsText('changes.description', locale) }}</p>
          <p>{{ getTermsText('changes.acceptance', locale) }}</p>
        </section>

        <section>
          <h2>{{ getTermsText('contact.title', locale) }}</h2>
          <p>{{ getTermsText('contact.intro', locale) }}</p>
          <ul>
            <li>{{ getTermsText('contact.email', locale) }}</li>
          </ul>
          <p>{{ getTermsText('contact.response', locale) }}</p>
        </section>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useSeo } from '@/composables/useSeo'
import { getTermsText } from '@/locales/terms'
import { onMounted } from 'vue'

const { locale } = useI18n()

// SEO设置
const { updatePageMeta } = useSeo()

// 手动设置页面元数据
onMounted(() => {
  document.title = getTermsText('seo.title', locale.value)
  
  let metaDescription = document.querySelector('meta[name="description"]')
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.name = 'description'
    document.head.appendChild(metaDescription)
  }
  metaDescription.content = getTermsText('seo.description', locale.value)
  
  let metaKeywords = document.querySelector('meta[name="keywords"]')
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta')
    metaKeywords.name = 'keywords'
    document.head.appendChild(metaKeywords)
  }
  metaKeywords.content = getTermsText('seo.keywords', locale.value)
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

h3 {
  color: #444;
  margin: 20px 0 10px 0;
  font-size: 16px;
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

a {
  color: #18a058;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style> 