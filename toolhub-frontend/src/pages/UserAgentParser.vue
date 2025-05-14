<template>
  <div class="user-agent-parser">
    <n-card :title="t('tools.userAgentParser.title')">
      <n-form>
        <n-form-item :label="t('tools.userAgentParser.input')">
          <n-input
            v-model:value="userAgent"
            type="textarea"
            :placeholder="t('tools.userAgentParser.inputPlaceholder')"
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
        </n-form-item>

        <n-form-item>
          <n-space>
            <n-button @click="parseUserAgent" type="primary">
              {{ t('tools.userAgentParser.parse') }}
            </n-button>
            <n-button @click="getMyUserAgent" type="info">
              {{ t('tools.userAgentParser.getMyUserAgent') }}
            </n-button>
            <n-button @click="clear" type="warning">
              {{ t('common.clear') }}
            </n-button>
          </n-space>
        </n-form-item>

        <template v-if="parsedInfo">
          <n-divider>{{ t('tools.userAgentParser.browser') }}</n-divider>
          
          <n-descriptions bordered>
            <n-descriptions-item :label="t('tools.userAgentParser.browserName')">
              {{ parsedInfo.browser.name }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('tools.userAgentParser.browserVersion')">
              {{ parsedInfo.browser.version }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('tools.userAgentParser.browserEngine')">
              {{ parsedInfo.browser.engine }}
            </n-descriptions-item>
          </n-descriptions>

          <n-divider>{{ t('tools.userAgentParser.os') }}</n-divider>
          
          <n-descriptions bordered>
            <n-descriptions-item :label="t('tools.userAgentParser.osName')">
              {{ parsedInfo.os.name }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('tools.userAgentParser.osVersion')">
              {{ parsedInfo.os.version }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('tools.userAgentParser.osArchitecture')">
              {{ parsedInfo.os.architecture }}
            </n-descriptions-item>
          </n-descriptions>

          <n-divider>{{ t('tools.userAgentParser.device') }}</n-divider>
          
          <n-descriptions bordered>
            <n-descriptions-item :label="t('tools.userAgentParser.deviceType')">
              {{ parsedInfo.device.type }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('tools.userAgentParser.deviceModel')">
              {{ parsedInfo.device.model }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('tools.userAgentParser.deviceVendor')">
              {{ parsedInfo.device.vendor }}
            </n-descriptions-item>
          </n-descriptions>

          <n-divider>{{ t('tools.userAgentParser.cpu') }}</n-divider>
          
          <n-descriptions bordered>
            <n-descriptions-item :label="t('tools.userAgentParser.cpuArchitecture')">
              {{ parsedInfo.cpu.architecture }}
            </n-descriptions-item>
          </n-descriptions>
        </template>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from 'naive-ui';

const { t } = useI18n();
const message = useMessage();

const userAgent = ref('');
const parsedInfo = ref<any>(null);

// 模拟解析结果
const mockParsedInfo = {
  browser: {
    name: 'Chrome',
    version: '120.0.0.0',
    engine: 'Blink'
  },
  os: {
    name: 'macOS',
    version: '14.4.0',
    architecture: 'x64'
  },
  device: {
    type: 'desktop',
    model: 'MacBook Pro',
    vendor: 'Apple'
  },
  cpu: {
    architecture: 'x64'
  }
};

function parseUserAgent() {
  if (!userAgent.value) {
    message.error(t('tools.userAgentParser.userAgentRequired'));
    return;
  }

  try {
    // 这里应该使用实际的 User-Agent 解析库
    // 例如 ua-parser-js
    // const parser = new UAParser(userAgent.value);
    // parsedInfo.value = parser.getResult();
    
    // 使用模拟数据
    parsedInfo.value = mockParsedInfo;
    message.success(t('tools.userAgentParser.parseSuccess'));
  } catch (error) {
    message.error(t('tools.userAgentParser.parseError'));
  }
}

function getMyUserAgent() {
  userAgent.value = navigator.userAgent;
  parseUserAgent();
}

function clear() {
  userAgent.value = '';
  parsedInfo.value = null;
}
</script>

<style scoped>
.user-agent-parser {
  max-width: 800px;
  margin: 0 auto;
}
</style> 