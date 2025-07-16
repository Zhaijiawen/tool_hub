<template>
  <div class="about-page">
    <n-card>
      <template #header>
        <h1>{{ t('about.title') }}</h1>
      </template>
      
      <div class="content">
        <section class="intro">
          <h2>{{ t('about.sections.mission.title') }}</h2>
          <p>{{ t('about.sections.mission.description') }}</p>
          
          <div class="highlights">
            <div class="highlight-item">
              <n-icon size="24" color="#18a058">
                <CodeIcon />
              </n-icon>
              <h3>{{ t('about.sections.mission.highlights.developer.title') }}</h3>
              <p>{{ t('about.sections.mission.highlights.developer.desc') }}</p>
            </div>
            <div class="highlight-item">
              <n-icon size="24" color="#18a058">
                <ShieldIcon />
              </n-icon>
              <h3>{{ t('about.sections.mission.highlights.privacy.title') }}</h3>
              <p>{{ t('about.sections.mission.highlights.privacy.desc') }}</p>
            </div>
            <div class="highlight-item">
              <n-icon size="24" color="#18a058">
                <FastIcon />
              </n-icon>
              <h3>{{ t('about.sections.mission.highlights.fast.title') }}</h3>
              <p>{{ t('about.sections.mission.highlights.fast.desc') }}</p>
            </div>
          </div>
        </section>

        <section class="features">
          <h2>{{ t('about.sections.features.title') }}</h2>
          <div class="feature-grid">
            <div class="feature-category">
              <h3>{{ t('about.sections.features.categories.format.title') }}</h3>
              <p>{{ t('about.sections.features.categories.format.desc') }}</p>
              <ul>
                <li>{{ t('about.sections.features.categories.format.features.highlight') }}</li>
                <li>{{ t('about.sections.features.categories.format.features.error') }}</li>
                <li>{{ t('about.sections.features.categories.format.features.indent') }}</li>
                <li>{{ t('about.sections.features.categories.format.features.copy') }}</li>
              </ul>
            </div>

            <div class="feature-category">
              <h3>{{ t('about.sections.features.categories.encrypt.title') }}</h3>
              <p>{{ t('about.sections.features.categories.encrypt.desc') }}</p>
              <ul>
                <li>{{ t('about.sections.features.categories.encrypt.features.symmetric') }}</li>
                <li>{{ t('about.sections.features.categories.encrypt.features.asymmetric') }}</li>
                <li>{{ t('about.sections.features.categories.encrypt.features.hash') }}</li>
                <li>{{ t('about.sections.features.categories.encrypt.features.encoding') }}</li>
              </ul>
            </div>

            <div class="feature-category">
              <h3>{{ t('about.sections.features.categories.convert.title') }}</h3>
              <p>{{ t('about.sections.features.categories.convert.desc') }}</p>
              <ul>
                <li>{{ t('about.sections.features.categories.convert.features.timestamp') }}</li>
                <li>{{ t('about.sections.features.categories.convert.features.number') }}</li>
                <li>{{ t('about.sections.features.categories.convert.features.color') }}</li>
                <li>{{ t('about.sections.features.categories.convert.features.unit') }}</li>
              </ul>
            </div>

            <div class="feature-category">
              <h3>{{ t('about.sections.features.categories.image.title') }}</h3>
              <p>{{ t('about.sections.features.categories.image.desc') }}</p>
              <ul>
                <li>{{ t('about.sections.features.categories.image.features.format') }}</li>
                <li>{{ t('about.sections.features.categories.image.features.resize') }}</li>
                <li>{{ t('about.sections.features.categories.image.features.rotate') }}</li>
                <li>{{ t('about.sections.features.categories.image.features.watermark') }}</li>
              </ul>
            </div>

            <div class="feature-category">
              <h3>{{ t('about.sections.features.categories.text.title') }}</h3>
              <p>{{ t('about.sections.features.categories.text.desc') }}</p>
              <ul>
                <li>{{ t('about.sections.features.categories.text.features.case') }}</li>
                <li>{{ t('about.sections.features.categories.text.features.replace') }}</li>
                <li>{{ t('about.sections.features.categories.text.features.whitespace') }}</li>
                <li>{{ t('about.sections.features.categories.text.features.reverse') }}</li>
              </ul>
            </div>

            <div class="feature-category">
              <h3>{{ t('about.sections.features.categories.other.title') }}</h3>
              <p>{{ t('about.sections.features.categories.other.desc') }}</p>
              <ul>
                <li>{{ t('about.sections.features.categories.other.features.qr') }}</li>
                <li>{{ t('about.sections.features.categories.other.features.shortUrl') }}</li>
                <li>{{ t('about.sections.features.categories.other.features.ip') }}</li>
                <li>{{ t('about.sections.features.categories.other.features.calculator') }}</li>
              </ul>
            </div>
          </div>
        </section>

        <section class="technology">
          <h2>{{ t('about.sections.technology.title') }}</h2>
          <p>{{ t('about.sections.technology.intro') }}</p>
          
          <div class="tech-stack">
            <div class="tech-item">
              <h4>{{ t('about.sections.technology.frontend.title') }}</h4>
              <ul>
                <li><strong>Vue 3:</strong> {{ t('about.sections.technology.frontend.vue') }}</li>
                <li><strong>Naive UI:</strong> {{ t('about.sections.technology.frontend.naiveui') }}</li>
                <li><strong>Vite:</strong> {{ t('about.sections.technology.frontend.vite') }}</li>
                <li><strong>Vue Router:</strong> {{ t('about.sections.technology.frontend.router') }}</li>
                <li><strong>Vue I18n:</strong> {{ t('about.sections.technology.frontend.i18n') }}</li>
              </ul>
            </div>

            <div class="tech-item">
              <h4>{{ t('about.sections.technology.backend.title') }}</h4>
              <ul>
                <li><strong>Node.js:</strong> {{ t('about.sections.technology.backend.node') }}</li>
                <li><strong>Express:</strong> {{ t('about.sections.technology.backend.express') }}</li>
                <li><strong>Nginx:</strong> {{ t('about.sections.technology.backend.nginx') }}</li>
                <li><strong>PM2:</strong> {{ t('about.sections.technology.backend.pm2') }}</li>
              </ul>
            </div>

            <div class="tech-item">
              <h4>{{ t('about.sections.technology.security.title') }}</h4>
              <ul>
                <li><strong>HTTPS:</strong> {{ t('about.sections.technology.security.https') }}</li>
                <li><strong>CSP:</strong> {{ t('about.sections.technology.security.csp') }}</li>
                <li><strong>{{ t('about.sections.technology.security.client.title') }}:</strong> {{ t('about.sections.technology.security.client.desc') }}</li>
                <li><strong>{{ t('about.sections.technology.security.validation.title') }}:</strong> {{ t('about.sections.technology.security.validation.desc') }}</li>
              </ul>
            </div>
          </div>
        </section>

        <section class="contact">
          <h2>{{ t('about.sections.contact.title') }}</h2>
          <p>{{ t('about.sections.contact.intro') }}</p>
          
          <div class="contact-methods">
            <div class="contact-item">
              <n-icon size="20" color="#18a058">
                <EmailIcon />
              </n-icon>
              <div>
                <h4>{{ t('about.sections.contact.methods.email.title') }}</h4>
                <p>{{ t('about.sections.contact.methods.email.support') }}</p>
                <p>{{ t('about.sections.contact.methods.email.business') }}</p>
              </div>
            </div>

            <div class="contact-item">
              <n-icon size="20" color="#18a058">
                <GithubIcon />
              </n-icon>
              <div>
                <h4>{{ t('about.sections.contact.methods.github.title') }}</h4>
                <p>{{ t('about.sections.contact.methods.github.repo') }}</p>
                <p>{{ t('about.sections.contact.methods.github.contribute') }}</p>
              </div>
            </div>

            <div class="contact-item">
              <n-icon size="20" color="#18a058">
                <LocationIcon />
              </n-icon>
              <div>
                <h4>{{ t('about.sections.contact.methods.address.title') }}</h4>
                <p>{{ t('about.sections.contact.methods.address.country') }}</p>
                <p>{{ t('about.sections.contact.methods.address.district') }}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="thanks">
          <h2>{{ t('about.sections.thanks.title') }}</h2>
          <p>{{ t('about.sections.thanks.intro') }}</p>
          <ul>
            <li>{{ t('about.sections.thanks.list.vue') }}</li>
            <li>{{ t('about.sections.thanks.list.naiveui') }}</li>
            <li>{{ t('about.sections.thanks.list.crypto') }}</li>
            <li>{{ t('about.sections.thanks.list.users') }}</li>
          </ul>
          <p>{{ t('about.sections.thanks.support') }}</p>
        </section>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useSeo } from '@/composables/useSeo'
import { 
  CodeOutline as CodeIcon,
  ShieldCheckmarkOutline as ShieldIcon,
  FlashOutline as FastIcon,
  MailOutline as EmailIcon,
  LogoGithub as GithubIcon,
  LocationOutline as LocationIcon
} from '@vicons/ionicons5'

const { t } = useI18n()

// SEO设置
useSeo({
  title: t('about.seo.title'),
  description: t('about.seo.description'),
  keywords: t('about.seo.keywords')
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