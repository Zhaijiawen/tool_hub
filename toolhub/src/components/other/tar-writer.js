// 手写 ustar TAR 写入（无第三方依赖）：512 字节定长头 + 文件数据按 512 对齐，
// 末尾两个 512 零块；文件名 >100 字节走 GNU 长文件名扩展（typeflag 'L'）。
// 产出的是标准 uncompressed tar，可由系统 tar / 7z / libarchive 直接读取。
//
// 之所以自己实现而非依赖 fflate：fflate 只提供 zip / gzip / brotli 等，没有 TAR 写入器。
// 标准 ustar 格式足够覆盖“纯打包”与“包 + gzip 包裹”两种需求，且便于单测验证。

/**
 * @param {Record<string, Uint8Array>} files 形如 { "相对路径/文件名": 字节 }
 * @returns {Uint8Array} 标准 ustar tar 字节流（未压缩）
 */
export function buildTar(files) {
  const enc = new TextEncoder()
  const blocks = []
  const push = (b) => blocks.push(b)
  const padTo512 = (data) => {
    const rem = data.length % 512
    if (rem) push(new Uint8Array(512 - rem))
  }
  const octal = (n, width) => {
    let s = Math.max(0, n >>> 0).toString(8)
    while (s.length < width - 1) s = '0' + s
    return s + '\0'
  }
  const makeHeader = ({ name, size, typeflag, mode }) => {
    const h = new Uint8Array(512)
    const putStr = (str, off, len) => {
      const b = enc.encode(str)
      h.set(b.subarray(0, Math.min(b.length, len)), off)
    }
    putStr(name, 0, 100)
    putStr(octal(mode, 8), 100, 8) // mode
    putStr(octal(0, 8), 108, 8) // uid
    putStr(octal(0, 8), 116, 8) // gid
    putStr(octal(size, 12), 124, 12) // size
    putStr(octal(0, 12), 136, 12) // mtime
    h[156] = typeflag.charCodeAt(0)
    putStr('ustar\0', 257, 6) // magic + version 00
    // chksum 字段先填 8 个空格，再整体求和后写回 6 位八进制 + \0 + 空格
    for (let i = 148; i < 156; i++) h[i] = 0x20
    let sum = 0
    for (let i = 0; i < 512; i++) sum += h[i]
    const chk = sum.toString(8).padStart(6, '0')
    const cb = enc.encode(chk)
    for (let i = 0; i < 6; i++) h[148 + i] = cb[i]
    h[154] = 0
    h[155] = 0x20
    return h
  }

  for (const [name, data] of Object.entries(files)) {
    // GNU 长文件名：文件名字节数（含结尾 \0）超过 100 时，先写一条 typeflag='L' 的“文件名块”。
    const nameBytes = enc.encode(name + '\0')
    if (nameBytes.length > 100) {
      push(makeHeader({ name: '././@LongLink', size: nameBytes.length, typeflag: 'L', mode: 0 }))
      push(nameBytes)
      padTo512(nameBytes)
    }
    const headerName = nameBytes.length > 100 ? name.split('/').pop() || 'file' : name
    push(makeHeader({ name: headerName, size: data.length, typeflag: '0', mode: 0o644 }))
    push(data)
    padTo512(data)
  }
  push(new Uint8Array(1024)) // 两个零块结束
  const total = blocks.reduce((s, b) => s + b.length, 0)
  const out = new Uint8Array(total)
  let off = 0
  for (const b of blocks) {
    out.set(b, off)
    off += b.length
  }
  return out
}
