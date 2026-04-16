# ToolHub 新功能开发方案

## 一、开发约定（所有功能必须遵守）

### 文件命名与位置约定

| 类型 | 路径 | 操作 |
|------|------|------|
| 组件文件 | `toolhub/src/components/{category}/{ToolName}.vue` | 新建 |
| 路由 | `toolhub/src/router/index.js` | 追加，不替换 |
| 工具注册 | `toolhub/src/api/tools.js` | 追加 tools 数组 |
| i18n 中文 | `toolhub/src/locales/zh.js` | 追加对应 key |
| i18n 英文 | `toolhub/src/locales/en.js` | 追加对应 key |
| 工具描述 | `toolhub/src/locales/toolDescriptions.js` | 追加新 key |
| 文档目录 | `toolhub/public/docs/` | 每个工具 6 个 md 文件 |
| About 页 | `toolhub/src/locales/about.js` | 更新工具数量描述 |

### 文档文件命名规则（每个新工具必须创建）

每个工具需创建以下 6 个文件，`{toolKey}` 与 `TutorialAndDocs.vue` 接收的 `toolKey` prop 及 `toolDescriptions.js` 中的 key 保持一致：

```
{toolKey}_background_zh.md    技术背景-中文
{toolKey}_background_en.md    技术背景-英文
{toolKey}_tutorial_zh.md      使用教程-中文
{toolKey}_tutorial_en.md      使用教程-英文
{toolKey}_examples_zh.md      代码示例-中文
{toolKey}_examples_en.md      代码示例-英文
```

### i18n Key 规范

每个新工具在 `zh.js` / `en.js` 中追加到对应分类下，结构如下：

```js
// convert 分类示例
convert: {
  // ... 已有 key 不动 ...
  newToolName: {
    title: '工具标题',
    description: '工具描述（搜索用）',
    placeholder: '...',
    // 其他字段按工具需要定义
  }
}
```

### 路由追加规则

在 `router/index.js` 对应分类的 `children` 数组末尾追加，不修改已有路由：

```js
{ path: 'new-tool', component: () => import('@/components/convert/NewTool.vue') }
```

### 搜索注册规则

在 `api/tools.js` 的 `tools` 数组末尾对应分类注释块后追加：

```js
{
  id: 'newTool',
  name: 'convert.newToolName.title',              // i18n key
  path: '/convert/new-tool',
  description: 'convert.newToolName.description', // i18n key
  category: 'convert'
}
```

### 性能约束

- **重型依赖必须动态导入**：引入新 npm 包且体积 > 50KB，必须使用 `() => import(...)` 懒加载，不得在组件顶层静态 `import`
- **localStorage 记忆**：每个工具的输入内容通过 `localStorage` 持久化，key 格式为 `toolhub_{toolKey}_input`

---

## 二、功能清单（按优先级排序）

---

### P0：Diff 文本对比工具

| 字段 | 值 |
|------|-----|
| 路径 | `/convert/diff` |
| 组件文件 | `src/components/convert/Diff.vue` |
| toolKey | `diff` |
| 分类 | `convert` |
| 菜单位置 | convert → other 子菜单末尾 |

**功能设计**

- 左右两栏输入框（复用 `CodeEditor` 组件）
- 支持模式切换：字符级 diff / 行级 diff
- diff 结果内嵌显示：绿色背景=新增，红色背景=删除，黄色=修改行
- 顶部统计：`+N 行新增 / -N 行删除`
- 按钮：对比、清空、互换左右、复制左/右

**依赖**：`diff` 库，体积约 15KB，**可以静态 import**（小库）。若未安装执行 `npm install diff`。

**菜单追加**（`AppLayout.vue` → `convert → other` 子菜单末尾）：

```js
{ label: t('convert.diff.title'), key: 'diff', path: '/convert/diff' }
```

---

### P0：Cron 表达式解析工具

| 字段 | 值 |
|------|-----|
| 路径 | `/convert/cron` |
| 组件文件 | `src/components/convert/Cron.vue` |
| toolKey | `cron` |
| 分类 | `convert` |
| 菜单位置 | convert → other 子菜单末尾 |

**功能设计**

- 输入框支持 5 位标准 cron 和 6 位含秒的 Quartz 格式
- 实时解析展示"人话描述"（如 `0 3 * * *` → "每天凌晨 3:00"）
- 展示下 5 次执行时间列表
- 反向生成区：选择分钟/小时/星期等 → 自动生成 cron 表达式
- 错误提示（表达式不合法时）

