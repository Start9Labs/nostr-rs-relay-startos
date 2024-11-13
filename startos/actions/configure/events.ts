import { configToml } from '../../file-models/config.toml'
import { sdk } from '../../sdk'

const { InputSpec, Value, List, Variants } = sdk

// whitelist spec
const whitelistSpec = InputSpec.of({
  event_kind_allowlist: Value.list(
    List.text(
      {
        name: 'Permitted Events',
        description:
          'These events will be permitted. All others will be prohibited and discarded. For a list of event kinds, see here: https://github.com/nostr-protocol/nips#event-kinds',
      },
      {
        patterns: [
          {
            regex: '^[0-9]+$',
            description: 'Event kinds must only contain numbers',
          },
        ],
        placeholder: '30023',
      },
    ),
  ),
})

// blacklist spec
const blacklistSpec = InputSpec.of({
  event_kind_blacklist: Value.list(
    List.text(
      {
        name: 'Prohibited Events',
        description:
          'These events will be prohibited and discarded. All others will be permitted. For a list of event kinds, see here: https://github.com/nostr-protocol/nips#event-kinds',
      },
      {
        patterns: [
          {
            regex: '^[0-9]+$',
            description: 'Event kinds must only contain numbers',
          },
        ],
        placeholder: '30023',
      },
    ),
  ),
})

// input spec
export const inputSpec = InputSpec.of({
  type: Value.union(
    {
      name: 'List Type',
      default: 'blacklist',
      description:
        'Decide whether to create a whitelist or blacklist of event kinds. For a list of event kinds, see here: https://github.com/nostr-protocol/nips#event-kinds',
    },
    Variants.of({
      whitelist: {
        name: 'Whitelist',
        spec: whitelistSpec,
        description:
          'A list of event types to permit. All others will be prohibited',
      },
      blacklist: {
        name: 'Blacklist',
        spec: blacklistSpec,
        description:
          'A list of event types to prohibit. All others will be permitted',
      },
    }),
  ),
})

export const configureEvents = sdk.Action.withInput(
  // id
  'configure-events',

  // metadata
  async ({ effects }) => ({
    name: 'Events',
    description: 'Decide which events are permitted or prohibited',
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
    const limits = (await configToml.read.const(effects))?.limits
    if (!limits) return

    return {
      type: limits.event_kind_allowlist?.length
        ? {
            selection: 'whitelist',
            value: {
              event_kind_allowlist: limits.event_kind_allowlist.map(String),
            },
          }
        : {
            selection: 'blacklist',
            value: {
              event_kind_blacklist:
                limits.event_kind_blacklist?.map(String) || [],
            },
          },
    }
  },

  // the execution function
  async ({ effects, input }) =>
    configToml.merge({
      limits:
        input.type.selection === 'whitelist'
          ? {
              event_kind_allowlist:
                input.type.value.event_kind_allowlist.map(Number),
              event_kind_blacklist: undefined,
            }
          : {
              event_kind_blacklist:
                input.type.value.event_kind_blacklist.map(Number),
              event_kind_allowlist: undefined,
            },
    }),
)
