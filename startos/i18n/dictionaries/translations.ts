import { LangDict } from './default'

const translations = {
  es_ES: {
    0: '¡Hola, mundo!',
    1: 'Configuración',
    2: 'Guardar cambios',
  },
  fr_FR: {
    0: 'Bonjour, monde!',
    1: 'Paramètres',
    2: 'Enregistrer les modifications',
  },
} satisfies Record<string, LangDict>

/**
 * Plumbing. DO NOT EDIT.
 */
export type Lang = keyof typeof translations
export default translations
