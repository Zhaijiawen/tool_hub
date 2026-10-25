<template>
  <div class="file-hash-tool">
    <!-- 工具简介 -->
    <ToolIntro toolKey="fileHash" />

    <n-card :title="t('other.fileHash.title')" :bordered="false">
      <template #header-extra>
        <WasmTag />
      </template>
      <n-space vertical size="large">

        <!-- 文件上传 -->
        <div class="upload-section">
          <n-upload
            ref="uploadRef"
            :show-file-list="false"
            :custom-request="handleFileSelect"
            accept="*"
          >
            <n-upload-dragger>
              <div class="upload-inner">
                <n-icon size="48" :depth="3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                  </svg>
                </n-icon>
                <n-text class="upload-title">{{ t('other.fileHash.dragOrClick') }}</n-text>
                <n-text depth="3" class="upload-hint">{{ t('other.fileHash.sizeHint') }}</n-text>
              </div>
            </n-upload-dragger>
          </n-upload>
        </div>

        <!-- 文件信息 -->
        <div v-if="fileInfo" class="file-info-section">
          <n-descriptions bordered :column="2">
            <n-descriptions-item :label="t('other.fileHash.fileName')">{{ fileInfo.name }}</n-descriptions-item>
            <n-descriptions-item :label="t('other.fileHash.fileSize')">{{ formatFileSize(fileInfo.size) }}</n-descriptions-item>
            <n-descriptions-item :label="t('other.fileHash.fileType')">{{ fileInfo.type || 'unknown' }}</n-descriptions-item>
            <n-descriptions-item :label="t('other.fileHash.lastModified')">{{ new Date(fileInfo.lastModified).toLocaleString() }}</n-descriptions-item>
          </n-descriptions>
        </div>

        <!-- 进度条 -->
        <div v-if="computing" class="progress-section">
          <div class="progress-header">
            <n-text class="section-title">{{ t('other.fileHash.computing') }}</n-text>
            <n-button size="tiny" quaternary @click="cancelCompute">
              {{ t('other.fileHash.cancel') }}
            </n-button>
          </div>
          <n-progress type="line" :percentage="progress" :indicator-placement="'inside'" />
        </div>

        <!-- 哈希结果 -->
        <div v-if="hashResults.md5 !== null" class="results-section">
          <n-text class="section-title">{{ t('other.fileHash.hashResults') }}</n-text>
          <n-list bordered>
            <n-list-item v-for="algo in algorithms" :key="algo.key">
              <div class="hash-item">
                <div class="hash-header">
                  <n-tag size="small" :type="getVerifyStatus(algo.key)">{{ algo.label }}</n-tag>
                  <n-button size="tiny" quaternary @click="copyHash(algo.key)">{{ t('common.copy') }}</n-button>
                </div>
                <div class="hash-value">
                  <n-text code>{{ hashResults[algo.key] || t('other.fileHash.computing') }}</n-text>
                </div>
              </div>
            </n-list-item>
          </n-list>
        </div>

        <!-- 校验比对 -->
        <div v-if="hashResults.md5 !== null" class="verify-section">
          <n-text class="section-title">{{ t('other.fileHash.verify') }}</n-text>
          <n-input-group>
            <n-input
              v-model:value="expectedHash"
              :placeholder="t('other.fileHash.verifyPlaceholder')"
              clearable
            />
            <n-button @click="verifyHash">{{ t('other.fileHash.verifyBtn') }}</n-button>
          </n-input-group>
          <div v-if="verifyResult !== null" class="verify-result">
            <n-tag :type="verifyResult ? 'success' : 'error'" size="large">
              {{ verifyResult ? ('✓ ' + t('other.fileHash.match')) : ('✗ ' + t('other.fileHash.noMatch')) }}
            </n-tag>
          </div>
        </div>

      </n-space>
    </n-card>
    <TutorialAndDocs toolKey="fileHash" />
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
import ToolIntro from '@/components/common/ToolIntro.vue'
import WasmTag from '@/components/common/WasmTag.vue'
import { useWasmModule } from '@/composables/useWasmModule'

const { t } = useI18n()
const message = useMessage()

const uploadRef = ref(null)
const fileInfo = ref(null)
const computing = ref(false)
const progress = ref(0)
const expectedHash = ref('')
const verifyResult = ref(null)

