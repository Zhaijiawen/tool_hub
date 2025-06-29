<template>
  <div class="base64-codec">
    <n-card :title="t('encrypt.base64.title')" :description="t('encrypt.base64.description')">
      <n-space vertical>
        <!-- 输入区域 -->
        <n-form-item :label="t('common.input')">
          <n-input 
            v-model:value="input" 
            type="textarea" 
            :placeholder="t('encrypt.base64.inputPlaceholder')"
            :autosize="{ minRows: 5, maxRows: 10 }" 
          />
          <div class="input-info" v-if="input">
            <n-text depth="3">{{ t('common.charCount') }}：{{ input.length }} {{ t('common.characters') }}</n-text>
          </div>
        </n-form-item>

        <!-- 操作选择 -->
        <n-form :model="formData" label-placement="left" label-width="200px">
          <n-form-item :label="t('encrypt.base64.operation')">
            <n-select 
              v-model:value="formData.operation" 
              :options="operationOptions"
              :placeholder="t('encrypt.base64.operationPlaceholder')" 
            />
          </n-form-item>
        </n-form>

        <!-- 操作按钮 -->
        <n-space>
          <n-button @click="process" type="primary" :loading="isProcessing">
            {{ t('encrypt.base64.process') }}
          </n-button>
          <n-button @click="clearAll">
            {{ t('common.clear') }}
          </n-button>
        </n-space>

        <!-- 输出区域 -->
        <n-form-item :label="t('common.output')">
          <n-input 
            v-model:value="output" 
            type="textarea" 
            :placeholder="t('encrypt.base64.outputPlaceholder')"
            :autosize="{ minRows: 5, maxRows: 10 }" 
            readonly 
          />
          <div class="output-actions" v-if="output">
            <n-space>
              <n-button @click="copyToClipboard" size="small">
                {{ t('common.copy') }}
              </n-button>
              <n-text depth="3">{{ t('common.charCount') }}：{{ output.length }} {{ t('common.characters') }}</n-text>
            </n-space>
          </div>
        </n-form-item>

        <!-- 错误提示 -->
        <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
          {{ error }}
        </n-alert>
      </n-space>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()

// 响应式数据
const input = ref('')
const output = ref('')
const error = ref('')
const isProcessing = ref(false)

const formData = reactive({
  operation: 'encode'
})

// 操作选项
const operationOptions = computed(() => [
  { label: t('encrypt.base64.encode'), value: 'encode' },
  { label: t('encrypt.base64.decode'), value: 'decode' }
])

// 处理编码/解码
const process = () => {
  try {
    if (!input.value.trim()) {
      throw new Error(t('encrypt.base64.inputRequired'))
    }

    isProcessing.value = true
    error.value = ''

    if (formData.operation === 'encode') {
      // Base64编码
      output.value = btoa(unescape(encodeURIComponent(input.value)))
    } else {
      // Base64解码
      try {
        const decoded = atob(input.value)
        output.value = decodeURIComponent(escape(decoded))
      } catch (decodeError) {
        throw new Error(t('common.invalidInput'))
      }
    }

    message.success(t('common.success'))
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  } finally {
    isProcessing.value = false
  }
}

// 复制到剪贴板
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(output.value)
    message.success(t('common.copySuccess'))
  } catch (e) {
    message.error(t('common.copyError'))
  }
}

// 清空所有内容
const clearAll = () => {
  input.value = ''
  output.value = ''
  error.value = ''
  formData.operation = 'encode'
}
</script>

<style scoped>
.base64-codec {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
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

.error-alert {
  margin-top: 16px;
}
</style>