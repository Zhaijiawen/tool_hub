<template>
  <div class="http-status-explainer">
    <n-card :title="t('tools.httpStatusExplainer.title')">
      <n-form>
        <n-form-item :label="t('tools.httpStatusExplainer.search')">
          <n-input
            v-model:value="searchCode"
            type="text"
            :placeholder="t('tools.httpStatusExplainer.searchPlaceholder')"
            @keyup.enter="searchStatus"
          >
            <template #suffix>
              <n-button @click="searchStatus" type="primary">
                {{ t('tools.httpStatusExplainer.search') }}
              </n-button>
            </template>
          </n-input>
        </n-form-item>

        <n-divider>{{ t('tools.httpStatusExplainer.commonStatus') }}</n-divider>

        <n-grid :cols="3" :x-gap="12" :y-gap="12">
          <n-grid-item v-for="category in categories" :key="category.name">
            <n-card :title="category.name" size="small">
              <n-space vertical>
                <n-button
                  v-for="status in category.statuses"
                  :key="status.code"
                  :type="getStatusType(status.code)"
                  @click="selectStatus(status)"
                  block
                >
                  {{ status.code }} - {{ status.name }}
                </n-button>
              </n-space>
            </n-card>
          </n-grid-item>
        </n-grid>

        <template v-if="selectedStatus">
          <n-divider>{{ t('tools.httpStatusExplainer.details') }}</n-divider>
          
          <n-descriptions bordered>
            <n-descriptions-item :label="t('tools.httpStatusExplainer.code')">
              {{ selectedStatus.code }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('tools.httpStatusExplainer.name')">
              {{ selectedStatus.name }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('tools.httpStatusExplainer.category')">
              {{ selectedStatus.category }}
            </n-descriptions-item>
          </n-descriptions>

          <n-card :title="t('tools.httpStatusExplainer.description')" class="mt-4">
            <p>{{ selectedStatus.description }}</p>
          </n-card>

          <n-card :title="t('tools.httpStatusExplainer.scenarios')" class="mt-4">
            <n-list>
              <n-list-item v-for="(scenario, index) in selectedStatus.scenarios" :key="index">
                {{ scenario }}
              </n-list-item>
            </n-list>
          </n-card>
        </template>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from 'naive-ui';

const { t } = useI18n();
const message = useMessage();

const searchCode = ref('');
const selectedStatus = ref<any>(null);

const categories = [
  {
    name: t('tools.httpStatusExplainer.informational'),
    statuses: [
      { code: 100, name: 'Continue', category: 'Informational', description: '服务器已收到请求的初始部分，请继续发送剩余部分。', scenarios: ['客户端发送大文件时', '分块传输编码时'] },
      { code: 101, name: 'Switching Protocols', category: 'Informational', description: '服务器正在切换协议。', scenarios: ['WebSocket升级时', 'HTTP/2升级时'] },
      { code: 102, name: 'Processing', category: 'Informational', description: '服务器正在处理请求，但尚未完成。', scenarios: ['处理耗时较长的请求时'] },
      { code: 103, name: 'Early Hints', category: 'Informational', description: '服务器正在准备响应，可以先发送一些提示信息。', scenarios: ['预加载资源时'] }
    ]
  },
  {
    name: t('tools.httpStatusExplainer.success'),
    statuses: [
      { code: 200, name: 'OK', category: 'Success', description: '请求成功。', scenarios: ['正常获取资源时', '表单提交成功时'] },
      { code: 201, name: 'Created', category: 'Success', description: '请求成功并创建了新资源。', scenarios: ['创建新资源时', '注册新用户时'] },
      { code: 202, name: 'Accepted', category: 'Success', description: '请求已接受，但尚未处理完成。', scenarios: ['异步处理请求时', '批量操作时'] },
      { code: 204, name: 'No Content', category: 'Success', description: '请求成功，但响应中没有内容。', scenarios: ['删除资源成功时', '更新资源成功时'] }
    ]
  },
  {
    name: t('tools.httpStatusExplainer.redirection'),
    statuses: [
      { code: 301, name: 'Moved Permanently', category: 'Redirection', description: '请求的资源已永久移动到新位置。', scenarios: ['网站改版时', '域名变更时'] },
      { code: 302, name: 'Found', category: 'Redirection', description: '请求的资源临时从不同的URI响应。', scenarios: ['临时重定向时', '登录后跳转时'] },
      { code: 304, name: 'Not Modified', category: 'Redirection', description: '资源未修改，可以使用缓存的版本。', scenarios: ['使用缓存时', '条件请求时'] },
      { code: 307, name: 'Temporary Redirect', category: 'Redirection', description: '请求的资源临时从不同的URI响应，且请求方法不应改变。', scenarios: ['临时重定向时', '负载均衡时'] }
    ]
  },
  {
    name: t('tools.httpStatusExplainer.clientError'),
    statuses: [
      { code: 400, name: 'Bad Request', category: 'Client Error', description: '请求语法错误或无法被服务器理解。', scenarios: ['参数错误时', '请求格式错误时'] },
      { code: 401, name: 'Unauthorized', category: 'Client Error', description: '请求需要用户认证。', scenarios: ['未登录时', 'token过期时'] },
      { code: 403, name: 'Forbidden', category: 'Client Error', description: '服务器理解请求但拒绝执行。', scenarios: ['权限不足时', 'IP被封禁时'] },
      { code: 404, name: 'Not Found', category: 'Client Error', description: '请求的资源不存在。', scenarios: ['访问不存在的页面时', '资源被删除时'] }
    ]
  },
  {
    name: t('tools.httpStatusExplainer.serverError'),
    statuses: [
      { code: 500, name: 'Internal Server Error', category: 'Server Error', description: '服务器内部错误。', scenarios: ['服务器崩溃时', '代码异常时'] },
      { code: 502, name: 'Bad Gateway', category: 'Server Error', description: '网关或代理服务器收到无效响应。', scenarios: ['上游服务器故障时', '网关超时时'] },
      { code: 503, name: 'Service Unavailable', category: 'Server Error', description: '服务器暂时无法处理请求。', scenarios: ['服务器维护时', '过载时'] },
      { code: 504, name: 'Gateway Timeout', category: 'Server Error', description: '网关或代理服务器等待上游服务器响应超时。', scenarios: ['上游服务器响应超时时', '网络延迟时'] }
    ]
  }
];

function getStatusType(code: number): string {
  if (code >= 200 && code < 300) return 'success';
  if (code >= 300 && code < 400) return 'warning';
  if (code >= 400 && code < 500) return 'error';
  if (code >= 500) return 'error';
  return 'info';
}

function searchStatus() {
  const code = parseInt(searchCode.value);
  if (isNaN(code)) {
    message.error(t('tools.httpStatusExplainer.invalidCode'));
    return;
  }

  for (const category of categories) {
    const status = category.statuses.find(s => s.code === code);
    if (status) {
      selectedStatus.value = status;
      return;
    }
  }

  message.error(t('tools.httpStatusExplainer.codeNotFound'));
}

function selectStatus(status: any) {
  selectedStatus.value = status;
  searchCode.value = status.code.toString();
}
</script>

<style scoped>
.http-status-explainer {
  max-width: 800px;
  margin: 0 auto;
}

.mt-4 {
  margin-top: 16px;
}
</style> 