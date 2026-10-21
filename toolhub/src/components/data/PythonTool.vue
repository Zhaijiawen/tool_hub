<template>
  <div class="python-tool">
    <ToolIntro toolKey="python" />

    <n-card :bordered="false">
      <template #header-extra>
        <WasmTag />
      </template>

      <n-alert type="info" :bordered="true" style="margin-bottom: 12px;">
        <n-space vertical :size="2">
          <n-text depth="3" style="font-size: 12px;">{{ t('data.python.stdlibOnly') }}</n-text>
          <n-text depth="3" style="font-size: 12px;">{{ t('data.python.engineNote') }}</n-text>
        </n-space>
      </n-alert>

      <!-- 示例 -->
      <n-space align="center" :wrap="true" style="margin-bottom: 8px;">
        <n-text depth="3" style="font-size: 12px;">{{ t('data.python.examples') }}</n-text>
        <n-button
          v-for="ex in examples"
          :key="ex.key"
          size="tiny"
          secondary
          @click="loadExample(ex.key)"
        >
          {{ t(`data.python.examplesList.${ex.key}.label`) }}
        </n-button>
      </n-space>

      <!-- 代码编辑器 -->
      <div class="editor-wrap">
        <CodeEditor v-model="code" language="python" :placeholder="t('data.python.placeholder')" />
      </div>

      <n-space align="center" style="margin-top: 10px;" :wrap="true">
        <n-button type="primary" :loading="busy" :disabled="!code.trim() || busy" @click="run">
          {{ busy ? t('data.python.running') : t('data.python.run') }}
        </n-button>
        <n-button :disabled="busy" @click="reset">{{ t('common.clear') }}</n-button>
        <n-text v-if="pythonVersion" depth="3" style="font-size: 12px;">
          Python {{ pythonVersion }}
        </n-text>
      </n-space>

      <!-- 进度 -->
      <div v-if="busy" class="progress-area">
        <n-progress
          type="line"
          :percentage="displayProgress"
          :show-percentage="true"
          :height="8"
          indicator-placement="inside"
          processing
        />
        <n-text depth="3" style="font-size: 12px; margin-top: 6px; display: block;">
          {{ phaseText }} · {{ displayProgress }}%
        </n-text>
      </div>

      <!-- 结果 -->
      <div v-if="result" class="result-area">
        <!-- 错误 -->
        <n-alert v-if="result.error" type="error" :show-icon="true" style="margin-bottom: 10px;">
          <n-text style="font-family: monospace; font-size: 12px;">{{ result.error.type }}: {{ result.error.message }}</n-text>
        </n-alert>

        <!-- 结果值 -->
        <div v-if="result.value" class="output-block">
          <div class="output-header">
            <n-text depth="3" style="font-size: 12px;">{{ t('data.python.resultValue') }}</n-text>
            <n-space align="center">
              <n-text depth="3" style="font-size: 11px;">{{ result.ms }} ms</n-text>
              <n-button size="tiny" quaternary @click="copy(result.value)">{{ t('common.copy') }}</n-button>
            </n-space>
          </div>
          <pre class="output-content">{{ result.value }}</pre>
        </div>

        <!-- stdout -->
        <div v-if="result.stdout.length" class="output-block">
          <div class="output-header">
            <n-text depth="3" style="font-size: 12px;">{{ t('data.python.stdout') }}</n-text>
            <n-button size="tiny" quaternary @click="copy(result.stdout.join(''))">{{ t('common.copy') }}</n-button>
          </div>
          <pre class="output-content stdout">{{ result.stdout.join('') }}</pre>
        </div>

        <!-- stderr -->
        <div v-if="result.stderr.length" class="output-block">
          <div class="output-header">
            <n-text depth="3" style="font-size: 12px;">{{ t('data.python.stderr') }}</n-text>
          </div>
          <pre class="output-content stderr">{{ result.stderr.join('') }}</pre>
        </div>

        <!-- 空输出提示 -->
        <n-text
          v-if="!result.error && !result.value && !result.stdout.length && !result.stderr.length"
          depth="3"
          style="font-size: 12px;"
        >
          {{ t('data.python.noOutput') }}
        </n-text>
      </div>

      <!-- 加载失败 -->
      <n-alert v-if="errorText" type="error" :show-icon="true" closable style="margin-top: 12px;" @close="errorText = ''">
        {{ errorText }}
      </n-alert>
    </n-card>

    <TutorialAndDocs toolKey="python" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import CodeEditor from '@/components/common/CodeEditor.vue'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
