# ToolHub 新功能开发方案 V3

## 一、开发约定（所有功能必须遵守）

与 `new_features_plan_v2.md` 中的约定完全一致，无新增修改。

### 文件命名与位置约定

| 类型 | 路径 | 操作 |
|------|------|------|
| 组件文件 | `toolhub/src/components/{category}/{ToolName}.vue` | 新建 |
| 路由 | `toolhub/src/router/index.js` | 在对应分类 `children` 末尾追加 |
| 工具注册 | `toolhub/src/api/tools.js` | 在对应分类注释块末尾追加 |
| i18n 中文 | `toolhub/src/locales/zh.js` | 追加对应 key |
| i18n 英文 | `toolhub/src/locales/en.js` | 追加对应 key（结构与 zh 完全一致） |
| 工具描述 | `toolhub/src/locales/toolDescriptions.js` | 追加新 key（features/useCases/usageSteps/bestPractices） |
| 文档目录 | `toolhub/public/docs/` | 每个工具 6 个 md 文件 |
| About 页 | `toolhub/src/locales/about.js` | 更新对应分类的工具描述 |
| 菜单 | `toolhub/src/components/layout/AppLayout.vue` | 在对应分类 children 末尾追加 |

### 文档文件命名规则（每个新工具必须创建）

```
{toolKey}_background_zh.md    技术背景-中文
{toolKey}_background_en.md    技术背景-英文
{toolKey}_tutorial_zh.md      使用教程-中文
{toolKey}_tutorial_en.md      使用教程-英文
{toolKey}_examples_zh.md      代码示例-中文
{toolKey}_examples_en.md      代码示例-英文
```

### i18n Key 规范

每个新工具在 `zh.js` / `en.js` 中追加到对应分类下，不允许出现重复 key：

```js
// image 分类示例
image: {
  // ... 已有 key 不动 ...
  resize: {
    title: '图片尺寸调整',
    description: '等比/自由缩放图片尺寸，支持批量处理',
    // 其他字段按工具需要定义
  }
}
```

### CSS 主题规范（重要）

所有自定义样式中**禁止**写死背景色和边框颜色，必须使用 CSS 变量：

```css
/* ✅ 正确 */
background-color: var(--card-color);    /* 亮色:#ffffff  暗色:#1e1e1e */
border: 2px dashed var(--border-color); /* 亮色:#e0e0e6  暗色:#3a3a3a */
color: var(--text-color);

/* ❌ 错误 - 不随主题切换 */
background-color: white;
background-color: #fafafa;
border: 2px dashed #d1d5db;
```

### 性能约束

- **重型依赖必须动态导入**：引入新 npm 包且体积 > 50KB，必须使用 `() => import(...)` 懒加载
- **localStorage 记忆**：每个工具的输入内容通过 `localStorage` 持久化，key 格式为 `toolhub_{toolKey}_input`

### TutorialAndDocs 组件

每个工具模板末尾必须引入文档组件：

```vue
<template>
  <div class="xxx-tool">
    <n-card ...>
      <!-- 工具内容 -->
    </n-card>
    <TutorialAndDocs toolKey="xxx" />  <!-- toolKey 与工具注册 id 一致 -->
  </div>
</template>

<script setup>
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
</script>
```

---

## 二、背景说明（V3 新增工具的选型依据）

V2 已交付的能力（已全部实现，**不在本文档范围内**）：

- UUID / NanoID 生成器、随机密码生成器、URL 解析器
- JSON Path 查询、数字大写转换、图片 EXIF 查看
- 二维码扫描（含摄像头）、URL 分享公共组件、全局快捷键、工具收藏

V3 聚焦以下真实缺口（通过对比现有 60+ 工具后确认）：

| 分类 | 已有 | 缺口 |
|------|------|------|
| image | 格式转换（含压缩质量）、旋转、裁剪、水印、EXIF | **尺寸调整（Resize）— 增强 Convert.vue** |
| convert | 颜色选择器 + HEX/RGB/HSL 互转、渐变生成 | **配色方案生成（互补/类似/三角）** |
| convert | 时间戳、日期计算、进制、单位换算、CRON... | **IP/CIDR 子网计算器** |
| convert | JSON格式化、JSONPath、JSON互转 | **JSON Schema 生成器** |
| convert | — | **CSV / TSV 预览解析** |
| other | UUID、密码、HTTP客户端、证书解析... | **Git Commit 规范生成器** |
| other | — | **Mock 数据生成器** |
| text | 大小写、替换、反转、空白处理、Diff | **文本统计分析** |

