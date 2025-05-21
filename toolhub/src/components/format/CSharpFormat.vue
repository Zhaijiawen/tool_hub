<template>
  <div class="csharp-format">
    <n-card :title="t('format.csharp.title')" :bordered="false">
      <template #header-extra>
        <n-button quaternary circle @click="isCollapsed = !isCollapsed">
          <template #icon>
            <n-icon>
              <chevron-down v-if="!isCollapsed" />
              <chevron-up v-else />
            </n-icon>
          </template>
        </n-button>
      </template>
      <n-collapse-transition>
        <div v-show="!isCollapsed">
          <n-input
            v-model:value="input"
            type="textarea"
            :placeholder="t('format.csharp.placeholder')"
            :autosize="{ minRows: 10, maxRows: 20 }"
          />
          <div class="button-group">
            <n-button @click="formatCSharp" type="primary">
              {{ t('format.csharp.format') }}
            </n-button>
            <n-button @click="copyToClipboard">
              {{ t('common.copy') }}
            </n-button>
          </div>
          <n-alert
            v-if="error"
            type="error"
            :title="t('common.error')"
            :content="error"
            class="error-alert"
          />
        </div>
      </n-collapse-transition>
    </n-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { js_beautify } from 'js-beautify'
import { ChevronDown, ChevronUp } from '@vicons/ionicons5'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const error = ref('')
const isCollapsed = ref(false)

const formatCSharp = () => {
  try {
    input.value = js_beautify(input.value, {
      indent_size: 4,
      indent_char: ' ',
      max_preserve_newlines: 2,
      preserve_newlines: true,
      keep_array_indentation: false,
      break_chained_methods: false,
      indent_scripts: 'normal',
      brace_style: 'collapse',
      space_before_conditional: true,
      unescape_strings: false,
      jslint_happy: false,
      end_with_newline: true,
      wrap_line_length: 100,
      indent_inner_html: false,
      comma_first: false,
      e4x: false,
      indent_empty_lines: false
    })
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(input.value)
    message.success(t('common.success'))
  } catch (e) {
    message.error(t('common.error'))
  }
}
</script>

<style scoped>
.csharp-format {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.button-group {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

.error-alert {
  margin-top: 16px;
}
</style> 