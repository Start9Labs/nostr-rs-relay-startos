export const DEFAULT_LANG = 'en_US'

const dict = {
  'Hello, world!': 0,
  Settings: 1,
  'Save changes': 2,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
