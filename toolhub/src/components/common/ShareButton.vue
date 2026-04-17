<template>
  <n-popover trigger="click" placement="bottom-end" :show="showPopover" @update:show="showPopover = $event">
    <template #trigger>
      <n-button v-bind="buttonProps" @click="showPopover = !showPopover">
        <template #icon>
          <n-icon><share-icon /></n-icon>
        </template>
        <span v-if="showText" class="button-text">{{ t('common.share.label') }}</span>
      </n-button>
    </template>

    <div class="share-panel">
      <p class="share-title">{{ t('common.share.title') }}</p>

      <!-- 当前 URL 展示 -->
      <div class="share-url-row">
        <n-input
          readonly
          :value="currentUrl"
          size="small"
          class="share-url-input"
        />
        <n-button size="small" type="primary" @click="copyUrl">
          {{ copied ? t('common.share.copied') : t('common.share.copy') }}
        </n-button>
      </div>

      <!-- 分享到平台 -->
      <div class="share-platforms">
        <n-button
          v-for="platform in platforms"
          :key="platform.key"
          size="small"
          quaternary
          class="platform-btn"
          @click="shareToPlatform(platform)"
        >
          <template #icon>
            <n-icon :color="platform.color">
              <component :is="platform.icon" />
            </n-icon>
          </template>
          {{ platform.label }}
        </n-button>
      </div>

      <!-- 二维码入口 -->
      <div class="share-qr-row">
        <n-button size="small" quaternary @click="toggleQR">
          <template #icon>
            <n-icon><qr-code-icon /></n-icon>
          </template>
          {{ t('common.share.qrCode') }}
        </n-button>
      </div>

      <!-- 二维码展示区域 -->
      <div v-if="showQR" class="share-qr-display">
        <canvas ref="qrCanvasRef" class="qr-canvas" />
        <n-button size="tiny" @click="downloadQR">{{ t('common.share.downloadQR') }}</n-button>
      </div>
    </div>
  </n-popover>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import {
  ShareSocialOutline as ShareIcon,
  QrCodeOutline as QrCodeIcon,
  LogoTwitter as TwitterIcon,
  LinkOutline as LinkIcon
} from '@vicons/ionicons5'
import QRCode from 'qrcode'

const props = defineProps({
  /** 自定义分享 URL，默认使用当前页面 URL */
  url: {
    type: String,
    default: null
  },
  /** 是否在按钮上显示文字 */
  showText: {
    type: Boolean,
    default: false
  },
  /** 透传给 n-button 的属性 */
  buttonProps: {
    type: Object,
    default: () => ({})
  }
})

const { t } = useI18n()
const message = useMessage()
const route = useRoute()

// 当前分享 URL
const currentUrl = computed(() => {
  if (props.url) return props.url
  return window.location.origin + route.fullPath
})

const showPopover = ref(false)
const copied = ref(false)
const showQR = ref(false)
const qrCanvasRef = ref(null)

// 支持的分享平台
const platforms = computed(() => [
  {
    key: 'twitter',
    label: 'X / Twitter',
    color: '#1d9bf0',
    icon: TwitterIcon,
    getUrl: (url) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(t('common.share.tweetText'))}`
  },
  {
    key: 'copy',
    label: t('common.share.copyMarkdown'),
    color: '#6b7280',
    icon: LinkIcon,
    getUrl: null
  }
])

// 复制 URL 到剪贴板
async function copyUrl() {
  try {
    await navigator.clipboard.writeText(currentUrl.value)
    copied.value = true
    message.success(t('common.share.copySuccess'))
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    message.error(t('common.copyFailed'))
  }
}

// 分享到平台
function shareToPlatform(platform) {
  if (platform.key === 'copy') {
    // 复制 Markdown 格式链接
    const md = `[${document.title}](${currentUrl.value})`
    navigator.clipboard.writeText(md).then(() => {
      message.success(t('common.share.copySuccess'))
    })
    return
  }
  if (platform.getUrl) {
    window.open(platform.getUrl(currentUrl.value), '_blank', 'noopener,noreferrer')
  }
}

// 切换二维码显示
async function toggleQR() {
  showQR.value = !showQR.value
  if (showQR.value) {
    await nextTick()
    renderQR()
  }
}

// 渲染二维码
async function renderQR() {
  if (!qrCanvasRef.value) return
  try {
    await QRCode.toCanvas(qrCanvasRef.value, currentUrl.value, {
      width: 180,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
  } catch (err) {
    console.error('QR render error:', err)
  }
}

// 下载二维码
function downloadQR() {
  if (!qrCanvasRef.value) return
  const link = document.createElement('a')
  link.href = qrCanvasRef.value.toDataURL('image/png')
  link.download = `share-qrcode-${Date.now()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 监听 URL 变化，重置二维码
watch(currentUrl, () => {
  if (showQR.value) {
    nextTick(renderQR)
  }
})

// 关闭 popover 时重置状态
watch(showPopover, (val) => {
  if (!val) {
    showQR.value = false
    copied.value = false
  }
})
</script>

<style scoped>
.share-panel {
  width: 280px;
  padding: 4px 0;
}

.share-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-color, #18181c);
  margin: 0 0 10px 0;
}

.share-url-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;
}

.share-url-input {
  flex: 1;
  min-width: 0;
}

.share-platforms {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.platform-btn {
  flex: 0 0 auto;
}

.share-qr-row {
  border-top: 1px solid var(--border-color, #e0e0e6);
  padding-top: 8px;
}

.share-qr-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding-top: 10px;
}

.qr-canvas {
  border-radius: 6px;
  border: 1px solid var(--border-color, #e0e0e6);
}
</style>

