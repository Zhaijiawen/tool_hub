<template>
  <div class="component-composer">
    <div class="composer-container">
      <div
        v-for="(block, index) in blocks"
        :key="index"
        class="composer-block"
        :class="{ 'is-empty': !block.component }"
      >
        <div v-if="block.component" class="component-wrapper">
          <component :is="componentMap[block.component]" v-bind="block.props" />
          <div class="block-actions">
            <n-button @click="removeComponent(index)" type="error" size="small" circle>
              <template #icon>
                <n-icon><remove-icon /></n-icon>
              </template>
            </n-button>
          </div>
        </div>
        <div v-else-if="index === blocks.length - 1" class="add-component">
          <n-button @click="showComponentList(index)" type="primary" size="large" circle>
            <template #icon>
              <n-icon><add-icon /></n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </div>

    <!-- 组件选择弹窗 -->
    <n-modal v-model:show="showModal" preset="card" title="选择组件" style="width: 600px">
      <n-scrollbar style="max-height: 400px">
        <n-list>
          <n-list-item v-for="comp in availableComponents" :key="comp.name">
            <n-thing :title="comp.name" :description="comp.description">
              <template #header-extra>
                <n-button @click="addComponent(comp)" type="primary" size="small">
                  添加
                </n-button>
              </template>
            </n-thing>
          </n-list-item>
        </n-list>
      </n-scrollbar>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { AppsOutline as PuzzleIcon, AddOutline as AddIcon, RemoveOutline as RemoveIcon } from '@vicons/ionicons5'
import { useMessage } from 'naive-ui'
// 显式导入所有可用组件
import JsonFormat from '@/components/format/JsonFormat.vue'
import XmlFormat from '@/components/format/XmlFormat.vue'
import YamlFormat from '@/components/format/YamlFormat.vue'
import MarkdownFormat from '@/components/format/MarkdownFormat.vue'

const componentMap = {
  JsonFormat,
  XmlFormat,
  YamlFormat,
  MarkdownFormat
}

const message = useMessage()

// 可用的组件列表
const availableComponents = [
  {
    name: 'JSON格式化',
    component: 'JsonFormat',
    description: '格式化JSON数据，支持压缩和美化',
    props: {}
  },
  {
    name: 'XML格式化',
    component: 'XmlFormat',
    description: '格式化XML数据，支持压缩和美化',
    props: {}
  },
  {
    name: 'YAML格式化',
    component: 'YamlFormat',
    description: '格式化YAML数据，支持压缩和美化',
    props: {}
  },
  {
    name: 'Markdown格式化',
    component: 'MarkdownFormat',
    description: '格式化Markdown文本',
    props: {}
  }
]

// 当前选中的块索引
const selectedBlockIndex = ref(null)
// 是否显示组件选择弹窗
const showModal = ref(false)
// 组件块列表
const blocks = ref([
  { component: null, props: {} }
])

// 显示组件选择弹窗
const showComponentList = (index) => {
  selectedBlockIndex.value = index
  showModal.value = true
}

// 添加组件
const addComponent = (component) => {
  if (selectedBlockIndex.value === null) return
  blocks.value[selectedBlockIndex.value] = {
    component: component.component,
    props: { ...component.props }
  }
  // 如果当前块是最后一个，则补一个空块
  if (selectedBlockIndex.value === blocks.value.length - 1) {
    blocks.value.push({ component: null, props: {} })
  }
  showModal.value = false
  message.success('组件添加成功')
}

// 移除组件
const removeComponent = (index) => {
  blocks.value.splice(index, 1)
  // 保证至少有一个空块
  if (blocks.value.length === 0 || blocks.value[blocks.value.length - 1].component) {
    blocks.value.push({ component: null, props: {} })
  }
  message.success('组件移除成功')
}
</script>

<style scoped>
.component-composer {
  padding: 20px;
  height: 100%;
}

.composer-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: minmax(320px, auto);
  gap: 0;
  max-height: 660px; /* 2行2列，每块320px，含边距 */
  overflow-y: auto;
  border: 2px solid var(--border-color);
  border-radius: 10px;
}

.composer-block {
  min-height: 320px;
  border: 1.5px solid var(--border-color);
  border-right: none;
  border-bottom: none;
  border-radius: 0;
  padding: 20px;
  background-color: var(--background-color);
  position: relative;
}

.composer-block:nth-child(2n) {
  border-right: 0;
}

.composer-block.is-empty {
  background: var(--background-color-secondary, #fafbfc);
}

.component-wrapper {
  position: relative;
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
  min-height: 160px;
}

:deep(.n-list-item) {
  padding: 12px;
}

:deep(.n-thing-main__description) {
  margin-top: 8px;
}
</style> 