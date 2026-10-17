<template>
  <!-- 全局 WASM 下载指示器：任一面触发下载即在此展示进度，可取消 / 失败可重试 -->
  <div v-if="activeList.length" class="wasm-dl-wrap">
    <div v-for="item in activeList" :key="item.id" class="wasm-dl-card">
      <div class="wasm-dl-head">
        <n-icon class="wasm-dl-icon" :class="item.status">
          <cube-outline v-if="item.status !== 'error'" />
          <alert-circle-outline v-else />
        </n-icon>
        <span class="wasm-dl-name" :title="item.name">{{ item.name }}</span>
        <n-button
          v-if="item.status === 'downloading' || item.status === 'compiling'"
          size="tiny" quaternary circle class="wasm-dl-act"
          :title="t('common.wasmDownload.cancel')"
          @click="cancel(item.id)"
        >
          <template #icon>
            <n-icon><close-outline /></n-icon>
          </template>
        </n-button>
        <n-button
          v-else-if="item.status === 'error'"
          size="tiny" quaternary circle class="wasm-dl-act"
          :title="t('common.wasmDownload.retry')"
          @click="retry(item)"
        >
          <template #icon>
            <n-icon><refresh-outline /></n-icon>
          </template>
        </n-button>
      </div>

      <n-progress
        class="wasm-dl-bar"
        :type="item.status === 'compiling' ? 'line' : 'line'"
        :percentage="item.status === 'compiling' ? undefined : Math.round((item.progress || 0) * 100)"
        :processing="item.status === 'compiling'"
        :status="item.status === 'error' ? 'error' : (item.status === 'ready' ? 'success' : 'info')"
        :show-indicator="item.status !== 'compiling'"
        indicator-placement="inside"
      />

      <div class="wasm-dl-status">
        <span v-if="item.status === 'downloading'">
          {{ t('common.wasmDownload.downloading') }} {{ Math.round((item.progress || 0) * 100) }}%
        </span>
        <span v-else-if="item.status === 'compiling'">{{ t('common.wasmDownload.preparing') }}</span>
        <span v-else-if="item.status === 'ready'">{{ t('common.wasmDownload.done') }}</span>
        <span v-else-if="item.status === 'error'" class="wasm-dl-err">{{ t('common.wasmDownload.failed') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWasmDownloads } from '@/composables/useWasmModule'
import {
  CubeOutline,
  AlertCircleOutline,
  CloseOutline,
  RefreshOutline
} from '@vicons/ionicons5'

const { t } = useI18n()
const { downloads, cancel } = useWasmDownloads()

// 仅展示进行中 / 失败 / 刚就绪的条目（idle 不展示）
const activeList = computed(() => {
  return Object.entries(downloads.value)
    .map(([id, v]) => ({ id, ...v }))
    .filter((item) => ['downloading', 'compiling', 'error', 'ready'].includes(item.status))
})

function retry(item) {
  if (typeof item.retry === 'function') item.retry()
}
</script>

<style scoped>
.wasm-dl-wrap {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 260px;
  max-width: calc(100vw - 32px);
}

.wasm-dl-card {
  background-color: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  box-shadow: var(--shadow-md, 0 6px 16px rgba(0, 0, 0, 0.12));
  padding: 10px 12px;
  color: var(--text-color);
}

.wasm-dl-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.wasm-dl-icon {
  font-size: 18px;
  color: var(--primary-color);
  flex-shrink: 0;
}
.wasm-dl-icon.error {
  color: var(--error-color);
}

.wasm-dl-name {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wasm-dl-act {
  flex-shrink: 0;
}

.wasm-dl-bar {
  margin: 2px 0 4px;
}

.wasm-dl-status {
  font-size: 12px;
  color: var(--text-color-secondary, var(--text-color));
}
.wasm-dl-err {
  color: var(--error-color);
}
</style>
