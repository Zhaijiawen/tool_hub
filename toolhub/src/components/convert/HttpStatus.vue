<template>
  <n-card :title="$t('convert.httpStatus.title')">
    <n-form>
      <n-form-item :label="$t('convert.httpStatus.input')">
        <n-input v-model:value="formData.input" :placeholder="$t('convert.httpStatus.inputPlaceholder')" />
      </n-form-item>

      <n-space>
        <n-button type="primary" @click="search">
          {{ $t('convert.httpStatus.search') }}
        </n-button>
        <n-button @click="copyResult">
          {{ $t('convert.httpStatus.copy') }}
        </n-button>
      </n-space>

      <n-divider />

      <template v-if="formData.result">
        <n-descriptions bordered>
          <n-descriptions-item :label="$t('convert.httpStatus.code')">
            {{ formData.result.code }}
          </n-descriptions-item>
          <n-descriptions-item :label="$t('convert.httpStatus.name')">
            {{ $t(`convert.httpStatus.codes.${formData.result.code}.name`) }}
          </n-descriptions-item>
          <n-descriptions-item :label="$t('convert.httpStatus.category')">
            {{ $t(`convert.httpStatus.categories.${formData.result.category}`) }}
          </n-descriptions-item>
        </n-descriptions>

        <n-card :title="$t('convert.httpStatus.description')" class="mt-4">
          <p>{{ $t(`convert.httpStatus.codes.${formData.result.code}.description`) }}</p>
        </n-card>

        <n-card :title="$t('convert.httpStatus.scenarios')" class="mt-4">
          <n-list>
            <n-list-item v-for="(scenario, index) in $t(`convert.httpStatus.codes.${formData.result.code}.scenarios`)"
              :key="index">
              {{ scenario }}
            </n-list-item>
          </n-list>
        </n-card>

        <n-card :title="$t('convert.httpStatus.solutions')" class="mt-4"
          v-if="$t(`convert.httpStatus.codes.${formData.result.code}.solutions`)">
          <n-list>
            <n-list-item v-for="(solution, index) in $t(`convert.httpStatus.codes.${formData.result.code}.solutions`)"
              :key="index">
              {{ solution }}
            </n-list-item>
          </n-list>
        </n-card>
      </template>
    </n-form>
    <!-- 错误提示 -->
    <n-alert v-if="error" type="t('common.error')" :title="error" style="margin-top: 16px">
      {{ error }}
    </n-alert>
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
  result: null
})

const error = ref('')

// HTTP状态码数据
const statusCodes = {
  // 1xx 信息响应
  '100': {
    code: '100',
    category: 'informational'
  },
  '101': {
    code: '101',
    category: 'informational'
  },
  '102': {
    code: '102',
    category: 'informational'
  },

  // 2xx 成功响应
  '200': {
    code: '200',
    category: 'success'
  },
  '201': {
    code: '201',
    category: 'success'
  },
  '204': {
    code: '204',
    category: 'success'
  },

  // 3xx 重定向
  '301': {
    code: '301',
    category: 'redirect'
  },
  '302': {
    code: '302',
    category: 'redirect'
  },
  '304': {
    code: '304',
    category: 'redirect'
  },

  // 4xx 客户端错误
  '400': {
    code: '400',
    category: 'clientError'
  },
  '401': {
    code: '401',
    category: 'clientError'
  },
  '403': {
    code: '403',
    category: 'clientError'
  },
  '404': {
    code: '404',
    category: 'clientError'
  },
  '429': {
    code: '429',
    category: 'clientError'
  },

  // 5xx 服务器错误
  '500': {
    code: '500',
    category: 'serverError'
  },
  '502': {
    code: '502',
    category: 'serverError'
  },
  '503': {
    code: '503',
    category: 'serverError'
  },
  '504': {
    code: '504',
    category: 'serverError'
  }
}

function search() {
  error.value = ''

  try {
    if (!formData.input) {
      throw new Error(t('convert.httpStatus.inputRequired'))
    }

    const code = formData.input.trim()
    if (!statusCodes[code]) {
      throw new Error(t('convert.httpStatus.codeNotFound'))
    }

    formData.result = statusCodes[code]
  } catch (err) {
    error.value = err.message
  }
}

function copyResult() {
  if (formData.result) {
    const text = JSON.stringify({
      code: formData.result.code,
      name: t(`convert.httpStatus.codes.${formData.result.code}.name`),
      category: t(`convert.httpStatus.categories.${formData.result.category}`),
      description: t(`convert.httpStatus.codes.${formData.result.code}.description`),
      scenarios: t(`convert.httpStatus.codes.${formData.result.code}.scenarios`),
      solutions: t(`convert.httpStatus.codes.${formData.result.code}.solutions`)
    }, null, 2)
    navigator.clipboard.writeText(text)
    message.success(t('convert.httpStatus.copied'))
  }
}
</script>

<style scoped>
.n-card {
  max-width: 800px;
  margin: 0 auto;
}

.mt-4 {
  margin-top: 16px;
}
</style>