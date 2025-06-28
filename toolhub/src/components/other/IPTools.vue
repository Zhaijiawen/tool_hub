<template>
  <n-card :title="$t('other.ipTools.title')">
    <n-tabs type="line" animated>
      <!-- IP查询 -->
      <n-tab-pane name="lookup" :tab="$t('other.ipTools.lookup')">
        <n-form>
          <n-form-item :label="$t('other.ipTools.ip')">
            <n-input v-model:value="lookupForm.ip" :placeholder="$t('other.ipTools.ipPlaceholder')" />
          </n-form-item>

          <n-space>
            <n-button type="primary" @click="lookupIP">
              {{ $t('other.ipTools.lookup') }}
            </n-button>
            <n-button @click="copyResult" :disabled="!lookupResult">
              {{ $t('other.ipTools.copy') }}
            </n-button>
          </n-space>

          <n-result v-if="lookupResult" :status="'success'" :title="$t('other.ipTools.lookupResult')">
            <template #footer>
              <n-descriptions bordered>
                <n-descriptions-item :label="$t('other.ipTools.ip')">
                  {{ lookupResult.ip }}
                </n-descriptions-item>
                <n-descriptions-item :label="$t('other.ipTools.country')">
                  {{ lookupResult.country }}
                </n-descriptions-item>
                <n-descriptions-item :label="$t('other.ipTools.region')">
                  {{ lookupResult.region }}
                </n-descriptions-item>
                <n-descriptions-item :label="$t('other.ipTools.city')">
                  {{ lookupResult.city }}
                </n-descriptions-item>
                <n-descriptions-item :label="$t('other.ipTools.isp')">
                  {{ lookupResult.isp }}
                </n-descriptions-item>
                <n-descriptions-item :label="$t('other.ipTools.asn')">
                  {{ lookupResult.asn }}
                </n-descriptions-item>
                <n-descriptions-item :label="$t('other.ipTools.location')">
                  {{ lookupResult.latitude }}, {{ lookupResult.longitude }}
                </n-descriptions-item>
                <n-descriptions-item :label="$t('other.ipTools.timezone')">
                  {{ lookupResult.timezone }}
                </n-descriptions-item>
              </n-descriptions>
            </template>
          </n-result>

          <!-- 错误提示 -->
          <n-alert v-if="lookupError" type="t('common.error')" :title="error" class="mt-4">
            {{ lookupError }}
          </n-alert>
        </n-form>
      </n-tab-pane>

      <!-- IP反查 -->
      <n-tab-pane name="reverse" :tab="$t('other.ipTools.reverse')">
        <n-form>
          <n-form-item :label="$t('other.ipTools.domain')">
            <n-input v-model:value="reverseForm.domain" :placeholder="$t('other.ipTools.domainPlaceholder')" />
          </n-form-item>

          <n-space>
            <n-button type="primary" @click="reverseLookup">
              {{ $t('other.ipTools.reverse') }}
            </n-button>
            <n-button @click="copyReverseResult" :disabled="!reverseResult">
              {{ $t('other.ipTools.copy') }}
            </n-button>
          </n-space>

          <n-result v-if="reverseResult" :status="'success'" :title="$t('other.ipTools.reverseResult')">
            <template #footer>
              <n-list>
                <n-list-item v-for="(ip, index) in reverseResult" :key="index">
                  {{ ip }}
                </n-list-item>
              </n-list>
            </template>
          </n-result>

          <n-alert v-if="reverseError" type="error" :title="$t('other.ipTools.reverseError')" class="mt-4" />
        </n-form>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()

// IP查询表单
const lookupForm = reactive({
  ip: ''
})

// IP反查表单
const reverseForm = reactive({
  domain: ''
})

// 查询结果
const lookupResult = ref(null)
const lookupError = ref('')

// 反查结果
const reverseResult = ref([])
const reverseError = ref('')

// IP查询
async function lookupIP() {
  try {
    if (!lookupForm.ip) {
      throw new Error(t('other.ipTools.ipRequired'))
    }

    // 这里应该调用后端API进行IP查询
    // 示例代码仅作演示
    const response = await fetch(`/api/ip-lookup/${lookupForm.ip}`)

    if (!response.ok) {
      throw new Error(t('other.ipTools.lookupError'))
    }

    const data = await response.json()
    lookupResult.value = data
    lookupError.value = ''
  } catch (err) {
    lookupError.value = err.message
    lookupResult.value = null
  }
}

// IP反查
async function reverseLookup() {
  try {
    if (!reverseForm.domain) {
      throw new Error(t('other.ipTools.domainRequired'))
    }

    // 这里应该调用后端API进行IP反查
    // 示例代码仅作演示
    const response = await fetch(`/api/ip-reverse/${reverseForm.domain}`)

    if (!response.ok) {
      throw new Error(t('other.ipTools.reverseError'))
    }

    const data = await response.json()
    reverseResult.value = data.ips
    reverseError.value = ''
  } catch (err) {
    reverseError.value = err.message
    reverseResult.value = []
  }
}

// 复制查询结果
function copyResult() {
  if (!lookupResult.value) return

  const result = JSON.stringify(lookupResult.value, null, 2)
  navigator.clipboard.writeText(result)
  message.success(t('other.ipTools.copied'))
}

// 复制反查结果
function copyReverseResult() {
  if (!reverseResult.value.length) return

  const result = reverseResult.value.join('\n')
  navigator.clipboard.writeText(result)
  message.success(t('other.ipTools.copied'))
}
</script>

<style scoped>
.n-card {
  max-width: 800px;
  margin: 0 auto;
}

.mt-4 {
  margin-top: 16px;
}
</style>