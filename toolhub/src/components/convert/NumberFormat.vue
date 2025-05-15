<template>
  <n-card :title="$t('convert.numberFormat.title')">
    <n-form>
      <n-form-item :label="$t('convert.numberFormat.input')">
        <n-input
          v-model:value="formData.input"
          :placeholder="$t('convert.numberFormat.inputPlaceholder')"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5 }"
        />
      </n-form-item>

      <n-form-item :label="$t('convert.numberFormat.operation')">
        <n-radio-group v-model:value="formData.operation">
          <n-space>
            <n-radio value="toScientific">{{ $t('convert.numberFormat.toScientific') }}</n-radio>
            <n-radio value="toNormal">{{ $t('convert.numberFormat.toNormal') }}</n-radio>
            <n-radio value="toThousands">{{ $t('convert.numberFormat.toThousands') }}</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>

      <n-form-item :label="$t('convert.numberFormat.output')">
        <n-input
          v-model:value="formData.output"
          :placeholder="$t('convert.numberFormat.outputPlaceholder')"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5 }"
          readonly
        />
      </n-form-item>

      <n-space>
        <n-button type="primary" @click="convert">
          {{ $t('convert.numberFormat.convert') }}
        </n-button>
        <n-button @click="copyOutput">
          {{ $t('convert.numberFormat.copy') }}
        </n-button>
      </n-space>
    </n-form>

    <n-alert
      v-if="error"
      type="error"
      :title="error"
      style="margin-top: 16px"
    />
  </n-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()

const formData = reactive({
  input: '',
  operation: 'toScientific',
  output: ''
})

const error = ref('')

// 转换为科学计数法
function toScientific(num) {
  return Number(num).toExponential()
}

// 转换为普通数值
function toNormal(num) {
  return Number(num).toString()
}

// 转换为千分位格式
function toThousands(num) {
  return Number(num).toLocaleString()
}

function convert() {
  error.value = ''
  
  try {
    if (!formData.input) {
      throw new Error(t('convert.numberFormat.inputRequired'))
    }

    const num = parseFloat(formData.input)
    if (isNaN(num)) {
      throw new Error(t('convert.numberFormat.invalidNumber'))
    }

    switch (formData.operation) {
      case 'toScientific':
        formData.output = toScientific(num)
        break
      case 'toNormal':
        formData.output = toNormal(num)
        break
      case 'toThousands':
        formData.output = toThousands(num)
        break
    }
  } catch (err) {
    error.value = err.message
  }
}

function copyOutput() {
  if (formData.output) {
    navigator.clipboard.writeText(formData.output)
    message.success(t('convert.numberFormat.copied'))
  }
}
</script>

<style scoped>
.n-card {
  max-width: 800px;
  margin: 0 auto;
}
</style> 