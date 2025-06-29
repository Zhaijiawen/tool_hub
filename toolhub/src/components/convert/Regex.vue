<template>
  <div class="regex-tool">
    <n-card :title="t('convert.regex.title')" :bordered="false">
      <n-space vertical size="large">
        <!-- 正则表达式输入 -->
        <div class="pattern-section">
          <n-text class="section-title">{{ t('convert.regex.pattern') }}</n-text>
          <n-input 
            v-model:value="formData.pattern" 
            :placeholder="t('convert.regex.patternPlaceholder')"
            clearable
            @input="handleInput"
          />
        </div>

        <!-- 标志选择 -->
        <div class="flags-section">
          <n-text class="section-title">{{ t('convert.regex.flags') }}</n-text>
          <n-space>
            <n-checkbox v-model:checked="formData.flags.global" @update:checked="handleInput">
              g ({{ t('convert.regex.flagsDesc.global') }})
            </n-checkbox>
            <n-checkbox v-model:checked="formData.flags.ignoreCase" @update:checked="handleInput">
              i ({{ t('convert.regex.flagsDesc.ignoreCase') }})
            </n-checkbox>
            <n-checkbox v-model:checked="formData.flags.multiline" @update:checked="handleInput">
              m ({{ t('convert.regex.flagsDesc.multiline') }})
            </n-checkbox>
            <n-checkbox v-model:checked="formData.flags.sticky" @update:checked="handleInput">
              y ({{ t('convert.regex.flagsDesc.sticky') }})
            </n-checkbox>
            <n-checkbox v-model:checked="formData.flags.unicode" @update:checked="handleInput">
              u ({{ t('convert.regex.flagsDesc.unicode') }})
            </n-checkbox>
          </n-space>
        </div>

        <!-- 测试文本输入 -->
        <div class="test-section">
          <n-text class="section-title">{{ t('convert.regex.testString') }}</n-text>
          <n-input 
            v-model:value="formData.testString" 
            type="textarea" 
            :placeholder="t('convert.regex.testStringPlaceholder')"
            :autosize="{ minRows: 4, maxRows: 12 }"
            clearable
            @input="handleInput"
          />
        </div>

        <!-- 操作按钮 -->
        <div class="actions-section">
          <n-space justify="space-between">
            <n-space>
              <n-button type="primary" @click="testRegex" :disabled="!canTest">
                {{ t('convert.regex.test') }}
              </n-button>
              <n-button @click="showGenerateOptions = true" :disabled="!formData.testString.trim()">
                {{ t('convert.regex.generate') }}
              </n-button>
              <n-button @click="clearAll">
                {{ t('common.clear') }}
              </n-button>
            </n-space>
            <n-button @click="loadExample" type="info">
              {{ t('convert.regex.loadExample') }}
            </n-button>
          </n-space>
        </div>

        <!-- 帮助文本 -->
        <div class="help-section">
          <n-text depth="3" style="font-size: 12px;">
            {{ t('convert.regex.helpText') }}
          </n-text>
        </div>

        <!-- 生成选项对话框 -->
        <n-modal v-model:show="showGenerateOptions" :title="t('convert.regex.generateOptions')" preset="dialog">
          <n-space vertical>
            <div>
              <n-text class="section-title">{{ t('convert.regex.generateType') }}</n-text>
              <n-radio-group v-model:value="generateType">
                <n-space vertical>
                  <n-radio value="exact">{{ t('convert.regex.generateExact') }}</n-radio>
                  <n-radio value="email">{{ t('convert.regex.generateEmail') }}</n-radio>
                  <n-radio value="phone">{{ t('convert.regex.generatePhone') }}</n-radio>
                  <n-radio value="number">{{ t('convert.regex.generateNumber') }}</n-radio>
                  <n-radio value="date">{{ t('convert.regex.generateDate') }}</n-radio>
                  <n-radio value="url">{{ t('convert.regex.generateUrl') }}</n-radio>
                </n-space>
              </n-radio-group>
            </div>
            <div v-if="generateType === 'exact'">
              <n-text class="section-title">{{ t('convert.regex.generateExactDesc') }}</n-text>
            </div>
            <div v-else>
              <n-text class="section-title">{{ t('convert.regex.generatePatternDesc') }}</n-text>
            </div>
          </n-space>
          <template #action>
            <n-space>
              <n-button @click="showGenerateOptions = false">
                {{ t('common.cancel') }}
              </n-button>
              <n-button type="primary" @click="generateRegexAdvanced">
                {{ t('convert.regex.generate') }}
              </n-button>
            </n-space>
          </template>
        </n-modal>

        <!-- 结果显示 -->
        <div class="result-section" v-if="formData.result">
          <n-text class="section-title">{{ t('convert.regex.result') }}</n-text>
          <div class="output-with-copy">
            <n-input 
              v-model:value="formData.result" 
              type="textarea" 
              :placeholder="t('convert.regex.resultPlaceholder')"
              :autosize="{ minRows: 4, maxRows: 12 }"
              readonly
            />
            <n-button @click="copyResult" size="small" type="primary">
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
          <n-alert type="info" :title="t('convert.regex.infoTitle')" class="info-alert">
            {{ t('convert.regex.infoContent') }}
          </n-alert>
        </div>
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

const formData = reactive({
  pattern: '',
  testString: '',
  result: '',
  flags: {
    global: true,
    ignoreCase: false,
    multiline: false,
    sticky: false,
    unicode: false
  }
})

const error = ref('')
const showGenerateOptions = ref(false)
const generateType = ref('exact')

