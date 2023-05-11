import { setupManifest } from '@start9labs/start-sdk/lib/manifest/setupManifest'

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
    main: 'data',
  },
  containers: {
    main: {
      image: 'main',
      mounts: {
        main: '/data',
      },
    },
  },
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
