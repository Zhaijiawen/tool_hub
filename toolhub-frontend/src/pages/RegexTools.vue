<template>
  <div class="regex-tools">
    <n-card :title="t('tools.regexTools.title')">
      <n-tabs type="line" animated>
        <!-- 正则测试器 -->
        <n-tab-pane :name="1" :tab="t('tools.regexTools.tester')">
          <n-form>
            <n-form-item :label="t('tools.regexTools.pattern')">
              <n-input
                v-model:value="pattern"
                type="textarea"
                :placeholder="t('tools.regexTools.patternPlaceholder')"
                :autosize="{ minRows: 2, maxRows: 5 }"
                @update:value="handleTest"
              />
            </n-form-item>
            <n-form-item :label="t('tools.regexTools.flags')">
              <n-space>
                <n-checkbox v-model:checked="flags.global" @update:checked="handleTest">
                  {{ t('tools.regexTools.global') }}
                </n-checkbox>
                <n-checkbox v-model:checked="flags.ignoreCase" @update:checked="handleTest">
                  {{ t('tools.regexTools.ignoreCase') }}
                </n-checkbox>
                <n-checkbox v-model:checked="flags.multiline" @update:checked="handleTest">
                  {{ t('tools.regexTools.multiline') }}
                </n-checkbox>
                <n-checkbox v-model:checked="flags.sticky" @update:checked="handleTest">
                  {{ t('tools.regexTools.sticky') }}
                </n-checkbox>
                <n-checkbox v-model:checked="flags.unicode" @update:checked="handleTest">
                  {{ t('tools.regexTools.unicode') }}
                </n-checkbox>
              </n-space>
            </n-form-item>
            <n-form-item :label="t('tools.regexTools.testString')">
              <n-input
                v-model:value="testString"
                type="textarea"
                :placeholder="t('tools.regexTools.testStringPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 8 }"
                @update:value="handleTest"
              />
            </n-form-item>
            <n-form-item v-if="error" :label="t('tools.regexTools.error')">
              <n-alert type="error">{{ error }}</n-alert>
            </n-form-item>
            <n-form-item v-if="matches.length > 0" :label="t('tools.regexTools.matches')">
              <n-list>
                <n-list-item v-for="(match, index) in matches" :key="index">
                  <n-card>
                    <template #header>
                      {{ t('tools.regexTools.match') }} #{{ index + 1 }}
                    </template>
                    <n-space vertical>
                      <div>
                        <strong>{{ t('tools.regexTools.fullMatch') }}:</strong>
                        <n-text>{{ match.match }}</n-text>
                      </div>
                      <div v-if="match.groups">
                        <strong>{{ t('tools.regexTools.groups') }}:</strong>
                        <n-space vertical>
                          <div v-for="(value, key) in match.groups" :key="key">
                            <n-text>{{ key }}: {{ value }}</n-text>
                          </div>
                        </n-space>
                      </div>
                      <div>
                        <strong>{{ t('tools.regexTools.index') }}:</strong>
                        <n-text>{{ match.index }}</n-text>
                      </div>
                    </n-space>
                  </n-card>
                </n-list-item>
              </n-list>
            </n-form-item>
          </n-form>
        </n-tab-pane>

        <!-- 正则生成器 -->
        <n-tab-pane :name="2" :tab="t('tools.regexTools.generator')">
          <n-form>
            <n-form-item :label="t('tools.regexTools.patternType')">
              <n-select
                v-model:value="patternType"
                :options="patternTypes"
                @update:value="handleGenerate"
              />
            </n-form-item>
            <n-form-item v-if="patternType === 'custom'" :label="t('tools.regexTools.customPattern')">
              <n-input
                v-model:value="customPattern"
                type="textarea"
                :placeholder="t('tools.regexTools.customPatternPlaceholder')"
                :autosize="{ minRows: 2, maxRows: 5 }"
                @update:value="handleGenerate"
              />
            </n-form-item>
            <n-form-item v-if="patternType === 'email'" :label="t('tools.regexTools.emailOptions')">
              <n-space vertical>
                <n-checkbox v-model:checked="emailOptions.allowSubdomains" @update:checked="handleGenerate">
                  {{ t('tools.regexTools.allowSubdomains') }}
                </n-checkbox>
                <n-checkbox v-model:checked="emailOptions.allowIP" @update:checked="handleGenerate">
                  {{ t('tools.regexTools.allowIP') }}
                </n-checkbox>
                <n-checkbox v-model:checked="emailOptions.allowLocal" @update:checked="handleGenerate">
                  {{ t('tools.regexTools.allowLocal') }}
                </n-checkbox>
              </n-space>
            </n-form-item>
            <n-form-item v-if="patternType === 'url'" :label="t('tools.regexTools.urlOptions')">
              <n-space vertical>
                <n-checkbox v-model:checked="urlOptions.requireProtocol" @update:checked="handleGenerate">
                  {{ t('tools.regexTools.requireProtocol') }}
                </n-checkbox>
                <n-checkbox v-model:checked="urlOptions.allowIP" @update:checked="handleGenerate">
                  {{ t('tools.regexTools.allowIP') }}
                </n-checkbox>
                <n-checkbox v-model:checked="urlOptions.allowLocal" @update:checked="handleGenerate">
                  {{ t('tools.regexTools.allowLocal') }}
                </n-checkbox>
              </n-space>
            </n-form-item>
            <n-form-item v-if="patternType === 'phone'" :label="t('tools.regexTools.phoneOptions')">
              <n-select
                v-model:value="phoneOptions.format"
                :options="phoneFormats"
                @update:value="handleGenerate"
              />
            </n-form-item>
            <n-form-item v-if="patternType === 'date'" :label="t('tools.regexTools.dateOptions')">
              <n-select
                v-model:value="dateOptions.format"
                :options="dateFormats"
                @update:value="handleGenerate"
              />
            </n-form-item>
            <n-form-item :label="t('tools.regexTools.generatedPattern')">
              <n-input
                v-model:value="generatedPattern"
                type="textarea"
                readonly
                :autosize="{ minRows: 2, maxRows: 5 }"
              />
            </n-form-item>
            <n-form-item :label="t('tools.regexTools.description')">
              <n-text>{{ patternDescription }}</n-text>
            </n-form-item>
            <div class="btn-group">
              <n-button @click="copyPattern">{{ t('common.copy') }}</n-button>
              <n-button @click="clearGenerator">{{ t('common.clear') }}</n-button>
            </div>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from 'naive-ui';

