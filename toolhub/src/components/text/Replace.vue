<template>
  <div class="text-replace">
    <!-- 工具简介 -->
    <ToolIntro toolKey="replace" />

    
    <n-card :title="$t('text.replace.title')">
      <n-form>
        <n-form-item :label="$t('text.replace.input')">
          <n-input 
            v-model:value="input" 
            type="textarea" 
            :placeholder="$t('text.replace.inputPlaceholder')"
            :autosize="{ minRows: 3, maxRows: 10 }" 
            @keydown="handleInputKeydown"
          />
        </n-form-item>

        <n-form-item :label="$t('text.replace.find')">
          <n-input-group>
            <n-input 
              v-model:value="find" 
              ref="findInputRef"
              :placeholder="$t('text.replace.findPlaceholder')" 
              style="flex: 1"
              @focus="onFindInputFocus"
            />
            <n-select
              v-model:value="selectedFindSpecial"
              :options="specialOptions"
              style="width: 140px"
              :placeholder="$t('text.replace.special')"
              @update:value="insertToFind"
              clearable
            />
          </n-input-group>
        </n-form-item>

        <n-form-item :label="$t('text.replace.replace')">
          <n-input-group>
            <n-input 
              v-model:value="replace" 
              ref="replaceInputRef"
              :placeholder="$t('text.replace.replacePlaceholder')" 
              style="flex: 1"
              @focus="onReplaceInputFocus"
            />
            <n-select
              v-model:value="selectedReplaceSpecial"
              :options="specialOptions"
              style="width: 140px"
              :placeholder="$t('text.replace.special')"
              @update:value="insertToReplace"
              clearable
            />
          </n-input-group>
        </n-form-item>

        <n-space>
          <n-checkbox v-model:checked="caseSensitive">
            {{ $t('text.replace.caseSensitive') }}
          </n-checkbox>
          <n-checkbox v-model:checked="useRegex">
            {{ $t('text.replace.useRegex') }}
          </n-checkbox>
        </n-space>

        <n-space class="mt-4">
          <n-button type="primary" @click="replaceAll">
            {{ $t('text.replace.replace') }}
          </n-button>
        </n-space>

        <n-form-item :label="$t('text.replace.output')" class="mt-4">
          <n-input 
            v-model:value="output" 
            type="textarea" 
            :placeholder="$t('text.replace.outputPlaceholder')"
            :autosize="{ minRows: 3, maxRows: 10 }" 
            readonly 
          />
        </n-form-item>

        <n-space>
          <n-button @click="copyOutput" :disabled="!output">
            {{ $t('text.replace.copy') }}
          </n-button>
          <n-button @click="clearAll">
            {{ $t('text.replace.clear') }}
          </n-button>
        </n-space>
        
        <n-alert type="info" :title="$t('text.replace.infoTitle')" class="info-section">
          {{ $t('text.replace.infoContent') }}
        </n-alert>
      </n-form>
    </n-card>

  </div>
  <TutorialAndDocs toolKey="replace" />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
import ToolIntro from '@/components/common/ToolIntro.vue'

const { t } = useI18n()
const message = useMessage()

// 响应式数据
const input = ref('')
const find = ref('')
const replace = ref('')
const output = ref('')
const caseSensitive = ref(false)
const useRegex = ref(false)
const selectedFindSpecial = ref(null)
const selectedReplaceSpecial = ref(null)

// DOM 引用
const findInputRef = ref(null)
const replaceInputRef = ref(null)

// 光标位置记录
const findCursorPos = ref(0)
const replaceCursorPos = ref(0)

// 特殊符号选项（显示转义文本）
const specialOptions = computed(() => [
  { label: t('text.replace.specialNewline'), value: '\\n' },
  { label: t('text.replace.specialTab'), value: '\\t' },
  { label: t('text.replace.specialSpace'), value: ' ' },
  { label: t('text.replace.specialComma'), value: ',' },
  { label: t('text.replace.specialSemicolon'), value: ';' }
])

// 记录光标位置
function onFindInputFocus() {
  setTimeout(() => {
    const input = findInputRef.value?.inputElRef
    if (input) {
      findCursorPos.value = input.selectionStart || find.value.length
    }
  }, 0)
}

function onReplaceInputFocus() {
  setTimeout(() => {
    const input = replaceInputRef.value?.inputElRef
    if (input) {
      replaceCursorPos.value = input.selectionStart || replace.value.length
    }
  }, 0)
}

// 插入特殊符号到查找框
function insertToFind(value) {
  if (!value) return
  
  // 获取当前实际光标位置
  const input = findInputRef.value?.inputElRef
  const currentPos = input ? (input.selectionStart || find.value.length) : find.value.length
  
  const before = find.value.slice(0, currentPos)
  const after = find.value.slice(currentPos)
  find.value = before + value + after
  
  // 更新光标位置
  const newPos = currentPos + value.length
  
  // 清空选择并聚焦
  selectedFindSpecial.value = null
  setTimeout(() => {
    if (input) {
      input.focus()
      input.setSelectionRange(newPos, newPos)
      findCursorPos.value = newPos
    }
  }, 0)
}

// 插入特殊符号到替换框
function insertToReplace(value) {
  if (!value) return
  
  // 获取当前实际光标位置
  const input = replaceInputRef.value?.inputElRef
  const currentPos = input ? (input.selectionStart || replace.value.length) : replace.value.length
  
  const before = replace.value.slice(0, currentPos)
  const after = replace.value.slice(currentPos)
  replace.value = before + value + after
  
  // 更新光标位置
  const newPos = currentPos + value.length
  
  // 清空选择并聚焦
  selectedReplaceSpecial.value = null
  setTimeout(() => {
    if (input) {
      input.focus()
      input.setSelectionRange(newPos, newPos)
      replaceCursorPos.value = newPos
    }
  }, 0)
}

// 执行替换（全部替换）
function replaceAll() {
  if (!input.value || !find.value) {
    message.warning(t('text.replace.noInput'))
    return
  }

  try {
    let flags = 'g'
    if (!caseSensitive.value) {
      flags += 'i'
    }

    let pattern = find.value

    if (!useRegex.value) {
      // 转义特殊字符，但先处理常见的转义序列
      pattern = pattern
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    } else {
      // 在正则模式下也处理转义序列
      pattern = pattern
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
    }

    const regex = new RegExp(pattern, flags)
    
    let replaceValue = replace.value
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
    
    output.value = input.value.replace(regex, replaceValue)
  } catch (e) {
    message.error(t('text.replace.invalidRegex'))
  }
}

// 复制输出
function copyOutput() {
  if (!output.value) return
  navigator.clipboard.writeText(output.value)
  message.success(t('text.replace.copied'))
}

// 清空所有
function clearAll() {
  input.value = ''
  find.value = ''
  replace.value = ''
  output.value = ''
}

// 处理输入框的 Tab 键
function handleInputKeydown(event) {
  if (event.key === 'Tab') {
    event.preventDefault() // 阻止默认的跳转行为
    
    const textarea = event.target
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    
    // 在光标位置插入制表符
    const value = input.value
    input.value = value.substring(0, start) + '\t' + value.substring(end)
    
    // 恢复光标位置（在插入的制表符后面）
    setTimeout(() => {
      textarea.setSelectionRange(start + 1, start + 1)
    }, 0)
  }
}
</script>

<style scoped>
.n-card {
  max-width: 1200px;
  margin: 0 auto;
}

.mt-4 {
  margin-top: 16px;
}

.info-section {
  margin-top: 16px;
}
</style>
