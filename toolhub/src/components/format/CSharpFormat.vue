<template>
  <!-- C#格式化工具容器 -->
  <div class="csharp-format">
    <!-- 工具卡片 -->
    <n-card :title="t('format.csharp.title')" :bordered="false">
      <!-- 折叠按钮 -->
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
      <!-- 折叠内容区域 -->
      <n-collapse-transition>
        <div v-show="!isCollapsed">
          <!-- C#输入区域 -->
          <n-input
            v-model:value="input"
            type="textarea"
            :placeholder="t('format.csharp.placeholder')"
            :autosize="{ minRows: 10, maxRows: 20 }"
          />
          <!-- 功能按钮组 -->
          <div class="button-group">
            <!-- 格式化按钮 -->
            <n-button @click="formatCSharp" type="primary">
              {{ t('format.csharp.format') }}
            </n-button>
            <!-- 复制按钮 -->
            <n-button @click="copyToClipboard">
              {{ t('common.copy') }}
            </n-button>
          </div>
          <!-- 错误提示 -->
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
// 导入Vue相关功能
import { ref } from 'vue'
// 导入国际化功能
import { useI18n } from 'vue-i18n'
// 导入Naive UI消息提示
import { useMessage } from 'naive-ui'
// 导入代码美化工具
import { js_beautify } from 'js-beautify'
// 导入图标组件
import { ChevronDown, ChevronUp } from '@vicons/ionicons5'

// 初始化国际化
const { t } = useI18n()
// 初始化消息提示
const message = useMessage()

// 输入文本
const input = ref('')
// 错误信息
const error = ref('')
// 折叠状态
const isCollapsed = ref(false)

/**
 * 格式化C#代码
 * 使用js-beautify进行格式化，设置缩进和换行等规则
 */
const formatCSharp = () => {
  try {
    input.value = js_beautify(input.value, {
      indent_size: 4,                // 缩进空格数
      indent_char: ' ',              // 使用空格缩进
      max_preserve_newlines: 2,      // 最大保留空行数
      preserve_newlines: true,       // 保留换行
      keep_array_indentation: false, // 不保持数组缩进
      break_chained_methods: false,  // 不打断链式方法
      indent_scripts: 'normal',      // 脚本缩进样式
      brace_style: 'collapse',       // 大括号样式
      space_before_conditional: true,// 条件语句前加空格
      unescape_strings: false,       // 不转义字符串
      jslint_happy: false,          // 不使用jslint风格
      end_with_newline: true,        // 以换行结束
      wrap_line_length: 100,         // 行长度限制
      indent_inner_html: false,      // 不缩进内部HTML
      comma_first: false,           // 不使用逗号开头
      e4x: false,                   // 不使用E4X
      indent_empty_lines: false      // 不缩进空行
    })
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
}

/**
 * 复制到剪贴板
 * 将当前内容复制到系统剪贴板
 */
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(input.value)
    message.success(t('common.copySuccess'))
  } catch (e) {
    message.error(t('common.copyError'))
  }
}
</script>

<style scoped>
/* 工具容器样式 */
.csharp-format {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

/* 按钮组样式 */
.button-group {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

/* 错误提示样式 */
.error-alert {
  margin-top: 16px;
}
</style> 