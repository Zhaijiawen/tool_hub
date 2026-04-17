<template>
  <div class="file-hash-tool">
    <n-card :title="t('other.fileHash.title')" :bordered="false">
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
          <n-text class="section-title">{{ t('other.fileHash.computing') }}</n-text>
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

const CHUNK_SIZE = 2 * 1024 * 1024 // 2MB chunks

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
    message.warning(t('other.fileHash.largeFileWarning'))
  }

  await computeHashes(f)
}

const computeHashes = async (file) => {
  computing.value = true
  progress.value = 0

  try {
    // 读取整个文件
    const arrayBuffer = await readFileAsArrayBuffer(file)
    progress.value = 50

    // SHA 系列使用 Web Crypto API
    const [sha1Buf, sha256Buf, sha512Buf] = await Promise.all([
      crypto.subtle.digest('SHA-1', arrayBuffer),
      crypto.subtle.digest('SHA-256', arrayBuffer),
      crypto.subtle.digest('SHA-512', arrayBuffer)
    ])
    hashResults.sha1 = bufToHex(sha1Buf)
    hashResults.sha256 = bufToHex(sha256Buf)
    hashResults.sha512 = bufToHex(sha512Buf)
    progress.value = 80

    // MD5 动态导入 spark-md5
    const SparkMD5 = (await import('spark-md5')).default
    const spark = new SparkMD5.ArrayBuffer()
    spark.append(arrayBuffer)
    hashResults.md5 = spark.end()
    progress.value = 100
  } catch (e) {
    message.error(t('common.error') + ': ' + e.message)
  } finally {
    computing.value = false
  }
}

const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

const bufToHex = (buffer) => {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
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

@media (max-width: 768px) {
  .file-hash-tool {
    padding: 0 12px;
  }
}
</style>

