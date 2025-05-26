<template>
  <!-- 带行号的代码编辑器组件 -->
  <div class="code-editor">
    <!-- 行号区域 -->
    <div class="line-numbers">
      <div 
        v-for="(line, index) in lineNumbers" 
        :key="index" 
        class="line-number"
      >
        {{ index + 1 }}
      </div>
    </div>
    <!-- 代码输入区域 -->
    <n-input
      :value="modelValue"
      @update:value="handleInput"
      type="textarea"
      :placeholder="placeholder"
      :autosize="{ minRows: 10, maxRows: 20 }"
      class="code-textarea"
    />
  </div>
</template>

<script setup>
// 导入Vue相关功能
import { computed, defineProps, defineEmits } from 'vue'

// 定义组件属性
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  }
})

// 定义组件事件
const emit = defineEmits(['update:modelValue'])

// 计算行号
const lineNumbers = computed(() => {
  const lines = props.modelValue.split('\n')
  return lines.length > 0 ? lines : ['']
})

/**
 * 处理输入事件
 * @param {string} value - 输入的值
 */
const handleInput = (value) => {
  emit('update:modelValue', value)
}
</script>

<style scoped>
/* 代码编辑器容器 */
.code-editor {
  position: relative;
  display: flex;
  border: 1px solid var(--n-border-color);
  border-radius: 6px;
  overflow: hidden;
  background-color: var(--n-color);
}

/* 行号区域 */
.line-numbers {
  background-color: var(--n-color-modal);
  border-right: 1px solid var(--n-border-color);
  padding: 8px 8px 8px 12px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: var(--n-text-color-disabled);
  user-select: none;
  min-width: 50px;
  text-align: right;
}

.line-number {
  height: 21px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

/* 代码文本框 */
.code-textarea {
  flex: 1;
}

.code-textarea :deep(.n-input__textarea-el) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  border: none;
  outline: none;
  resize: none;
  padding: 8px 12px;
  background-color: transparent;
}

.code-textarea :deep(.n-input__border),
.code-textarea :deep(.n-input__state-border) {
  display: none;
}

/* 深色主题适配 */
.dark .code-editor {
  border-color: #3f3f46;
}

.dark .line-numbers {
  background-color: #1f1f23;
  border-right-color: #3f3f46;
  color: #6b7280;
}
</style> 