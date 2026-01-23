import { setupManifest } from '@start9labs/start-sdk'
import { short, long, cln, lnbits } from './i18n'

export const manifest = setupManifest({
  id: 'nostr-rs-relay',
  title: 'Nostr RS Relay',
  license: 'MIT',
  wrapperRepo: 'https://github.com/Start9Labs/nostr-rs-relay-startos/',
  upstreamRepo: 'https://sr.ht/~gheartsfield/nostr-rs-relay/',
  supportSite: 'https://todo.sr.ht/~gheartsfield/nostr-rs-relay/',
  marketingSite: 'https://nostr.com/',
  donationUrl: null,
  docsUrl:
    'https://github.com/Start9Labs/nostr-rs-relay-startos/blob/update/040/docs/instructions.md',
  description: { short, long },
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
      description: cln,
      optional: true,
      metadata: {
        title: 'Core Lightning',
        icon: 'https://raw.githubusercontent.com/Start9Labs/cln-startos/refs/heads/master/icon.png',
      },
    },
    lnbits: {
      description: lnbits,
      optional: true,
      metadata: {
        title: 'LNBits',
        icon: 'https://raw.githubusercontent.com/Start9Labs/lnbits-startos/refs/heads/master/icon.png',
      },
    },
  },
})
