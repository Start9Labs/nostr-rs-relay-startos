import { Config } from '@start9labs/start-sdk/lib/config/builder/config'
import { Value } from '@start9labs/start-sdk/lib/config/builder/value'
import { List } from '@start9labs/start-sdk/lib/config/builder/list'
import { Variants } from '@start9labs/start-sdk/lib/config/builder/variants'

/**
 * Here you define the config specification that will ultimately present to the user as validated form inputs
 *
 * Most form controls are available, including text, textarea, number, toggle, select, multiselect, list, color, datetime, object (a subform), and union (a conditional subform)
 */

// private config
export const privateConfig = Config.of({
  pubkey_whitelist: Value.list(
    List.text(
      {
        name: 'Pubkey Whitelist (hex)',
        minLength: 1,
        description:
          'A list of pubkeys that are permitted to publish through your relay. A minimum, you need to enter your own Nostr hex (not npub) pubkey. Go to https://damus.io/key/ to convert from npub to hex.',
      },
      {
        placeholder: 'hex (not npub) pubkey',
        patterns: [
          {
            regex: '[0-9a-fA-F]{64}',
            description:
              'Must be a valid 64-digit hexadecimal value (ie a Nostr hex pubkey, not an npub). Go to https://damus.io/key/ to convert npub to hex.',
          },
        ],
      },
    ),
  ),
})

// public config
export const publicConfig = Config.of({
  info: Value.object(
    {
      name: 'Relay Info',
      description: 'General public info about your relay',
    },
    Config.of({
      name: Value.text({
        name: 'Relay Name',
        description: "Your relay's human-readable identifier",
        required: false,
        placeholder: "Bob's Public Relay",
        patterns: [
          {
            regex: '.{3,32}',
            description:
              'Must be at least 3 character and no more than 32 characters',
          },
        ],
      }),
      description: Value.text({
        name: 'Relay Description',
        description: 'A more detailed description for your relay',
        required: false,
        placeholder: 'The best relay in town',
        patterns: [
          {
            regex: '.{6,256}',
            description:
              'Must be at least 6 character and no more than 256 characters',
          },
        ],
      }),
      pubkey: Value.text({
        name: 'Admin contact pubkey (hex)',
        description:
          'The Nostr hex (not npub) pubkey of the relay administrator',
        required: false,
        placeholder: 'hex (not npub) pubkey',
        patterns: [
          {
            regex: '[0-9a-fA-F]{64}',
            description:
              'Must be a valid 64-digit hexadecimal value (ie a Nostr hex pubkey, not an npub). Go to https://damus.io/key/ to convert npub to hex.',
          },
        ],
      }),
      contact: Value.text({
        name: 'Admin contact email',
        description: 'The email address of the relay administrator',
        required: false,
        patterns: [
          {
            regex: '[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+',
            description: 'Must be a valid email address.',
          },
        ],
        inputmode: 'email',
      }),
    }),
  ),
  limits: Value.object(
    {
      name: 'Limits',
      description:
        'Data limits to protect your relay from using too many resources',
    },
    Config.of({
      messages_per_sec: Value.number({
        name: 'Messages Per Second Limit',
        description:
          'Limit events created per second, averaged over one minute. Note: this is for the server as a whole, not per connection.',
        required: { default: 2 },
        min: 1,
        integer: true,
        units: 'msgs/sec',
      }),
      subscriptions_per_min: Value.number({
        name: 'Subscriptions Per Minute Limit',
        description:
          'Limit client subscriptions created per second, averaged over one minute. Strongly recommended to set this to a low value such as 10 to ensure fair service.',
        required: { default: 10 },
        min: 1,
        integer: true,
        units: 'subs/min',
      }),
      max_blocking_threads: Value.number({
        name: 'Max Blocking Threads',
        description:
          'Maximum number of blocking threads used for database connections.',
        required: { default: 16 },
        integer: true,
        min: 1,
        units: 'threads',
      }),
      max_event_bytes: Value.number({
        name: 'Max Event Size',
        description:
          'Limit the maximum size of an EVENT message. Set to 0 for unlimited',
        required: { default: 131_072 },
        integer: true,
        min: 1,
        units: 'bytes',
      }),
      max_ws_message_bytes: Value.number({
        name: 'Max Websocket Message Size',
        description: 'Maximum WebSocket message in bytes.',
        required: { default: 131_072 },
        integer: true,
        min: 1,
        units: 'bytes',
      }),
      max_ws_frame_bytes: Value.number({
        name: 'Max Websocket Frame Size',
        description: 'Maximum WebSocket frame size in bytes.',
        required: { default: 131_072 },
        integer: true,
        min: 1,
        units: 'bytes',
      }),
      event_kind_blacklist: Value.list(
        List.number(
          {
            name: 'Event Kind Blacklist',
            description:
              'Events with these kinds will be discarded. For a list of event kinds, see here: https://github.com/nostr-protocol/nips#event-kinds',
          },
          {
            integer: true,
            min: 1,
            placeholder: '30023',
          },
        ),
      ),
    }),
  ),
})

// combined union config - private or public
export const configSpec = Config.of({
  relayType: Value.union(
    {
      name: 'Relay Type',
      description:
        'Private or public. A private relay (highly recommended) restricts write access to specific pubkeys. Anyone can write to a public relay.',
      warning:
        'Running a public relay carries risk. Your relay can be spammed, resulting in large amounts of disk usage.',
      required: { default: null },
    },
    Variants.of({
      private: { name: 'Private', spec: privateConfig },
      public: { name: 'Public', spec: publicConfig },
    }),
  ),
})

// This line is necessary to satisfy Typescript. Do not touch it
export type ConfigSpec = typeof configSpec.validator._TYPE
