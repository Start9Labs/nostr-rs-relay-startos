import { configToml } from './fileModels/config.toml'
import { sdk } from './sdk'
import {
  clnMountpoint,
  lnbitsMountpoint,
  mainMount,
  relayInterfacePort,
} from './utils'
import { manifest as clnManifest } from 'c-lightning-startos/startos/manifest'
import { manifest as lnbitsManifest } from 'lnbits-startos/startos/manifest'

export const main = sdk.setupMain(async ({ effects, started }) => {
  /**
   * ======================== Setup ========================
   */
  console.info('[i] Starting nostr-rs-relay!')

  const depResult = await sdk.checkDependencies(effects)
  depResult.throwIfNotSatisfied()

  let mounts = mainMount

  const processor = await configToml
    .read((c) => c.pay_to_relay?.processor)
    .const(effects)

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

  /**
   * ======================== Daemons ========================
   */
  return sdk.Daemons.of(effects, started).addDaemon('primary', {
    subcontainer: await sdk.SubContainer.of(
      effects,
      { imageId: 'nostr-rs-relay' },
      mounts,
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
