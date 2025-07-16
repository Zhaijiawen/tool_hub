<template>
  <div class="legal-page">
    <n-card>
      <template #header>
        <h1>{{ t('terms.title') }}</h1>
      </template>
      
      <div class="content">
        <p class="last-updated">{{ t('terms.lastUpdated', { date: formatDate() }) }}</p>
        
        <section>
          <h2>{{ t('terms.sections.intro.title') }}</h2>
          <p>{{ t('terms.sections.intro.welcome') }}</p>
          <p>{{ t('terms.sections.intro.agreement') }}</p>
        </section>

        <section>
          <h2>{{ t('terms.sections.usage.title') }}</h2>
          <h3>{{ t('terms.sections.usage.freeUse.title') }}</h3>
          <p>{{ t('terms.sections.usage.freeUse.intro') }}</p>
          <ul>
            <li>{{ t('terms.sections.usage.freeUse.tools') }}</li>
            <li>{{ t('terms.sections.usage.freeUse.features') }}</li>
            <li>{{ t('terms.sections.usage.freeUse.local') }}</li>
            <li>{{ t('terms.sections.usage.freeUse.noRegistration') }}</li>
          </ul>

          <h3>{{ t('terms.sections.usage.limitations.title') }}</h3>
          <p>{{ t('terms.sections.usage.limitations.intro') }}</p>
          <ul>
            <li>{{ t('terms.sections.usage.limitations.excessive') }}</li>
            <li>{{ t('terms.sections.usage.limitations.attack') }}</li>
            <li>{{ t('terms.sections.usage.limitations.automation') }}</li>
            <li>{{ t('terms.sections.usage.limitations.interference') }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ t('terms.sections.responsibility.title') }}</h2>
          <h3>{{ t('terms.sections.responsibility.legal.title') }}</h3>
          <p>{{ t('terms.sections.responsibility.legal.intro') }}</p>
          <ul>
            <li>{{ t('terms.sections.responsibility.legal.lawful') }}</li>
            <li>{{ t('terms.sections.responsibility.legal.noHarm') }}</li>
            <li>{{ t('terms.sections.responsibility.legal.noAccess') }}</li>
            <li>{{ t('terms.sections.responsibility.legal.comply') }}</li>
          </ul>

          <h3>{{ t('terms.sections.responsibility.data.title') }}</h3>
          <p>{{ t('terms.sections.responsibility.data.reminder') }}</p>
          <ul>
            <li>{{ t('terms.sections.responsibility.data.backup') }}</li>
            <li>{{ t('terms.sections.responsibility.data.sensitive') }}</li>
            <li>{{ t('terms.sections.responsibility.data.risk') }}</li>
            <li>{{ t('terms.sections.responsibility.data.localBackup') }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ t('terms.sections.intellectualProperty.title') }}</h2>
          <p>{{ t('terms.sections.intellectualProperty.intro') }}</p>
          <ul>
            <li>{{ t('terms.sections.intellectualProperty.design') }}</li>
            <li>{{ t('terms.sections.intellectualProperty.code') }}</li>
            <li>{{ t('terms.sections.intellectualProperty.content') }}</li>
            <li>{{ t('terms.sections.intellectualProperty.brand') }}</li>
          </ul>
          <p>{{ t('terms.sections.intellectualProperty.disclaimer') }}</p>
        </section>

        <section>
          <h2>{{ t('terms.sections.serviceChanges.title') }}</h2>
          <h3>{{ t('terms.sections.serviceChanges.updates.title') }}</h3>
          <p>{{ t('terms.sections.serviceChanges.updates.intro') }}</p>
          <ul>
            <li>{{ t('terms.sections.serviceChanges.updates.tools') }}</li>
            <li>{{ t('terms.sections.serviceChanges.updates.performance') }}</li>
            <li>{{ t('terms.sections.serviceChanges.updates.interface') }}</li>
            <li>{{ t('terms.sections.serviceChanges.updates.bugs') }}</li>
          </ul>

          <h3>{{ t('terms.sections.serviceChanges.interruption.title') }}</h3>
          <p>{{ t('terms.sections.serviceChanges.interruption.intro') }}</p>
          <ul>
            <li>{{ t('terms.sections.serviceChanges.interruption.maintenance') }}</li>
            <li>{{ t('terms.sections.serviceChanges.interruption.technical') }}</li>
            <li>{{ t('terms.sections.serviceChanges.interruption.force') }}</li>
            <li>{{ t('terms.sections.serviceChanges.interruption.legal') }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ t('terms.sections.disclaimer.title') }}</h2>
          <p>{{ t('terms.sections.disclaimer.intro') }}</p>
          <ul>
            <li>{{ t('terms.sections.disclaimer.accuracy') }}</li>
            <li>{{ t('terms.sections.disclaimer.availability') }}</li>
            <li>{{ t('terms.sections.disclaimer.damages') }}</li>
            <li>{{ t('terms.sections.disclaimer.thirdParty') }}</li>
          </ul>
          <p><strong>{{ t('terms.sections.disclaimer.suggestion') }}</strong></p>
        </section>

        <section>
          <h2>{{ t('terms.sections.privacy.title') }}</h2>
          <p>{{ t('terms.sections.privacy.intro') }}</p>
          <ul>
            <li>{{ t('terms.sections.privacy.local') }}</li>
            <li>{{ t('terms.sections.privacy.noCollection') }}</li>
            <li>
              {{ t('terms.sections.privacy.policy') }}
              <router-link to="/privacy">{{ t('terms.sections.privacy.policyLink') }}</router-link>
            </li>
          </ul>
        </section>

        <section>
          <h2>{{ t('terms.sections.changes.title') }}</h2>
          <p>{{ t('terms.sections.changes.description') }}</p>
          <p>{{ t('terms.sections.changes.acceptance') }}</p>
        </section>

        <section>
          <h2>{{ t('terms.sections.contact.title') }}</h2>
          <p>{{ t('terms.sections.contact.intro') }}</p>
          <ul>
            <li>{{ t('terms.sections.contact.email') }}</li>
            <li>{{ t('terms.sections.contact.address') }}</li>
          </ul>
          <p>{{ t('terms.sections.contact.response') }}</p>
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
  title: t('terms.seo.title'),
  description: t('terms.seo.description'),
  keywords: t('terms.seo.keywords')
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