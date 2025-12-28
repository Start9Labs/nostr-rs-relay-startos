import { configToml } from './fileModels/config.toml'
import { sdk } from './sdk'
import { clnMountpoint, lnbitsMountpoint, relayInterfacePort } from './utils'
import { manifest as clnManifest } from 'c-lightning-startos/startos/manifest'
import { manifest as lnbitsManifest } from 'lnbits-startos/startos/manifest'

export const appPath = '/usr/src/app'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup ========================
   */
  console.info('Starting Nostr RS Relay!')

  let mounts = sdk.Mounts.of()
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

  const toml = await configToml.read().const(effects)

  const processor = toml?.pay_to_relay?.processor

  if (processor === 'ClnRest') {
    mounts = mounts.mountDependency<typeof clnManifest>({
      dependencyId: 'c-lightning',
      volumeId: 'main',
      subpath: null,
      mountpoint: clnMountpoint,
      readonly: true,
    })
  } else if (processor === 'LNBits') {
    mounts = mounts.mountDependency<typeof lnbitsManifest>({
      dependencyId: 'lnbits',
      volumeId: 'main',
      subpath: null,
      mountpoint: lnbitsMountpoint,
      readonly: true,
    })
  }

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
        display: 'Relay Listening',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, relayInterfacePort, {
            successMessage: 'The relay is ready',
            errorMessage: 'The relay is not reachable',
          }),
      },
      requires: ['chown'],
    })
})
