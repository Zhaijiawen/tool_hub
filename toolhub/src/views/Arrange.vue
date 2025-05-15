<template>
  <div class="arrange-view">
    <n-card>
      <template #header>
        <div class="arrange-header">
          <n-space>
            <n-button type="primary" @click="addTool">
              <template #icon>
                <n-icon><add-icon /></n-icon>
              </template>
              {{ $t('arrange.addTool') }}
            </n-button>
            <n-button @click="saveLayout">
              <template #icon>
                <n-icon><save-icon /></n-icon>
              </template>
              {{ $t('arrange.saveLayout') }}
            </n-button>
            <n-button @click="resetLayout">
              <template #icon>
                <n-icon><refresh-icon /></n-icon>
              </template>
              {{ $t('arrange.resetLayout') }}
            </n-button>
          </n-space>
        </div>
      </template>

      <n-grid :cols="24" :x-gap="16" :y-gap="16">
        <n-grid-item
          v-for="(tool, index) in tools"
          :key="index"
          :span="tool.span || 12"
        >
          <n-card
            class="tool-card"
            :class="{ 'is-dragging': draggingIndex === index }"
            @mousedown="startDrag(index)"
            @mousemove="onDrag"
            @mouseup="endDrag"
            @mouseleave="endDrag"
          >
            <template #header>
              <div class="tool-header">
                <n-space>
                  <n-icon class="drag-handle"><drag-icon /></n-icon>
                  <n-select
                    v-model:value="tool.type"
                    :options="toolOptions"
                    :placeholder="$t('arrange.selectTool')"
                    style="width: 200px"
                    @update:value="handleToolChange(index, $event)"
                  />
                  <n-select
                    v-model:value="tool.span"
                    :options="spanOptions"
                    :placeholder="$t('arrange.selectSize')"
                    style="width: 100px"
                  />
                  <n-button
                    circle
                    size="small"
                    @click="removeTool(index)"
                    type="error"
                  >
                    <template #icon>
                      <n-icon><delete-icon /></n-icon>
                    </template>
                  </n-button>
                </n-space>
              </div>
            </template>
            <component
              :is="tool.component"
              v-if="tool.component"
              v-bind="tool.props || {}"
            />
            <div v-else class="tool-placeholder">
              {{ $t('arrange.selectTool') }}
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, shallowRef } from 'vue'
import { useMessage } from 'naive-ui'
import {
  Add as AddIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Move as DragIcon
} from '@vicons/ionicons5'

const message = useMessage()

// 工具列表
const tools = ref([])
const draggingIndex = ref(-1)
const dragStartY = ref(0)

// 工具选项
const toolOptions = computed(() => [
  {
    label: 'JSON格式化',
    value: 'json-format'
  },
  {
    label: 'XML格式化',
    value: 'xml-format'
  },
  {
    label: 'AES加密',
    value: 'aes-encrypt'
  },
  {
    label: '时间戳转换',
    value: 'timestamp-convert'
  },
  {
    label: '图片压缩',
    value: 'image-compress'
  },
  {
    label: '文本替换',
    value: 'text-replace'
  },
  {
    label: '二维码工具',
    value: 'qrcode-tool'
  }
])

// 布局选项
const spanOptions = [
  {
    label: '1/2',
    value: 12
  },
  {
    label: '1/3',
    value: 8
  },
  {
    label: '2/3',
    value: 16
  },
  {
    label: '1/4',
    value: 6
  },
  {
    label: '3/4',
    value: 18
  },
  {
    label: '全宽',
    value: 24
  }
]

// 动态导入组件
const loadComponent = async (type) => {
  try {
    const component = await import(`@/components/${type}.vue`)
    return component.default
  } catch (error) {
    console.error(`加载组件失败: ${type}`, error)
    return null
  }
}

// 处理工具变更
const handleToolChange = async (index, type) => {
  if (!type) return
  
  const component = await loadComponent(type)
  if (component) {
    tools.value[index].component = shallowRef(component)
  } else {
    message.error('加载组件失败')
    tools.value[index].type = null
  }
}

// 添加工具
const addTool = () => {
  tools.value.push({
    type: null,
    span: 12,
    component: null,
    props: {}
  })
}

// 移除工具
const removeTool = (index) => {
  tools.value.splice(index, 1)
  message.success('工具移除成功')
}

// 保存布局
const saveLayout = () => {
  try {
    const layoutToSave = tools.value.map(tool => ({
      type: tool.type,
      span: tool.span
    }))
    localStorage.setItem('toolhub-layout', JSON.stringify(layoutToSave))
    message.success('布局保存成功')
  } catch (error) {
    message.error('布局保存失败')
  }
}

// 重置布局
const resetLayout = () => {
  tools.value = []
  localStorage.removeItem('toolhub-layout')
  message.success('布局已重置')
}

// 拖拽相关
const startDrag = (index) => {
  draggingIndex.value = index
  dragStartY.value = event.clientY
}

const onDrag = (event) => {
  if (draggingIndex.value === -1) return
  
  const currentY = event.clientY
  const deltaY = currentY - dragStartY.value
  
  if (Math.abs(deltaY) > 50) {
    const newIndex = draggingIndex.value + (deltaY > 0 ? 1 : -1)
    if (newIndex >= 0 && newIndex < tools.value.length) {
      const temp = tools.value[draggingIndex.value]
      tools.value[draggingIndex.value] = tools.value[newIndex]
      tools.value[newIndex] = temp
      draggingIndex.value = newIndex
      dragStartY.value = currentY
    }
  }
}

const endDrag = () => {
  draggingIndex.value = -1
}

// 初始化时加载保存的布局
const loadSavedLayout = async () => {
  const savedLayout = localStorage.getItem('toolhub-layout')
  if (savedLayout) {
    try {
      const layout = JSON.parse(savedLayout)
      tools.value = layout.map(tool => ({
        ...tool,
        component: null,
        props: {}
      }))
      
      // 加载组件
      for (const tool of tools.value) {
        if (tool.type) {
          await handleToolChange(tools.value.indexOf(tool), tool.type)
        }
      }
    } catch (error) {
      console.error('加载布局失败:', error)
      message.error('加载布局失败')
    }
  }
}

// 组件挂载时加载布局
onMounted(() => {
  loadSavedLayout()
})
</script>

<style scoped>
.arrange-view {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.arrange-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tool-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tool-card {
  cursor: move;
  transition: all 0.3s ease;
}

.tool-card.is-dragging {
  opacity: 0.5;
  transform: scale(0.95);
}

.drag-handle {
  cursor: move;
  color: #666;
}

.tool-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  background-color: #f5f5f5;
  border-radius: 4px;
  color: #999;
}
</style> 