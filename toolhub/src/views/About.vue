<template>
  <div class="about-page">
    <n-card>
      <template #header>
        <h1>{{ getAboutText('title', locale) }}</h1>
      </template>
      
      <div class="content">
        <section class="intro">
          <h2>{{ getAboutText('mission.title', locale) }}</h2>
          <p>{{ getAboutText('mission.description', locale) }}</p>
          
          <div class="highlights">
            <div class="highlight-item">
              <n-icon size="24" color="#18a058">
                <CodeIcon />
              </n-icon>
              <h3>{{ getAboutText('mission.highlights.developer.title', locale) }}</h3>
              <p>{{ getAboutText('mission.highlights.developer.desc', locale) }}</p>
            </div>
            <div class="highlight-item">
              <n-icon size="24" color="#18a058">
                <ShieldIcon />
              </n-icon>
              <h3>{{ getAboutText('mission.highlights.privacy.title', locale) }}</h3>
              <p>{{ getAboutText('mission.highlights.privacy.desc', locale) }}</p>
            </div>
            <div class="highlight-item">
              <n-icon size="24" color="#18a058">
                <FastIcon />
              </n-icon>
              <h3>{{ getAboutText('mission.highlights.fast.title', locale) }}</h3>
              <p>{{ getAboutText('mission.highlights.fast.desc', locale) }}</p>
            </div>
          </div>
        </section>

        <section class="features">
          <h2>{{ getAboutText('features.title', locale) }}</h2>
          <p>{{ getAboutText('features.intro', locale) }}</p>
          <div class="feature-grid">
            <div class="feature-category">
              <h3>{{ getAboutText('features.format.title', locale) }}</h3>
              <p>{{ getAboutText('features.format.desc', locale) }}</p>
            </div>

            <div class="feature-category">
              <h3>{{ getAboutText('features.encrypt.title', locale) }}</h3>
              <p>{{ getAboutText('features.encrypt.desc', locale) }}</p>
            </div>

            <div class="feature-category">
              <h3>{{ getAboutText('features.convert.title', locale) }}</h3>
              <p>{{ getAboutText('features.convert.desc', locale) }}</p>
            </div>

            <div class="feature-category">
              <h3>{{ getAboutText('features.image.title', locale) }}</h3>
              <p>{{ getAboutText('features.image.desc', locale) }}</p>
            </div>

            <div class="feature-category">
              <h3>{{ getAboutText('features.text.title', locale) }}</h3>
              <p>{{ getAboutText('features.text.desc', locale) }}</p>
            </div>

            <div class="feature-category">
              <h3>{{ getAboutText('features.other.title', locale) }}</h3>
              <p>{{ getAboutText('features.other.desc', locale) }}</p>
            </div>
          </div>
        </section>

        <section class="technology">
          <h2>{{ getAboutText('technology.title', locale) }}</h2>
          <p>{{ getAboutText('technology.intro', locale) }}</p>
          
          <div class="tech-stack">
            <div class="tech-item">
              <h4>{{ getAboutText('technology.frontend.title', locale) }}</h4>
              <ul>
                <li><strong>Vue 3:</strong> {{ getAboutText('technology.frontend.vue', locale) }}</li>
                <li><strong>Naive UI:</strong> {{ getAboutText('technology.frontend.naiveui', locale) }}</li>
                <li><strong>Vite:</strong> {{ getAboutText('technology.frontend.vite', locale) }}</li>
                <li><strong>Vue Router:</strong> {{ getAboutText('technology.frontend.router', locale) }}</li>
                <li><strong>Vue I18n:</strong> {{ getAboutText('technology.frontend.i18n', locale) }}</li>
              </ul>
            </div>

            <div class="tech-item">
              <h4>{{ getAboutText('technology.backend.title', locale) }}</h4>
              <ul>
                <li><strong>Node.js:</strong> {{ getAboutText('technology.backend.node', locale) }}</li>
                <li><strong>Express:</strong> {{ getAboutText('technology.backend.express', locale) }}</li>
                <li><strong>Nginx:</strong> {{ getAboutText('technology.backend.nginx', locale) }}</li>
                <li><strong>PM2:</strong> {{ getAboutText('technology.backend.pm2', locale) }}</li>
              </ul>
            </div>

            <div class="tech-item">
              <h4>{{ getAboutText('technology.security.title', locale) }}</h4>
              <ul>
                <li><strong>HTTPS:</strong> {{ getAboutText('technology.security.https', locale) }}</li>
                <li><strong>CSP:</strong> {{ getAboutText('technology.security.csp', locale) }}</li>
                <li><strong>{{ getAboutText('technology.security.client.title', locale) }}:</strong> {{ getAboutText('technology.security.client.desc', locale) }}</li>
                <li><strong>{{ getAboutText('technology.security.validation.title', locale) }}:</strong> {{ getAboutText('technology.security.validation.desc', locale) }}</li>
              </ul>
            </div>
          </div>
        </section>

        <section class="contact">
          <h2>{{ getAboutText('contact.title', locale) }}</h2>
          <p>{{ getAboutText('contact.intro', locale) }}</p>
          
          <div class="contact-methods">
            <div class="contact-item">
              <n-icon size="20" color="#18a058">
                <EmailIcon />
              </n-icon>
              <div>
                <h4>{{ getAboutText('contact.methods.email.title', locale) }}</h4>
                <p>{{ getAboutText('contact.methods.email.support', locale) }}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="thanks">
          <h2>{{ getAboutText('thanks.title', locale) }}</h2>
          <p>{{ getAboutText('thanks.intro', locale) }}</p>
          <ul>
            <li>{{ getAboutText('thanks.list.vue', locale) }}</li>
            <li>{{ getAboutText('thanks.list.naiveui', locale) }}</li>
            <li>{{ getAboutText('thanks.list.crypto', locale) }}</li>
            <li>{{ getAboutText('thanks.list.users', locale) }}</li>
          </ul>
          <p>{{ getAboutText('thanks.support', locale) }}</p>
        </section>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useSeo } from '@/composables/useSeo'
