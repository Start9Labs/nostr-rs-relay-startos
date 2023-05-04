import { setupManifest } from '@start9labs/start-sdk/lib/manifest/setupManifest'
import { actionsMetadata } from './procedures/actions'

/**
 * In this function you define static properties of the service
 */
export const manifest = setupManifest({
  id: 'nostr',
  title: 'Nostr RS Relay',
  version: '0.8.9',
  releaseNotes: 'Update for StartOS 0.4.0',
  license: 'mit',
  replaces: Array<string>(),
  wrapperRepo: 'https://github.com/Start9Labs/nostr-rs-relay-wrapper/',
  upstreamRepo: 'https://github.com/scsibug/nostr-rs-relay/',
  supportSite: 'https://github.com/scsibug/nostr-rs-relay/issues/',
  marketingSite: 'https://nostr.com/',
  donationUrl: null,
  description: {
    short: 'A Nostr relay, written in Rust',
    long: 'Gitea is a community managed lightweight code hosting solution.',
  },
  assets: {
    license: 'LICENSE',
    icon: 'assets/icon.png',
    instructions: 'assets/instructions.md',
  },
  volumes: {
    // This is the image where files from the project asset directory will go
    main: 'data',
  },
  containers: {
    main: {
      // Identifier for the main image volume, which will be used when other actions need to mount to this volume.
      image: 'main',
      // Specifies where to mount the data volume(s), if there are any. Mounts for pointer dependency volumes are also denoted here. These are necessary if data needs to be read from / written to these volumes.
      mounts: {
        // Specifies where on the service's file system its persistence directory should be mounted prior to service startup
        main: '/data',
      },
    },
  },
  actions: actionsMetadata,
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {},
})

export type Manifest = typeof manifest
