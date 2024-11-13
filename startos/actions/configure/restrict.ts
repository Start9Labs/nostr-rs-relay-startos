import { Patterns } from '@start9labs/start-sdk/base/lib/util'
import { configToml } from '../../file-models/config.toml'
import { sdk } from '../../sdk'

const { InputSpec, Value, List, Variants } = sdk

// domain whitelist spec
const domainWhitelistSpec = InputSpec.of({
  domain_whitelist: Value.list(
    List.text(
      {
        name: 'Permitted Domains',
        description:
          'Domain names that are allowed to publish events. If defined, only events NIP-05 verified authors at these domains are persisted',
      },
      {
        patterns: [Patterns.hostname],
        placeholder: 'start9.com',
      },
    ),
  ),
})

// domain blacklist spec
const domainBlacklistSpec = InputSpec.of({
  domain_blacklist: Value.list(
    List.text(
      {
        name: 'Prohibited Domains',
        description:
          'Domain names that will be prevented from publishing events',
      },
      {
        patterns: [Patterns.hostname],
        placeholder: 'bitcoin.com',
      },
    ),
  ),
})

// input spec
export const inputSpec = InputSpec.of({
  verified_users: Value.object(
    {
      name: 'Verified Users (NIP-05)',
    },
    InputSpec.of({
      mode: Value.select({
        name: 'Mode',
        description:
          'NIP-05 verification of users. Can be "enabled" to require NIP-05 metadata for event authors, "passive" to perform validation but never block publishing, or "disabled" to do nothing',
        default: 'disabled',
        values: {
          disabled: 'Disabled',
          enabled: 'Enabled',
          passive: 'Passive',
        },
      }),
      domains_union: Value.union(
        {
          name: 'Domain Permissions',
          description:
            'Permit all domains, or whitelist/blacklist certain domains',
          default: 'all',
        },
        Variants.of({
          all: {
            name: 'Permit all Domains',
            spec: InputSpec.of({}),
          },
          domain_whitelist: {
            name: 'Domain Whitelist',
            spec: domainWhitelistSpec,
            description:
              'Create a list of permitted domains. All others will be prohibited',
          },
          domain_blacklist: {
            name: 'Domain Blacklist',
            spec: domainBlacklistSpec,
            description:
              'Create a list of prohibited domains. All others will be permitted',
          },
        }),
      ),
      verify_expiration: Value.text({
        name: 'Verify Expiration',
        description:
          'Consider an pubkey "verified" if we have a successful validation from the NIP-05 domain within this amount of time.  Note, if the domain provides a successful response that omits the account, verification is immediately revoked',
        required: false,
        default: null,
        patterns: [], // enforce "number unit"
      }),
      verify_update_frequency: Value.text({
        name: 'Verify Update Frequency',
        description:
          'How long to wait between verification attempts for a specific author',
        required: false,
        default: null,
        patterns: [], // enforce "number unit"
      }),
      max_consecutive_failures: Value.number({
        name: 'Max Consecutive Failures',
        description:
          'How many consecutive failed checks before we give up on verifying an author',
        required: false,
        default: 20,
        integer: true,
        min: 1,
      }),
    }),
  ),
  pubkey_whitelist: Value.list(
    List.text(
      {
        name: 'Authorized Pubkeys',
        description:
          'A list of public keys (in hex format) that are permitted to publish to the relay. Go to https://damus.io/key/ to convert from npub to hex',
      },
      {
        placeholder: 'hex pubkey (not npub)',
        patterns: [
          {
            regex: '[0-9a-fA-F]{64}',
            description:
              'Hexadecimal format required. Go to https://damus.io/key/ to convert an npub to hex',
          },
        ],
      },
    ),
  ),
})

export const configureRestrict = sdk.Action.withInput(
  // id
  'configure-restrict',

  // metadata
  async ({ effects }) => ({
    name: 'Restrict Access',
    description: 'Limit relay usage to verified or authorized users',
    warning: null,
    allowedStatuses: 'any',
    group: 'configure',
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async function ({
    effects,
  }): Promise<typeof inputSpec.validator._TYPE | void> {
    const data = await configToml.read.const(effects)
    if (!data) return

    const { verified_users, authorization } = data
    if (!verified_users || !authorization) return

    // @TODO handle "all" type

    return {
      verified_users: {
        ...verified_users,
        domains_union: verified_users.domain_whitelist?.length
          ? {
              selection: 'domain_whitelist',
              value: {
                domain_whitelist: verified_users.domain_whitelist,
              },
            }
          : {
              selection: 'domain_blacklist',
              value: {
                domain_blacklist: verified_users.domain_blacklist || [],
              },
            },
      },
      pubkey_whitelist: authorization.pubkey_whitelist,
    }
  },

  // the execution function
  async ({ effects, input }) => {
    const { domains_union, ...verified_users } = input.verified_users

    // @TODO handle "all" type

    return configToml.merge({
      verified_users: {
        ...verified_users,
        ...domains_union.value,
      },
      authorization: { pubkey_whitelist: input.pubkey_whitelist },
    })
  },
)
