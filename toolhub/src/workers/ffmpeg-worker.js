/**
 * ToolHub FFmpeg Worker 入口（**自建单层 worker**，方案 B）。
 *
 * 为什么不用上游 `@ffmpeg/ffmpeg` 的主线程 FFmpeg 类：
 * 它内部 spawn 自己的 worker 并自行 fetch core wasm，**会绕过我们的
 * useWasmModule 加载链路**（进度条 / 取消 / Cache API 缓存全部失效），
 * 直接违背「所有 WASM 异步按需下载并展示进度、可取消」的需求。
 * 故自建：主线程下载 → 转移字节 → worker 内直接 import 补丁后的胶水，
 * 与 OCR / PDF / SQLite 四个工具架构完全统一。
 *
 * 时序设计（与 mupdf-worker 同型）：
 * 1. 顶层注册一次性 message 监听，等待主线程注入 wasm 字节；
 * 2. 收到字节后动态 import vendored ffmpeg-core.js，调用
 *    `createFFmpegCore({ wasmBinary })`（胶水原生支持 Module.wasmBinary 注入，
 *    补丁使 _locateFile 在注入场景返回占位名、不触发任何 fetch）；
 * 3. ready 后按 job 协议处理 probe / transcode / audio / gif。
 *
 * ffmpeg 命令在本文件内构造（组件只传结构化选项）：
 * 命令行参数是外部输入面，集中在 worker 内便于校验与后续收窄。
 *
 * 胶水特性（与前述工具的差异，实测结论）：
 * - **必须在专用 worker 内运行**：胶水硬编码 `ENVIRONMENT_IS_WORKER=true`
 *   且 `ENVIRONMENT_IS_NODE=false`（无 Node 分支可短路），主线程会因
 *   `self` 未定义直接崩溃 —— worker 化是必需而非可选。
 * - 无 Node 分支代码，故**不需要**mupdf/sqlite 那种环境短路补丁。
 * - FS 为 Emscripten MEMFS，全量内存文件系统 —— 用完必须删，否则 32MB
 *   wasm 同进程内会累积（尤其大视频转码产物可能上百 MB）。
 * - `setProgress` 的 progress 实测会返回**负数**（ffmpeg time 是微秒基准
 *   差值），必须钳制后再上报，否则进度条会跳负。
 * - `exec` 是同步阻塞的（wasm 内跑完整条命令），期间 worker 无法处理
 *   cancel 消息；用胶水 `setTimeout(ms)` 做中断保护（超时后 ffmpeg 自行中止）。
 */

let ffmpeg = null
let ready = false
let currentJobId = 0 // 进度回调用它把进度路由到当前 job
let logs = [] // ffmpeg stderr 缓冲，失败时供 UI 展示原始报错

/** 上传文件在 MEMFS 中的安全路径（仅取 basename，规避路径穿越与特殊字符） */
function safePath(name) {
  const base = String(name || 'input')
    .split(/[/\\]/)
    .pop()
    .replace(/[^A-Za-z0-9._-]/g, '_')
    .slice(0, 64)
  return '/' + (base || 'input')
}

/** 由输入名生成输出路径（固定 _out 后缀，避免与输入同名冲突） */
function outputPath(inputName, ext) {
  const stem = safePath(inputName).replace(/\.[^.]*$/, '') || 'output'
  return `${stem}_out.${ext}`
}

/**
 * 执行 ffmpeg 命令，返回返回码；同时把 stderr 存入 logs。
 * 单线程 ffmpeg-core 在处理较大/复杂媒体时，wasm 堆（初始 32MB、依赖
 * 不可靠的增长路径）会触发 `memory access out of bounds` 的 RuntimeError 陷阱，
 * 该异常会直接从 exec 抛出。这里把它归一为 OUT_OF_MEMORY 错误码，
 * 让 UI 给出「文件过大/内存不足」的友好提示，而不是把原始 wasm 文本暴露给用户。
 * 注意：仅匹配真正的越界陷阱文案；setTimeout 触发的 Aborted() 不在此列，
 * 避免把超时误判为内存不足。
 */
function run(args, timeoutMs = -1) {
  logs = []
  ffmpeg.setTimeout(timeoutMs)
  try {
    ffmpeg.exec(...args)
  } catch (e) {
    const msg = String((e && e.message) || e)
    if (/memory access out of bounds/i.test(msg)) {
      throw new Error('OUT_OF_MEMORY')
    }
    throw e
  }
  return ffmpeg.ret
}

/**
 * ffmpeg 报错文本的可用性（实测，重要）：
 * 该构建的胶水在 exec/ffprobe 内 `catch` 掉 Aborted 只返回 ret，
 * **ffmpeg 自身的 stderr 不经过 setLogger** —— 日志缓冲里通常只有 `Aborted()`。
 * 因此不能用错误文本判定失败原因，只能按「哪条命令 + 什么选项组合」
 * 映射到具体错误码（如音频提取失败即视为无音轨）。
 * 本函数仅在 stderr 确实可达时提供兜底文案。
 */
