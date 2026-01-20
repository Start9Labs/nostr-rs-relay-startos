import { configToml } from '../../fileModels/config.toml'
import { sdk } from '../../sdk'
import { i18n } from '../../i18n'

const { InputSpec, Value, List, Variants } = sdk

// whitelist spec
const whitelistSpec = InputSpec.of({
  event_kind_allowlist: Value.list(
    List.text(
      {
        name: i18n('Permitted Events'),
        description: i18n(
          'These events will be permitted. All others will be prohibited and discarded. For a list of event kinds, see here: https://github.com/nostr-protocol/nips#event-kinds',
        ),
      },
      {
        patterns: [
          {
            regex: '^[0-9]+$',
            description: i18n('Event kinds must only contain numbers'),
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
        name: i18n('Prohibited Events'),
        description: i18n(
          'These events will be prohibited and discarded. All others will be permitted. For a list of event kinds, see here: https://github.com/nostr-protocol/nips#event-kinds',
        ),
      },
      {
        patterns: [
          {
            regex: '^[0-9]+$',
            description: i18n('Event kinds must only contain numbers'),
          },
        ],
        placeholder: '30023',
      },
    ),
  ),
})

// input spec
export const inputSpec = InputSpec.of({
  type: Value.union({
    name: i18n('Permitted Event Types'),
    default: 'all',
    description: i18n(
      'Permit all event kinds, or create a whitelist or blacklist certain event kinds. For a list of event kinds, see here: https://github.com/nostr-protocol/nips#event-kinds',
    ),
    variants: Variants.of({
      all: {
        name: i18n('Permit all Event Types'),
        spec: InputSpec.of({}),
      },
      whitelist: {
        name: i18n('Event Type Whitelist'),
        spec: whitelistSpec,
        description: i18n(
          'A list of event types to permit. All others will be prohibited',
        ),
      },
      blacklist: {
        name: i18n('Event Type Blacklist'),
        spec: blacklistSpec,
        description: i18n(
          'A list of event types to prohibit. All others will be permitted',
        ),
      },
    }),
  }),
})

export const configureEvents = sdk.Action.withInput(
  // id
  'configure-events',

  // metadata
  async ({ effects }) => ({
    name: i18n('Permitted Events'),
    description: i18n('Decide which events are permitted or prohibited'),
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
    const limits = await configToml.read((c) => c.limits).once()
    if (!limits) return

    return {
      type: limits.event_kind_allowlist?.length
        ? {
            selection: 'whitelist',
            value: {
              event_kind_allowlist: limits.event_kind_allowlist.map(String),
            },
          }
        : limits.event_kind_blacklist?.length
          ? {
              selection: 'blacklist',
              value: {
                event_kind_blacklist: limits.event_kind_blacklist.map(String),
              },
            }
          : {
              selection: 'all',
              value: {},
            },
    }
  },

  // the execution function
  async ({ effects, input }) =>
    configToml.merge(effects, {
      limits:
        input.type.selection === 'whitelist'
          ? {
              event_kind_allowlist:
                input.type.value.event_kind_allowlist.map(Number),
              event_kind_blacklist: undefined,
            }
          : input.type.selection === 'blacklist'
            ? {
                event_kind_allowlist: undefined,
                event_kind_blacklist:
                  input.type.value.event_kind_blacklist.map(Number),
              }
            : {
                event_kind_allowlist: undefined,
                event_kind_blacklist: undefined,
              },
    }),
)
