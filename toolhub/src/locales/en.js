// 英文语言包总入口：按分类拆分至 messages/en/，此处合并导出（键序与原单文件一致）
import home from './messages/en/home.js'
import common from './messages/en/common.js'
import format from './messages/en/format.js'
import encrypt from './messages/en/encrypt.js'
import convert from './messages/en/convert.js'
import image from './messages/en/image.js'
import document from './messages/en/document.js'
import data from './messages/en/data.js'
import media from './messages/en/media.js'
import text from './messages/en/text.js'
import ai from './messages/en/ai.js'
import other from './messages/en/other.js'
import custom from './messages/en/custom.js'
import misc from './messages/en/misc.js'

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
