import { VersionGraph } from '@start9labs/start-sdk'
import { current, other } from './versions'
import { sdk } from '../sdk'

export const versionGraph = VersionGraph.of({
  current,
  other,
  preInstall: async (effects) => {
    // @TODO is this necessary? If so, is this the place/way to do it?
    await sdk.runCommand(
      effects,
      { imageId: 'nostr-rs-relay' },
      'chown -R $APP_USER:$APP_USER $APP_DATA',
      { mounts: null },
      'chown',
    )
  },
})
