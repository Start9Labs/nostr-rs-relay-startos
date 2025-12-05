import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { rm } from 'fs/promises'

export const v_0_9_0_1_a1 = VersionInfo.of({
  version: '0.9.0:1-alpha.1',
  releaseNotes: 'Revamped for StartOS 0.4.0',
  migrations: {
    up: async ({ effects }) => {
      // remove old start9 dir
      await rm('media/startos/volumes/main/start9', { recursive: true }).catch(
        console.error,
      )
    },
    down: IMPOSSIBLE,
  },
})