function extractError() {
  if (!logs.length) return ''
  const tail = logs.slice(-8)
  const line = tail.find((l) =>
    /error|invalid|unable|failed|no such|not found|unsupported|unknown|does not contain/i.test(l)
  )
  const picked = line || tail[tail.length - 1] || ''
  // 只有 Aborted() 这类无信息量内容时返回空串，避免把垃圾文案抛给用户
  return /^Aborted/.test(picked) ? '' : picked.slice(0, 300)
}

/** 写入输入文件并在结束时清理（MEMFS 全内存，残留会累积占用） */
function writeInput(bytes, name) {
  const path = safePath(name)
  ffmpeg.FS.writeFile(path, new Uint8Array(bytes))
  return path
}

function removeFiles(...paths) {
  for (const p of paths) {
    try {
      ffmpeg.FS.unlink(p)
    } catch (_) {
      /* 文件不存在时忽略 */
    }
  }
}

/** 读取产物并转移（FS.readFile 返回 Uint8Array，其 buffer 可安全转移） */
function finish(id, outPath) {
  let out
  try {
    out = ffmpeg.FS.readFile(outPath)
  } catch (_) {
    throw new Error('OUTPUT_MISSING')
  }
  self.postMessage(
    { type: 'toolhub:job-done', id, result: { kind: 'file', name: outPath.slice(1), bytes: out } },
    [out.buffer]
  )
}

// ================= job: probe（校验文件 + 读取容器信息） =================
// 能力边界（实测结论，勿假设 ffprobe 可用）：
// - 该构建的 **`ffprobe` 不可用**：无参调用返回 -1，带参写 JSON 文件也直接 abort。
// - ffmpeg 自身的报错文本**不经过胶水 logger**（exec/ffprobe 会 catch Aborted
//   并只返回 ret），因此失败时拿不到 ffmpeg 原始报错，只有 `Aborted()`。
// - 可用替代：
//   ① `-f null -` 作**文件类型校验**（能解析返回 0，文本文件等返回非 0）；
//   ② `-f ffmetadata out.txt` 取容器/流元数据（major_brand、encoder 等），
//      但**不含时长与分辨率**（那些只在 stderr，而我们拿不到 stderr）。
// 故 UI 只展示可确证的信息（容器格式、字节大小），不谎报时长/分辨率。
function handleProbe(msg) {
  const inPath = writeInput(msg.bytes, msg.name)
  const size = msg.bytes ? msg.bytes.byteLength : 0

  // ① 能否解析为媒体流
  const retNull = run(['-i', inPath, '-f', 'null', '-'])
  if (retNull !== 0) {
    removeFiles(inPath)
    throw new Error('NOT_MEDIA_FILE')
  }

  // ② 容器元数据（可选，失败不影响主流程）
  let meta = null
  try {
    const metaPath = '/meta.txt'
    if (run(['-i', inPath, '-f', 'ffmetadata', metaPath]) === 0) {
      const text = ffmpeg.FS.readFile(metaPath, { encoding: 'utf8' })
      const map = {}
      for (const line of String(text).split('\n')) {
        const idx = line.indexOf('=')
        if (idx > 0) map[line.slice(0, idx)] = line.slice(idx + 1)
      }
      meta = map
      removeFiles(metaPath)
    }
  } catch (_) { /* 元数据可选 */ }

  removeFiles(inPath)
  self.postMessage({
    type: 'toolhub:job-done',
    id: msg.id,
    result: {
      kind: 'probe',
      size,
      majorBrand: meta?.major_brand || '',
      compatibleBrands: meta?.compatible_brands || '',
      encoder: meta?.encoder || ''
    }
  })
}

