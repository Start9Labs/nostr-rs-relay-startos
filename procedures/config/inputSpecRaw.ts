import { InputSpecRaw } from "start-sdk/lib/config/configTypesRaw"

export const spec: InputSpecRaw = {
  relayType: {
    type: "union",
    name: "Relay Type",
    warning: "Running a public relay carries risk. Your relay can be spammed, resulting in large amounts of disk usage.",
    description: "Private or public. A private relay (highly recommended) restricts write access to specific pubkeys. Anyone can write to a public relay.",
    required: false,
    variants: {
      private: {
        name: "Private",
        spec: {
          pubkey_whitelist: {
            type: "list",
            name: "Pubkey Whitelist (hex)",
            description: "A list of pubkeys that are permitted to publish through your relay. A minimum, you need to enter your own Nostr hex (not npub) pubkey. Go to https://damus.io/key/ to convert from npub to hex.",
            range: "[1,*)",
            spec: {
              type: "string",
              placeholder: "hex (not npub) pubkey",
              pattern: "[0-9a-fA-F]{64}",
              patternDescription: "Must be a valid 64-digit hexadecimal value (ie a Nostr hex pubkey, not an npub). Go to https://damus.io/key/ to convert npub to hex.",
            },
          },
        }
      },
      public: {
        name: "Public",
        spec: {
          info: {
            name: "Relay Info",
            description: "General public info about your relay",
            type: "object",
            spec: {
              name: {
                type: "string",
                name: "Relay Name",
                description: "Your relay's human-readable identifier",
                required: false,
                placeholder: "Bob's Public Relay",
                pattern: ".{3,32}",
                patternDescription: "Must be at least 3 character and no more than 32 characters",
              },
              description: {
                type: "string",
                name: "Relay Description",
                description: "A more detailed description for your relay",
                required: false,
                placeholder: "The best relay in town",
                pattern: ".{6,256}",
                patternDescription: "Must be at least 6 character and no more than 256 characters",
              },
              pubkey: {
                type: "string",
                name: "Admin contact pubkey (hex)",
                description: "The Nostr hex (not npub) pubkey of the relay administrator",
                required: false,
                placeholder: "hex (not npub) pubkey",
                pattern: "[0-9a-fA-F]{64}",
                patternDescription: "Must be a valid 64-digit hexadecimal value (ie a Nostr hex pubkey, not an npub). Go to https://damus.io/key/ to convert npub to hex.",
              },
              contact: {
                type: "string",
                name: "Admin contact email",
                description: "The email address of the relay administrator",
                required: false,
                pattern: "[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+",
                patternDescription: "Must be a valid email address.",
              },
            },
          },
          limits: {
            type: "object",
            name: "Limits",
            description: "Data limits to protect your relay from using too many resources",
            spec: {
              messages_per_sec: {
                type: "number",
                name: "Messages Per Second Limit",
                description: "Limit events created per second, averaged over one minute. Note: this is for the server as a whole, not per connection.",
                required: true,
                range: "[1,*)",
                integral: true,
                default: 2,
                units: "messages/sec",
              },
              subscriptions_per_min: {
                name: "Subscriptions Per Minute Limit",
                description: "Limit client subscriptions created per second, averaged over one minute. Strongly recommended to set this to a low value such as 10 to ensure fair service.",
                type: "number",
                required: true,
                range: "[1,*)",
                integral: true,
                default: 10,
                units: "subscriptions",
              },
              max_blocking_threads: {
                name: "Max Blocking Threads",
                description: "Maximum number of blocking threads used for database connections.",
                type: "number",
                required: true,
                range: "[0,*)",
                integral: true,
                units: "threads",
                default: 16,
              },
              max_event_bytes: {
                name: "Max Event Size",
                description: "Limit the maximum size of an EVENT message. Set to 0 for unlimited",
                type: "number",
                required: true,
                range: "[0,*)",
                integral: true,
                units: "bytes",
                default: 131072,
              },
              max_ws_message_bytes: {
                name: "Max Websocket Message Size",
                description: "Maximum WebSocket message in bytes.",
                type: "number",
                required: true,
                range: "[0,*)",
                integral: true,
                units: "bytes",
                default: 131072,
              },
              max_ws_frame_bytes: {
                name: "Max Websocket Frame Size",
                description: "Maximum WebSocket frame size in bytes.",
                type: "number",
                required: true,
                range: "[0,*)",
                integral: true,
                units: "bytes",
                default: 131072,
              },
              event_kind_blacklist: {
                type: "list",
                name: "Event Kind Blacklist",
                description: "Events with these kinds will be discarded. For a list of event kinds, see here: https://github.com/nostr-protocol/nips#event-kinds",
                spec: {
                  type: "number",
                  integral: true,
                  placeholder: '30023',
                },
              },
            },
          },
        }
      },
    },
  },
}