**依赖**（均**动态导入**，在解析函数中 `await import(...)`）：
- `cronstrue`：人话描述，约 30KB
- `cron-parser`：计算下次执行，约 40KB

---

### P0：JSON ↔ 其他格式互转

| 字段 | 值 |
|------|-----|
| 路径 | `/convert/json-convert` |
| 组件文件 | `src/components/convert/JsonConvert.vue` |
| toolKey | `jsonConvert` |
| 分类 | `convert` |
| 菜单位置 | convert → other 子菜单末尾 |

**功能设计**

- 左侧：输入框 + 格式选择（JSON / YAML / CSV / TOML / XML）
- 右侧：输出框 + 格式选择（与左侧不同即可转换）
- 按钮：转换、互换、复制输出、下载

**各格式处理方式**

| 格式 | 实现方式 | 依赖 |
|------|---------|------|
| JSON ↔ YAML | `js-yaml` | 检查是否已引入，否则动态导入 |
| JSON ↔ CSV | 前端手写实现（处理一维/对象数组） | 无 |
| JSON ↔ TOML | 动态导入 `@iarna/toml` | 约 30KB，动态导入 |
| JSON ↔ XML | `fast-xml-parser` 或动态导入 | 视现有依赖决定 |

---

### P1：IP 查询工具

| 字段 | 值 |
|------|-----|
| 路径 | `/other/ip` |
| 组件文件 | `src/components/other/IpQuery.vue` |
| toolKey | `ip` |
| 分类 | `other` |
| 菜单位置 | other 子菜单末尾 |

**功能设计**

- 自动检测并显示用户当前 IP
- 输入框：查询任意 IP（支持 IPv4 / IPv6）
- 展示信息：IP 地址、国家/地区、城市、ISP/运营商、经纬度（地图链接）、时区

**外部 API**（前端直调，无需后端）

```
当前 IP：  GET https://ipapi.co/json/
指定 IP：  GET https://ipapi.co/{ip}/json/       （免费，每天 1000 次）
备用接口： GET https://ip-api.com/json/{ip}?lang=zh-CN  （免费，仅 HTTP）
```

注意：请求加 `try/catch` + 超时处理，接口失败时给友好提示。**无新依赖**，纯 `fetch` 调用。

---

### P1：文件哈希校验

| 字段 | 值 |
|------|-----|
| 路径 | `/other/file-hash` |
| 组件文件 | `src/components/other/FileHash.vue` |
| toolKey | `fileHash` |
| 分类 | `other` |
| 菜单位置 | other 子菜单末尾 |

**功能设计**

- 拖拽/选择文件上传（复用 `NUpload` / `NUploadDragger` 组件）
- 同时计算：MD5、SHA-1、SHA-256、SHA-512
- SHA 系列使用 `Web Crypto API`（`crypto.subtle.digest`），**纯浏览器原生，无依赖**
- MD5 动态导入 `spark-md5`（约 20KB）
- 大文件分片读取并显示进度条
- 支持输入预期哈希值进行校验比对（绿色 ✓ / 红色 ✗）
- 文件大小建议限制提示（< 500MB）

---

### P1：图片压缩

| 字段 | 值 |
|------|-----|
| 路径 | `/image/compress` |
| 组件文件 | `src/components/image/Compress.vue` |
| toolKey | `compress` |
| 分类 | `image` |
| 菜单位置 | image 子菜单末尾 |

**功能设计**

- 拖拽/选择图片（支持 JPG / PNG / WebP）
- 质量滑块（10%~100%）
- 对比显示：原始大小 vs 压缩后大小 + 压缩率
- 下载按钮
- 批量模式：可上传多张（最多 10 张）

**依赖**：`browser-image-compression`，约 25KB，**动态导入**。

---

### P2：DNS 查询

| 字段 | 值 |
|------|-----|
| 路径 | `/other/dns` |
| 组件文件 | `src/components/other/DnsQuery.vue` |
| toolKey | `dns` |
| 分类 | `other` |
| 菜单位置 | other 子菜单末尾 |

**功能设计**

- 输入域名
- 查询类型选择：A / AAAA / MX / TXT / CNAME / NS / SOA
- 结果表格展示（名称、类型、TTL、值）

**外部 API**（前端直调，无需后端，使用 Cloudflare DoH）

```
GET https://cloudflare-dns.com/dns-query?name={domain}&type={type}
Headers: Accept: application/dns-json
```

