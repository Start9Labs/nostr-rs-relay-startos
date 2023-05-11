import { sdk } from '../../sdk'
import { rmdir } from 'fs/promises'

export const v0_8_9 = sdk.Migration.of({
  version: '0.8.9',
  up: async ({ effects, utils }) => {
    // remove old start9 dir
    await rmdir('/root/start9')
  },
  down: async ({ effects, utils }) => {
    throw new Error('Downgrade not permitted')
  },
})
