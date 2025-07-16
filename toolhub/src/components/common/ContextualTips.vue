<template>
  <div class="contextual-tips" v-if="shouldShow">
    <!-- 左侧提示 -->
    <div class="tip-panel left-panel" v-if="leftTip">
      <n-card size="small" :title="leftTip.title" class="tip-card">
        <div class="tip-content">
          <div class="tip-icon">
            <n-icon size="24" :color="leftTip.iconColor">
              <component :is="leftTip.icon" />
            </n-icon>
          </div>
          <div class="tip-text">
            <p class="tip-description">{{ leftTip.description }}</p>
            <div class="tip-items">
              <div class="tip-item" v-for="item in leftTip.items" :key="item">
                <n-icon size="14" color="#18a058">
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1zm3.5 4L6.75 9.75 4.5 7.5l-1 1 3.25 3.25L12.5 6l-1-1z"/>
                  </svg>
                </n-icon>
                <span>{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
      </n-card>
    </div>

    <!-- 右侧提示 -->
    <div class="tip-panel right-panel" v-if="rightTip">
      <n-card size="small" :title="rightTip.title" class="tip-card">
        <div class="tip-content">
          <div class="tip-icon">
            <n-icon size="24" :color="rightTip.iconColor">
              <component :is="rightTip.icon" />
            </n-icon>
          </div>
          <div class="tip-text">
            <p class="tip-description">{{ rightTip.description }}</p>
            <div class="tip-example" v-if="rightTip.example">
              <h4>{{ t('common.example') }}:</h4>
              <pre class="example-code">{{ rightTip.example }}</pre>
            </div>
            <div class="tip-actions" v-if="rightTip.actions">
              <n-button 
                v-for="action in rightTip.actions" 
                :key="action.text"
                size="small" 
                @click="handleAction(action)"
                class="action-btn"
              >
                {{ action.text }}
              </n-button>
            </div>
          </div>
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import {
  CodeOutline as CodeIcon,
  LockClosedOutline as LockIcon,
  TimeOutline as TimeIcon,
  ColorPaletteOutline as ColorIcon,
  DocumentTextOutline as DocIcon,
  ImageOutline as ImageIcon,
  ChatbubbleOutline as TextIcon,
  CalculatorOutline as CalcIcon,
  QrCodeOutline as QrIcon,
  ShieldCheckmarkOutline as ShieldIcon,
  SpeedometerOutline as SpeedIcon,
  BulbOutline as BulbIcon,
  BookOutline as BookIcon,
  StarOutline as StarIcon
} from '@vicons/ionicons5'

const props = defineProps({
  currentPath: {
    type: String,
    required: true
  }
})

const { t } = useI18n()
const router = useRouter()

// 响应式窗口宽度
const windowWidth = ref(1200)

// 更新窗口宽度
const updateWindowWidth = () => {
  if (typeof window !== 'undefined') {
    windowWidth.value = window.innerWidth
  }
}

// 组件挂载时监听窗口变化
onMounted(() => {
  updateWindowWidth()
  window.addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})

// 控制显示
const shouldShow = computed(() => {
  return windowWidth.value >= 1400 // 只在大屏幕显示
})

// 根据路径获取知识提示
const getTipsForPath = (path) => {
  const category = path.split('/')[1]
  const tool = path.split('/')[2]
  
  const tipConfigs = {
    format: {
      json: {
        left: {
          title: t('sidebar.tips.jsonFormat'),
          icon: CodeIcon,
          iconColor: '#18a058',
          description: t('sidebar.tips.jsonFormatDesc'),
          items: [
            t('sidebar.tips.jsonValidation'),
            t('sidebar.tips.jsonBeautify'),
            t('sidebar.tips.jsonCompress'),
            t('sidebar.tips.jsonEscape')
          ]
        },
        right: {
          title: t('sidebar.tips.commonUse'),
          icon: BulbIcon,
          iconColor: '#f39c12',
          description: t('sidebar.tips.jsonCommonDesc'),
          example: `{
  "name": "ToolHub",
  "version": "1.0.0",
  "features": ["format", "encrypt"]
}`,
          actions: [
            { text: t('sidebar.tips.tryXML'), path: '/format/xml' },
            { text: t('sidebar.tips.tryYAML'), path: '/format/yaml' }
          ]
        }
      },
      xml: {
        left: {
          title: t('sidebar.tips.xmlFormat'),
          icon: CodeIcon,
          iconColor: '#52c41a',
          description: t('sidebar.tips.xmlFormatDesc'),
          items: [
            t('sidebar.tips.xmlValidation'),
            t('sidebar.tips.xmlBeautify'),
            t('sidebar.tips.xmlNamespace'),
            t('sidebar.tips.xmlStructure')
          ]
        },
        right: {
          title: t('sidebar.tips.commonUse'),
          icon: BookIcon,
          iconColor: '#722ed1',
          description: t('sidebar.tips.xmlCommonDesc'),
          example: `<?xml version="1.0" encoding="UTF-8"?>
<config>
  <database>
    <host>localhost</host>
    <port>3306</port>
  </database>
</config>`,
          actions: [
            { text: t('sidebar.tips.tryJSON'), path: '/format/json' },
            { text: t('sidebar.tips.tryHTML'), path: '/format/html' }
          ]
        }
      }
    },
    encrypt: {
      base64: {
        left: {
          title: t('sidebar.tips.base64Encoding'),
          icon: LockIcon,
          iconColor: '#2080f0',
          description: t('sidebar.tips.base64Desc'),
          items: [
            t('sidebar.tips.base64Text'),
            t('sidebar.tips.base64Image'),
            t('sidebar.tips.base64Safe'),
            t('sidebar.tips.base64URL')
          ]
        },
        right: {
          title: t('sidebar.tips.commonUse'),
          icon: StarIcon,
          iconColor: '#eb2f96',
          description: t('sidebar.tips.base64CommonDesc'),
          example: `// 原文本
Hello World!

// Base64编码
SGVsbG8gV29ybGQh`,
          actions: [
            { text: t('sidebar.tips.tryHex'), path: '/encrypt/hex' },
            { text: t('sidebar.tips.tryURL'), path: '/encrypt/url' }
          ]
        }
      },
      aes: {
        left: {
          title: t('sidebar.tips.aesEncryption'),
          icon: ShieldIcon,
          iconColor: '#722ed1',
          description: t('sidebar.tips.aesDesc'),
          items: [
            t('sidebar.tips.aesSecure'),
            t('sidebar.tips.aesKey'),
            t('sidebar.tips.aesModes'),
            t('sidebar.tips.aesPadding')
          ]
        },
        right: {
          title: t('sidebar.tips.securityTips'),
          icon: BulbIcon,
          iconColor: '#fa8c16',
          description: t('sidebar.tips.aesSecurityDesc'),
          example: `密钥长度: 128/192/256位
模式: CBC, ECB, CFB, OFB
填充: PKCS7, NoPadding`,
          actions: [
            { text: t('sidebar.tips.tryDES'), path: '/encrypt/des' },
            { text: t('sidebar.tips.tryRSA'), path: '/encrypt/rsa' }
          ]
        }
      }
    },
    convert: {
      timestamp: {
        left: {
          title: t('sidebar.tips.timestampConvert'),
          icon: TimeIcon,
          iconColor: '#f39c12',
          description: t('sidebar.tips.timestampDesc'),
          items: [
            t('sidebar.tips.timestampUnix'),
            t('sidebar.tips.timestampMs'),
            t('sidebar.tips.timestampTimezone'),
            t('sidebar.tips.timestampFormat')
          ]
        },
        right: {
          title: t('sidebar.tips.commonUse'),
          icon: BookIcon,
          iconColor: '#13c2c2',
          description: t('sidebar.tips.timestampCommonDesc'),
          example: `当前时间戳: ${Math.floor(Date.now() / 1000)}
毫秒时间戳: ${Date.now()}
日期格式: ${new Date().toLocaleString()}`,
          actions: [
            { text: t('sidebar.tips.tryDateCalc'), path: '/convert/date-calc' },
            { text: t('sidebar.tips.tryDateDiff'), path: '/convert/date-diff' }
          ]
        }
      },
      color: {
        left: {
          title: t('sidebar.tips.colorConvert'),
          icon: ColorIcon,
          iconColor: '#eb2f96',
          description: t('sidebar.tips.colorDesc'),
          items: [
            t('sidebar.tips.colorHex'),
            t('sidebar.tips.colorRGB'),
            t('sidebar.tips.colorHSL'),
            t('sidebar.tips.colorPicker')
          ]
        },
        right: {
          title: t('sidebar.tips.designTips'),
          icon: StarIcon,
          iconColor: '#52c41a',
          description: t('sidebar.tips.colorDesignDesc'),
          example: `HEX: #FF6B6B
RGB: rgb(255, 107, 107)
HSL: hsl(0, 100%, 71%)`,
          actions: [
            { text: t('sidebar.tips.tryUnit'), path: '/convert/unit' },
            { text: t('sidebar.tips.tryNumber'), path: '/convert/number' }
          ]
        }
      }
    },
    other: {
      qrcode: {
        left: {
          title: t('sidebar.tips.qrcodeGenerate'),
          icon: QrIcon,
          iconColor: '#722ed1',
          description: t('sidebar.tips.qrcodeDesc'),
          items: [
            t('sidebar.tips.qrcodeText'),
            t('sidebar.tips.qrcodeURL'),
            t('sidebar.tips.qrcodeContact'),
            t('sidebar.tips.qrcodeWifi')
          ]
        },
        right: {
          title: t('sidebar.tips.qrcodeTips'),
          icon: BulbIcon,
          iconColor: '#fa8c16',
          description: t('sidebar.tips.qrcodeTipsDesc'),
          example: `文本: Hello World
网址: https://toolhub.com
WiFi: WIFI:T:WPA;S:MyNetwork;P:password;;`,
          actions: [
            { text: t('sidebar.tips.tryCalc'), path: '/other/calculator' },
            { text: t('sidebar.tips.tryRegex'), path: '/convert/regex' }
          ]
        }
      }
    }
  }
  
  return tipConfigs[category]?.[tool] || getDefaultTips(category)
}

// 获取默认提示（当没有具体工具配置时）
const getDefaultTips = (category) => {
  const defaultTips = {
    format: {
      left: {
        title: t('sidebar.tips.formatTools'),
        icon: CodeIcon,
        iconColor: '#18a058',
        description: t('sidebar.tips.formatToolsDesc'),
        items: [
          t('sidebar.tips.formatBeautify'),
          t('sidebar.tips.formatValidate'),
          t('sidebar.tips.formatCompress'),
          t('sidebar.tips.formatHighlight')
        ]
      },
      right: {
        title: t('sidebar.tips.formatAdvanced'),
        icon: SpeedIcon,
        iconColor: '#2080f0',
        description: t('sidebar.tips.formatAdvancedDesc'),
        actions: [
          { text: 'JSON', path: '/format/json' },
          { text: 'XML', path: '/format/xml' },
          { text: 'JavaScript', path: '/format/js' },
          { text: 'CSS', path: '/format/css' }
        ]
      }
    },
    encrypt: {
      left: {
        title: t('sidebar.tips.encryptTools'),
        icon: ShieldIcon,
        iconColor: '#722ed1',
        description: t('sidebar.tips.encryptToolsDesc'),
        items: [
          t('sidebar.tips.encryptSecure'),
          t('sidebar.tips.encryptLocal'),
          t('sidebar.tips.encryptAlgorithms'),
          t('sidebar.tips.encryptKeys')
        ]
      },
      right: {
        title: t('sidebar.tips.encryptTypes'),
        icon: LockIcon,
        iconColor: '#fa8c16',
        description: t('sidebar.tips.encryptTypesDesc'),
        actions: [
          { text: 'AES', path: '/encrypt/aes' },
          { text: 'RSA', path: '/encrypt/rsa' },
          { text: 'Base64', path: '/encrypt/base64' },
          { text: 'SHA Hash', path: '/encrypt/sha' }
        ]
      }
    },
    convert: {
      left: {
        title: t('sidebar.tips.convertTools'),
        icon: TimeIcon,
        iconColor: '#f39c12',
        description: t('sidebar.tips.convertToolsDesc'),
        items: [
          t('sidebar.tips.convertTime'),
          t('sidebar.tips.convertNumber'),
          t('sidebar.tips.convertUnit'),
          t('sidebar.tips.convertColor')
        ]
      },
      right: {
        title: t('sidebar.tips.convertQuick'),
        icon: SpeedIcon,
        iconColor: '#13c2c2',
        description: t('sidebar.tips.convertQuickDesc'),
        actions: [
          { text: t('sidebar.timestamp'), path: '/convert/timestamp' },
          { text: 'Base Convert', path: '/convert/number-base' },
          { text: 'Color', path: '/convert/color' },
          { text: 'Unit', path: '/convert/unit' }
        ]
      }
    },
    other: {
      left: {
        title: t('sidebar.tips.utilityTools'),
        icon: CalcIcon,
        iconColor: '#52c41a',
        description: t('sidebar.tips.utilityToolsDesc'),
        items: [
          t('sidebar.tips.utilityQR'),
          t('sidebar.tips.utilityCalc'),
          t('sidebar.tips.utilityText'),
          t('sidebar.tips.utilityImage')
        ]
      },
      right: {
        title: t('sidebar.tips.utilityQuick'),
        icon: StarIcon,
        iconColor: '#eb2f96',
        description: t('sidebar.tips.utilityQuickDesc'),
        actions: [
          { text: t('sidebar.qrCode'), path: '/other/qrcode' },
          { text: 'Calculator', path: '/other/calculator' },
          { text: 'Text Case', path: '/text/case' },
          { text: 'Image Convert', path: '/image/convert' }
        ]
      }
    }
  }
  
  return defaultTips[category] || null
}

// 当前页面的提示
const currentTips = computed(() => {
  return getTipsForPath(props.currentPath)
})

const leftTip = computed(() => currentTips.value?.left)
const rightTip = computed(() => currentTips.value?.right)

// 处理操作按钮点击
const handleAction = (action) => {
  if (action.path) {
    router.push(action.path)
  } else if (action.url) {
    window.open(action.url, '_blank')
  }
}
</script>

<style scoped>
.contextual-tips {
  position: fixed;
  top: 84px;
  left: 0;
  right: 0;
  pointer-events: none;
  z-index: 5;
}

.tip-panel {
  position: fixed;
  width: 280px;
  pointer-events: auto;
}

.left-panel {
  left: calc((100vw - 1200px) / 2 - 300px);
}

.right-panel {
  right: calc((100vw - 1200px) / 2 - 300px);
}

.tip-card {
  background: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.tip-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.tip-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-icon {
  text-align: center;
  padding: 8px 0;
}

.tip-text {
  flex: 1;
}

.tip-description {
  font-size: 13px;
  color: var(--text-color-2);
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.tip-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-color-2);
  line-height: 1.4;
}

.tip-example {
  margin-top: 12px;
}

.tip-example h4 {
  font-size: 12px;
  color: var(--text-color);
  margin: 0 0 8px 0;
  font-weight: 600;
}

.example-code {
  background: var(--code-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 12px;
  font-size: 11px;
  line-height: 1.4;
  color: var(--text-color-2);
  white-space: pre-wrap;
  overflow-x: auto;
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.tip-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}

.action-btn {
  font-size: 11px;
  height: 26px;
  padding: 0 8px;
}

/* 响应式隐藏 */
@media (max-width: 1399px) {
  .contextual-tips {
    display: none;
  }
}

/* 确保在超大屏幕上有足够空间 */
@media (min-width: 1800px) {
  .left-panel {
    left: calc((100vw - 1200px) / 2 - 320px);
  }
  
  .right-panel {
    right: calc((100vw - 1200px) / 2 - 320px);
  }
  
  .tip-panel {
    width: 300px;
  }
}
</style> 