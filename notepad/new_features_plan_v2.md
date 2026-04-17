# ToolHub 新功能开发方案 V2

## 一、开发约定（所有功能必须遵守）

与 `new_features_plan.md` 中的约定完全一致，新增补充如下：

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
// other 分类示例
other: {
  // ... 已有 key 不动 ...
  uuid: {
    title: 'UUID / NanoID 生成器',
    description: '生成 UUID v1/v4/v7 和 NanoID，支持批量生成、自定义长度',
    // 其他字段按工具需要定义
  }
}
```

### CSS 主题规范（重要）

所有自定义样式中**禁止**写死背景色和边框颜色，必须使用 CSS 变量：

```css
/* ✅ 正确 */
background-color: var(--card-color);   /* 亮色:#ffffff  暗色:#1e1e1e */
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

## 二、功能清单（按优先级排序）

---

### P0：UUID / NanoID 生成器

| 字段 | 值 |
|------|-----|
| 路径 | `/other/uuid` |
| 组件文件 | `src/components/other/UuidGenerator.vue` |
| toolKey | `uuid` |
| 分类 | `other` |
| 菜单位置 | other 子菜单末尾 |

**功能设计**

- 类型切换：UUID v1 / UUID v4 / UUID v7 / NanoID
- 批量生成（1~100条），结果列表展示
- UUID 格式选项：标准带连字符 / 纯十六进制（无连字符）/ 大写
- NanoID 自定义长度（默认21）和自定义字母表
- 一键全部复制 / 逐条复制
- 每次操作生成结果的历史记录（最近3次）

**依赖**

- UUID: 动态导入 `uuid`（约 8KB），`import { v1, v4, v7 } from 'uuid'`
- NanoID: 动态导入 `nanoid`（约 2KB），`import { nanoid, customAlphabet } from 'nanoid'`

**菜单追加**（`AppLayout.vue` → `other` children 末尾）：

```js
{ label: t('other.uuid.title'), key: 'uuid', path: '/other/uuid' }
```

---

### P0：随机密码生成器

| 字段 | 值 |
|------|-----|
| 路径 | `/other/password` |
| 组件文件 | `src/components/other/PasswordGenerator.vue` |
| toolKey | `password` |
| 分类 | `other` |
| 菜单位置 | other 子菜单末尾 |

**功能设计**

- 密码长度滑块（4~128，默认16）
- 字符集复选框：大写字母 / 小写字母 / 数字 / 特殊符号（可自定义特殊符号集）
- 排除易混淆字符选项（0/O/l/1/I）
- 密码强度评级（弱/中/强/极强），彩色进度条显示
- 批量生成（最多20条）
- 一键复制 / 全部复制
- 历史记录（最近5次）

**依赖**：无新依赖，使用 `crypto.getRandomValues()` 原生 API 确保随机性

**菜单追加**：

```js
{ label: t('other.password.title'), key: 'password', path: '/other/password' }
```

---

### P0：URL 解析器

| 字段 | 值 |
|------|-----|
| 路径 | `/convert/url-parser` |
| 组件文件 | `src/components/convert/UrlParser.vue` |
| toolKey | `urlParser` |
| 分类 | `convert` |
| 菜单位置 | convert → other 子菜单末尾 |

**功能设计**

- 输入框粘贴完整 URL，自动解析并以表格展示各部分：
  - Protocol、Host、Port、Pathname、Hash
  - Query Parameters：键值对表格，可单独复制每个参数值
- 反向构建区：填写各字段 → 自动拼装 URL
- URL 编码/解码切换显示
- 支持检测 URL 是否合法（颜色提示）

**依赖**：无新依赖，使用原生 `URL` API

**菜单追加**（`AppLayout.vue` → `convert → other` children 末尾）：

```js
{ label: t('convert.urlParser.title'), key: 'url-parser', path: '/convert/url-parser' }
```

---

### P1：JSON Path 查询

| 字段 | 值 |
|------|-----|
| 路径 | `/convert/json-path` |
| 组件文件 | `src/components/convert/JsonPath.vue` |
| toolKey | `jsonPath` |
| 分类 | `convert` |
| 菜单位置 | convert → other 子菜单末尾 |

**功能设计**

- 左侧：JSON 输入（复用 `CodeEditor` 组件，语言设为 `json`）
- 右侧上方：JSONPath 表达式输入框（如 `$.store.book[*].author`）
- 右侧下方：命中结果，高亮显示 JSON 片段
- 结果统计：命中 N 个节点
- 支持常用 JSONPath 语法提示（悬停 tooltip）
- 复制结果按钮