import { getAboutText } from '@/locales/about'
import { 
  CodeOutline as CodeIcon,
  ShieldCheckmarkOutline as ShieldIcon,
  FlashOutline as FastIcon,
  MailOutline as EmailIcon
} from '@vicons/ionicons5'

const { locale } = useI18n()

// SEO设置
const { updatePageMeta } = useSeo()

// 手动设置页面元数据
onMounted(() => {
  document.title = getAboutText('seo.title', locale.value)
  
  let metaDescription = document.querySelector('meta[name="description"]')
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.name = 'description'
    document.head.appendChild(metaDescription)
  }
  metaDescription.content = getAboutText('seo.description', locale.value)
  
  let metaKeywords = document.querySelector('meta[name="keywords"]')
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta')
    metaKeywords.name = 'keywords'
    document.head.appendChild(metaKeywords)
  }
  metaKeywords.content = getAboutText('seo.keywords', locale.value)
})
</script>

<style scoped>
.about-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.content {
  line-height: 1.8;
  font-size: 14px;
}

section {
  margin-bottom: 40px;
}

h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
  border-left: 4px solid #18a058;
  padding-left: 15px;
}

h3 {
  color: #444;
  margin: 15px 0 10px 0;
  font-size: 18px;
}

h4 {
  color: #555;
  margin: 10px 0;
  font-size: 16px;
}

p {
  margin: 15px 0;
  color: #666;
}

.highlights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.highlight-item {
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  background: linear-gradient(135deg, #f6f8fc 0%, #ffffff 100%);
  border: 1px solid #e1e5e9;
}

.highlight-item h3 {
  margin: 10px 0;
  color: #333;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin: 30px 0;
}

.feature-category {
  padding: 20px;
  border-radius: 8px;
  background: #f8f9fa;
  border-left: 4px solid #18a058;
}

.feature-category h3 {
  margin-bottom: 10px;
  color: #333;
}

.feature-category ul {
  margin: 15px 0 0 20px;
}

.feature-category li {
  margin: 8px 0;
  color: #555;
}

.tech-stack {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin: 30px 0;
}

.tech-item {
  padding: 20px;
  border-radius: 8px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.tech-item ul {
  margin: 15px 0 0 20px;
}

.tech-item li {
  margin: 8px 0;
  color: #555;
}

.contact-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  border-radius: 8px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.contact-item h4 {
  margin: 0 0 5px 0;
  color: #333;
}

.contact-item p {
  margin: 2px 0;
  color: #666;
  font-size: 13px;
}

.thanks ul {
  margin: 15px 0 0 25px;
}

.thanks li {
  margin: 8px 0;
  color: #555;
}

strong {
  color: #333;
  font-weight: 600;
}

@media (max-width: 768px) {
  .highlights {
    grid-template-columns: 1fr;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .tech-stack {
    grid-template-columns: 1fr;
  }
  
  .contact-methods {
    grid-template-columns: 1fr;
  }
}
</style> 