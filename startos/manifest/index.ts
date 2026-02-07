import { setupManifest } from '@start9labs/start-sdk'
import { short, long } from './i18n'

export const manifest = setupManifest({
  id: 'nostr-rs-relay',
  title: 'Nostr RS Relay',
  license: 'MIT',
  wrapperRepo: 'https://github.com/Start9Labs/nostr-rs-relay-startos/',
  upstreamRepo: 'https://sr.ht/~gheartsfield/nostr-rs-relay/',
  supportSite: 'https://todo.sr.ht/~gheartsfield/nostr-rs-relay/',
  marketingSite: 'https://nostr.com/',
  donationUrl: null,
  docsUrl: 'https://github.com/scsibug/nostr-rs-relay',
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
