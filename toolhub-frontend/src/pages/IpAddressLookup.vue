<template>
  <div class="ip-address-lookup">
    <n-card :title="t('tools.ipAddressLookup.title')">
      <n-form>
        <n-form-item :label="t('tools.ipAddressLookup.search')">
          <n-input
            v-model:value="ipAddress"
            type="text"
            :placeholder="t('tools.ipAddressLookup.searchPlaceholder')"
            @keyup.enter="searchIp"
          >
            <template #suffix>
              <n-button @click="searchIp" type="primary">
                {{ t('tools.ipAddressLookup.search') }}
              </n-button>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item>
          <n-space>
            <n-button @click="getMyIp" type="info">
              {{ t('tools.ipAddressLookup.getMyIp') }}
            </n-button>
            <n-button @click="clear" type="warning">
              {{ t('common.clear') }}
            </n-button>
          </n-space>
        </n-form-item>

        <template v-if="ipInfo">
          <n-divider>{{ t('tools.ipAddressLookup.basicInfo') }}</n-divider>
          
          <n-descriptions bordered>
            <n-descriptions-item :label="t('tools.ipAddressLookup.ip')">
              {{ ipInfo.ip }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('tools.ipAddressLookup.type')">
              {{ ipInfo.type }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('tools.ipAddressLookup.version')">
              {{ ipInfo.version }}
            </n-descriptions-item>
          </n-descriptions>

          <n-divider>{{ t('tools.ipAddressLookup.location') }}</n-divider>
          
          <n-descriptions bordered>
            <n-descriptions-item :label="t('tools.ipAddressLookup.country')">
              {{ ipInfo.country }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('tools.ipAddressLookup.region')">
              {{ ipInfo.region }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('tools.ipAddressLookup.city')">
              {{ ipInfo.city }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('tools.ipAddressLookup.latitude')">
              {{ ipInfo.latitude }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('tools.ipAddressLookup.longitude')">
              {{ ipInfo.longitude }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('tools.ipAddressLookup.timezone')">
              {{ ipInfo.timezone }}
            </n-descriptions-item>
          </n-descriptions>

          <n-divider>{{ t('tools.ipAddressLookup.network') }}</n-divider>
          
          <n-descriptions bordered>
            <n-descriptions-item :label="t('tools.ipAddressLookup.isp')">
              {{ ipInfo.isp }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('tools.ipAddressLookup.asn')">
              {{ ipInfo.asn }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('tools.ipAddressLookup.organization')">
              {{ ipInfo.organization }}
            </n-descriptions-item>
          </n-descriptions>

          <n-card :title="t('tools.ipAddressLookup.map')" class="mt-4">
            <div class="map-container" ref="mapContainer"></div>
          </n-card>
        </template>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from 'naive-ui';
import axios from 'axios';

const { t } = useI18n();
const message = useMessage();

const ipAddress = ref('');
const ipInfo = ref<any>(null);
const mapContainer = ref<HTMLElement | null>(null);

// 模拟 IP 信息数据
const mockIpInfo = {
  ip: '8.8.8.8',
  type: 'Public',
  version: 'IPv4',
  country: '美国',
  region: '加利福尼亚',
  city: '洛杉矶',
  latitude: 34.0522,
  longitude: -118.2437,
  timezone: 'America/Los_Angeles',
  isp: 'Google LLC',
  asn: 'AS15169',
  organization: 'Google LLC'
};

async function searchIp() {
  if (!ipAddress.value) {
    message.error(t('tools.ipAddressLookup.ipRequired'));
    return;
  }

  // 简单的 IP 地址格式验证
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  if (!ipv4Regex.test(ipAddress.value) && !ipv6Regex.test(ipAddress.value)) {
    message.error(t('tools.ipAddressLookup.invalidIp'));
    return;
  }

  try {
    // 这里应该调用实际的 IP 查询 API
    // const response = await axios.get(`https://api.example.com/ip/${ipAddress.value}`);
    // ipInfo.value = response.data;
    
    // 使用模拟数据
    ipInfo.value = mockIpInfo;
    message.success(t('tools.ipAddressLookup.searchSuccess'));
  } catch (error) {
    message.error(t('tools.ipAddressLookup.searchError'));
  }
}

async function getMyIp() {
  try {
    // 这里应该调用获取本机 IP 的 API
    // const response = await axios.get('https://api.example.com/myip');
    // ipAddress.value = response.data.ip;
    
    // 使用模拟数据
    ipAddress.value = '8.8.8.8';
    await searchIp();
  } catch (error) {
    message.error(t('tools.ipAddressLookup.getMyIpError'));
  }
}

function clear() {
  ipAddress.value = '';
  ipInfo.value = null;
}

onMounted(() => {
  // 这里可以初始化地图组件
  // 例如使用 Leaflet 或 Google Maps
});
</script>

<style scoped>
.ip-address-lookup {
  max-width: 800px;
  margin: 0 auto;
}

.mt-4 {
  margin-top: 16px;
}

.map-container {
  height: 400px;
  width: 100%;
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style> 