import ToolIntro from '@/components/common/ToolIntro.vue'
import WasmTag from '@/components/common/WasmTag.vue'
import { usePyodide } from '@/composables/usePyodide'

const { t } = useI18n()
const message = useMessage()
const pyodide = usePyodide()

const { busy, errorMsg, stage, displayProgress, pythonVersion } = pyodide

const code = ref('')
const result = ref(null)
const errorText = ref('')

const phaseText = computed(() => {
  if (stage.value === 'download') return t('data.python.phaseDownloading')
  if (stage.value === 'load') return t('data.python.phaseLoading')
  return t('data.python.phaseRunning')
})

watch(errorMsg, (v) => {
  if (v) {
    if (String(v).includes('PYODIDE_INIT_TIMEOUT')) {
      errorText.value = t('data.python.errors.initTimeout')
    } else if (String(v).includes('Worker error') || String(v).includes('WORKER')) {
      errorText.value = t('data.python.errors.workerError')
    } else {
      errorText.value = `${t('data.python.failed')}: ${v}`
    }
  }
})

// ---- 示例代码（覆盖标准库的典型能力） ----
const EXAMPLES = {
  stats: `import statistics
import random

data = [random.randint(1, 100) for _ in range(1000)]
print(f"样本数: {len(data)}")
print(f"均值: {statistics.mean(data):.2f}")
print(f"中位数: {statistics.median(data)}")
print(f"标准差: {statistics.stdev(data):.2f}")

# 找出出现频率最高的分位数
buckets = {}
for v in data:
    b = v // 10 * 10
    buckets[b] = buckets.get(b, 0) + 1

top = sorted(buckets.items(), key=lambda kv: kv[1], reverse=True)[:3]
print("最高频区间:", top)
`,
  json: `import json

raw = '''
{"name": "ToolHub", "tags": ["wasm", "python", "local"],
 "stats": {"tools": 9, "users": 0}}
'''

data = json.loads(raw)
print(f"名称: {data['name']}")
print(f"标签: {', '.join(data['tags'])}")
print(f"工具数: {data['stats']['tools']}")

# 美化输出
compact = json.dumps(data, separators=(",", ":"), ensure_ascii=False)
print(f"紧凑 JSON ({len(compact)} 字符):")
print(compact)

# 只取某个键
print("仅 stats:", json.dumps(data["stats"], ensure_ascii=False))
`,
  regex: `import re

text = "订单 A2026-1001 已发货; 订单 B2026-1002 待付款; 联系 138-0013-8000"

# 提取订单号
orders = re.findall(r"[A-Z]\\d{4}-\\d{4}", text)
print(f"订单: {orders}")
print(f"数量: {len(orders)}")

# 提取手机号并脱敏
phones = re.findall(r"1\\d{2}-\\d{4}-\\d{4}", text)
print("手机号:", [p[:3] + "****" + p[-4:] for p in phones])

# 按状态分组
by_status = re.findall(r"(已发货|待付款)", text)
from collections import Counter
for status, n in Counter(by_status).items():
    print(f"  {status}: {n} 单")

# 命名分组
m = re.search(r"订单\\s+(?P<code>[A-Z0-9-]+)\\s+(?P<status>已发货|待付款)", text)
if m:
    print("首个订单:", m.group("code"), "->", m.group("status"))
`,
  datetime: `import datetime
from datetime import timedelta

now = datetime.datetime.now()
print(f"现在: {now.strftime('%Y-%m-%d %H:%M:%S')}")
print(f"今天是今年的第 {now.timetuple().tm_yday} 天")

# 各种日期运算
d1 = datetime.date(2026, 10, 17)
d2 = d1 + timedelta(days=30)
print(f"30 天后: {d2}")
print(f"相差天数: {(d2 - d1).days}")

# 月份最后一天
import calendar
last_day = calendar.monthrange(d1.year, d1.month)[1]
print(f"{d1.year}年{d1.month}月共 {last_day} 天")

# 时间戳互转
ts = now.timestamp()
print(f"时间戳: {ts:.0f}")
print(f"还原: {datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')}")

# 本周起止
week_start = now - timedelta(days=now.weekday())
print(f"本周: {week_start.strftime('%m-%d')} ~ {(week_start + timedelta(days=6)).strftime('%m-%d')}")
`,
  algo: `from collections import defaultdict, deque
import heapq

# 1) 图的 BFS 最短路径
graph = defaultdict(list)
edges = [("A","B"), ("A","C"), ("B","D"), ("C","D"), ("D","E")]
for u, v in edges:
    graph[u].append(v); graph[v].append(u)

def bfs(start, target):
    q = deque([(start, [start])])
    seen = {start}
    while q:
        node, path = q.popleft()
        if node == target:
            return path
        for nxt in graph[node]:
            if nxt not in seen:
                seen.add(nxt)
                q.append((nxt, path + [nxt]))
    return None

print("A→E 最短路径:", " -> ".join(bfs("A", "E")))

# 2) 堆排序（手写，不依赖 sorted）
def heap_sort(arr):
    h = arr[:]
    def sift(i, n):
        while True:
            l, r, big = 2*i+1, 2*i+2, i
            if l < n and h[l] > h[big]: big = l
            if r < n and h[r] > h[big]: big = r
            if big == i: return
            h[i], h[big] = h[big], h[i]
            i = big
    n = len(h)
    for i in range(n//2 - 1, -1, -1): sift(i, n)
    for i in range(n-1, 0, -1):
        h[0], h[i] = h[i], h[0]
        sift(0, i)
    return h

nums = [42, 17, 93, 8, 55, 23, 68, 2]
print("原数组:", nums)
print("堆排序:", heap_sort(nums))

# 3) 前 K 大元素
k = 3
print(f"最大的 {k} 个: {heapq.nlargest(k, nums)}")
`
}

