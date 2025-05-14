<template>
  <div class="json-formatter">
    <n-card :title="t('tools.jsonFormatter.title')" class="formatter-card">
      <n-space vertical>
        <n-space align="center">
          <n-switch v-model:value="enableHighlight" @update:value="handleHighlightChange">
            {{ t('tools.jsonFormatter.enableHighlight') }}
          </n-switch>
          <n-select
            v-model:value="highlightTheme"
            :options="highlightThemes"
            :disabled="!enableHighlight"
            style="width: 200px"
            @update:value="handleThemeChange"
          />
        </n-space>
        <div class="editor-container">
          <n-input
            v-model:value="input"
            type="textarea"
            :placeholder="t('common.input')"
            :autosize="{ minRows: 10, maxRows: 20 }"
            @update:value="handleInputChange"
          />
          <div v-if="enableHighlight" class="highlight-preview" v-html="highlightedInput"></div>
        </div>
        <n-space>
          <n-button type="primary" @click="handleFormat">
            {{ t('tools.jsonFormatter.format') }}
          </n-button>
          <n-button @click="handleCompress">
            {{ t('tools.jsonFormatter.compress') }}
          </n-button>
          <n-button @click="handleEscape">
            {{ t('tools.jsonFormatter.escape') }}
          </n-button>
          <n-button @click="handleUnescape">
            {{ t('tools.jsonFormatter.unescape') }}
          </n-button>
        </n-space>
        <div class="editor-container">
          <n-input
            v-model:value="output"
            type="textarea"
            :placeholder="t('common.result')"
            :autosize="{ minRows: 10, maxRows: 20 }"
            readonly
            @update:value="handleOutputChange"
          />
          <div v-if="enableHighlight" class="highlight-preview" v-html="highlightedOutput"></div>
        </div>
        <n-space>
          <n-button @click="handleCopy">
            {{ t('common.copy') }}
          </n-button>
          <n-button @click="handleClear">
            {{ t('common.clear') }}
          </n-button>
        </n-space>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from 'naive-ui';
import { formatCode, compressCode } from '../utils/formatter';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

const { t } = useI18n();
const message = useMessage();

const input = ref('');
const output = ref('');
const enableHighlight = ref(localStorage.getItem('jsonFormatterHighlight') === 'true');
const highlightTheme = ref(localStorage.getItem('jsonFormatterTheme') || 'github');
const highlightedInput = ref('');
const highlightedOutput = ref('');

const highlightThemes = [
  { label: 'GitHub', value: 'github' },
  { label: 'VS2015', value: 'vs2015' },
  { label: 'Atom One Dark', value: 'atom-one-dark' },
  { label: 'Monokai', value: 'monokai' },
  { label: 'Solarized Light', value: 'solarized-light' },
];

onMounted(() => {
  // 加载主题样式
  import(`highlight.js/styles/${highlightTheme.value}.css`);
});

watch(highlightTheme, (newTheme) => {
  localStorage.setItem('jsonFormatterTheme', newTheme);
  import(`highlight.js/styles/${newTheme}.css`);
});

watch(enableHighlight, (value) => {
  localStorage.setItem('jsonFormatterHighlight', value.toString());
});

const highlightCode = (code: string) => {
  try {
    return hljs.highlight(code, { language: 'json' }).value;
  } catch (error) {
    return code;
  }
};

const handleInputChange = () => {
  if (enableHighlight.value) {
    highlightedInput.value = highlightCode(input.value);
  }
};

const handleOutputChange = () => {
  if (enableHighlight.value) {
    highlightedOutput.value = highlightCode(output.value);
  }
};

const handleHighlightChange = (value: boolean) => {
  if (value) {
    handleInputChange();
    handleOutputChange();
  }
};

const handleThemeChange = (theme: string) => {
  import(`highlight.js/styles/${theme}.css`);
};

const handleFormat = async () => {
  try {
    output.value = await formatCode(input.value, 'json', {
      printWidth: 80,
      tabWidth: 2,
      singleQuote: false,
      trailingComma: 'es5',
    });
    handleOutputChange();
  } catch (error) {
    message.error(error.message);
  }
};

const handleCompress = async () => {
  try {
    output.value = await compressCode(input.value, 'json');
    handleOutputChange();
  } catch (error) {
    message.error(error.message);
  }
};

const handleEscape = () => {
  try {
    const json = JSON.stringify(input.value);
    output.value = json.slice(1, -1);
    handleOutputChange();
  } catch (error) {
    message.error(t('common.error'));
  }
};

const handleUnescape = () => {
  try {
    output.value = JSON.parse(`"${input.value}"`);
    handleOutputChange();
  } catch (error) {
    message.error(t('common.error'));
  }
};

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(output.value);
    message.success(t('common.copySuccess'));
  } catch (error) {
    message.error(t('common.error'));
  }
};

const handleClear = () => {
  input.value = '';
  output.value = '';
  highlightedInput.value = '';
  highlightedOutput.value = '';
};
</script>

<style scoped>
.json-formatter {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.formatter-card {
  margin-bottom: 20px;
}

.editor-container {
  position: relative;
  width: 100%;
}

.highlight-preview {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  white-space: pre-wrap;
  font-family: monospace;
  padding: 8px;
  background: transparent;
  color: transparent;
  caret-color: black;
}

.highlight-preview :deep(pre) {
  margin: 0;
  background: transparent !important;
}

.highlight-preview :deep(code) {
  background: transparent !important;
}
</style> 