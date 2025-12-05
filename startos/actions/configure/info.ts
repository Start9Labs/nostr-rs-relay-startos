import { utils } from '@start9labs/start-sdk'
import { configToml } from '../../fileModels/config.toml'
import { sdk } from '../../sdk'
import { relayInterfaceId } from '../../utils'

const { InputSpec, Value } = sdk

// input spec
export const inputSpec = InputSpec.of({
  relay_url: getExternalAddresses().map((val) =>
    val === 'none' ? undefined : val,
  ),
  name: Value.text({
    name: 'Name',
    description: "Your relay's human-readable name",
    required: false,
    default: null,
    placeholder: 'My Public Relay',
    minLength: 3,
    maxLength: 32,
  }),
  description: Value.text({
    name: 'Description',
    description: 'A detailed description for your relay',
    required: false,
    default: null,
    placeholder: 'The best relay in town',
    minLength: 6,
    maxLength: 256,
  }),
  pubkey: Value.text({
    name: 'Admin Pubkey',
    description: 'The Nostr hex pubkey (not npub) of the relay administrator',
    required: false,
    default: null,
    placeholder: 'hex pubkey (not npub)',
    patterns: [
      {
        regex: '^[0-9a-fA-F]{64}$',
        description:
          'Must be a valid 64-digit hexadecimal value (ie a Nostr hex pubkey, not an npub). Go to https://damus.io/key/ to convert npub to hex',
      },
    ],
  }),
  contact: Value.text({
    name: 'Admin Contact URI',
    description: 'Contact URI of the relay administrator',
    required: false,
    default: null,
    placeholder: 'mailto:contact@example.com',
    patterns: [
      {
        regex:
          '^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}(\\?[a-zA-Z0-9=&%+-]+)?$',
        description:
          'Must be a valid "mailto" contact URI, e.g. mailto:contact@example.com',
      },
    ],
  }),
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
  async ({ effects }) => configToml.read((c) => c.info).const(effects),

  // the execution function
  async ({ effects, input }) =>
    configToml.merge(effects, {
      info: Object.fromEntries(
        Object.entries(input).map(([key, value]) => [
          key,
          value === null ? undefined : value,
        ]),
      ),
    }),
)

export function getExternalAddresses() {
  return sdk.Value.dynamicSelect(async ({ effects }) => {
    const relay = await sdk.serviceInterface
      .getOwn(effects, relayInterfaceId)
      .const()

    const urls =
      relay?.addressInfo?.filter({
        visibility: 'public',
        kind: ['domain', 'ipv4', 'onion'],
      }) || []

    return {
      name: 'External Address',
      description:
        "Address at which your node can be reached by peers. Select 'None' if you do not want your node to be reached by peers.",
      values: urls.reduce((obj, url) => ({ ...obj, [url]: url }), {
        none: 'None',
      } as Record<string, string>),
      default: urls.find((u) => u.endsWith('.onion')) || '',
    }
  })
}
