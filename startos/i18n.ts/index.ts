import translations from './translations'

const DEFAULT_LANG = 'en_US'
const LANG = process.env.LANG?.replace(/\.UTF-8$/, '') ?? DEFAULT_LANG

export function i18n(key: string): string {
  const s = translations[key]
  if (!s) {
    console.warn(`Translations missing for ${key}`)
    return key
  }
  return s[LANG] ?? s[DEFAULT_LANG] ?? key
}
