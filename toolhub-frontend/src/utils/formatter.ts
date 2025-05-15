// JSON 格式化
export const formatJson = (input: string): string => {
  const parsed = JSON.parse(input)
  return JSON.stringify(parsed, null, 2)
}

export const compressJson = (input: string): string => {
  const parsed = JSON.parse(input)
  return JSON.stringify(parsed)
}

export const escapeJson = (input: string): string => {
  const parsed = JSON.parse(input)
  return JSON.stringify(JSON.stringify(parsed))
}

export const unescapeJson = (input: string): string => {
  const parsed = JSON.parse(input)
  return JSON.stringify(parsed)
}

// XML 格式化
export const formatXml = (input: string): string => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(input, 'text/xml')
  
  if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
    throw new Error('无效的XML格式')
  }
  
  const serializer = new XMLSerializer()
  return serializer.serializeToString(xmlDoc)
    .replace(/></g, '>\n<')
    .replace(/(<[^>]+>)/g, (match) => {
      return match.replace(/\s+/g, ' ').trim()
    })
}

export const compressXml = (input: string): string => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(input, 'text/xml')
  
  if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
    throw new Error('无效的XML格式')
  }
  
  const serializer = new XMLSerializer()
  return serializer.serializeToString(xmlDoc)
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .trim()
}

// JavaScript 格式化
import prettier from 'prettier/standalone'
import parserBabel from 'prettier/parser-babel'

export const formatJs = (input: string): string => {
  return prettier.format(input, {
    parser: 'babel',
    plugins: [parserBabel],
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
    printWidth: 80,
    tabWidth: 2
  })
}

export const compressJs = (input: string): string => {
  return prettier.format(input, {
    parser: 'babel',
    plugins: [parserBabel],
    semi: true,
    singleQuote: true,
    printWidth: 1000,
    tabWidth: 0
  })
}

// 通用工具函数
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (e) {
    return false
  }
} 