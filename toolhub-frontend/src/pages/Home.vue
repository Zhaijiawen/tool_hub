<template>
  <div class="home">
    <n-card title="欢迎使用 ToolHub 在线工具站">
      <n-grid :cols="4" :x-gap="16" :y-gap="16">
        <n-grid-item v-for="category in categories" :key="category.key">
          <n-card :title="category.label" size="small">
            <n-list>
              <n-list-item v-for="tool in category.children" :key="tool.key">
                <n-button text @click="router.push(`/${tool.key}`)">
                  {{ tool.label }}
                </n-button>
              </n-list-item>
            </n-list>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { menuOptions } from '../components/Header.vue';

const router = useRouter();
const categories = menuOptions;
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
</style> 