**依赖**：动态导入 `jsonpath-plus`（约 60KB，**必须动态导入**）

**菜单追加**：

```js
{ label: t('convert.jsonPath.title'), key: 'json-path', path: '/convert/json-path' }
```

---

### P1：数字大写转换

| 字段 | 值 |
|------|-----|
| 路径 | `/convert/number-cn` |
| 组件文件 | `src/components/convert/NumberCn.vue` |
| toolKey | `numberCn` |
| 分类 | `convert` |
| 菜单位置 | convert → other 子菜单末尾 |

**功能设计**

- 输入数字（支持小数、负数，最大支持到京/兆级别）
- 实时显示：
  - 中文大写：`壹仟贰佰叁拾肆元伍角陆分`
  - 中文小写：`一千二百三十四元五角六分`
  - 金融写法（支票专用）：带单位行
- 反向解析：输入中文数字 → 转为阿拉伯数字
- 支持人民币 / 美元 / 港币 货币格式切换

**依赖**：无新依赖，纯前端手写实现

**菜单追加**：

```js
{ label: t('convert.numberCn.title'), key: 'number-cn', path: '/convert/number-cn' }
```

---

### P1：二维码扫描（现有 QRCode 工具增强）

| 字段 | 值 |
|------|-----|
| 改动文件 | `src/components/other/QRCode.vue`（在现有组件内新增 Tab） |
| toolKey | `qrcode`（复用） |

**功能设计**（在现有生成 Tab 旁边新增"扫描/读取" Tab）

- 上传图片或粘贴图片 → 解析二维码内容
- 支持摄像头实时扫描（需用户授权）
- 识别结果显示：文字内容 + 类型判断（URL/文本/联系人等）
- 如果是 URL，显示可点击链接

**依赖**：动态导入 `jsQR`（约 60KB，**必须动态导入**）

---

### P1：图片 EXIF 查看

| 字段 | 值 |
|------|-----|
| 路径 | `/image/exif` |
| 组件文件 | `src/components/image/Exif.vue` |
| toolKey | `exif` |
| 分类 | `image` |
| 菜单位置 | image 子菜单末尾 |

**功能设计**

- 上传/拖拽图片
- 展示 EXIF 元数据：
  - 基础信息：文件名、大小、尺寸、格式
  - 拍摄参数：相机品牌型号、光圈、快门、ISO、焦距
  - 时间：拍摄时间、修改时间
  - GPS 信息：经纬度 + 地图链接（Google Maps / 高德）
  - 版权：作者、软件、版权信息
- 支持删除 EXIF 信息后下载（保护隐私）

**依赖**：动态导入 `exifr`（约 35KB，**动态导入**）

**菜单追加**：

```js
{ label: t('image.exif.title'), key: 'image-exif', path: '/image/exif' }
```

---

### P2：URL 分享公共组件

| 字段 | 值 |
|------|-----|
| 组件文件 | `src/components/common/ShareButton.vue` |
| 类型 | 公共组件，按需引入 |

**功能设计**

- 点击后将当前输入内容 LZ-String 压缩 + Base64 编码写入 URL hash：`#state=<encoded>`
- 页面加载时检测 hash 并自动填充输入框
- 复制分享链接按钮（使用 `navigator.clipboard`）
- 支持显示/隐藏状态（展开收起）

**接入方式**（在各工具组件中按需引入）：

```vue
<ShareButton :data="{ input: textInput, mode: mode }" @restore="onRestoreState" />
```

**优先集成到**：Diff、JsonPath、Cron（这几个工具最适合分享）

**依赖**：动态导入 `lz-string`（约 8KB，压缩数据用）

---

### P2：全局快捷键

| 字段 | 值 |
|------|-----|
| 改动文件 | `src/components/layout/AppLayout.vue`（新增快捷键监听） |
| 类型 | 体验增强，无新路由 |

**功能设计**

- `⌘K` / `Ctrl+K`：聚焦打开顶部搜索框（现有搜索框复用）
- `Escape`：清空搜索 / 关闭搜索
- 在工具页内 `⌘Enter` / `Ctrl+Enter`：触发主要操作按钮（格式化/加密/转换）

**实现方式**：在 `AppLayout.vue` 的 `onMounted` 中添加 `document.addEventListener('keydown', ...)` 监听，`onBeforeUnmount` 中移除

**依赖**：无新依赖

---

### P2：工具收藏/固定

