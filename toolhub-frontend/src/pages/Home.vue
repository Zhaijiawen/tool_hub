<template>
  <div class="home-container">
    <n-card title="欢迎使用 ToolHub">
      <n-grid :cols="3" :x-gap="12" :y-gap="8">
        <n-grid-item v-for="category in categories" :key="category.key">
          <n-card :title="category.title" hoverable>
            <n-list>
              <n-list-item v-for="tool in category.tools" :key="tool.key">
                <router-link :to="tool.path">{{ tool.name }}</router-link>
              </n-list-item>
            </n-list>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NCard, NGrid, NGridItem, NList, NListItem } from 'naive-ui'

const categories = [
  {
    key: 'format',
    title: '格式化工具',
    tools: [
      { key: 'json', name: 'JSON格式化', path: '/format/json' },
      { key: 'xml', name: 'XML格式化', path: '/format/xml' },
      { key: 'js', name: 'JavaScript格式化', path: '/format/js' }
    ]
  },
  {
    key: 'text',
    title: '文本工具',
    tools: [
      { key: 'case', name: '大小写转换', path: '/text/case-converter' },
      { key: 'reverse', name: '字符串反转', path: '/text/reverser' },
      { key: 'space', name: '空格处理', path: '/text/space-handler' }
    ]
  },
  {
    key: 'convert',
    title: '转换工具',
    tools: [
      { key: 'unit', name: '单位转换', path: '/convert/unit' },
      { key: 'number', name: '进制转换', path: '/convert/number-base' },
      { key: 'time', name: '时间转换', path: '/convert/time' }
    ]
  },
  {
    key: 'crypto',
    title: '加密工具',
    tools: [
      { key: 'aes', name: 'AES加密', path: '/crypto/aes' },
      { key: 'hash', name: '哈希生成器', path: '/crypto/hash' },
      { key: 'base64', name: 'Base64编解码', path: '/crypto/base64' }
    ]
  },
  {
    key: 'image',
    title: '图片工具',
    tools: [
      { key: 'compress', name: '图片压缩', path: '/image/compressor' },
      { key: 'convert', name: '图片转换', path: '/image/converter' },
      { key: 'crop', name: '图片裁剪', path: '/image/cropper' }
    ]
  },
  {
    key: 'tools',
    title: '其他工具',
    tools: [
      { key: 'calculator', name: '计算器', path: '/tools/calculator' },
      { key: 'http', name: 'HTTP状态码解释', path: '/tools/http-status' },
      { key: 'ip', name: 'IP地址查询', path: '/tools/ip-lookup' }
    ]
  }
]
</script>

<style scoped>
.home-container {
  padding: 20px;
}

a {
  text-decoration: none;
  color: var(--primary-color);
}

a:hover {
  text-decoration: underline;
}
</style> 