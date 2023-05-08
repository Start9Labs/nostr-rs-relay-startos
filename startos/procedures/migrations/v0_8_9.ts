import { Migration } from '@start9labs/start-sdk/lib/inits/migrations/Migration'
import { rmdir } from 'fs/promises'

export const v0_8_9 = new Migration({
  version: '0.8.9',
  up: async ({ effects }) => {
    // remove old start9 dir
    await rmdir('/root/start9')
  },
  down: async ({ effects }) => {
    throw new Error('Downgrade not permitted')
  },
})