const { t } = useI18n();
const message = useMessage();

// 正则测试器相关
const pattern = ref('');
const testString = ref('');
const error = ref('');
const matches = ref<Array<{ match: string; groups?: Record<string, string>; index: number }>>([]);
const flags = ref({
  global: true,
  ignoreCase: false,
  multiline: false,
  sticky: false,
  unicode: false
});

// 正则生成器相关
const patternType = ref('email');
const customPattern = ref('');
const generatedPattern = ref('');
const patternDescription = ref('');

const patternTypes = [
  { label: t('tools.regexTools.email'), value: 'email' },
  { label: t('tools.regexTools.url'), value: 'url' },
  { label: t('tools.regexTools.phone'), value: 'phone' },
  { label: t('tools.regexTools.date'), value: 'date' },
  { label: t('tools.regexTools.custom'), value: 'custom' }
];

const emailOptions = ref({
  allowSubdomains: true,
  allowIP: false,
  allowLocal: false
});

const urlOptions = ref({
  requireProtocol: true,
  allowIP: false,
  allowLocal: false
});

const phoneOptions = ref({
  format: 'international'
});

const dateOptions = ref({
  format: 'iso'
});

const phoneFormats = [
  { label: t('tools.regexTools.international'), value: 'international' },
  { label: t('tools.regexTools.northAmerican'), value: 'northAmerican' },
  { label: t('tools.regexTools.chinese'), value: 'chinese' }
];

const dateFormats = [
  { label: t('tools.regexTools.iso'), value: 'iso' },
  { label: t('tools.regexTools.us'), value: 'us' },
  { label: t('tools.regexTools.european'), value: 'european' }
];

// 正则测试器处理函数
function handleTest() {
  error.value = '';
  matches.value = [];

  if (!pattern.value) return;

  try {
    const flagString = Object.entries(flags.value)
      .filter(([_, value]) => value)
      .map(([key]) => key[0])
      .join('');

    const regex = new RegExp(pattern.value, flagString);
    const results = [...testString.value.matchAll(regex)];

    matches.value = results.map(result => ({
      match: result[0],
      groups: result.groups,
      index: result.index
    }));
  } catch (e) {
    error.value = e.message;
  }
}