// ================= job: transcode（视频转码） =================
const VIDEO_FORMATS = {
  mp4: { ext: 'mp4', codec: ['-c:v', 'libx264', '-preset', 'ultrafast', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'] },
  webm: { ext: 'webm', codec: ['-c:v', 'libvpx', '-b:v', '1M'] },
  gif: { ext: 'gif', codec: null } // gif 走独立 job（需 palettegen/use）
}

function handleTranscode(msg) {
  const { bytes, name, format = 'mp4', quality = 28, scale = 0, timeoutMs = -1 } = msg
  const spec = VIDEO_FORMATS[format]
  if (!spec) throw new Error('UNSUPPORTED_FORMAT')
  const inPath = writeInput(bytes, name)
  const outPath = outputPath(name, spec.ext)

  const args = ['-i', inPath]
  // scale：0 = 保持原尺寸；否则限制宽度并按比例缩放（-2 保证偶数，yuv420p 要求）
  if (scale > 0) args.push('-vf', `scale=${Math.round(scale)}:-2:flags=lanczos`)
  args.push(...(spec.codec || []))
  if (spec.codec && format === 'mp4') args.push('-crf', String(quality))
  args.push(outPath)

  const ret = run(args, timeoutMs)
  if (ret !== 0) {
    removeFiles(inPath)
    const detail = extractError()
    throw new Error(detail ? 'TRANSCODE_FAILED:' + detail : 'TRANSCODE_FAILED')
  }
  finish(msg.id, outPath)
  removeFiles(inPath, outPath)
}

// ================= job: audio（提取/转换音频） =================
const AUDIO_FORMATS = {
  mp3: { ext: 'mp3', codec: ['-c:a', 'libmp3lame', '-b:a', '192k'] },
  m4a: { ext: 'm4a', codec: ['-c:a', 'aac', '-b:a', '192k'] },
  wav: { ext: 'wav', codec: ['-c:a', 'pcm_s16le'] },
  ogg: { ext: 'ogg', codec: ['-c:a', 'libvorbis', '-b:a', '128k'] },
  opus: { ext: 'opus', codec: ['-c:a', 'libopus', '-b:a', '96k'] }
}

function handleAudio(msg) {
  const { bytes, name, format = 'mp3', timeoutMs = -1 } = msg
  const spec = AUDIO_FORMATS[format]
  if (!spec) throw new Error('UNSUPPORTED_FORMAT')
  const inPath = writeInput(bytes, name)
  const outPath = outputPath(name, spec.ext)

  // -vn 去视频轨。
  // 注意：ffmpeg 的报错文本拿不到（见 handleProbe 的能力边界说明），
  // 因此「输入无音轨」无法靠错误文本判定 —— 只能靠返回码：
  // 无音轨时 ffmpeg 对 `-vn` 输出的空流报错，返回非 0。
  // 这里统一以 NO_AUDIO_STREAM 呈现（用户最常见成因就是"这个视频没声音"）。
  const ret = run(['-i', inPath, '-vn', ...spec.codec, outPath], timeoutMs)
  if (ret !== 0) {
    removeFiles(inPath)
    throw new Error('NO_AUDIO_STREAM')
  }
  finish(msg.id, outPath)
  removeFiles(inPath, outPath)
}

// ================= job: gif（视频转 GIF） =================
function handleGif(msg) {
  const { bytes, name, fps = 10, width = 320, quality = 5, timeoutMs = -1 } = msg
  const inPath = writeInput(bytes, name)
  const outPath = outputPath(name, 'gif')
  const w = Math.min(Math.max(Math.round(width) || 320, 80), 800)
  const f = Math.min(Math.max(Math.round(fps) || 10, 5), 30)
  // palettegen/paletteuse 双段滤镜是 GIF 标准做法（256 色调色板优化）
  const vf =
    `fps=${f},scale=${w}:-1:flags=lanczos,split[s0][s1];` +
    `[s0]palettegen=max_colors=${256}:stats_mode=diff[p];` +
    `[s1][p]paletteuse=dither=sierra2_4a`
  const ret = run(['-i', inPath, '-filter_complex', vf, '-loop', '0', outPath], timeoutMs)
  if (ret !== 0) {
    removeFiles(inPath)
    const detail = extractError()
    throw new Error(detail ? 'GIF_FAILED:' + detail : 'GIF_FAILED')
  }
  finish(msg.id, outPath)
  removeFiles(inPath, outPath)
}

self.addEventListener('message', async (e) => {
  const msg = e.data
  if (!msg || typeof msg !== 'object') return

  if (msg.type === 'toolhub:ffmpeg-init') {
    try {
      const { default: createFFmpegCore } = await import('../vendor/ffmpeg/ffmpeg-core.js')
      ffmpeg = await createFFmpegCore({ wasmBinary: new Uint8Array(msg.wasm) })

      ffmpeg.setLogger(({ message }) => {
        if (logs.length > 200) logs.shift()
        logs.push(message)
      })

      ffmpeg.setProgress(({ progress, time }) => {
        // ffmpeg 的 progress 实测可能为负（微秒基准差值），钳制后再上报
        const p = Number.isFinite(progress) ? Math.min(Math.max(progress, 0), 1) : 0
        self.postMessage({ type: 'toolhub:job-progress', id: currentJobId, progress: p, time })
      })

      ffmpeg.setTimeout(-1)
      ready = true
      self.postMessage({ type: 'toolhub:ffmpeg-ready' })
    } catch (err) {
      self.postMessage({
        type: 'toolhub:ffmpeg-error',
        message: String(err && err.message ? err.message : err)
      })
    }
    return
  }

  if (!ready) {
    self.postMessage({ type: 'toolhub:job-error', id: msg.id, message: 'WORKER_NOT_READY' })
    return
  }

  currentJobId = msg.id
  try {
    switch (msg.type) {
      case 'probe':
        handleProbe(msg)
        break
      case 'transcode':
        handleTranscode(msg)
        break
      case 'audio':
        handleAudio(msg)
        break
      case 'gif':
        handleGif(msg)
        break
      default:
        throw new Error('UNKNOWN_JOB:' + msg.type)
    }
  } catch (err) {
    self.postMessage({
      type: 'toolhub:job-error',
      id: msg.id,
      message: String(err && err.message ? err.message : err)
    })
  }
})