import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'nostr', // @TODO change ID to nostr-rs-relay once OS migration is implemented
  title: 'Nostr RS Relay',
  license: 'MIT',
  wrapperRepo: 'https://github.com/Start9Labs/nostr-rs-relay-startos/',
  upstreamRepo: 'https://sr.ht/~gheartsfield/nostr-rs-relay/',
  supportSite: 'https://todo.sr.ht/~gheartsfield/nostr-rs-relay/',
  marketingSite: 'https://nostr.com/',
  donationUrl: null,
  docsUrl:
    'https://github.com/Start9Labs/nostr-rs-relay/blob/update/040/docs/README.md',
  description: {
    short: 'A Nostr relay, written in Rust',
    long: 'This is a Nostr relay, written in Rust. It currently supports the entire relay protocol, including pay-to-relay capabilities.',
  },
  volumes: ['db', 'config', 'main'], // main for migration only
  images: {
    'nostr-rs-relay': {
      source: {
        dockerTag: 'chekist32/nostr-rs-relay:0.9.0',
      },
    },
  },
  dependencies: {
    'c-lightning': {
      description:
        'Needed if you want to accept relay subscription payments using Core Lightning',
      optional: true,
      metadata: {
        title: 'Core Lightning',
        icon: 'https://raw.githubusercontent.com/Start9Labs/cln-startos/refs/heads/master/icon.png',
      },
    },
    lnbits: {
      description:
        'Needed if you want to accept relay subscription payments using LNBits',
      optional: true,
      metadata: {
        title: 'LNBits',
        icon: 'https://raw.githubusercontent.com/Start9Labs/lnbits-startos/refs/heads/master/icon.png',
      },
    },
  },
})