// 计算属性
const canTest = computed(() => {
  return formData.pattern.trim() && formData.testString.trim()
})

// 获取正则表达式标志
const getFlags = () => {
  return Object.entries(formData.flags)
    .filter(([_, value]) => value)
    .map(([key]) => key[0])
    .join('')
}

// 处理输入变化
const handleInput = () => {
  error.value = ''
  formData.result = ''
}

// 测试正则表达式
const testRegex = () => {
  try {
    if (!formData.pattern.trim()) {
      throw new Error(t('convert.regex.patternRequired'))
    }
    if (!formData.testString.trim()) {
      throw new Error(t('convert.regex.testStringRequired'))
    }

    const regex = new RegExp(formData.pattern, getFlags())
    const matches = Array.from(formData.testString.matchAll(regex))
    const results = []

    for (const match of matches) {
      const result = {
        match: match[0],
        index: match.index,
        input: match.input,
        groups: match.groups || {}
      }
      
      // 添加捕获组
      if (match.length > 1) {
        result.captures = Array.from(match).slice(1)
      }
      
      results.push(result)
    }

    if (results.length === 0) {
      formData.result = t('convert.regex.noMatch')
    } else {
      formData.result = JSON.stringify(results, null, 2)
    }
    error.value = ''
  } catch (err) {
    error.value = err.message
    formData.result = ''
    message.error(t('common.error'))
  }
}

// 生成正则表达式
const generateRegex = () => {
  try {
    if (!formData.testString.trim()) {
      throw new Error(t('convert.regex.testStringRequired'))
    }

    // 转义特殊字符
    const escaped = formData.testString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    formData.pattern = escaped
    formData.result = t('convert.regex.generated', { pattern: escaped })
    error.value = ''
  } catch (err) {
    error.value = err.message
    message.error(t('common.error'))
  }
}

// 复制结果
const copyResult = () => {
  if (formData.result) {
    try {
      navigator.clipboard.writeText(formData.result)
      message.success(t('common.copy') + ' ' + t('common.success'))
    } catch (e) {
      message.error(t('common.copy') + ' ' + t('common.error'))
    }
  }
}

// 清空所有
const clearAll = () => {
  formData.pattern = ''
  formData.testString = ''
  formData.result = ''
  Object.keys(formData.flags).forEach(key => {
    formData.flags[key] = key === 'global'
  })
  error.value = ''
}

// 加载示例
const loadExample = () => {
  const examples = [
    {
      name: '邮箱验证',
      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      testString: 'test@example.com\ninvalid-email\nuser123@gmail.com\nadmin@company.org',
      flags: { global: true, ignoreCase: false, multiline: true, sticky: false, unicode: false }
    },
    {
      name: '手机号码',
      pattern: '1[3-9]\\d{9}',
      testString: '13812345678\n12345678901\n13987654321\ninvalid-phone',
      flags: { global: true, ignoreCase: false, multiline: false, sticky: false, unicode: false }
    },
    {
      name: '提取数字',
      pattern: '\\d+',
      testString: 'Hello 123 World 456\nPrice: $99.99\nID: 789012',
      flags: { global: true, ignoreCase: false, multiline: false, sticky: false, unicode: false }
    },
    {
      name: 'HTML标签',
      pattern: '<[^>]+>',
      testString: '<div>Hello</div>\n<span class="title">World</span>\n<p>Content</p>',
      flags: { global: true, ignoreCase: false, multiline: false, sticky: false, unicode: false }
    },
    {
      name: '日期格式',
      pattern: '\\d{4}-\\d{2}-\\d{2}',
      testString: '2024-01-15\n2023-12-31\ninvalid-date\n2024/01/15',
      flags: { global: true, ignoreCase: false, multiline: false, sticky: false, unicode: false }
    }
  ]
  
  // 随机选择一个示例
  const example = examples[Math.floor(Math.random() * examples.length)]
  
  formData.pattern = example.pattern
  formData.testString = example.testString
  Object.assign(formData.flags, example.flags)
  
  // 自动执行测试
  setTimeout(() => {
    testRegex()
  }, 100)
  
  message.success(t('convert.regex.exampleLoaded', { name: example.name }))
}

// 生成正则表达式（高级）
const generateRegexAdvanced = () => {
  try {
    if (!formData.testString.trim()) {
      throw new Error(t('convert.regex.testStringRequired'))
    }

    let pattern = ''
    let type = generateType.value

    switch (type) {
      case 'exact':
        pattern = formData.testString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        break
      case 'email':
        pattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        break
      case 'phone':
        pattern = '1[3-9]\\d{9}'
        break
      case 'number':
        pattern = '\\d+'
        break
      case 'date':
        pattern = '\\d{4}-\\d{2}-\\d{2}'
        break
      case 'url':
        pattern = 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)'
        break
      default:
        throw new Error(t('convert.regex.generateTypeInvalid'))
    }

    formData.pattern = pattern
    showGenerateOptions.value = false
    error.value = ''
    message.success(t('convert.regex.generated', { pattern: pattern }))
  } catch (err) {
    error.value = err.message
    message.error(t('common.error'))
  }
}
</script>

<style scoped>
.regex-tool {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.pattern-section {
  margin-bottom: 20px;
}

.flags-section {
  margin-bottom: 20px;
}

.test-section {
  margin-bottom: 20px;
}

.actions-section {
  margin-bottom: 20px;
}

.result-section {
  margin-bottom: 20px;
}

.section-title {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.output-with-copy {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.output-with-copy .n-input {
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

.help-section {
  margin-bottom: 20px;
}
</style>