import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { rmdir } from 'fs/promises'

export const v0901 = VersionInfo.of({
  version: '0.9.0:1',
  releaseNotes: 'Revamped for StartOS 0.3.6',
  migrations: {
    up: async ({ effects }) => {
      // remove old start9 dir
      await rmdir('/root/start9')
    },
    down: IMPOSSIBLE,
  },
})