const examples = Object.keys(EXAMPLES).map((key) => ({ key }))

function loadExample(key) {
  code.value = EXAMPLES[key] || ''
  result.value = null
  errorText.value = ''
}

async function run() {
  if (!code.value.trim() || busy.value) return
  errorText.value = ''
  result.value = null
  try {
    result.value = await pyodide.runPython(code.value)
  } catch (err) {
    if (err && err.name === 'AbortError') return
    const msg = String(err && err.message ? err.message : err)
    if (msg.includes('WORKER_NOT_READY')) {
      errorText.value = t('data.python.errors.workerNotReady')
    } else if (msg.includes('WORKER_ERROR')) {
      errorText.value = t('data.python.errors.workerError')
    } else {
      errorText.value = `${t('data.python.failed')}: ${msg}`
    }
  }
}

function reset() {
  code.value = ''
  result.value = null
  errorText.value = ''
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text)
    message.success(t('common.copySuccess'))
  } catch {
    message.error(t('common.copyError'))
  }
}

// 初始给一个示例，避免空白页
loadExample('stats')

onUnmounted(() => {
  pyodide.terminate()
})
</script>

<style scoped>
.python-tool {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* CodeEditor 默认高度对单页工作台过高，压到 240px */
.editor-wrap :deep(.code-editor) {
  height: 240px;
}
.editor-wrap :deep(.cm-content) {
  min-height: 100%;
}

.progress-area {
  margin-top: 12px;
}

.result-area {
  margin-top: 12px;
  border-top: 1px solid var(--n-border-color);
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.output-block {
  border: 1px solid var(--n-border-color);
  border-radius: 6px;
  overflow: hidden;
}
.output-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 10px;
  background: var(--n-color-modal);
}
.output-content {
  margin: 0;
  padding: 10px;
  font-family: 'Fira Code', 'JetBrains Mono', Consolas, monospace;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 280px;
  overflow: auto;
}
.output-content.stdout {
  color: var(--n-text-color);
}
.output-content.stderr {
  color: #d03050;
}
</style>