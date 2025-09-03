import { sdk } from './sdk'
import { T } from '@start9labs/start-sdk'
import { relayInterfacePort } from './utils'

export const main = sdk.setupMain(async ({ effects, started }) => {
  /**
   * ======================== Setup ========================
   */
  console.info('Starting nostr-rs-relay!')

  /**
   * ======================== Additional Health Checks ========================
   */
  const healthReceipts: T.HealthCheck[] = []

  /**
   * ======================== Daemons ========================
   */
  return sdk.Daemons.of(effects, started).addDaemon('primary', {
    subcontainer: await sdk.SubContainer.of(
      effects,
      { imageId: 'nostr-rs-relay' },
      sdk.Mounts.of().mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/data',
        readonly: false,
      }),
      'nostr-rs-relay-sub',
    ),
    exec: { command: ['./nostr-rs-relay', '--db', '/data'] },
    ready: {
      display: 'Relay Listening',
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, relayInterfacePort, {
          successMessage: 'The relay is ready',
          errorMessage: 'The relay is not reachable',
        }),
    },
    requires: [],
  })
})
