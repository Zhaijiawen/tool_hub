<template>
  <div class="component-composer">
    <div class="composer-container">
      <div v-for="(block, index) in blocks" :key="index" class="composer-block"
        :class="{ 'is-empty': !block.component }">
        <div v-if="block.component" class="component-wrapper">
          <component :is="componentMap[block.component]" v-bind="block.props" />
          <div class="block-actions">
            <n-button @click="removeComponent(index)" type="error" size="small">
              {{ $t('composer.removeComponent') }}
            </n-button>
          </div>
        </div>
        <div v-else-if="index === blocks.length - 1" class="add-component">
          <n-button @click="showComponentList(index)" type="primary" size="large">
            {{ $t('composer.addComponent') }}
          </n-button>
        </div>
      </div>
    </div>

    <!-- 组件选择弹窗 -->
    <n-modal v-model:show="showModal" preset="card" :title="$t('composer.selectComponent')" style="width: 600px">
      <!-- 搜索框 -->
      <n-input 
        v-model:value="searchKeyword" 
        :placeholder="$t('composer.searchPlaceholder')" 
        clearable 
        style="margin-bottom: 16px"
      />
      
      <n-scrollbar style="max-height: 400px">
        <n-list v-if="filteredComponents.length > 0">
          <n-list-item v-for="comp in filteredComponents" :key="comp.id">
            <n-thing :title="$t(comp.name)" :description="$t(comp.description)">
              <template #header-extra>
                <n-button @click="addComponent(comp)" type="primary" size="small">
                  {{ $t('composer.addComponent') }}
                </n-button>
              </template>
            </n-thing>
          </n-list-item>
        </n-list>
        <n-empty v-else :description="$t('composer.noResults')" />
      </n-scrollbar>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { getAllTools } from '@/api/tools'

// 动态导入所有组件
const componentMap = {}



// 动态导入函数 - 使用完整的导入映射
const componentImportMap = {
  // format 类组件
  'format:json': () => import('@/components/format/JsonFormat.vue'),
  'format:xml': () => import('@/components/format/XmlFormat.vue'),
  'format:yaml': () => import('@/components/format/YamlFormat.vue'),
  'format:js': () => import('@/components/format/JsFormat.vue'),
  'format:html': () => import('@/components/format/HtmlFormat.vue'),
  'format:css': () => import('@/components/format/CssFormat.vue'),
  'format:java': () => import('@/components/format/JavaFormat.vue'),
  'format:php': () => import('@/components/format/PhpFormat.vue'),
  'format:ruby': () => import('@/components/format/RubyFormat.vue'),
  'format:shell': () => import('@/components/format/ShellFormat.vue'),
  'format:sql': () => import('@/components/format/SqlFormat.vue'),
  'format:markdown': () => import('@/components/format/MarkdownFormat.vue'),
  'format:vue': () => import('@/components/format/VueFormat.vue'),
  
  // encrypt 类组件
  'encrypt:aes': () => import('@/components/encrypt/AesEncrypt.vue'),
  'encrypt:base64': () => import('@/components/encrypt/Base64Codec.vue'),
  'encrypt:hex': () => import('@/components/encrypt/HexCodec.vue'),
  'encrypt:url': () => import('@/components/encrypt/UrlCodec.vue'),
  'encrypt:html': () => import('@/components/encrypt/HtmlCodec.vue'),
  'encrypt:jwt': () => import('@/components/encrypt/JwtCodec.vue'),
  'encrypt:rsa': () => import('@/components/encrypt/RsaEncrypt.vue'),
  'encrypt:sha': () => import('@/components/encrypt/ShaHash.vue'),
  'encrypt:ed25519Sign': () => import('@/components/encrypt/Ed25519Sign.vue'),
  'encrypt:rsaSign': () => import('@/components/encrypt/RsaSign.vue'),
  'encrypt:x25519': () => import('@/components/encrypt/X25519.vue'),
  'encrypt:argon2': () => import('@/components/encrypt/Argon2Hash.vue'),
  'encrypt:bcrypt': () => import('@/components/encrypt/BcryptHash.vue'),
  'encrypt:chacha20': () => import('@/components/encrypt/ChaCha20Encrypt.vue'),
  'encrypt:des': () => import('@/components/encrypt/DesEncrypt.vue'),
  'encrypt:ecc': () => import('@/components/encrypt/EccEncrypt.vue'),
  'encrypt:ecdhKeyExchange': () => import('@/components/encrypt/EcdhKeyExchange.vue'),
  'encrypt:ecdsaSign': () => import('@/components/encrypt/EcdsaSign.vue'),
  
  // convert 类组件
  'convert:timestamp': () => import('@/components/convert/Timestamp.vue'),
  'convert:dateCalc': () => import('@/components/convert/DateCalc.vue'),
  'convert:dateDiff': () => import('@/components/convert/DateDiff.vue'),
  'convert:number': () => import('@/components/convert/Number.vue'),
  'convert:numberBase': () => import('@/components/convert/NumberBase.vue'),
  'convert:storageTime': () => import('@/components/convert/StorageTime.vue'),
  'convert:unit': () => import('@/components/convert/Unit.vue'),
  'convert:color': () => import('@/components/convert/Color.vue'),
  'convert:regex': () => import('@/components/convert/Regex.vue'),
  'convert:markdown': () => import('@/components/convert/Markdown.vue'),
  'convert:httpStatus': () => import('@/components/convert/HttpStatus.vue'),
  'convert:userAgent': () => import('@/components/convert/UserAgent.vue'),
  'convert:charCode': () => import('@/components/convert/CharCode.vue'),
  
  // image 类组件
  'image:convert': () => import('@/components/image/Convert.vue'),
  'image:rotate': () => import('@/components/image/Rotate.vue'),
  'image:crop': () => import('@/components/image/Crop.vue'),
  'image:watermark': () => import('@/components/image/Watermark.vue'),
  
  // text 类组件
  'text:case': () => import('@/components/text/Case.vue'),
  'text:reverse': () => import('@/components/text/Reverse.vue'),
  'text:whitespace': () => import('@/components/text/Whitespace.vue'),
  'text:replace': () => import('@/components/text/Replace.vue'),
  
  // other 类组件
  'other:qrcode': () => import('@/components/other/QRCode.vue'),
  'other:calculator': () => import('@/components/other/Calculator.vue')
}

