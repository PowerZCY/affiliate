/**
 * @license
 * MIT License
 * Copyright (c) 2025 D8ger
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use client'

import { appConfig } from '@/lib/appConfig'
import { X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Locale = typeof appConfig.i18n.locales[number]

// 从配置中获取存储key
const LANGUAGE_PREFERENCE_KEY = `${appConfig.i18n.detector.storagePrefix}-${appConfig.i18n.detector.storageKey}`

interface LanguagePreference {
  locale: string;
  status: 'accepted' | 'rejected';
  timestamp: number;
}

export default function LanguageDetector() {
  const [show, setShow] = useState(false)
  const [detectedLocale, setDetectedLocale] = useState<Locale | null>(null)
  const currentLocale = useLocale()
  const router = useRouter()
  const t = useTranslations('languageDetection')

  useEffect(() => {
    // 获取浏览器语言
    const browserLang = navigator.language.split('-')[0] as Locale
    
    // 从localStorage获取语言偏好
    const savedPreference = localStorage.getItem(LANGUAGE_PREFERENCE_KEY)
    const preference: LanguagePreference | null = savedPreference 
      ? JSON.parse(savedPreference)
      : null

    // 检查是否需要显示语言检测框
    const shouldShowDetector = () => {
      if (!preference) return true;

      // 如果存储的语言与当前语言相同，不显示检测框
      if (preference.locale === currentLocale) return false;

      // 如果用户之前已经拒绝过切换到这个语言，不显示检测框
      if (preference.status === 'rejected' && preference.locale === browserLang) return false;

      // 如果用户之前接受过切换到这个语言，不显示检测框
      if (preference.status === 'accepted' && preference.locale === currentLocale) return false;

      // 使用配置中的过期时间
      const expirationMs = appConfig.i18n.detector.expirationDays * 24 * 60 * 60 * 1000;
      if (Date.now() - preference.timestamp < expirationMs) return false;

      return true;
    }

    // 检查浏览器语言是否在支持的语言列表中且需要显示检测框
    if (appConfig.i18n.locales.includes(browserLang) && 
        browserLang !== currentLocale && 
        shouldShowDetector()) {
      setDetectedLocale(browserLang)
      setShow(true)

      // 使用配置中的自动关闭时间
      const timer = setTimeout(() => {
        console.log('[LanguageDetector] Auto closing after timeout')
        setShow(false)
        // 自动关闭时保存拒绝状态
        savePreference(browserLang, 'rejected')
      }, appConfig.i18n.detector.autoCloseTimeout)

      return () => clearTimeout(timer)
    }
  }, [currentLocale])

  // 保存语言偏好到localStorage
  const savePreference = (locale: string, status: 'accepted' | 'rejected') => {
    const preference: LanguagePreference = {
      locale,
      status,
      timestamp: Date.now()
    }
    localStorage.setItem(LANGUAGE_PREFERENCE_KEY, JSON.stringify(preference))
  }

  const handleLanguageChange = () => {
    if (detectedLocale) {
      // 保存接受状态
      savePreference(detectedLocale, 'accepted')
      
      // 获取当前路径
      const pathname = window.location.pathname
      // 替换语言部分
      const newPathname = pathname.replace(`/${currentLocale}`, `/${detectedLocale}`)
      // 跳转到新路径
      router.push(newPathname)
      setShow(false)
    }
  }

  const handleClose = () => {
    if (detectedLocale) {
      // 保存拒绝状态
      savePreference(detectedLocale, 'rejected')
    }
    setShow(false)
  }

  if (!detectedLocale || !show) return null

  return (
    <div className="fixed top-16 right-4 z-40 w-[420px]">
      <div className={`shadow-lg rounded-lg transition-all duration-300 ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} 
        bg-gradient-to-r from-purple-100/95 via-white/95 to-purple-100/95 backdrop-blur-sm
        animate-gradient-x`}>
        <div className="relative px-6 py-4 overflow-hidden">
          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('title')}
                </h3>
                <p className="text-base text-gray-600">
                  {t('description')} <span className="text-purple-500 font-semibold">{detectedLocale === 'zh' ? '中文' : 'English'}</span>?
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 text-base bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
              >
                {t('close')}
              </button>
              <button
                onClick={handleLanguageChange}
                className="flex-1 px-4 py-2 text-base bg-purple-500 text-white rounded-md hover:bg-purple-600"
              >
                {t('changeAction')}
              </button>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200/30 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  )
} 