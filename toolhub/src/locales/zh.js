// 中文语言包总入口：按分类拆分至 messages/zh/，此处合并导出（键序与原单文件一致）
import home from './messages/zh/home.js'
import common from './messages/zh/common.js'
import format from './messages/zh/format.js'
import encrypt from './messages/zh/encrypt.js'
import convert from './messages/zh/convert.js'
import image from './messages/zh/image.js'
import document from './messages/zh/document.js'
import data from './messages/zh/data.js'
import media from './messages/zh/media.js'
import text from './messages/zh/text.js'
import ai from './messages/zh/ai.js'
import other from './messages/zh/other.js'
import custom from './messages/zh/custom.js'
import misc from './messages/zh/misc.js'

export default {
  ...home,
  ...common,
  ...format,
  ...encrypt,
  ...convert,
  ...image,
  ...document,
  ...data,
  ...media,
  ...text,
  ...ai,
  ...other,
  ...custom,
  ...misc
}