| 字段 | 值 |
|------|-----|
| 改动文件 | `src/components/layout/AppLayout.vue`（侧边栏顶部新增收藏区） |
| 类型 | 体验增强，无新路由 |

**功能设计**

- 侧边栏顶部新增"我的收藏"分组（折叠/展开）
- 每个菜单项悬浮时显示 ⭐ 图标，点击可收藏/取消收藏
- 收藏状态存入 `localStorage`，key 为 `toolhub_favorites`
- 最多收藏 10 个工具

**依赖**：无新依赖

---

## 三、菜单导航更新

更新文件：`src/components/layout/AppLayout.vue` → `menuOptions` computed

### convert → other 子菜单追加

```js
{ label: t('convert.urlParser.title'),  key: 'url-parser',  path: '/convert/url-parser' },
{ label: t('convert.jsonPath.title'),   key: 'json-path',   path: '/convert/json-path' },
{ label: t('convert.numberCn.title'),   key: 'number-cn',   path: '/convert/number-cn' },
```

### image 子菜单追加

```js
{ label: t('image.exif.title'), key: 'image-exif', path: '/image/exif' },
```

### other 子菜单追加

```js
{ label: t('other.uuid.title'),     key: 'uuid',     path: '/other/uuid' },
{ label: t('other.password.title'), key: 'password', path: '/other/password' },
```

---

## 四、路由追加

更新文件：`src/router/index.js`

### convert children 末尾追加

```js
{ path: 'url-parser', component: () => import('@/components/convert/UrlParser.vue') },
{ path: 'json-path',  component: () => import('@/components/convert/JsonPath.vue') },
{ path: 'number-cn',  component: () => import('@/components/convert/NumberCn.vue') },
```

### image children 末尾追加

```js
{ path: 'exif', component: () => import('@/components/image/Exif.vue') },
```

### other children 末尾追加

```js
{ path: 'uuid',     component: () => import('@/components/other/UuidGenerator.vue') },
{ path: 'password', component: () => import('@/components/other/PasswordGenerator.vue') },
```

---

## 五、工具注册（api/tools.js）

在对应分类注释块末尾追加：

```js
// convert 分类末尾追加
{ id: 'urlParser',  name: 'convert.urlParser.title',  path: '/convert/url-parser', description: 'convert.urlParser.description',  category: 'convert' },
{ id: 'jsonPath',   name: 'convert.jsonPath.title',   path: '/convert/json-path',  description: 'convert.jsonPath.description',   category: 'convert' },
{ id: 'numberCn',  name: 'convert.numberCn.title',   path: '/convert/number-cn',  description: 'convert.numberCn.description',   category: 'convert' },

// image 分类末尾追加
{ id: 'exif', name: 'image.exif.title', path: '/image/exif', description: 'image.exif.description', category: 'image' },

// other 分类末尾追加
{ id: 'uuid',     name: 'other.uuid.title',     path: '/other/uuid',     description: 'other.uuid.description',     category: 'other' },
{ id: 'password', name: 'other.password.title', path: '/other/password', description: 'other.password.description', category: 'other' },
```

---

## 六、About 页更新

更新文件：`src/locales/about.js`

| 字段路径 | 更新内容 |
|---------|---------|
| `zh-CN.features.convert.desc` | 追加：URL解析器、JSON Path查询、数字大写转换 |
| `en.features.convert.desc` | 追加对应英文描述 |
| `zh-CN.features.image.desc` | 追加：EXIF元数据查看 |
| `en.features.image.desc` | 追加对应英文描述 |
| `zh-CN.features.other.desc` | 追加：UUID/NanoID生成、随机密码生成 |
| `en.features.other.desc` | 追加对应英文描述 |

---

## 七、开发顺序

```
第1批（P0，纯前端，无或极小依赖）:
  UUID / NanoID 生成器
  随机密码生成器
  URL 解析器
  → 三个工具都是零/极小依赖，纯前端，半天内可完成

第2批（P1，需引入动态依赖）:
  JSON Path 查询
  数字大写转换
  图片 EXIF 查看
  → 注意动态导入，EXIF 工具需处理大文件性能

第3批（P1，现有工具增强）:
  二维码扫描（增强 QRCode.vue）
  → 摄像头 API 需要 HTTPS 环境才能调用

第4批（P2，体验提升，改现有文件）:
  URL 分享公共组件
  全局快捷键
  工具收藏/固定
  → 改动 AppLayout.vue 需注意不影响现有菜单逻辑
```

---

## 八、检查清单（每个工具完成后对照验收）

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