**无新依赖**，纯 `fetch` 调用。

---

### P2：渐变色生成器

| 字段 | 值 |
|------|-----|
| 路径 | `/convert/gradient` |
| 组件文件 | `src/components/convert/Gradient.vue` |
| toolKey | `gradient` |
| 分类 | `convert` |
| 菜单位置 | convert → other 子菜单末尾 |

**功能设计**

- 可视化颜色拾取（复用已有 `NColorPicker` 组件）
- 支持 2~5 个色点
- 渐变方向选择（0°~360° 旋转或预设方向）
- 类型：线性 / 径向 / 锥形
- 实时预览大色块
- 输出 CSS 代码（`background: linear-gradient(...)`）一键复制

**无新依赖**，纯 CSS + 已有 `NColorPicker`。

---

### P2：URL 分享状态（通用公共组件）

无需新增工具页面，为现有工具增加分享能力。

**实现文件**：`src/components/common/ShareButton.vue`

**功能设计**

- 点击后将当前输入内容 Base64 编码写入 URL hash：`#/data=<base64>`
- 页面加载时检测 hash 并自动填充输入框
- 点击复制分享链接（使用 `navigator.clipboard`）

**集成方式**：在各工具组件中按需引入，不强制所有工具都接入。

---

## 三、菜单导航更新

更新文件：`src/components/layout/AppLayout.vue` → `menuOptions` computed

### convert → other 子菜单追加

```js
{ label: t('convert.diff.title'),         key: 'diff',         path: '/convert/diff' },
{ label: t('convert.cron.title'),          key: 'cron',         path: '/convert/cron' },
{ label: t('convert.jsonConvert.title'),  key: 'json-convert', path: '/convert/json-convert' },
{ label: t('convert.gradient.title'),     key: 'gradient',     path: '/convert/gradient' },
```

### other 子菜单追加

```js
{ label: t('other.ip.title'),       key: 'ip',        path: '/other/ip' },
{ label: t('other.fileHash.title'), key: 'file-hash', path: '/other/file-hash' },
{ label: t('other.dns.title'),      key: 'dns',       path: '/other/dns' },
```

### image 子菜单追加

```js
{ label: t('image.compress.title'), key: 'image-compress', path: '/image/compress' },
```

---

## 四、About 页更新

更新文件：`src/locales/about.js`

| 字段路径 | 更新内容 |
|---------|---------|
| `zh-CN.features.convert.desc` | 追加：Diff对比、Cron解析、JSON互转、渐变色生成器 |
| `en.features.convert.desc` | 追加对应英文描述 |
| `zh-CN.features.image.desc` | 追加：图片压缩 |
| `en.features.image.desc` | 追加对应英文描述 |
| `zh-CN.features.other` | 新增/追加描述：IP查询、DNS查询、文件哈希校验 |
| `en.features.other` | 追加对应英文描述 |
| 工具数量统计字段（如有） | 更新数字 |

---

## 五、开发顺序

```
第1批（优先）: Diff + Cron + IP查询
  → 高搜索量，开发简单，纯前端，无或小依赖

第2批（次周）: JSON互转 + 文件哈希
  → 中等复杂度，注意 TOML/XML 动态导入

第3批（两周）: 图片压缩 + DNS查询
  → 依赖动态加载需细心处理进度和错误

第4批（月内）: 渐变色生成器 + URL分享公共组件
  → 提升留存和分享传播
```

---

## 六、检查清单（每个工具完成后对照验收）

- [ ] 组件文件已创建于正确目录
- [ ] 路由已追加（懒加载 `() => import(...)`）
- [ ] `api/tools.js` 已注册工具条目
- [ ] `zh.js` 已追加完整 i18n key
- [ ] `en.js` 已追加完整 i18n key（与 zh 结构一致）
- [ ] `toolDescriptions.js` 已追加 toolKey 描述（features / useCases / usageSteps / bestPractices）
- [ ] `public/docs/` 已创建 6 个 md 文档文件
- [ ] `AppLayout.vue` 菜单已追加对应入口
- [ ] `about.js` 已更新功能描述
- [ ] localStorage 记忆输入内容已实现（key: `toolhub_{toolKey}_input`）
- [ ] 重型依赖（>50KB）使用动态导入，未在顶层静态 import
- [ ] 中英文切换无异常
- [ ] 暗色/亮色主题无异常
- [ ] 移动端布局无明显破坏