// 正则生成器处理函数
function handleGenerate() {
  switch (patternType.value) {
    case 'email':
      generateEmailPattern();
      break;
    case 'url':
      generateUrlPattern();
      break;
    case 'phone':
      generatePhonePattern();
      break;
    case 'date':
      generateDatePattern();
      break;
    case 'custom':
      generatedPattern.value = customPattern.value;
      patternDescription.value = t('tools.regexTools.customPatternDescription');
      break;
  }
}

function generateEmailPattern() {
  let pattern = '^[a-zA-Z0-9._%+-]+@';
  if (emailOptions.value.allowSubdomains) {
    pattern += '(?:[a-zA-Z0-9-]+\\.)+';
  } else {
    pattern += '[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}';
  }
  pattern += '[a-zA-Z]{2,}$';

  if (emailOptions.value.allowIP) {
    pattern = pattern.replace('@[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}', '@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}|@\\[(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\]');
  }

  if (emailOptions.value.allowLocal) {
    pattern = pattern.replace('^[a-zA-Z0-9._%+-]+', '^[a-zA-Z0-9._%+-]+(?:\\+[a-zA-Z0-9._%+-]+)?');
  }

  generatedPattern.value = pattern;
  patternDescription.value = t('tools.regexTools.emailDescription');
}

function generateUrlPattern() {
  let pattern = '^(?:https?:\\/\\/)?';
  if (urlOptions.value.requireProtocol) {
    pattern = '^https?:\\/\\/';
  }

  pattern += '(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}';

  if (urlOptions.value.allowIP) {
    pattern = pattern.replace('(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}', '(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}|(?:[0-9]{1,3}\\.){3}[0-9]{1,3}');
  }

  if (urlOptions.value.allowLocal) {
    pattern = pattern.replace('^(?:https?:\\/\\/)?', '^(?:https?:\\/\\/)?(?:localhost|127\\.0\\.0\\.1|\\[::1\\])|');
  }

  pattern += '(?:\\/[a-zA-Z0-9._~:/?#\\[\\]@!$&\'()*+,;=%-]*)?$';

  generatedPattern.value = pattern;
  patternDescription.value = t('tools.regexTools.urlDescription');
}

function generatePhonePattern() {
  switch (phoneOptions.value.format) {
    case 'international':
      generatedPattern.value = '^\\+[1-9]\\d{1,14}$';
      patternDescription.value = t('tools.regexTools.internationalPhoneDescription');
      break;
    case 'northAmerican':
      generatedPattern.value = '^\\+?1?[-.\\s]?\\(?[0-9]{3}\\)?[-.\\s]?[0-9]{3}[-.\\s]?[0-9]{4}$';
      patternDescription.value = t('tools.regexTools.northAmericanPhoneDescription');
      break;
    case 'chinese':
      generatedPattern.value = '^1[3-9]\\d{9}$';
      patternDescription.value = t('tools.regexTools.chinesePhoneDescription');
      break;
  }
}

function generateDatePattern() {
  switch (dateOptions.value.format) {
    case 'iso':
      generatedPattern.value = '^\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])$';
      patternDescription.value = t('tools.regexTools.isoDateDescription');
      break;
    case 'us':
      generatedPattern.value = '^(?:0[1-9]|1[0-2])/(?:0[1-9]|[12]\\d|3[01])/\\d{4}$';
      patternDescription.value = t('tools.regexTools.usDateDescription');
      break;
    case 'european':
      generatedPattern.value = '^(?:0[1-9]|[12]\\d|3[01])/(?:0[1-9]|1[0-2])/\\d{4}$';
      patternDescription.value = t('tools.regexTools.europeanDateDescription');
      break;
  }
}

// 复制和清空函数
function copyPattern() {
  if (generatedPattern.value) {
    navigator.clipboard.writeText(generatedPattern.value);
    message.success(t('common.copySuccess'));
  }
}

function clearGenerator() {
  patternType.value = 'email';
  customPattern.value = '';
  generatedPattern.value = '';
  patternDescription.value = '';
  emailOptions.value = {
    allowSubdomains: true,
    allowIP: false,
    allowLocal: false
  };
  urlOptions.value = {
    requireProtocol: true,
    allowIP: false,
    allowLocal: false
  };
  phoneOptions.value = {
    format: 'international'
  };
  dateOptions.value = {
    format: 'iso'
  };
}
</script>

<style scoped>
.regex-tools {
  max-width: 800px;
  margin: 0 auto;
}
.btn-group {
  display: flex;
  gap: 12px;
  margin: 16px 0;
}
</style> 