const importComponent = async (category, id) => {
  try {
    const mappingKey = `${category}:${id}`
    const importFn = componentImportMap[mappingKey]
    if (!importFn) {
      console.error(`No component import function found for: ${mappingKey}`)
      return null
    }
    
    const component = await importFn()
    return component.default
  } catch (error) {
    console.error(`Failed to import component: ${category}:${id}`, error)
    return null
  }
}

const { t, locale } = useI18n()
const message = useMessage()

// 可用的组件列表
const availableComponents = ref([])
const searchKeyword = ref('')

// 过滤后的组件列表
const filteredComponents = computed(() => {
  if (!searchKeyword.value) return availableComponents.value
  
  const keyword = searchKeyword.value.toLowerCase()
  return availableComponents.value.filter(comp => 
    t(comp.name).toLowerCase().includes(keyword) ||
    t(comp.description).toLowerCase().includes(keyword) ||
    comp.id.toLowerCase().includes(keyword)
  )
})

// 当前选中的块索引
const selectedBlockIndex = ref(null)
// 是否显示组件选择弹窗
const showModal = ref(false)
// 组件块列表
const blocks = ref([
  { component: null, props: {} }
])

// 加载组件数据
const loadComponents = async () => {
  try {
    const tools = await getAllTools(locale.value)
    
    // 过滤出支持的组件类型
    const supportedComponents = tools.filter(tool => {
      return ['format', 'encrypt', 'convert', 'text', 'image', 'other'].includes(tool.category)
    })
    
    availableComponents.value = supportedComponents
    
    // 预加载部分组件
    for (const tool of supportedComponents.slice(0, 10)) {
      const mappingKey = `${tool.category}:${tool.id}`
      if (componentImportMap[mappingKey]) {
        const component = await importComponent(tool.category, tool.id)
        if (component) {
          componentMap[tool.id] = component
        }
      }
    }
  } catch (error) {
    console.error('Failed to load components:', error)
    message.error('加载组件失败')
  }
}

// 显示组件选择弹窗
const showComponentList = (index) => {
  selectedBlockIndex.value = index
  showModal.value = true
  searchKeyword.value = ''
}

// 添加组件
const addComponent = async (tool) => {
  if (selectedBlockIndex.value === null) return
  
  // 动态加载组件（如果还没加载）
  if (!componentMap[tool.id]) {
    const mappingKey = `${tool.category}:${tool.id}`
    if (!componentImportMap[mappingKey]) {
      console.error(`No mapping found for tool: ${mappingKey}`)
      message.error(`不支持的组件类型: ${tool.id}`)
      return
    }
    
    const component = await importComponent(tool.category, tool.id)
    if (component) {
      componentMap[tool.id] = component
    } else {
      console.error(`Component import failed for tool: ${tool.id}`)
      message.error(`组件加载失败: ${tool.id}`)
      return
    }
  }
  
  blocks.value[selectedBlockIndex.value] = {
    component: tool.id,
    props: {}
  }
  
  // 如果当前块是最后一个，则补一个空块
  if (selectedBlockIndex.value === blocks.value.length - 1) {
    blocks.value.push({ component: null, props: {} })
  }
  
  showModal.value = false
  message.success(t('composer.addSuccess'))
}

// 移除组件
const removeComponent = (index) => {
  blocks.value.splice(index, 1)
  // 保证至少有一个空块
  if (blocks.value.length === 0 || blocks.value[blocks.value.length - 1].component) {
    blocks.value.push({ component: null, props: {} })
  }
  message.success(t('composer.removeSuccess'))
}

onMounted(() => {
  loadComponents()
})
</script>

<style scoped>
.component-composer {
  padding: 20px;
  height: 100vh;
  overflow: hidden;
}

.composer-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  height: calc(100vh - 40px);
  overflow-y: auto;
  border: 2px solid var(--border-color);
  border-radius: 10px;
}

.composer-block {
  width: 50%;
  min-height: 400px;
  border-right: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  padding: 20px;
  background-color: var(--background-color);
  position: relative;
  box-sizing: border-box;
}

.composer-block:nth-child(2n) {
  border-right: none;
}

.composer-block.is-empty {
  background: var(--code-color);
}

.component-wrapper {
  position: relative;
  height: 100%;
}

.block-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
}

.add-component {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

:deep(.n-list-item) {
  padding: 12px;
}

:deep(.n-thing-main__description) {
  margin-top: 8px;
}
</style>