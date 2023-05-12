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
     *
     * In this section, you will fetch any resources or run any commands necessary to run the service
     */

    console.info('Starting Nostr RS Relay!')

    /**
     * ======================== Additional Health Checks (optional) ========================
     *
     * In this section, you will define additional health checks beyond those associated with daemons
     */
    const healthReceipts: HealthReceipt[] = []

    /**
     * ======================== Daemons ========================
     *
     * In this section, you will create one or more daemons that define the service runtime
     *
     * Each daemon defines its own health check, which can optionally be exposed to the user
     */
    return Daemons.of({
      effects,
      started,
      healthReceipts, // Provide the healthReceipts or [] to prove they were at least considered
    }).addDaemon('ws', {
      command: ['./nostr-rs-relay', '--db /data'], // The command to start the daemon
      requires: [],
      ready: {
        display: 'Service Ready',
        // The function to run to determine the health status of the daemon
        fn: () =>
          utils.checkPortListening(relayPort, {
            successMessage: `${manifest.title} is live`,
            errorMessage: `${manifest.title} is unreachable`,
          }),
      },
    })
  },
)
