<template>
  <div class="legal-page">
    <n-card>
      <template #header>
        <h1>{{ getLicensesText('title', locale) }}</h1>
      </template>

      <div class="content">
        <p class="last-updated">{{ getLicensesText('intro', locale) }}</p>

        <section>
          <h2>{{ getLicensesText('general.title', locale) }}</h2>
          <p>{{ getLicensesText('general.desc', locale) }}</p>
          <p>
            {{ getLicensesText('general.repo', locale) }}
            <a :href="getLicensesText('general.repoUrl', locale)" target="_blank" rel="noopener">{{ getLicensesText('general.repoUrl', locale) }}</a>
          </p>
        </section>

        <section>
          <h2>{{ getLicensesText('mupdf.title', locale) }}</h2>
          <p>{{ getLicensesText('mupdf.desc', locale) }}</p>
          <ul>
            <li>{{ getLicensesText('mupdf.version', locale) }}</li>
            <li>
              <strong>{{ getLicensesText('mupdf.upstream', locale) }}</strong>
              <a :href="getLicensesText('mupdf.upstreamUrl', locale)" target="_blank" rel="noopener">{{ getLicensesText('mupdf.upstreamUrl', locale) }}</a>
            </li>
            <li>{{ getLicensesText('mupdf.modified', locale) }}</li>
            <li>
              <strong>{{ getLicensesText('mupdf.license', locale) }}</strong>
              <a :href="getLicensesText('mupdf.licenseUrl', locale)" target="_blank" rel="noopener">{{ getLicensesText('mupdf.licenseUrl', locale) }}</a>
            </li>
          </ul>
        </section>

        <section>
          <h2>{{ getLicensesText('ffmpeg.title', locale) }}</h2>
          <p>{{ getLicensesText('ffmpeg.desc', locale) }}</p>
          <ul>
            <li>{{ getLicensesText('ffmpeg.version', locale) }}</li>
            <li>
              <strong>{{ getLicensesText('ffmpeg.upstream', locale) }}</strong>
              <a :href="getLicensesText('ffmpeg.upstreamUrl', locale)" target="_blank" rel="noopener">{{ getLicensesText('ffmpeg.upstreamUrl', locale) }}</a>
            </li>
            <li>
              <strong>{{ getLicensesText('ffmpeg.x264', locale) }}</strong>
              <a :href="getLicensesText('ffmpeg.x264Url', locale)" target="_blank" rel="noopener">{{ getLicensesText('ffmpeg.x264Url', locale) }}</a>
            </li>
            <li>{{ getLicensesText('ffmpeg.modified', locale) }}</li>
            <li>
              <strong>{{ getLicensesText('ffmpeg.license', locale) }}</strong>
              <a :href="getLicensesText('ffmpeg.licenseUrl', locale)" target="_blank" rel="noopener">{{ getLicensesText('ffmpeg.licenseUrl', locale) }}</a>
            </li>
          </ul>
        </section>

        <section>
          <h2>{{ getLicensesText('duty.title', locale) }}</h2>
          <p>{{ getLicensesText('duty.desc', locale) }}</p>
        </section>

        <section>
          <h2>{{ getLicensesText('disclaimer.title', locale) }}</h2>
          <p>{{ getLicensesText('disclaimer.desc', locale) }}</p>
        </section>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useSeo } from '@/composables/useSeo'
import { getLicensesText } from '@/locales/licenses'
import { onMounted } from 'vue'

const { locale } = useI18n()

// SEO设置
const { updatePageMeta } = useSeo()

// 手动设置页面元数据
onMounted(() => {
  document.title = getLicensesText('seo.title', locale.value)

  let metaDescription = document.querySelector('meta[name="description"]')
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.name = 'description'
    document.head.appendChild(metaDescription)
  }
  metaDescription.content = getLicensesText('seo.description', locale.value)

  let metaKeywords = document.querySelector('meta[name="keywords"]')
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta')
    metaKeywords.name = 'keywords'
    document.head.appendChild(metaKeywords)
  }
  metaKeywords.content = getLicensesText('seo.keywords', locale.value)
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

a {
  color: #18a058;
  text-decoration: none;
  word-break: break-all;
}

a:hover {
  text-decoration: underline;
}

p {
  margin: 15px 0;
  color: #555;
}
</style>
