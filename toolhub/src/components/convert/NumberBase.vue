<template>
  <div class="number-base-convert">

    <n-card :title="t('convert.numberBase.title')" :bordered="false">
      <n-space vertical size="large">
        <!-- 输入区域 -->
        <div class="input-section">
          <n-text class="section-title">{{ t('convert.numberBase.input') }}</n-text>
          <n-input-group>
            <n-input 
              v-model:value="formData.input" 
              :placeholder="t('convert.numberBase.inputPlaceholder')"
              @input="handleInput"
              clearable
            />
            <n-select 
              v-model:value="formData.fromBase" 
              :options="baseOptions" 
              style="width: 120px"
              @update:value="handleInput"
            />
          </n-input-group>
        </div>

        <!-- 转换按钮 -->
        <div class="button-row">
          <n-button type="primary" @click="convert" :disabled="!formData.input.trim()">
            {{ t('convert.numberBase.convert') }}
          </n-button>
        </div>

        <!-- 输出区域 -->
        <div class="output-section">
          <n-text class="section-title">{{ t('convert.numberBase.output') }}</n-text>
          <div class="output-with-copy">
            <n-input-group>
              <n-input 
                v-model:value="formData.output" 
                :placeholder="t('convert.numberBase.outputPlaceholder')"
                readonly
              />
              <n-select 
                v-model:value="formData.toBase" 
                :options="baseOptions" 
                style="width: 120px"
                @update:value="handleInput"
              />
            </n-input-group>
            <n-button @click="copyOutput" size="small" type="primary">
              {{ t('common.copy') }}
            </n-button>
          </div>
        </div>

        <!-- 错误提示 -->
        <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
          {{ error }}
        </n-alert>

        <!-- 使用说明 -->
        <div class="info-section">
          <n-alert type="info" :title="t('convert.numberBase.infoTitle')" class="info-alert">
            {{ t('convert.numberBase.infoContent') }}
          </n-alert>
        </div>
      </n-space>
    </n-card>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()

const formData = reactive({
  input: '',
  fromBase: 10,
  output: '',
  toBase: 2
})

const error = ref('')

const baseOptions = [
  { label: t('convert.numberBase.binary'), value: 2 },
  { label: t('convert.numberBase.octal'), value: 8 },
  { label: t('convert.numberBase.decimal'), value: 10 },
  { label: t('convert.numberBase.hexadecimal'), value: 16 }
]

const handleInput = () => {
  error.value = ''
  if (formData.input.trim()) {
    convert()
  } else {
    formData.output = ''
  }
}

const convert = () => {
  try {
    if (!formData.input.trim()) {
      error.value = t('convert.numberBase.inputRequired')
      return
    }

    // 验证输入是否合法
    const validChars = {
      2: /^[01]+$/,
      8: /^[0-7]+$/,
      10: /^\d+$/,
      16: /^[0-9A-Fa-f]+$/
    }

    if (!validChars[formData.fromBase].test(formData.input)) {
      throw new Error(t('convert.numberBase.invalidInput'))
    }

    // 转换为十进制
    const decimal = parseInt(formData.input, formData.fromBase)
    
    if (isNaN(decimal)) {
      throw new Error(t('convert.numberBase.invalidInput'))
    }

    // 转换为目标进制
    formData.output = decimal.toString(formData.toBase).toUpperCase()
    error.value = ''
  } catch (err) {
    error.value = err.message
    formData.output = ''
    message.error(t('common.error'))
  }
}

const copyOutput = () => {
  if (formData.output) {
    try {
      navigator.clipboard.writeText(formData.output)
      message.success(t('common.copy') + ' ' + t('common.success'))
    } catch (e) {
      message.error(t('common.copy') + ' ' + t('common.error'))
    }
  }
}
</script>

<style scoped>
.number-base-convert {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.input-section {
  margin-bottom: 20px;
}

.section-title {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.button-row {
  margin: 12px 0;
}

.output-section {
  margin-bottom: 20px;
}

.output-with-copy {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.output-with-copy .n-input-group {
  flex: 1;
}

.error-alert {
  margin-top: 16px;
}

.info-section {
  margin-bottom: 20px;
}

.info-alert {
  margin-top: 8px;
}
</style>