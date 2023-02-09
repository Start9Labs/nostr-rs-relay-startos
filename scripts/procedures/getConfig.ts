import { compat } from "../deps.ts";

export const [getConfig, setConfigMatcher] = compat.getConfigAndMatcher({
  "tor-address": {
    "name": "Tor Address",
    "description": "The Tor address for the websocket server.",
    "type": "pointer",
    "subtype": "package",
    "package-id": "nostr",
    "target": "tor-address",
    "interface": "websocket"
  },
  "lan-address": {
    "name": "Tor Address",
    "description": "The LAN address for the websocket server.",
    "type": "pointer",
    "subtype": "package",
    "package-id": "nostr",
    "target": "lan-address",
    "interface": "websocket"
  },
  "info": {
    "name": "Relay Info",
    "description": "General public info about your relay",
    "type": "object",
    "nullable": true,
    "spec": {
      "name": {
        "name": "Relay Name",
        "description": "Your relay's human-readable identifier",
        "type": "string",
        "nullable": true,
        "pattern": ".{1,32}",
        "pattern-description":
          "Must be at least 1 character and no more than 32 characters",
      },
      "description": {
        "name": "Relay Description",
        "description": "A more detailed description for your relay",
        "type": "string",
        "nullable": true,
        "pattern": ".{1,256}",
        "pattern-description":
          "Must be at least 1 character and no more than 256 characters",
      },
      "pubkey": {
        "name": "Administrative contact pubkey (hex)",
        "description": "The NOSTR account hex pubkey of the relay administrator",
        "type": "string",
        "nullable": true,
        "pattern": "[0-9a-fA-F]{64}",
        "pattern-description": "Must be a valid 64-digit hexadecimal value (ie a NOSTR hex pubkey, not an npub).",
      },
      "contact": {
        "name": "Administrative contact email",
        "description": "The email address of the relay administrator",
        "type": "string",
        "nullable": true,
        "pattern": "[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+",
        "pattern-description": "Must be a valid email address.",
      },
    },
  },
  "limits": {
    "name": "Limits",
    "description": "Data limits to protect your relay from using too many resources",
    "type": "object",
    "nullable": true,
    "spec": {
      "messages_per_sec": {
        "name": "Messages Per Second Limit",
        "description": "Limit events created per second, averaged over one minute. Note: this is for the server as a whole, not per connection.",
        "type": "number",
        "nullable": true,
        "range": "[0,*)",
        "integral": true,
        "default": 1,
        "units": "messages"
      },
      "subscriptions_per_min": {
        "name": "Subscriptions Per Minute Limit",
        "description": "Limit client subscriptions created per second, averaged over one minute. Strongly recommended to set this to a low value such as 10 to ensure fair service.",
        "type": "number",
        "nullable": true,
        "range": "[0,*)",
        "integral": true,
        "default": 10,
        "units": "subscriptions"
      },
      "max_blocking_threads": {
        "name": "Max Blocking Threads",
        "description": "Limit blocking threads used for database connections.  Defaults to 16.",
        "type": "number",
        "nullable": true,
        "range": "[0,*)",
        "integral": true,
        "units": "threads"
      },
      "max_event_bytes": {
        "name": "Max Event Size (Bytes)",
        "description": "Limit the maximum size of an EVENT message.  Defaults to 128 KB.",
        "type": "number",
        "nullable": true,
        "range": "[0,*)",
        "integral": true,
        "units": "bytes"
      },
      "max_ws_message_bytes": {
        "name": "Max Websocket Message Size (Bytes)",
        "description": "Maximum WebSocket message in bytes.  Defaults to 128 KB",
        "type": "number",
        "nullable": true,
        "range": "[0,*)",
        "integral": true,
        "units": "bytes"
      },
      "max_ws_frame_bytes": {
        "name": "Max Websocket Frame Size (Bytes)",
        "description": "Maximum WebSocket frame size in bytes.  Defaults to 128 KB",
        "type": "number",
        "nullable": true,
        "range": "[0,*)",
        "integral": true,
        "units": "bytes"
      },
      "event_kind_blacklist": {
        "name": "Event Kind Blacklist",
        "description": "Events with these kinds will be discarded.",
        "type": "list",
        "nullable": true,
        "range": "[0,*)",
        "subtype": "string",
        "spec": {
          "masked": false,
          "copyable": true,
          "placeholder": "70202"
        },
        "default": Array<string>() // [] as string []
      },
    },
  },
  "authorization": {
    "name": "Authorization",
    "description": "Configure who is allowed to publish events to your relay",
    "type": "object",
    "nullable": true,
    "spec": {
      "pubkey_whitelist": {
        "name": "Pubkey Whitelist (Hex)",
        "description": "Hex pubkeys in this array are whitelisted for event publishing. Only valid events by these authors will be accepted, if the variable is set.",
        "type": "list",
        "nullable": true,
        "range": "[0,*)",
        "subtype": "string",
        "spec": {
          "masked": false,
          "copyable": true,
          "placeholder": "35d26e4690cbe1a898af61cc3515661eb5fa763b57bd0b42e45099c8b32fd50f",
          "pattern": "[0-9a-fA-F]{64}",
          "pattern-description": "Must be a valid 64-digit hexadecimal value (ie a NOSTR hex pubkey, not an npub).",
        },
        "default": Array<string>() // [] as string []
      },
    },
  },
} as const);

export type SetConfig = typeof setConfigMatcher._TYPE
