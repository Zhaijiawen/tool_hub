<template>
  <div class="test-page">
    <h2>CodeEditor 测试页面</h2>
    <CodeEditor 
      v-model="testCode"
      :default-language="'json'"
      placeholder="请输入JSON代码进行测试..."
    />
    <div class="test-info">
      <h3>当前代码内容：</h3>
      <pre>{{ testCode }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CodeEditor from '@/components/common/CodeEditor.vue'

const testCode = ref(`[
  {
    "id": null,
    "sceneTemplateId": 1106,
    "sceneTaskId": null,
    "category": 1,
    "uid": null,
    "wmPoiAgentType": null,
    "applicationType": 2,
    "classifyField": null,
    "bizIds": "14130967,7737786,9586833,7314284,4964741,23893184,21952008,26500755,18616452",
    "modifyData": [
      {
        "id": 174,
        "code": "poiLogoForBusiness",
        "value": "{\\"picUrls\\":\\"http://p1.meituan.net/waimaipoi/5e82e425055459f3bbb1b2b564b69311199686.jpg\\",\\"opType\\":2}",
        "editType": 0
      }
    ]
  }
]`)
</script>

<style scoped>
.test-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.test-info {
  margin-top: 20px;
  padding: 16px;
  background-color: var(--n-color-modal);
  border-radius: 6px;
}

.test-info pre {
  background-color: var(--n-color);
  padding: 12px;
  border-radius: 4px;
  overflow: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
}
</style> 