---

## 三、功能清单（按优先级排序）

---

### P0：图片尺寸调整（增强现有 Convert.vue）

| 字段 | 值 |
|------|-----|
| 改动文件 | `src/components/image/Convert.vue` |
| toolKey | `convert`（复用，无新路由/菜单/工具注册） |

**改动思路**

`Convert.vue` 的核心流程是 `上传 → Canvas 绘制 → toBlob 导出`，Resize 与其完全同构——只需在绘制时传入目标宽高而非原图尺寸。两者合并后，用户在同一工具里完成「格式转换 + 尺寸调整 + 质量压缩」三合一，体验更聚焦，不新增工具数量。

**在全局参数区新增一行「尺寸调整」**

- **缩放模式**单选：`原始尺寸`（默认，不改变尺寸）/ `按像素` / `按百分比`
- 选择「按像素」时：宽度输入框 + 高度输入框 + 🔒锁定宽高比开关（默认开启）
  - 宽/高任一变动时，若锁定则另一方自动按比例计算
  - 原始尺寸来自图片加载后自动读取，输入框显示灰色占位提示 `原图: {W}×{H}`
- 选择「按百分比」时：单个百分比输入框（10%~500%，默认 100%），宽高同比缩放
- 参数区加一行尺寸信息展示：`原图: W×H → 目标: W×H`，实时联动
- 尺寸参数加入 `reconvertAll` 触发链，修改后自动重新处理所有已上传图片
- 下载文件名追加尺寸后缀：`{原文件名}_{W}x{H}.{ext}`（仅在非「原始尺寸」模式下追加）

**涉及改动文件**

| 文件 | 改动内容 |
|------|----------|
| `src/components/image/Convert.vue` | 新增尺寸调整参数 UI + `convertBlob` 接收目标尺寸 |
| `src/locales/zh.js` | `image.convert` 追加尺寸相关 i18n key |
| `src/locales/en.js` | 同上，英文版 |

**无需改动**：路由、菜单、`api/tools.js`、`about.js`、`toolDescriptions.js`、文档目录

**依赖**：无新依赖，使用 Canvas API

---

### P0：Git Commit 规范生成器

| 字段 | 值 |
|------|-----|
| 路径 | `/other/git-commit` |
| 组件文件 | `src/components/other/GitCommit.vue` |
| toolKey | `gitCommit` |
| 分类 | `other` |
| 菜单位置 | other 子菜单末尾 |

**功能设计**

- 遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范
- 表单式输入：
  - **Type**（下拉选择）：feat / fix / docs / style / refactor / perf / test / chore / revert / build / ci
  - **Scope**（可选文本输入）：影响范围，如 `auth`、`ui`、`api`
  - **Subject**（必填）：简短描述，自动限制 72 字符
  - **Body**（可选多行）：详细描述，支持换行
  - **Breaking Change**（开关 + 文本）：是否为破坏性变更
  - **Issues**（可选）：关联 issue，如 `#123, #456`
- 实时预览生成的 commit 信息（`type(scope): subject`格式）
- 每种 Type 带中英文说明 tooltip（悬停提示该类型适合的场景）
- 一键复制完整 commit 信息
- 历史记录（最近 5 条，localStorage 持久化）
- 支持"仅复制第一行（标题行）"快捷按钮

**依赖**：无新依赖，纯前端逻辑

**菜单追加**（`AppLayout.vue` → `other` children 末尾）：

```js
{ label: t('other.gitCommit.title'), key: 'git-commit', path: '/other/git-commit' }
```

---

### P0：文本统计分析

| 字段 | 值 |
|------|-----|
| 路径 | `/text/stats` |
| 组件文件 | `src/components/text/Stats.vue` |
| toolKey | `textStats` |
| 分类 | `text` |
| 菜单位置 | text 子菜单末尾 |

**功能设计**

- 输入区（大文本框，支持粘贴）
- 实时统计面板（卡片网格展示）：
  - 字符数（含/不含空格两个数字）
  - 单词数（按空格/标点分词）
  - 行数 / 段落数
  - 字节大小（UTF-8）
  - 中文字符数 / 英文字符数 / 数字字符数
  - 句子数（按 `.!?。！？` 分句）
  - 预计阅读时长（中文 500字/分钟，英文 200词/分钟）
