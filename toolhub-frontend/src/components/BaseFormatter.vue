<template>
  <div class="formatter">
    <n-card :title="title">
      <n-space vertical>
        <n-input
          v-model:value="input"
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 20 }"
          :placeholder="placeholder"
          class="formatter-input"
        />
        <n-space>
          <n-button type="primary" @click="handleFormat">格式化</n-button>
          <n-button @click="handleCompress">压缩</n-button>
          <n-button @click="handleCopy">复制</n-button>
          <slot name="extra-buttons"></slot>
        </n-space>
        <n-alert v-if="error" type="error" :title="error" />
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NInput, NSpace, NButton, NAlert, useMessage } from 'naive-ui'

const props = defineProps<{
  title: string
  placeholder: string
  formatFn: (input: string) => string
  compressFn: (input: string) => string
}>()

const input = ref('')
const error = ref('')
const message = useMessage()

const handleFormat = () => {
  try {
    input.value = props.formatFn(input.value)
    error.value = ''
  } catch (e) {
    error.value = e instanceof Error ? e.message : '格式化失败'
  }
}

const handleCompress = () => {
  try {
    input.value = props.compressFn(input.value)
    error.value = ''
  } catch (e) {
    error.value = e instanceof Error ? e.message : '压缩失败'
  }
}

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(input.value)
    message.success('复制成功')
  } catch (e) {
    message.error('复制失败')
  }
}

defineExpose({
  input
})
</script>

<style scoped>
.formatter {
  max-width: 1200px;
  margin: 0 auto;
}

.formatter-input {
  font-family: monospace;
}
</style> 