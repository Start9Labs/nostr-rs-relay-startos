import { InputSpec } from "start-sdk/lib/config/configTypes";

export const spec: InputSpec = {
  relayType: {
    type: "union",
    name: "Relay Type",
    warning:
      "Running a public relay carries risk. Your relay can be spammed, resulting in large amounts of disk usage.",
    description:
      "Private or public. A private relay (highly recommended) restricts write access to specific pubkeys. Anyone can write to a public relay.",
    required: false,
    default: null,
    variants: {
      private: {
        name: "Private",
        spec: {
          pubkey_whitelist: {
            type: "list",
            name: "Pubkey Whitelist (hex)",
            description:
              "A list of pubkeys that are permitted to publish through your relay. A minimum, you need to enter your own Nostr hex (not npub) pubkey. Go to https://damus.io/key/ to convert from npub to hex.",

            maxLength: null,
            minLength: null,
            default: [],
            warning: null,
            spec: {
              type: "text",
              inputmode: "text",
              masked: false,
              placeholder: "hex (not npub) pubkey",
              patterns: [
                {
                  regex: "[0-9a-fA-F]{64}",
                  description:
                    "Must be a valid 64-digit hexadecimal value (ie a Nostr hex pubkey, not an npub). Go to https://damus.io/key/ to convert npub to hex.",
                },
              ],
              maxLength: null,
              minLength: 0,
            },
          },
        },
      },
      public: {
        name: "Public",
        spec: {
          info: {
            name: "Relay Info",
            description: "General public info about your relay",
            type: "object",
            warning: null,
            spec: {
              name: {
                type: "text",
                name: "Relay Name",
                description: "Your relay's human-readable identifier",
                required: false,
                placeholder: "Bob's Public Relay",
                patterns: [
                  { regex: ".{3,32}", description: "Must be at least 3 character and no more than 32 characters" },
                ],
                masked: false,
                default: null,
                inputmode: "text",
                warning: null,
                maxLength: null,
                minLength: 0,
              },
              description: {
                type: "text",
                name: "Relay Description",
                description: "A more detailed description for your relay",
                required: false,
                placeholder: "The best relay in town",
                patterns: [
                  { regex: ".{6,256}", description: "Must be at least 6 character and no more than 256 characters" },
                ],
                masked: false,
                default: null,
                inputmode: "text",
                warning: null,
                minLength: 0,
                maxLength: null,
              },
              pubkey: {
                type: "text",
                name: "Admin contact pubkey (hex)",
                description: "The Nostr hex (not npub) pubkey of the relay administrator",
                required: false,
                placeholder: "hex (not npub) pubkey",
                patterns: [
                  {
                    regex: "[0-9a-fA-F]{64}",
                    description:
                      "Must be a valid 64-digit hexadecimal value (ie a Nostr hex pubkey, not an npub). Go to https://damus.io/key/ to convert npub to hex.",
                  },
                ],
                masked: false,
                default: null,
                inputmode: "text",
                warning: null,
                maxLength: null,
                minLength: 0,
              },
              contact: {
                type: "text",
                name: "Admin contact email",
                description: "The email address of the relay administrator",
                required: false,
                patterns: [
                  {
                    regex: "[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+",
                    description: "Must be a valid email address.",
                  },
                ],
                masked: false,
                default: null,
                inputmode: "text",
                warning: null,
                placeholder: null,
                maxLength: null,
                minLength: null,
              },
            },
          },
          limits: {
            type: "object",
            name: "Limits",
            description: "Data limits to protect your relay from using too many resources",
            warning: null,
            spec: {
              messages_per_sec: {
                type: "number",
                name: "Messages Per Second Limit",
                description:
                  "Limit events created per second, averaged over one minute. Note: this is for the server as a whole, not per connection.",
                required: true,

                max: null,
                min: 1,
                step: null,
                integer: true,
                default: 2,
                units: "messages/sec",
                placeholder: null,
                warning: null,
              },
              subscriptions_per_min: {
                name: "Subscriptions Per Minute Limit",
                description:
                  "Limit client subscriptions created per second, averaged over one minute. Strongly recommended to set this to a low value such as 10 to ensure fair service.",
                type: "number",
                required: true,

                max: null,
                min: null,
                step: null,
                integer: true,
                default: 10,
                units: "subscriptions",
                placeholder: null,
                warning: null,
              },
              max_blocking_threads: {
                name: "Max Blocking Threads",
                description: "Maximum number of blocking threads used for database connections.",
                type: "number",
                required: true,

                max: null,
                min: null,
                step: null,
                integer: true,
                units: "threads",
                default: 16,
                placeholder: null,
                warning: null,
              },
              max_event_bytes: {
                name: "Max Event Size",
                description: "Limit the maximum size of an EVENT message. Set to 0 for unlimited",
                type: "number",
                required: true,

                max: null,
                min: null,
                step: null,
                integer: true,
                units: "bytes",
                default: 131072,
                placeholder: null,
                warning: null,
              },
              max_ws_message_bytes: {
                name: "Max Websocket Message Size",
                description: "Maximum WebSocket message in bytes.",
                type: "number",
                required: true,
                max: null,
                min: null,
                step: null,
                integer: true,
                units: "bytes",
                default: 131072,
                placeholder: null,
                warning: null,
              },
              max_ws_frame_bytes: {
                name: "Max Websocket Frame Size",
                description: "Maximum WebSocket frame size in bytes.",
                type: "number",
                required: true,

                max: null,
                min: null,
                step: null,
                integer: true,
                units: "bytes",
                default: 131072,
                placeholder: null,
                warning: null,
              },
              event_kind_blacklist: {
                type: "list",
                name: "Event Kind Blacklist",
                description:
                  "Events with these kinds will be discarded. For a list of event kinds, see here: https://github.com/nostr-protocol/nips#event-kinds",

                maxLength: null,
                minLength: 0,
                default: [],
                warning: null,
                spec: {
                  type: "number",
                  integer: true,
                  placeholder: "30023",
                  max: null,
                  min: null,
                  step: null,
                  units: null,
                },
              },
            },
          },
        },
      },
    },
  },
};
