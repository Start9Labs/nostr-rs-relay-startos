import { i18n } from './i18n'
import { sdk } from './sdk'
import { relayInterfacePort } from './utils'

export const appPath = '/usr/src/app'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup ========================
   */
  console.info(i18n('Starting Nostr RS Relay!'))

  const mounts = sdk.Mounts.of()
    .mountVolume({
      volumeId: 'db',
      subpath: null,
      mountpoint: `${appPath}/db`,
      readonly: false,
    })
    .mountVolume({
      volumeId: 'config',
      subpath: 'config.toml',
      mountpoint: `${appPath}/config.toml`,
      type: 'file',
      readonly: false,
    })

  const subcontainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'nostr-rs-relay' },
    mounts,
    'nostr-rs-relay-sub',
  )

  /**
   * ======================== Daemons ========================
   */
  return sdk.Daemons.of(effects)
    .addOneshot('chown', {
      subcontainer,
      exec: {
        command: ['chown', '-R', 'appuser:appuser', appPath],
        user: 'root',
      },
      requires: [],
    })
    .addDaemon('primary', {
      subcontainer,
      exec: { command: sdk.useEntrypoint() },
      ready: {
        display: i18n('Relay'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, relayInterfacePort, {
            successMessage: i18n('Relay is ready'),
            errorMessage: i18n('Relay is unreachable'),
          }),
      },
      requires: ['chown'],
    })
})