- 词频统计 Tab：Top 20 高频词，柱状图展示（用 n-progress 模拟，无需图表库）
- 字符分布 Tab：各字符类别占比（中文/英文/数字/标点/空白）
- 支持清空；localStorage 不记忆内容（文本可能很大）

**依赖**：无新依赖，纯字符串处理

**菜单追加**（`AppLayout.vue` → `text` children 末尾）：

```js
{ label: t('text.stats.title'), key: 'text-stats', path: '/text/stats' }
```

---

### P1：CSV / TSV 预览解析

| 字段 | 值 |
|------|-----|
| 路径 | `/convert/csv` |
| 组件文件 | `src/components/convert/CsvViewer.vue` |
| toolKey | `csvViewer` |
| 分类 | `convert` |
| 菜单位置 | convert → 数据格式子菜单末尾 |

**功能设计**

- 输入方式：粘贴文本 / 上传文件（.csv / .tsv，最大 5MB）
- 自动检测分隔符（逗号/Tab/分号/管道符），也可手动指定
- 自动检测首行是否为表头
- 渲染为表格（Naive UI `n-data-table`）：
  - 支持列排序（点击表头）
  - 支持全局搜索（顶部搜索框，实时过滤行）
  - 分页（每页 50/100/200 行可选）
  - 显示总行数/列数/当前显示行数
- 导出功能：
  - **导出为 JSON**（数组对象格式）
  - **下载为 CSV**（重新序列化）
- 大文件友好：超过 10000 行时提示仅展示前 10000 行

**依赖**：无新依赖，手写轻量 CSV 解析器（避免引入 papaparse）

**菜单追加**（`AppLayout.vue` → `convert` → 数据格式分组末尾）：

```js
{ label: t('convert.csvViewer.title'), key: 'csv-viewer', path: '/convert/csv' }
```

---

### P1：配色方案生成器（Color.vue 增强 Tab）

| 字段 | 值 |
|------|-----|
| 改动文件 | `src/components/convert/Color.vue`（新增第三个 Tab） |
| toolKey | `color`（复用） |

**功能设计**（在现有"颜色选择器"和"格式转换"两个 Tab 旁边新增"配色方案" Tab）

- 输入一个主色（颜色选择器 或 直接输入 HEX）
- 自动生成 5 套配色方案：
  - **互补色**（Complementary）：主色 + 对面色
  - **类似色**（Analogous）：主色左右各 ±30° 共 3 色
  - **三角配色**（Triadic）：三等分色环 3 色
  - **四方配色**（Tetradic）：四等分色环 4 色
  - **单色系**（Monochromatic）：同色相 5 个明度梯度
- 每套方案显示色块预览 + HEX 值，点击色块复制 HEX
- 一键导出为：
  - CSS 变量（`--color-primary: #xxx; ...`）
  - Tailwind 配置片段（`colors: { primary: '#xxx', ... }`）
  - JSON 格式

**依赖**：无新依赖，HSL 色相旋转纯数学计算

---

### P1：IP / CIDR 子网计算器

| 字段 | 值 |
|------|-----|
| 路径 | `/convert/cidr` |
| 组件文件 | `src/components/convert/Cidr.vue` |
| toolKey | `cidr` |
| 分类 | `convert` |
| 菜单位置 | convert → 其他子菜单末尾 |

**功能设计**

- 两种输入方式切换：
  - **CIDR 表示法**：输入 `192.168.1.0/24`
  - **IP + 子网掩码**：分两个输入框，如 `192.168.1.0` + `255.255.255.0`
- 实时计算并展示：
  - 网络地址（Network Address）
  - 广播地址（Broadcast Address）
  - 子网掩码（Subnet Mask）/ 通配符掩码（Wildcard Mask）
  - 可用主机数（Usable Hosts）
  - IP 地址范围（First ~ Last）
  - IP 类型（A/B/C/D/E 类 + 私有/公共/回环/链路本地）
  - 二进制表示（各字段展开为二进制位）
- 支持 IPv4（IPv6 不在本期范围）
- 常用子网速查表（/8 ~ /32 对应主机数，点击自动填入）
- localStorage 记忆上次输入

**依赖**：无新依赖，纯位运算

**菜单追加**：

```js
{ label: t('convert.cidr.title'), key: 'cidr', path: '/convert/cidr' }
```

---

### P2：Mock 数据生成器

