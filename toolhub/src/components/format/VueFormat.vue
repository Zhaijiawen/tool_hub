import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import prettier from 'prettier'
import vuePlugin from '@prettier/plugin-vue'

const { t } = useI18n()
const message = useMessage()

const input = ref('')
const error = ref('')

const formatVue = () => {
  try {
    input.value = prettier.format(input.value, {
      parser: 'vue',
      plugins: [vuePlugin],
      printWidth: 100,
      tabWidth: 2,
      useTabs: false,
      semi: false,
      singleQuote: true,
      trailingComma: 'none'
    })
    error.value = ''
  } catch (e) {
    error.value = e.message
  }
} 