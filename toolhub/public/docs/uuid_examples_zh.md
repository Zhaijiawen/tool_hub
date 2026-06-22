# UUID 与 NanoID — 示例

## UUID v4（标准格式）

```
550e8400-e29b-41d4-a716-446655440000
f47ac10b-58cc-4372-a567-0e02b2c3d479
6ba7b810-9dad-11d1-80b4-00c04fd430c8
```

注意第三段总是以 `4` 开头——这是 v4 的版本标识位。第四段的第一个字符是 `8`、`9`、`a` 或 `b`——变体标识位。

## UUID v4（大写，无连字符）

```
550E8400E29B41D4A716446655440000
F47AC10B58CC4372A5670E02B2C3D479
```

紧凑格式少了 4 个连字符，省 4 个字符空间。熵一样，可读性差一点。

## UUID v7（按创建时间排序）

```
018e5a2f-1234-7abc-8def-0123456789ab
018e5a2f-1235-7def-9012-abcdef012345
018e5a2f-1236-7000-b123-000000000001
```

前三段是时间戳。批量生成的 v7 UUID 天然按创建时间排列。这就是数据库主键场景的核心优势。

## NanoID（默认 21 字符）

```
V1StGXR8_Z5jdHi6B-myT
4Xnm6DK8VB_v3FP2W0mJi
7TsRq1DcH_5mY3gNKpBwX
```

21 位 URL 安全字符。没有连字符，不需要转义，直接贴进 URL。

## NanoID（仅数字，长度 10）

```
3847291056
9012847365
1029384756
```

适合验证码或需要可读性的短数字 ID。

## 代码里怎么用

```javascript
// UUID v4
import { v4 as uuidv4 } from 'uuid'
const id = uuidv4()
// => '110ec58a-a0f4-4ac4-8ec2-c5b67f3a1590'

// UUID v7
import { v7 as uuidv7 } from 'uuid'
const id = uuidv7()
// => '018e5a2f-1234-7abc-8def-0123456789ab'

// NanoID
import { nanoid } from 'nanoid'
const id = nanoid()
// => 'V1StGXR8_Z5jdHi6B-myT'

// NanoID 自定义长度和字符集
import { customAlphabet } from 'nanoid'
const numericId = customAlphabet('0123456789', 10)
numericId()  // => '3847291056'
```

`customAlphabet` 在需要特定格式 ID 时很有用——纯数字、纯小写、或者限制成你系统支持的字符。
