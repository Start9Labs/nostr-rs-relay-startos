import { setupManifest } from '@start9labs/start-sdk'
import { SDKImageInputSpec } from '@start9labs/start-sdk/base/lib/types/ManifestTypes'

const BUILD = process.env.BUILD || ''

const architectures =
  BUILD === 'x86_64' || BUILD === 'aarch64' ? [BUILD] : ['x86_64', 'aarch64']

export const manifest = setupManifest({
  id: 'nostr',
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
  volumes: ['main'],
  images: {
    'nostr-rs-relay': {
      source: {
        dockerBuild: {},
      },
      arch: architectures,
    } as SDKImageInputSpec,
  },
  hardwareRequirements: {
    arch: architectures,
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
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
