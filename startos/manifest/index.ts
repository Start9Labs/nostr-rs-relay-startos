import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'nostr-rs-relay',
  title: 'Nostr RS Relay',
  license: 'MIT',
  donationUrl: null,
  packageRepo:
    'https://github.com/Start9Labs/nostr-rs-relay-startos/tree/update/040',
  upstreamRepo: 'https://sr.ht/~gheartsfield/nostr-rs-relay/',
  marketingUrl: 'https://nostr.com/',
  docsUrls: [
    'https://github.com/scsibug/nostr-rs-relay/blob/master/README.md',
    'https://github.com/scsibug/nostr-rs-relay/blob/master/config.toml',
  ],
  description: { short, long },
  volumes: ['db', 'config', 'main'], // main for migration only
  images: {
    'nostr-rs-relay': {
      source: {
        dockerTag: 'chekist32/nostr-rs-relay:0.9.0',
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {},
})
