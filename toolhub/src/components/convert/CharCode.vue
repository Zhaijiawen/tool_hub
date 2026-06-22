<template>
  <div class="char-codec">
    <!-- 工具简介 -->
    <ToolIntro toolKey="char-code" />


    <n-card :title="t('convert.charCode.title')" :description="t('convert.charCode.description')">
      <!-- 输入区 -->
      <div class="input-section">
        <n-text>{{ t('convert.charCode.input') }}</n-text>
        <n-input
          v-model:value="input"
          type="textarea"
          :placeholder="t('convert.charCode.inputPlaceholder')"
          :autosize="{ minRows: 3, maxRows: 8 }"
        />
        <div class="input-info" v-if="input">
          <n-text depth="3">{{ t('common.charCount') }}：{{ input.length }} {{ t('common.characters') }}</n-text>
        </div>
      </div>

      <!-- 按钮区 -->
      <div class="button-group">
        <n-button @click="toCode" type="primary" :disabled="!input">
          {{ t('convert.charCode.toCode') }}
        </n-button>
        <n-button @click="toChar" type="info" :disabled="!input">
          {{ t('convert.charCode.toChar') }}
        </n-button>
        <n-button @click="clearAll">
          {{ t('common.clear') }}
        </n-button>
      </div>

      <!-- 输出区 -->
      <div class="output-section">
        <n-text>{{ t('common.output') }}</n-text>
        <div v-if="output">
          <n-input
            v-model:value="output"
            type="textarea"
            :placeholder="t('convert.charCode.outputPlaceholder')"
            :autosize="{ minRows: 3, maxRows: 8 }"
            readonly
          />
          <div class="output-actions">
            <n-space>
              <n-button @click="copyOutput" size="small">
                {{ t('common.copy') }}
              </n-button>
              <n-text depth="3">{{ t('common.charCount') }}：{{ output.length }} {{ t('common.characters') }}</n-text>
            </n-space>
          </div>
        </div>
        <div v-if="!output" class="output-placeholder">
          <n-text depth="3">{{ t('convert.charCode.outputPlaceholder') }}</n-text>
        </div>
      </div>

      <!-- 错误提示 -->
      <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
        {{ error }}
      </n-alert>

      <!-- 使用说明 -->
      <div class="info-section">
        <n-alert type="info" :title="t('convert.charCode.infoTitle')" class="info-alert">
          {{ t('convert.charCode.infoContent') }}
        </n-alert>
      </div>
    </n-card>
    
  </div>
  <TutorialAndDocs toolKey="charCode" />
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
import ToolIntro from '@/components/common/ToolIntro.vue'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const output = ref('')
const error = ref('')

function toCode() {
  error.value = ''
  if (!input.value) {
    error.value = t('convert.charCode.inputRequired')
    return
  }
  try {
    const result = []
    for (let i = 0; i < input.value.length; i++) {
      const char = input.value[i]
      const code = char.charCodeAt(0)
      result.push(`U+${code.toString(16).toUpperCase().padStart(4, '0')}`)
    }
    output.value = result.join(' ')
  } catch (e) {
    error.value = t('convert.charCode.invalidInput')
  }
}

function toChar() {
  error.value = ''
  if (!input.value) {
    error.value = t('convert.charCode.inputRequired')
    return
  }
  try {
    const codes = input.value.trim().split(/\s+/)
    const result = codes.map(code => {
      const hex = code.replace(/^U\+/i, '')
      const num = parseInt(hex, 16)
      if (isNaN(num)) {
        throw new Error(t('convert.charCode.invalidCode'))
      }
      return String.fromCharCode(num)
    })
    output.value = result.join('')
  } catch (e) {
    error.value = e.message || t('convert.charCode.invalidInput')
  }
}

function copyOutput() {
  if (!output.value) return
  navigator.clipboard.writeText(output.value)
  message.success(t('common.copied'))
}

function clearAll() {
  input.value = ''
  output.value = ''
  error.value = ''
}
</script>

<style scoped>
.char-codec {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.input-section,
.output-section {
  width: 100%;
  margin-bottom: 20px;
  border: none;
  background: none;
  padding: 0;
}

.button-group {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.input-info {
  margin-top: 8px;
}

.output-actions {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.output-placeholder {
  text-align: center;
  padding: 40px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background-color: #fafafa;
}

.error-alert {
  margin-top: 16px;
}

.info-section {
  margin-top: 16px;
}

.info-alert {
  margin-bottom: 8px;
}
</style>