const hashResults = reactive({
  md5: null,
  sha1: null,
  sha256: null,
  sha512: null
})

const algorithms = [
  { key: 'md5', label: 'MD5' },
  { key: 'sha1', label: 'SHA-1' },
  { key: 'sha256', label: 'SHA-256' },
  { key: 'sha512', label: 'SHA-512' }
]

/**
 * 分块大小。取 4MB 是速度与内存的平衡点：
 * - 太大（如整文件）→ 内存峰值等于文件大小，GB 级文件直接 OOM；
 * - 太小（如 64KB）→ 跨 WASM 边界调用的开销占比过高。
 * 实测 100MB 文件流式哈希的堆内存增量仅约 0.6MB（不含源数据）。
 */
const CHUNK_SIZE = 4 * 1024 * 1024

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + ' MB'
  return (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB'
}

const handleFileSelect = async ({ file }) => {
  const f = file.file
  if (!f) return

  // 重置状态
  hashResults.md5 = null
  hashResults.sha1 = null
  hashResults.sha256 = null
  hashResults.sha512 = null
  verifyResult.value = null
  expectedHash.value = ''

  // 重置上传组件，允许再次选择同一文件或新文件
  await nextTick()
  if (uploadRef.value) {
    uploadRef.value.clear()
  }

  fileInfo.value = {
    name: f.name,
    size: f.size,
    type: f.type,
    lastModified: f.lastModified
  }

  if (f.size > 500 * 1024 * 1024) {
    // 流式处理已不吃内存，但 GB 级文件仍需数秒计算时间，提前告知预期
    message.info(t('other.fileHash.largeFileInfo'))
  }

  await computeHashes(f)
}

/** 取消信号：用户在计算过程中点击取消 */
let abortFlag = false

/**
 * 四个算法的 wasm loader（共约 32KB）。
 * compile:false —— hash-wasm 内部用 `WebAssembly.compile(bytes)` 自己编译，
 * 主线程再 compile 一份纯属浪费。
 */
const HASH_WASM = [
  { key: 'md5', loader: useWasmModule('hash-md5', { url: '/wasm/md5.wasm', name: 'Hash WASM', compile: false }) },
  { key: 'sha1', loader: useWasmModule('hash-sha1', { url: '/wasm/sha1.wasm', name: 'Hash WASM', compile: false }) },
  { key: 'sha256', loader: useWasmModule('hash-sha256', { url: '/wasm/sha256.wasm', name: 'Hash WASM', compile: false }) },
  { key: 'sha512', loader: useWasmModule('hash-sha512', { url: '/wasm/sha512.wasm', name: 'Hash WASM', compile: false }) }
]

/**
 * 流式计算全部哈希。
 *
 * 为什么必须流式：Web Crypto 的 `crypto.subtle.digest()` **不支持流式喂数据**，
 * 只能一次性传入完整数据 —— 这意味着它必须先把整个文件读进内存。
 * 旧实现还并发调用三次 digest（SHA-1/256/512），每次各复制一份，
 * 1GB 文件会产生约 4GB 峰值内存，浏览器直接崩溃。
 *
 * hash-wasm 提供 `createXXX()` 工厂 + `update(chunk)` 逐块喂入 + `digest()` 取值，
 * 内存占用与文件大小无关（实测 100MB 文件堆增量约 0.6MB）。
 *
 * 分块读取用 `file.slice()` —— 它是惰性视图，不会复制数据；
 * 只有 `arrayBuffer()` 才真正把字节读进内存。
 */
