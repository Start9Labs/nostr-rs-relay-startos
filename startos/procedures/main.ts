import { sdk } from '../sdk'
import { ExpectedExports } from '@start9labs/start-sdk/lib/types'
import { manifest } from '../manifest'
import { HealthReceipt } from '@start9labs/start-sdk/lib/health/HealthReceipt'
import { Daemons } from '@start9labs/start-sdk/lib/mainFn/Daemons'
import { relayPort } from './interfaces'

export const main: ExpectedExports.main = sdk.setupMain(
  async ({ effects, utils, started }) => {
    /**
     * ======================== Setup ========================
     */

    console.info('Starting Nostr RS Relay!')

    /**
     * ======================== Additional Health Checks (optional) ========================
     */
    const healthReceipts: HealthReceipt[] = []

    /**
     * ======================== Daemons ========================
     */
    return Daemons.of({
      effects,
      started,
      healthReceipts,
    }).addDaemon('ws', {
      command: ['./nostr-rs-relay', '--db', '/data'],
      requires: [],
      ready: {
        display: 'Service Ready',
        fn: () =>
          utils.checkPortListening(relayPort, {
            successMessage: `${manifest.title} is live`,
            errorMessage: `${manifest.title} is unreachable`,
          }),
      },
    })
  },
)
