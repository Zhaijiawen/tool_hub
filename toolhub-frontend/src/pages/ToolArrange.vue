<template>
  <div class="tool-arrange">
    <n-card title="工具编排">
      <n-select v-model:value="selected" :options="toolOptions" style="width: 200px;" />
      <n-button @click="addTool" style="margin-left: 8px;">添加</n-button>
      <n-list bordered style="margin-top: 16px;">
        <n-list-item v-for="(tool, idx) in arranged" :key="tool">
          <span>{{ tool }}</span>
          <n-button size="small" @click="removeTool(idx)" style="margin-left: 8px;">移除</n-button>
          <n-button size="small" @click="moveUp(idx)" :disabled="idx===0">上移</n-button>
          <n-button size="small" @click="moveDown(idx)" :disabled="idx===arranged.length-1">下移</n-button>
        </n-list-item>
      </n-list>
      <n-button @click="saveArrange" style="margin-top: 16px;">保存到本地</n-button>
      <n-alert v-if="saveSuccess" type="success" class="copy-tip">保存成功！</n-alert>
    </n-card>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
const toolOptions = [
  { label: 'Json格式化', value: 'JsonFormatter' },
  { label: '进制转换', value: 'RadixConverter' },
  { label: '单位转换', value: 'UnitConverter' },
  { label: '二维码生成', value: 'QrCodeTool' },
  { label: '网页计算器', value: 'Calculator' },
  { label: 'IP查询', value: 'IpTool' },
  { label: 'Markdown转HTML', value: 'MarkdownToHtml' },
  { label: '正则测试', value: 'RegexTester' },
  { label: '短网址', value: 'ShortUrlTool' },
  // ...可补充更多
];
const selected = ref(toolOptions[0].value);
const arranged = ref<string[]>([]);
const saveSuccess = ref(false);
const route = useRoute();
function addTool() {
  if (!arranged.value.includes(selected.value)) arranged.value.push(selected.value);
}
function removeTool(idx: number) {
  arranged.value.splice(idx, 1);
}
function moveUp(idx: number) {
  if (idx > 0) {
    const t = arranged.value[idx];
    arranged.value[idx] = arranged.value[idx - 1];
    arranged.value[idx - 1] = t;
  }
}
function moveDown(idx: number) {
  if (idx < arranged.value.length - 1) {
    const t = arranged.value[idx];
    arranged.value[idx] = arranged.value[idx + 1];
    arranged.value[idx + 1] = t;
  }
}
function saveArrange() {
  localStorage.setItem('toolhub_arrange', JSON.stringify(arranged.value));
  saveSuccess.value = true;
  setTimeout(() => (saveSuccess.value = false), 1500);
}
onMounted(() => {
  const arr = localStorage.getItem('toolhub_arrange');
  if (arr) arranged.value = JSON.parse(arr);
  // 自动添加工具（如有）
  if (route.query.add) {
    const tool = route.query.add as string;
    if (tool && !arranged.value.includes(tool)) arranged.value.push(tool);
  }
});
</script>
<style scoped>
.tool-arrange { max-width: 600px; margin: 0 auto; }
.copy-tip { margin-top: 8px; }
</style> 