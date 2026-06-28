export type MultiLang = Record<string, string>

export function getLang(obj: MultiLang | null | undefined, lang: string, fallback = 'en'): string {
  if (!obj) return ''
  return obj[lang] || obj[fallback] || Object.values(obj)[0] || ''
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
  { code: 'ar', label: 'العربية' },
  { code: 'zh', label: '中文' },
  { code: 'ru', label: 'Русский' },
]
