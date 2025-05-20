import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import prettier from 'prettier'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const error = ref('')

const formatTs = () => {
  try {
    input.value = prettier.format(input.value, {
      parser: 'typescript',
      printWidth: 100,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: true,
      trailingComma: 'none'
    })
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
} 