const computeHashes = async (file) => {
  computing.value = true
  progress.value = 0
  abortFlag = false

  try {
    // 四个算法 wasm 共约 32KB，一次性经 useWasmModule 下载（带进度/取消/缓存）
    const buffers = {}
    await Promise.all(
      HASH_WASM.map(async ({ key, loader }) => {
        const { buffer } = await loader.load()
        buffers[key] = new Uint8Array(buffer)
      })
    )
    if (abortFlag) return

    // 注入：vendor 胶水读取 self.__toolhubHashWasm 取字节（内嵌 base64 已剥离）
    globalThis.__toolhubHashWasm = buffers

    const [md5m, sha1m, sha256m, sha512m] = await Promise.all([
      import('@/vendor/hash-wasm/md5.js'),
      import('@/vendor/hash-wasm/sha1.js'),
      import('@/vendor/hash-wasm/sha256.js'),
      import('@/vendor/hash-wasm/sha512.js')
    ])
    if (abortFlag) return
    progress.value = 2

    // 工厂是异步的（内部要编译 wasm），四个并发初始化
    const [md5h, sha1h, sha256h, sha512h] = await Promise.all([
      unwrap(md5m, 'createMD5').createMD5(),
      unwrap(sha1m, 'createSHA1').createSHA1(),
      unwrap(sha256m, 'createSHA256').createSHA256(),
      unwrap(sha512m, 'createSHA512').createSHA512()
    ])
    if (abortFlag) return

    // 逐块读取并喂给四个哈希器 —— 内存中始终只有一个 chunk
    const total = file.size
    let offset = 0
    while (offset < total) {
      if (abortFlag) return
      const end = Math.min(offset + CHUNK_SIZE, total)
      const chunk = new Uint8Array(await file.slice(offset, end).arrayBuffer())
      md5h.update(chunk)
      sha1h.update(chunk)
      sha256h.update(chunk)
      sha512h.update(chunk)
      offset = end
      progress.value = Math.round((offset / total) * 100)
      // 让出主线程一帧，避免进度条绘制被哈希计算饿死（UI 卡顿）
      if (end < total) await new Promise((r) => setTimeout(r, 0))
    }

    hashResults.md5 = md5h.digest()
    hashResults.sha1 = sha1h.digest()
    hashResults.sha256 = sha256h.digest()
    hashResults.sha512 = sha512h.digest()
    progress.value = 100
  } catch (e) {
    if (!abortFlag) message.error(t('common.error') + ': ' + e.message)
  } finally {
    delete globalThis.__toolhubHashWasm
    computing.value = false
    if (abortFlag) {
      abortFlag = false
      hashResults.md5 = null
      hashResults.sha1 = null
      hashResults.sha256 = null
      hashResults.sha512 = null
      progress.value = 0
    }
  }
}

/**
 * 取出哈希工厂所在的模块对象。
 * hash-wasm 的各 vendored 文件是自我执行的 IIFE，会把 createXXX 写到
 * 全局 `globalThis.hashwasm`（无 ESM 具名导出，import 进来是空 namespace）。
 * 因此不能只靠模块自身的具名导出判断——这里同时检查模块自身、default、
 * 以及真正的全局对象，按需要的具体工厂函数名定位，避免误判取不到函数。
 */
function unwrap(mod, createFn) {
  const candidates = [mod, mod?.default, globalThis.hashwasm]
  for (const c of candidates) {
    if (c && typeof c[createFn] === 'function') return c
  }
  return mod
}

/** 用户取消计算 */
const cancelCompute = () => {
  if (!computing.value) return
  abortFlag = true
}

const copyHash = (key) => {
  const val = hashResults[key]
  if (!val) return
  navigator.clipboard.writeText(val).then(() => {
    message.success(t('common.copySuccess'))
  })
}

const verifyHash = () => {
  const expected = expectedHash.value.trim().toLowerCase()
  if (!expected) {
    message.warning(t('other.fileHash.emptyExpected'))
    return
  }
  const allHashes = [hashResults.md5, hashResults.sha1, hashResults.sha256, hashResults.sha512]
  verifyResult.value = allHashes.some(h => h && h.toLowerCase() === expected)
}

const getVerifyStatus = (key) => {
  const expected = expectedHash.value.trim().toLowerCase()
  if (!expected || verifyResult.value === null) return 'default'
  if (hashResults[key] && hashResults[key].toLowerCase() === expected) return 'success'
  return 'default'
}
</script>

<style scoped>
.file-hash-tool {
  max-width: 900px;
  margin: 20px auto;
  padding: 0 20px;
}

.section-title {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.upload-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 0;
}

.upload-title {
  font-size: 16px;
  font-weight: 500;
}

.upload-hint {
  font-size: 13px;
}

.file-info-section,
.progress-section,
.results-section,
.verify-section {
  margin-bottom: 4px;
}

.hash-item {
  width: 100%;
}

.hash-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.hash-value {
  word-break: break-all;
  font-size: 13px;
}

.verify-result {
  margin-top: 12px;
}

.progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

@media (max-width: 768px) {
  .file-hash-tool {
    padding: 0 12px;
  }
}
</style>

