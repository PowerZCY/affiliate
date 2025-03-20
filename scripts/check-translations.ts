/* eslint-disable @typescript-eslint/no-explicit-any */

import * as fs from 'fs'
import * as path from 'path'
import * as glob from 'glob'
import { appConfig } from '../src/lib/appConfig' // 引入配置

// 定义类型
interface TranslationInfo {
  namespaces: Map<string, string> // 变量名 -> 命名空间
  keys: string[] // 完整的翻译键路径
}

interface TranslationReport {
  [key: string]: string[]; // 动态键名
}

// 存储所有日志消息
const logMessages: string[] = []

// 自定义日志函数
function log(message: string): void {
  console.log(message)
  logMessages.push(message)
}

// 自定义错误日志函数
function logError(message: string): void {
  console.error(message)
  logMessages.push('[ERROR] ' + message)
}

// 读取翻译文件
const translations: Record<string, Record<string, any>> = {}

// 动态加载所有语言的翻译文件
// 注意翻译文件的目录位置，推荐项目根目录
appConfig.i18n.locales.forEach(locale => {
  try {
    const filePath = path.join(process.cwd(), `${appConfig.i18n.messageRoot}/${locale}.json`)
    translations[locale] = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (error) {
    logError(`无法读取语言文件 ${locale}: ${error}`)
  }
})

// 用于存储找到的翻译键
const foundTranslationKeys: Set<string> = new Set()

// 用于存储找到的命名空间
const foundNamespaces: Set<string> = new Set()

// 从对象中获取所有键（包括嵌套键）
function getAllKeys(obj: Record<string, any>, prefix: string = ''): string[] {
  let keys: string[] = []
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = prefix ? `${prefix}.${key}` : key
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        keys = [...keys, ...getAllKeys(obj[key], newKey)]
      } else {
        keys.push(newKey)
      }
    }
  }
  return keys
}

// 检查键是否存在于翻译文件中
function checkKeyExists(key: string, translations: Record<string, any>): boolean {
  const parts = key.split('.')
  let current: any = translations

  for (const part of parts) {
    if (current[part] === undefined) {
      return false
    }
    current = current[part]
  }

  return true
}

// 检查命名空间是否存在于翻译文件中
function checkNamespaceExists(namespace: string, translations: Record<string, any>): boolean {
  return translations[namespace] !== undefined
}

// 从文件内容中提取翻译键和命名空间
function extractTranslationsInfo(content: string, filePath: string): TranslationInfo {
  const result: TranslationInfo = {
    namespaces: new Map<string, string>(),
    keys: []
  }

  // 匹配 getTranslations({ locale, namespace: 'namespace' }) 或 getTranslations('namespace')
  const getTranslationsPattern = /getTranslations\(\s*(?:{[^}]*namespace:\s*['"]([^'"]+)['"][^}]*}|['"]([^'"]+)['"])\s*\)/g
  let match: RegExpExecArray | null

  while ((match = getTranslationsPattern.exec(content)) !== null) {
    const namespace = match[1] || match[2]
    if (namespace) {
      foundNamespaces.add(namespace)

      // 尝试找到赋值语句，如 const t = await getTranslations(...)
      // 查找前面最近的 const 声明
      const linesBefore = content.substring(0, match.index).split('\n');
      for (let i = linesBefore.length - 1; i >= Math.max(0, linesBefore.length - 5); i--) {
        const line = linesBefore[i];
        const constMatch = /const\s+(\w+)\s*=/.exec(line);
        if (constMatch && !line.includes('useTranslations') && !line.includes('getTranslations')) {
          result.namespaces.set(constMatch[1], namespace);
          break;
        }
      }
    }
  }

  // 匹配 useTranslations('namespace')
  const useTranslationsPattern = /useTranslations\(\s*['"]([^'"]+)['"]\s*\)/g
  while ((match = useTranslationsPattern.exec(content)) !== null) {
    const namespace = match[1]
    foundNamespaces.add(namespace)

    // 尝试找到赋值语句，如 const t = useTranslations(...)
    // 查找包含 useTranslations 的行
    const currentLine = content.substring(0, match.index).split('\n').pop() || '';
    const constMatch = /const\s+(\w+)\s*=/.exec(currentLine);
    if (constMatch) {
      result.namespaces.set(constMatch[1], namespace);
    }
  }

  // 匹配 t('key') 或 t("key")，并检查 t 是否与已知命名空间关联
  const tPattern = /(\w+)\(\s*['"]([^'"]+)['"]\s*\)/g
  while ((match = tPattern.exec(content)) !== null) {
    const funcName = match[1]
    const key = match[2]

    // 过滤掉明显不是翻译函数的调用
    if (key.includes('/') || key === '') continue

    // 如果函数名与已知命名空间变量关联
    if (result.namespaces.has(funcName)) {
      const namespace = result.namespaces.get(funcName)
      if (namespace) {
        const fullKey = `${namespace}.${key}`
        result.keys.push(fullKey)
      }
    }
  }

  // 匹配 <FormattedMessage id="key" />
  const formattedMessagePattern = /<FormattedMessage[^>]*id=['"]([^'"]+)['"]/g
  while ((match = formattedMessagePattern.exec(content)) !== null) {
    const key = match[1]
    if (!key.includes('/') && key !== '') {
      // 对于 FormattedMessage，我们需要猜测命名空间
      // 通常会在同一文件中找到 useTranslations 调用
      if (result.namespaces.size > 0) {
        const namespace = Array.from(result.namespaces.values())[0]
        result.keys.push(`${namespace}.${key}`)
      } else {
        // 如果找不到命名空间，尝试从文件路径推断
        const pathMatch = filePath.match(/\[locale\]\/(?:\([^)]+\)\/)?([^/]+)/)
        if (pathMatch && pathMatch[1]) {
          const possibleNamespace = pathMatch[1]
          foundNamespaces.add(possibleNamespace)
          result.keys.push(`${possibleNamespace}.${key}`)
        }
      }
    }
  }

  return result
}

