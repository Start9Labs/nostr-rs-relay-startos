import { configToml } from '../../file-models/config.toml'
import { sdk } from '../../sdk'
import { nullToUndefined } from '../../utils'

const { InputSpec, Value } = sdk

// input spec
export const inputSpec = InputSpec.of({
  relay_url: Value.text({
    name: 'Relay URL',
    description: 'The advertised URL for your public relay',
    required: false,
    default: null,
    placeholder: 'https://my-relay.xyz',
    patterns: [sdk.patterns.url],
  }).map(nullToUndefined),
  name: Value.text({
    name: 'Name',
    description: "Your relay's human-readable name",
    required: false,
    default: null,
    placeholder: "Bob's Public Relay",
    patterns: [
      {
        regex: '.{3,32}',
        description:
          'Must be at least 3 character and no more than 32 characters',
      },
    ],
  }).map(nullToUndefined),
  description: Value.text({
    name: 'Description',
    description: 'A detailed description for your relay',
    required: false,
    default: null,
    placeholder: 'The best relay in town',
    patterns: [
      {
        regex: '.{6,256}',
        description:
          'Must be at least 6 character and no more than 256 characters',
      },
    ],
  }).map(nullToUndefined),
  pubkey: Value.text({
    name: 'Admin Pubkey',
    description: 'The Nostr hex pubkey (not npub) of the relay administrator',
    required: false,
    default: null,
    placeholder: 'hex pubkey (not npub)',
    patterns: [
      {
        regex: '[0-9a-fA-F]{64}',
        description:
          'Must be a valid 64-digit hexadecimal value (ie a Nostr hex pubkey, not an npub). Go to https://damus.io/key/ to convert npub to hex',
      },
    ],
  }).map(nullToUndefined),
  contact: Value.text({
    name: 'Admin Contact URI',
    description: 'Contact URI of the relay administrator',
    required: false,
    default: null,
    placeholder: 'mailto:contact@example.com',
  }).map(nullToUndefined),
})

export const configureInfo = sdk.Action.withInput(
  // id
  'configure-info',

  // metadata
  async ({ effects }) => ({
    name: 'General Information',
    description: 'Provide basic information about your Nostr relay',
    warning: null,
    allowedStatuses: 'any',
    group: 'configure',
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => configToml.read.const(effects).then((d) => d?.info),

  // the execution function
  async ({ effects, input }) => configToml.merge({ info: input }),
)
