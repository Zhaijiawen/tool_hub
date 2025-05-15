<template>
  <div class="number-base">
    <n-card :title="t('convert.numberBase.title')">
      <n-space vertical>
        <n-form :model="formData" label-placement="left" label-width="auto">
          <n-form-item :label="t('convert.numberBase.input')">
            <n-input-group>
              <n-input
                v-model:value="formData.input"
                :placeholder="t('convert.numberBase.inputPlaceholder')"
                @input="handleInput"
              />
              <n-select
                v-model:value="formData.fromBase"
                :options="baseOptions"
                style="width: 120px"
              />
            </n-input-group>
          </n-form-item>

          <n-form-item :label="t('convert.numberBase.output')">
            <n-space vertical>
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
                />
              </n-input-group>
              <n-button @click="copyOutput" size="small">
                {{ t('common.copy') }}
              </n-button>
            </n-space>
          </n-form-item>
        </n-form>

        <n-alert
          v-if="error"
          type="error"
          :title="t('common.error')"
          :content="error"
          class="error-alert"
        />
      </n-space>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
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
  { label: '2', value: 2 },
  { label: '8', value: 8 },
  { label: '10', value: 10 },
  { label: '16', value: 16 }
]

const handleInput = () => {
  convert()
}

const convert = () => {
  try {
    if (!formData.input) {
      formData.output = ''
      error.value = ''
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

    // 转换为目标进制
    formData.output = decimal.toString(formData.toBase).toUpperCase()
    error.value = ''
  } catch (e) {
    error.value = e.message
    formData.output = ''
  }
}

const copyOutput = () => {
  if (!formData.output) return
  navigator.clipboard.writeText(formData.output)
  message.success(t('common.success'))
}

// 监听进制变化
watch([() => formData.fromBase, () => formData.toBase], () => {
  convert()
})
</script>

<style scoped>
.number-base {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}

.error-alert {
  margin-top: 16px;
}
</style> 