| 字段 | 值 |
|------|-----|
| 路径 | `/other/mock-data` |
| 组件文件 | `src/components/other/MockData.vue` |
| toolKey | `mockData` |
| 分类 | `other` |
| 菜单位置 | other 子菜单末尾 |

**功能设计**

- 字段定义区（可增删行）：
  - 字段名（文本输入）
  - 字段类型（下拉）：
    - 基础类型：string / number / boolean / null
    - 中文数据：姓名 / 手机号 / 身份证 / 城市 / 地址 / 公司名
    - 通用数据：邮箱 / UUID / 日期 / 时间戳 / 颜色值（HEX）/ URL / IP地址
    - 范围类型：整数范围（min~max）/ 小数范围 / 枚举（自定义选项逗号分隔）
- 生成条数滑块（1~100，默认 10）
- 输出为 JSON 数组（用 CodeEditor 组件展示，只读模式）
- 一键复制 / 下载为 `.json` 文件
- 所有数据纯前端随机生成，无需后端

**依赖**：无新依赖，内置轻量 faker 逻辑（不引入 faker.js，体积太大）

**菜单追加**：

```js
{ label: t('other.mockData.title'), key: 'mock-data', path: '/other/mock-data' }
```

---

### P2：JSON Schema 生成器

| 字段 | 值 |
|------|-----|
| 路径 | `/convert/json-schema` |
| 组件文件 | `src/components/convert/JsonSchema.vue` |
| toolKey | `jsonSchema` |
| 分类 | `convert` |
| 菜单位置 | convert → 数据格式子菜单末尾 |

**功能设计**

- 左侧：JSON 输入（复用 `CodeEditor` 组件）
- 右侧：自动推断生成的 JSON Schema（`draft-07` 格式）
  - 递归分析 JSON 结构，推断每个字段的 type
  - 数组元素类型推断（取所有元素类型的并集）
  - 自动添加 `required` 数组（所有顶层字段默认 required）
  - 生成 `$schema`、`title`、`description` 占位字段
- 支持导出选项：JSON Schema / TypeScript Interface 两种格式
- 一键复制

**依赖**：无新依赖，纯前端递归推断

**菜单追加**：

```js
{ label: t('convert.jsonSchema.title'), key: 'json-schema', path: '/convert/json-schema' }
```

---

## 四、菜单导航更新

更新文件：`src/components/layout/AppLayout.vue` → `menuOptions` computed

> ⚠️ 图片尺寸调整为增强现有 Convert.vue，**无需新增菜单项**。

### text 子菜单末尾追加

```js
{ label: t('text.stats.title'), key: 'text-stats', path: '/text/stats' }
```

### convert → 数据格式分组末尾追加

```js
{ label: t('convert.csvViewer.title'), key: 'csv-viewer',   path: '/convert/csv'         },
{ label: t('convert.jsonSchema.title'), key: 'json-schema', path: '/convert/json-schema'  }
```

### convert → 其他分组末尾追加

```js
{ label: t('convert.cidr.title'), key: 'cidr', path: '/convert/cidr' }
```

### other 子菜单末尾追加

```js
{ label: t('other.gitCommit.title'), key: 'git-commit', path: '/other/git-commit' },
{ label: t('other.mockData.title'),  key: 'mock-data',  path: '/other/mock-data'  }
```

---

## 五、路由追加

更新文件：`src/router/index.js`

> ⚠️ 图片尺寸调整为增强现有 Convert.vue，**无需新增路由**。

### text children 末尾追加

```js
// 文本统计分析
{ path: 'stats', component: () => import('@/components/text/Stats.vue') }
```

### convert children 末尾追加

```js
// CSV / TSV 预览解析
{ path: 'csv',         component: () => import('@/components/convert/CsvViewer.vue')  },
// IP/CIDR 子网计算器
{ path: 'cidr',        component: () => import('@/components/convert/Cidr.vue')       },
// JSON Schema 生成器
{ path: 'json-schema', component: () => import('@/components/convert/JsonSchema.vue') }
```

### other children 末尾追加

```js
// Git Commit 规范生成器
{ path: 'git-commit', component: () => import('@/components/other/GitCommit.vue') },
// Mock 数据生成器
{ path: 'mock-data',  component: () => import('@/components/other/MockData.vue')  }
```

---

## 六、工具注册（api/tools.js）

在对应分类注释块末尾追加：

