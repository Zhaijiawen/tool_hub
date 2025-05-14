<template>
  <div class="short-url-tools">
    <n-card :title="t('tools.shortUrlTools.title')">
      <n-tabs type="line" animated>
        <!-- 短网址生成器 -->
        <n-tab-pane :name="1" :tab="t('tools.shortUrlTools.generator')">
          <n-form>
            <n-form-item :label="t('tools.shortUrlTools.url')">
              <n-input
                v-model:value="url"
                type="textarea"
                :placeholder="t('tools.shortUrlTools.urlPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 8 }"
              />
            </n-form-item>
            <n-form-item :label="t('tools.shortUrlTools.options')">
              <n-space vertical>
                <n-space>
                  <n-text>{{ t('tools.shortUrlTools.expiration') }}:</n-text>
                  <n-select
                    v-model:value="expiration"
                    :options="expirationOptions"
                  />
                </n-space>
                <n-space>
                  <n-text>{{ t('tools.shortUrlTools.customAlias') }}:</n-text>
                  <n-input
                    v-model:value="customAlias"
                    :placeholder="t('tools.shortUrlTools.customAliasPlaceholder')"
                  />
                </n-space>
              </n-space>
            </n-form-item>
            <n-form-item v-if="shortUrl" :label="t('tools.shortUrlTools.result')">
              <n-input
                v-model:value="shortUrl"
                readonly
                :placeholder="t('tools.shortUrlTools.resultPlaceholder')"
              />
            </n-form-item>
            <div class="btn-group">
              <n-button @click="generateShortUrl" :disabled="!url">
                {{ t('tools.shortUrlTools.generate') }}
              </n-button>
              <n-button @click="copyShortUrl" :disabled="!shortUrl">
                {{ t('common.copy') }}
              </n-button>
              <n-button @click="clearGenerator">
                {{ t('common.clear') }}
              </n-button>
            </div>
          </n-form>
        </n-tab-pane>

        <!-- 短网址解码器 -->
        <n-tab-pane :name="2" :tab="t('tools.shortUrlTools.decoder')">
          <n-form>
            <n-form-item :label="t('tools.shortUrlTools.shortUrl')">
              <n-input
                v-model:value="shortUrlToDecode"
                :placeholder="t('tools.shortUrlTools.shortUrlPlaceholder')"
              />
            </n-form-item>
            <n-form-item v-if="decodedUrl" :label="t('tools.shortUrlTools.decodedUrl')">
              <n-input
                v-model:value="decodedUrl"
                readonly
                :placeholder="t('tools.shortUrlTools.decodedUrlPlaceholder')"
              />
            </n-form-item>
            <div class="btn-group">
              <n-button @click="decodeShortUrl" :disabled="!shortUrlToDecode">
                {{ t('tools.shortUrlTools.decode') }}
              </n-button>
              <n-button @click="copyDecodedUrl" :disabled="!decodedUrl">
                {{ t('common.copy') }}
              </n-button>
              <n-button @click="clearDecoder">
                {{ t('common.clear') }}
              </n-button>
            </div>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from 'naive-ui';

const { t } = useI18n();
const message = useMessage();

// 短网址生成器相关
const url = ref('');
const shortUrl = ref('');
const expiration = ref('7d');
const customAlias = ref('');

const expirationOptions = [
  { label: '1天', value: '1d' },
  { label: '7天', value: '7d' },
  { label: '30天', value: '30d' },
  { label: '永久', value: 'never' }
];

async function generateShortUrl() {
  if (!url.value) return;

  try {
    // TODO: 调用后端API生成短网址
    // const response = await axios.post('/api/short-url/generate', {
    //   url: url.value,
    //   expiration: expiration.value,
    //   customAlias: customAlias.value
    // });
    // shortUrl.value = response.data.shortUrl;
    
    // 临时模拟
    shortUrl.value = `https://toolhub.com/s/${Math.random().toString(36).substring(2, 8)}`;
    message.success(t('tools.shortUrlTools.generateSuccess'));
  } catch (error) {
    message.error(t('tools.shortUrlTools.generateError'));
  }
}

function copyShortUrl() {
  if (shortUrl.value) {
    navigator.clipboard.writeText(shortUrl.value);
    message.success(t('common.copySuccess'));
  }
}

function clearGenerator() {
  url.value = '';
  shortUrl.value = '';
  expiration.value = '7d';
  customAlias.value = '';
}

// 短网址解码器相关
const shortUrlToDecode = ref('');
const decodedUrl = ref('');

async function decodeShortUrl() {
  if (!shortUrlToDecode.value) return;

  try {
    // TODO: 调用后端API解码短网址
    // const response = await axios.get(`/api/short-url/decode/${shortUrlToDecode.value}`);
    // decodedUrl.value = response.data.url;
    
    // 临时模拟
    decodedUrl.value = 'https://example.com/very/long/url/that/needs/to/be/shortened';
    message.success(t('tools.shortUrlTools.decodeSuccess'));
  } catch (error) {
    message.error(t('tools.shortUrlTools.decodeError'));
  }
}

function copyDecodedUrl() {
  if (decodedUrl.value) {
    navigator.clipboard.writeText(decodedUrl.value);
    message.success(t('common.copySuccess'));
  }
}

function clearDecoder() {
  shortUrlToDecode.value = '';
  decodedUrl.value = '';
}
</script>

<style scoped>
.short-url-tools {
  max-width: 800px;
  margin: 0 auto;
}
.btn-group {
  display: flex;
  gap: 12px;
  margin: 16px 0;
}
</style> 