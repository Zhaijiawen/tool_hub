<template>
  <n-config-provider>
    <n-message-provider>
      <n-layout>
        <n-layout-header bordered>
          <div class="header">
            <div class="logo" @click="router.push('/')">
              <n-icon size="24">
                <code-slash />
              </n-icon>
              <span>ToolHub</span>
            </div>
          </div>
        </n-layout-header>
        <n-layout-content>
          <router-view />
        </n-layout-content>
        <n-layout-footer bordered>
          <div class="footer">
            <p>© 2024 ToolHub. All rights reserved.</p>
          </div>
        </n-layout-footer>
      </n-layout>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NLayout, NLayoutHeader, NLayoutContent, NLayoutFooter, NIcon } from 'naive-ui'
import { useRouter } from 'vue-router'
import { CodeSlash } from '@vicons/ionicons5'

const router = useRouter()
</script>

<style scoped>
.header {
  height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  background: #fff;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  color: var(--primary-color);
}

.footer {
  padding: 24px;
  text-align: center;
  color: #666;
}
</style> 