```js
// ⚠️ 图片尺寸调整为增强现有 Convert.vue，无需新增工具注册

// text 分类末尾追加
{ id: 'textStats', name: 'text.stats.title', path: '/text/stats', description: 'text.stats.description', category: 'text' },

// convert 分类末尾追加
{ id: 'csvViewer',  name: 'convert.csvViewer.title',  path: '/convert/csv',         description: 'convert.csvViewer.description',  category: 'convert' },
{ id: 'cidr',       name: 'convert.cidr.title',       path: '/convert/cidr',        description: 'convert.cidr.description',       category: 'convert' },
{ id: 'jsonSchema', name: 'convert.jsonSchema.title', path: '/convert/json-schema', description: 'convert.jsonSchema.description', category: 'convert' },

// other 分类末尾追加
{ id: 'gitCommit', name: 'other.gitCommit.title', path: '/other/git-commit', description: 'other.gitCommit.description', category: 'other' },
{ id: 'mockData',  name: 'other.mockData.title',  path: '/other/mock-data',  description: 'other.mockData.description',  category: 'other'  },
```

---

## 七、About 页更新

更新文件：`src/locales/about.js`

| 字段路径 | 更新内容 |
|---------|---------|
| `zh-CN.features.image.desc` | 更新：格式转换工具描述补充尺寸调整能力 |
| `en.features.image.desc` | 追加对应英文描述 |
| `zh-CN.features.text.desc` | 追加：文本统计分析 |
| `en.features.text.desc` | 追加对应英文描述 |
| `zh-CN.features.convert.desc` | 追加：CSV/TSV预览、配色方案生成、IP/CIDR计算、JSON Schema生成 |
| `en.features.convert.desc` | 追加对应英文描述 |
| `zh-CN.features.other.desc` | 追加：Git Commit生成器、Mock数据生成器 |
| `en.features.other.desc` | 追加对应英文描述 |

---

## 八、开发顺序

```
第1批（P0，纯前端，无新依赖，优先实现）:
  1. 图片尺寸调整（增强 Convert.vue）→ 改一个文件，Canvas 传入目标尺寸，成本极低
  2. Git Commit 规范生成器           → 纯表单逻辑，开发者日常超高频
  3. 文本统计分析                    → 纯字符串处理，开发成本低，补全 text 分类

第2批（P1，有一定复杂度，但仍纯前端）:
  4. CSV / TSV 预览解析         → 手写轻量解析器 + n-data-table 渲染
  5. Color.vue 配色方案 Tab 增强 → 改现有文件，HSL 数学计算
  6. IP/CIDR 子网计算器         → 位运算，运维/后端常用

第3批（P2，偏复杂或体量较大）:
  7. Mock 数据生成器            → 字段类型多，UI 设计复杂，需要内置 faker 逻辑
  8. JSON Schema 生成器         → 递归推断逻辑有一定复杂度
```

---

## 九、检查清单（每个工具完成后对照验收）

**新工具通用检查项：**
- [ ] 组件文件已创建于正确目录
- [ ] 路由已追加（懒加载 `() => import(...)`）
- [ ] `api/tools.js` 已注册工具条目
- [ ] `zh.js` 已追加完整 i18n key，无重复 key
- [ ] `en.js` 已追加完整 i18n key（与 zh 结构完全一致），无重复 key
- [ ] `toolDescriptions.js` 已追加 toolKey 描述（features / useCases / usageSteps / bestPractices）
- [ ] `public/docs/` 已创建 6 个 md 文档文件
- [ ] `AppLayout.vue` 菜单已追加对应入口
- [ ] `about.js` 已更新功能描述
- [ ] 组件模板末尾已引入 `<TutorialAndDocs :toolKey="'xxx'" />`
- [ ] localStorage 记忆输入内容已实现（key: `toolhub_{toolKey}_input`）
- [ ] 重型依赖（>50KB）使用动态导入，未在组件顶层静态 import
- [ ] 所有自定义背景色/边框色使用 `var(--card-color)` / `var(--border-color)`，不写死颜色值
- [ ] 中英文切换无异常
- [ ] 暗色/亮色主题无异常（重点检查背景色、边框色）
- [ ] 移动端布局无明显破坏

**增强现有工具专属检查项（如 Convert.vue 增强）：**
- [ ] 新增参数与已有参数无冲突，默认值向后兼容（新增「原始尺寸」模式默认，行为与改动前完全一致）
- [ ] `reconvertAll` 触发链包含新参数
- [ ] 新增 i18n key 无重复，结构追加在对应分类末尾

