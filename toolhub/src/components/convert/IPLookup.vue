<template>
  <n-card :title="$t('convert.ipLookup.title')">
    <n-form>
      <n-form-item :label="$t('convert.ipLookup.input')">
        <n-input
          v-model:value="formData.input"
          :placeholder="$t('convert.ipLookup.inputPlaceholder')"
        />
      </n-form-item>

      <n-space>
        <n-button type="primary" @click="lookup">
          {{ $t('convert.ipLookup.lookup') }}
        </n-button>
        <n-button @click="copyResult">
          {{ $t('convert.ipLookup.copy') }}
        </n-button>
      </n-space>

      <n-divider />

      <template v-if="formData.result">
        <n-descriptions bordered>
          <n-descriptions-item :label="$t('convert.ipLookup.ip')">
            {{ formData.result.ip }}
          </n-descriptions-item>
          <n-descriptions-item :label="$t('convert.ipLookup.country')">
            {{ formData.result.country }}
          </n-descriptions-item>
          <n-descriptions-item :label="$t('convert.ipLookup.region')">
            {{ formData.result.region }}
          </n-descriptions-item>
          <n-descriptions-item :label="$t('convert.ipLookup.city')">
            {{ formData.result.city }}
          </n-descriptions-item>
          <n-descriptions-item :label="$t('convert.ipLookup.isp')">
            {{ formData.result.isp }}
          </n-descriptions-item>
          <n-descriptions-item :label="$t('convert.ipLookup.asn')">
            {{ formData.result.asn }}
          </n-descriptions-item>
        </n-descriptions>

        <n-card :title="$t('convert.ipLookup.location')" class="mt-4">
          <n-list>
            <n-list-item>
              <template #header>
                {{ $t('convert.ipLookup.latitude') }}
              </template>
              {{ formData.result.latitude }}
            </n-list-item>
            <n-list-item>
              <template #header>
                {{ $t('convert.ipLookup.longitude') }}
              </template>
              {{ formData.result.longitude }}
            </n-list-item>
            <n-list-item>
              <template #header>
                {{ $t('convert.ipLookup.timezone') }}
              </template>
              {{ formData.result.timezone }}
            </n-list-item>
          </n-list>
        </n-card>
      </template>
    </n-form>

    <n-alert
      v-if="error"
      type="error"
      :title="error"
      style="margin-top: 16px"
    />
  </n-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import axios from 'axios'

const { t } = useI18n()
const message = useMessage()

const formData = reactive({
  input: '',
  result: null
})

const error = ref('')

async function lookup() {
  error.value = ''
  
  try {
    if (!formData.input) {
      throw new Error(t('convert.ipLookup.inputRequired'))
    }

    // 验证IP地址格式
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
    if (!ipRegex.test(formData.input)) {
      throw new Error(t('convert.ipLookup.invalidIP'))
    }

    // 调用IP查询API
    const response = await axios.get(`https://ipapi.co/${formData.input}/json/`)
    const data = response.data

    formData.result = {
      ip: data.ip,
      country: data.country_name,
      region: data.region,
      city: data.city,
      isp: data.org,
      asn: data.asn,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone
    }
  } catch (err) {
    error.value = err.message || t('convert.ipLookup.lookupFailed')
  }
}

function copyResult() {
  if (formData.result) {
    const text = JSON.stringify(formData.result, null, 2)
    navigator.clipboard.writeText(text)
    message.success(t('convert.ipLookup.copied'))
  }
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