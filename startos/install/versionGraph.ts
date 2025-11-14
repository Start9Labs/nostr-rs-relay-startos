import { VersionGraph } from '@start9labs/start-sdk'
import { current, other } from './versions'
import { sdk } from '../sdk'
import { mainMount } from '../utils'

export const versionGraph = VersionGraph.of({
  current,
  other,
  preInstall: async (effects) => {
    // @TODO is this necessary? If so, is this the place/way to do it?
    await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'nostr-rs-relay' },
      mainMount,
      'chown',
      (s) => s.execFail(['chown', '-R', 'appuser:appuser', '/data']),
    )
  },
})
