import { Patterns } from '@start9labs/start-sdk/base/lib/util'
import { configToml } from '../fileModels/config.toml'
import { sdk } from '../sdk'
import { i18n } from '../i18n'

const { InputSpec, Value, List, Variants } = sdk

// domain whitelist spec
const domainWhitelistSpec = InputSpec.of({
  domain_whitelist: Value.list(
    List.text(
      {
        name: i18n('Permitted Domains'),
        description: i18n(
          'Domain names that are allowed to publish events. If defined, only events NIP-05 verified authors at these domains are persisted',
        ),
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
        name: i18n('Prohibited Domains'),
        description: i18n(
          'Domain names that will be prevented from publishing events',
        ),
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
      name: i18n('Verified Users (NIP-05)'),
    },
    InputSpec.of({
      mode: Value.select({
        name: i18n('Mode'),
        description: i18n(
          'NIP-05 verification of users. Can be "enabled" to require NIP-05 metadata for event authors, "passive" to perform validation but never block publishing, or "disabled" to do nothing',
        ),
        default: 'disabled',
        values: {
          disabled: i18n('Disabled'),
          enabled: i18n('Enabled'),
          passive: i18n('Passive'),
        },
      }),
      domains_union: Value.union({
        name: i18n('Domain Permissions'),
        description: i18n(
          'Permit all domains, or whitelist/blacklist certain domains',
        ),
        default: 'all',
        variants: Variants.of({
          all: {
            name: i18n('Permit all Domains'),
            spec: InputSpec.of({}),
          },
          domain_whitelist: {
            name: i18n('Domain Whitelist'),
            spec: domainWhitelistSpec,
            description: i18n(
              'Create a list of permitted domains. All others will be prohibited',
            ),
          },
          domain_blacklist: {
            name: i18n('Domain Blacklist'),
            spec: domainBlacklistSpec,
            description: i18n(
              'Create a list of prohibited domains. All others will be permitted',
            ),
          },
        }),
      }),
      verify_expiration: Value.text({
        name: i18n('Verify Expiration'),
        description: i18n(
          'Consider an pubkey "verified" if we have a successful validation from the NIP-05 domain within this amount of time. Note, if the domain provides a successful response that omits the account, verification is immediately revoked. Value must be in the form of "1 week" or "2 days" or "12 hours"',
        ),
        required: false,
        default: null,
        patterns: [], // enforce "number unit", e.g. "2 weeks"
      }),
      verify_update_frequency: Value.text({
        name: i18n('Verify Update Frequency'),
        description: i18n(
          'How long to wait between verification attempts for a specific author. Value must be in the form of "1 week" or "2 days" or "12 hours"',
        ),
        required: false,
        default: null,
        patterns: [], // enforce "number unit", e.g. "2 weeks"
      }),
      max_consecutive_failures: Value.number({
        name: i18n('Max Consecutive Failures'),
        description: i18n(
          'How many consecutive failed checks before we give up on verifying an author',
        ),
        required: false,
        default: null,
        integer: true,
        min: 1,
        placeholder: '20',
      }),
    }),
  ),
  pubkey_whitelist: Value.list(
    List.text(
      {
        name: i18n('Authorized Pubkeys'),
        description: i18n(
          'A list of public keys (in hex format) that are permitted to publish to the relay. Go to https://damus.io/key/ to convert from npub to hex',
        ),
      },
      {
        placeholder: 'hex pubkey (not npub)',
        patterns: [
          {
            regex: '[0-9a-fA-F]{64}',
            description: i18n(
              'Hexadecimal format required. Go to https://damus.io/key/ to convert an npub to hex',
            ),
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
    name: i18n('Restrict Access'),
    description: i18n('Limit relay usage to verified or authorized users'),
    warning: null,
    allowedStatuses: 'any',
    group: 'configure',
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async function ({ effects }) {
    const data = await configToml.read().once()
    if (!data) return

    const { verified_users, authorization } = data
    if (!verified_users || !authorization) return

    return {
      verified_users: {
        ...verified_users,
        domains_union: verified_users.domain_whitelist?.length
          ? {
              selection: 'domain_whitelist' as const,
              value: {
                domain_whitelist: verified_users.domain_whitelist,
              },
            }
          : verified_users.domain_blacklist?.length
            ? {
                selection: 'domain_blacklist' as const,
                value: {
                  domain_blacklist: verified_users.domain_blacklist,
                },
              }
            : {
                selection: 'all' as const,
                value: {},
              },
      },
      pubkey_whitelist: authorization.pubkey_whitelist,
    }
  },

  // the execution function
  async ({ effects, input }) => {
    const { domains_union, ...verified_users } = input.verified_users

    return configToml.merge(effects, {
      verified_users: {
        ...Object.fromEntries(
          Object.entries(verified_users).map(([key, value]) => [
            key,
            value === null ? undefined : value,
          ]),
        ),
        ...(domains_union.selection === 'domain_whitelist'
          ? {
              domain_whitelist: domains_union.value.domain_whitelist,
              domain_blacklist: undefined,
            }
          : domains_union.selection === 'domain_blacklist'
            ? {
                domain_whitelist: undefined,
                domain_blacklist: domains_union.value.domain_blacklist,
              }
            : {
                domain_whitelist: undefined,
                domain_blacklist: undefined,
              }),
      },
      authorization: { pubkey_whitelist: input.pubkey_whitelist },
    })
  },
)
