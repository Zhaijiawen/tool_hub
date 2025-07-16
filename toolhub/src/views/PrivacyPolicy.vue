<template>
  <div class="legal-page">
    <n-card>
      <template #header>
        <h1>{{ t('privacy.title') }}</h1>
      </template>
      
      <div class="content">
        <p class="last-updated">{{ t('privacy.lastUpdated', { date: formatDate() }) }}</p>
        
        <section>
          <h2>{{ t('privacy.sections.collection.title') }}</h2>
          <p>{{ t('privacy.sections.collection.intro') }}</p>
          <ul>
            <li><strong>{{ t('privacy.sections.collection.usage.title') }}：</strong>{{ t('privacy.sections.collection.usage.desc') }}</li>
            <li><strong>{{ t('privacy.sections.collection.technical.title') }}：</strong>{{ t('privacy.sections.collection.technical.desc') }}</li>
            <li><strong>{{ t('privacy.sections.collection.cookies.title') }}：</strong>{{ t('privacy.sections.collection.cookies.desc') }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ t('privacy.sections.usage.title') }}</h2>
          <p>{{ t('privacy.sections.usage.intro') }}</p>
          <ul>
            <li>{{ t('privacy.sections.usage.provide') }}</li>
            <li>{{ t('privacy.sections.usage.improve') }}</li>
            <li>{{ t('privacy.sections.usage.analyze') }}</li>
            <li>{{ t('privacy.sections.usage.security') }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ t('privacy.sections.processing.title') }}</h2>
          <p><strong>{{ t('privacy.sections.processing.important') }}：</strong>{{ t('privacy.sections.processing.description') }}</p>
          <ul>
            <li>{{ t('privacy.sections.processing.local') }}</li>
            <li>{{ t('privacy.sections.processing.noLeave') }}</li>
            <li>{{ t('privacy.sections.processing.noAccess') }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ t('privacy.sections.thirdParty.title') }}</h2>
          <p>{{ t('privacy.sections.thirdParty.intro') }}</p>
          <ul>
            <li><strong>{{ t('privacy.sections.thirdParty.analytics.title') }}：</strong>{{ t('privacy.sections.thirdParty.analytics.desc') }}</li>
            <li><strong>{{ t('privacy.sections.thirdParty.adsense.title') }}：</strong>{{ t('privacy.sections.thirdParty.adsense.desc') }}</li>
            <li><strong>{{ t('privacy.sections.thirdParty.cdn.title') }}：</strong>{{ t('privacy.sections.thirdParty.cdn.desc') }}</li>
          </ul>
          <p>{{ t('privacy.sections.thirdParty.disclaimer') }}</p>
        </section>

        <section>
          <h2>{{ t('privacy.sections.security.title') }}</h2>
          <p>{{ t('privacy.sections.security.intro') }}</p>
          <ul>
            <li>{{ t('privacy.sections.security.https') }}</li>
            <li>{{ t('privacy.sections.security.audit') }}</li>
            <li>{{ t('privacy.sections.security.access') }}</li>
            <li>{{ t('privacy.sections.security.backup') }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ t('privacy.sections.rights.title') }}</h2>
          <p>{{ t('privacy.sections.rights.intro') }}</p>
          <ul>
            <li>{{ t('privacy.sections.rights.know') }}</li>
            <li>{{ t('privacy.sections.rights.correct') }}</li>
            <li>{{ t('privacy.sections.rights.restrict') }}</li>
            <li>{{ t('privacy.sections.rights.contact') }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ t('privacy.sections.contact.title') }}</h2>
          <p>{{ t('privacy.sections.contact.intro') }}</p>
          <ul>
            <li>{{ t('privacy.sections.contact.email') }}</li>
            <li>{{ t('privacy.sections.contact.address') }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ t('privacy.sections.updates.title') }}</h2>
          <p>{{ t('privacy.sections.updates.description') }}</p>
        </section>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()

// SEO设置
useSeo({
  title: t('privacy.seo.title'),
  description: t('privacy.seo.description'),
  keywords: t('privacy.seo.keywords')
})

const formatDate = () => {
  return new Date().toLocaleDateString()
}
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