// 主函数
async function checkTranslations(): Promise<number> {
  log('开始检查翻译...')

  // 获取所有 TSX/TS 文件
  const files: string[] = glob.sync('src/**/*.{tsx,ts,jsx,js}', {
    ignore: ['src/**/*.d.ts', 'src/**/*.test.ts', 'src/**/*.test.tsx', 'node_modules/**']
  })

  log(`找到 ${files.length} 个文件需要扫描`)

  // 扫描所有文件
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8')
      const { namespaces, keys } = extractTranslationsInfo(content, file)

      if (keys.length > 0 || namespaces.size > 0) {
        log(`在文件 ${file} 中找到以下信息:`)

        if (namespaces.size > 0) {
          log(`  翻译函数映射:`)
          namespaces.forEach((namespace, varName) => {
            log(`    - ${varName} => ${namespace}`)
          })
        }

        if (keys.length > 0) {
          log(`  翻译键:`)
          keys.forEach(key => {
            log(`    - ${key}`)
            foundTranslationKeys.add(key)
          })
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        logError(`处理文件 ${file} 时出错: ${error.message}`)
      } else {
        logError(`处理文件 ${file} 时出错: 未知错误`)
      }
    }
  }

  log('\n检查翻译文件中的键...')
  log(`在代码中找到 ${foundNamespaces.size} 个使用的命名空间: ${Array.from(foundNamespaces).join(', ')}`)

  // 检查结果
  const report: TranslationReport = {
    missingInEn: [],
    missingInZh: [],
    enOnlyKeys: [],
    zhOnlyKeys: [],
    missingNamespacesInEn: [],
    missingNamespacesInZh: []
  }

  // 检查命名空间是否存在
  foundNamespaces.forEach(namespace => {
    appConfig.i18n.locales.forEach(locale => {
      const missingNamespaceKey = `missingNamespacesIn${locale.toUpperCase()}`;
      if (!checkNamespaceExists(namespace, translations[locale])) {
        report[missingNamespaceKey] = report[missingNamespaceKey] || [];
        report[missingNamespaceKey].push(namespace);
      }
    });
  });

  // 检查翻译键是否存在
  foundTranslationKeys.forEach(key => {
    appConfig.i18n.locales.forEach(locale => {
      const missingKey = `missingIn${locale.toUpperCase()}`;
      if (!checkKeyExists(key, translations[locale])) {
        report[missingKey] = report[missingKey] || [];
        report[missingKey].push(key);
      }
    });
  });

  // 检查翻译文件的键是否一致
  appConfig.i18n.locales.forEach(locale => {
    const allKeys = getAllKeys(translations[locale]);
    appConfig.i18n.locales.forEach(otherLocale => {
      if (locale !== otherLocale) {
        const otherKeys = getAllKeys(translations[otherLocale]);
        const onlyKeys = `${locale}OnlyKeys`;
        report[onlyKeys] = allKeys.filter(key => !otherKeys.includes(key));
      }
    });
  });

  // 生成报告
  log('\n=== 翻译检查报告 ===\n');

  // 首先报告缺失的命名空间，这通常是最严重的问题
  appConfig.i18n.locales.forEach(locale => {
    const missingNamespaceKey = `missingNamespacesIn${locale.toUpperCase()}`;
    if (report[missingNamespaceKey]?.length > 0) {
      log(`🚨 ${locale} 翻译文件中缺失的命名空间:`);
      report[missingNamespaceKey].forEach(namespace => log(`  - ${namespace}`));
    } else {
      log(`✅ ${locale} 翻译文件中包含所有使用的命名空间`);
    }
  });

  // 然后报告缺失的翻译键
  appConfig.i18n.locales.forEach(locale => {
    const missingKey = `missingIn${locale.toUpperCase()}`;
    if (report[missingKey]?.length > 0) {
      log(`\n🔴 ${locale} 翻译文件中缺失的键:`);
      report[missingKey].forEach(key => log(`  - ${key}`));
    } else {
      log(`\n✅ ${locale} 翻译文件中包含所有使用的键`);
    }
  });

  // 最后报告不一致的键
  appConfig.i18n.locales.forEach(locale => {
    const onlyKeys = `${locale}OnlyKeys`;
    if (report[onlyKeys]?.length > 0) {
      log(`\n⚠️ 仅在 ${locale} 翻译文件中存在的键:`);
      report[onlyKeys].forEach(key => log(`  - ${key}`));
    }
  });

  log('\n=== 报告结束 ===\n')

  // 在所有操作完成后，一次性写入日志文件
  const logFilePath = path.join(process.cwd(), 'scripts', 'check.log')
  fs.writeFileSync(logFilePath, logMessages.join('\n'), 'utf8')

  log(`检查完成，日志已保存到 ${logFilePath}`)

  // 如果有任何问题，返回非零状态码
  return Object.values(report).some(keys => keys.length > 0) ? 1 : 0
}

// 运行检查
checkTranslations().then(exitCode => {
  // 确保所有日志都已写入
  const logFilePath = path.join(process.cwd(), 'scripts', 'check.log')
  fs.writeFileSync(logFilePath, logMessages.join('\n'), 'utf8')
  console.log(`日志已保存到 ${logFilePath}`)

  process.exit(exitCode)
}).catch(error => {
  console.error('检查翻译时发生错误:', error)
  process.exit(1)
})