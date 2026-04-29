import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_0_9_0_6 = VersionInfo.of({
  version: '0.9.0:6',
  releaseNotes: {
    en_US: 'Internal updates (start-sdk 1.3.3)',
    es_ES: 'Actualizaciones internas (start-sdk 1.3.3)',
    de_DE: 'Interne Aktualisierungen (start-sdk 1.3.3)',
    pl_PL: 'Aktualizacje wewnętrzne (start-sdk 1.3.3)',
    fr_FR: 'Mises à jour internes (start-sdk 1.3.3)',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
