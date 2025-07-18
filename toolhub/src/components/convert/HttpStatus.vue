<template>
  <div class="http-status">

    <n-card :title="t('convert.httpStatus.title')" :bordered="false">
      <n-space vertical size="large">
        <!-- 使用说明 -->
        <div class="info-section">
          <n-alert type="info" :title="t('convert.httpStatus.infoTitle')" class="info-alert">
            {{ t('convert.httpStatus.infoContent') }}
          </n-alert>
        </div>

        <!-- HTTP状态码展示 -->
        <div class="status-codes-section">
          <!-- 1xx 信息响应 -->
          <div class="category-section">
            <n-text class="category-title">{{ t('convert.httpStatus.categories.informational') }}</n-text>
            <div class="status-grid">
              <n-card 
                v-for="code in getStatusCodesByCategory('informational')" 
                :key="code"
                class="status-card"
                :class="`status-${code}`"
              >
                <div class="status-header">
                  <n-text class="status-code">{{ code }}</n-text>
                  <n-text class="status-name">{{ t(`convert.httpStatus.codes.${code}.name`) }}</n-text>
                </div>
                <n-text class="status-description">{{ t(`convert.httpStatus.codes.${code}.description`) }}</n-text>
              </n-card>
            </div>
          </div>

          <!-- 2xx 成功响应 -->
          <div class="category-section">
            <n-text class="category-title">{{ t('convert.httpStatus.categories.success') }}</n-text>
            <div class="status-grid">
              <n-card 
                v-for="code in getStatusCodesByCategory('success')" 
                :key="code"
                class="status-card"
                :class="`status-${code}`"
              >
                <div class="status-header">
                  <n-text class="status-code">{{ code }}</n-text>
                  <n-text class="status-name">{{ t(`convert.httpStatus.codes.${code}.name`) }}</n-text>
                </div>
                <n-text class="status-description">{{ t(`convert.httpStatus.codes.${code}.description`) }}</n-text>
              </n-card>
            </div>
          </div>

          <!-- 3xx 重定向 -->
          <div class="category-section">
            <n-text class="category-title">{{ t('convert.httpStatus.categories.redirect') }}</n-text>
            <div class="status-grid">
              <n-card 
                v-for="code in getStatusCodesByCategory('redirect')" 
                :key="code"
                class="status-card"
                :class="`status-${code}`"
              >
                <div class="status-header">
                  <n-text class="status-code">{{ code }}</n-text>
                  <n-text class="status-name">{{ t(`convert.httpStatus.codes.${code}.name`) }}</n-text>
                </div>
                <n-text class="status-description">{{ t(`convert.httpStatus.codes.${code}.description`) }}</n-text>
              </n-card>
            </div>
          </div>

          <!-- 4xx 客户端错误 -->
          <div class="category-section">
            <n-text class="category-title">{{ t('convert.httpStatus.categories.clientError') }}</n-text>
            <div class="status-grid">
              <n-card 
                v-for="code in getStatusCodesByCategory('clientError')" 
                :key="code"
                class="status-card"
                :class="`status-${code}`"
              >
                <div class="status-header">
                  <n-text class="status-code">{{ code }}</n-text>
                  <n-text class="status-name">{{ t(`convert.httpStatus.codes.${code}.name`) }}</n-text>
                </div>
                <n-text class="status-description">{{ t(`convert.httpStatus.codes.${code}.description`) }}</n-text>
              </n-card>
            </div>
          </div>

          <!-- 5xx 服务器错误 -->
          <div class="category-section">
            <n-text class="category-title">{{ t('convert.httpStatus.categories.serverError') }}</n-text>
            <div class="status-grid">
              <n-card 
                v-for="code in getStatusCodesByCategory('serverError')" 
                :key="code"
                class="status-card"
                :class="`status-${code}`"
              >
                <div class="status-header">
                  <n-text class="status-code">{{ code }}</n-text>
                  <n-text class="status-name">{{ t(`convert.httpStatus.codes.${code}.name`) }}</n-text>
                </div>
                <n-text class="status-description">{{ t(`convert.httpStatus.codes.${code}.description`) }}</n-text>
              </n-card>
            </div>
          </div>
        </div>
      </n-space>
    </n-card>
        <!-- 工具描述组件 -->
        <ToolDescription tool-key="httpStatus" />
    
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ToolDescription from '@/components/common/ToolDescription.vue'

const { t } = useI18n()

// HTTP状态码数据
const statusCodes = {
  // 1xx 信息响应
  '100': { code: '100', category: 'informational' },
  '101': { code: '101', category: 'informational' },
  '102': { code: '102', category: 'informational' },

  // 2xx 成功响应
  '200': { code: '200', category: 'success' },
  '201': { code: '201', category: 'success' },
  '204': { code: '204', category: 'success' },

  // 3xx 重定向
  '301': { code: '301', category: 'redirect' },
  '302': { code: '302', category: 'redirect' },
  '304': { code: '304', category: 'redirect' },

  // 4xx 客户端错误
  '400': { code: '400', category: 'clientError' },
  '401': { code: '401', category: 'clientError' },
  '403': { code: '403', category: 'clientError' },
  '404': { code: '404', category: 'clientError' },
  '429': { code: '429', category: 'clientError' },

  // 5xx 服务器错误
  '500': { code: '500', category: 'serverError' },
  '502': { code: '502', category: 'serverError' },
  '503': { code: '503', category: 'serverError' },
  '504': { code: '504', category: 'serverError' }
}

// 根据分类获取状态码
const getStatusCodesByCategory = (category) => {
  return Object.values(statusCodes)
    .filter(item => item.category === category)
    .map(item => item.code)
    .sort()
}
</script>

<style scoped>
.http-status {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.info-section {
  margin-bottom: 20px;
}

.info-alert {
  margin-top: 8px;
}

.category-section {
  margin-bottom: 32px;
}

.category-title {
  display: block;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #24292e;
  border-bottom: 2px solid #e1e4e8;
  padding-bottom: 8px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.status-card {
  transition: all 0.3s ease;
  border: 1px solid #e1e4e8;
}

.status-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.status-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.status-code {
  font-size: 24px;
  font-weight: 700;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}

.status-name {
  font-size: 16px;
  font-weight: 500;
  color: #586069;
}

.status-description {
  display: block;
  line-height: 1.6;
  color: #24292e;
  margin-bottom: 16px;
}

/* 状态码颜色主题 */
.status-100, .status-101, .status-102 {
  border-left: 4px solid #0366d6;
}

.status-200, .status-201, .status-204 {
  border-left: 4px solid #28a745;
}

.status-301, .status-302, .status-304 {
  border-left: 4px solid #ffc107;
}

.status-400, .status-401, .status-403, .status-404, .status-429 {
  border-left: 4px solid #dc3545;
}

.status-500, .status-502, .status-503, .status-504 {
  border-left: 4px solid #6f42c1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .status-grid {
    grid-template-columns: 1fr;
  }
  
  .http-status {
    padding: 0 16px;
  }
}
</style>