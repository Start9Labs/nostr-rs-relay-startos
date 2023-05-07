import { Migration } from '@start9labs/start-sdk/lib/inits/migrations/Migration'

/**
 * This is an example migration file
 *
 * By convention, each version service requiring a migration receives its own file
 *
 * The resulting migration (e.g. v4000) is exported, then imported into migration/index.ts
 */
export const v0_8_9 = new Migration({
  version: '0.8.9',
  up: async ({ effects }) => {
    // remove old start9 dir
    await effects.runCommand(['rm', '-rf', '/root/start9'])
  },
  down: async ({ effects }) => {
    throw new Error('Downgrade not permitted')
  },
})
