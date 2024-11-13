import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'nostr',
  title: 'Nostr RS Relay',
  license: 'mit',
  wrapperRepo: 'https://github.com/Start9Labs/nostr-rs-relay-startos/',
  upstreamRepo: 'https://sr.ht/~gheartsfield/nostr-rs-relay/',
  supportSite: 'https://todo.sr.ht/~gheartsfield/nostr-rs-relay/',
  marketingSite: 'https://nostr.com/',
  donationUrl: null,
  description: {
    short: 'A Nostr relay, written in Rust',
    long: 'This is a Nostr relay, written in Rust. It currently supports the entire relay protocol, and persists data with SQLite',
  },
  assets: [],
  volumes: ['main'],
  images: {
    main: {
      source: {
        dockerTag: 'scsibug/nostr-rs-relay:0.9.0',
      },
    },
  },
  hardwareRequirements: {},
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
