import { configBuilder } from "start-sdk";
const { Config, Value, List, Variants } = configBuilder;

export const pubkeyWhitelistHexList = List.string({
  name: "Pubkey Whitelist (hex)",
  range: "[1,*)",
  spec: {
    masked: null,
    placeholder: "hex (not npub) pubkey",
    pattern: "[0-9a-fA-F]{64}",
    "pattern-description":
      "Must be a valid 64-digit hexadecimal value (ie a Nostr hex pubkey, not an npub). Go to https://damus.io/key/ to convert npub to hex.",
    textarea: false,
  },
  default: [],
  description:
    "A list of pubkeys that are permitted to publish through your relay. A minimum, you need to enter your own Nostr hex (not npub) pubkey. Go to https://damus.io/key/ to convert from npub to hex.",
  warning: null,
});
export const pubkeyWhitelist = Value.list(pubkeyWhitelistHexList);
export const personalConfig = Config.of({
  pubkey_whitelist: pubkeyWhitelist,
});
export const name = Value.string({
  name: "Relay Name",
  default: null,
  description: "Your relay's human-readable identifier",
  warning: null,
  nullable: true,
  masked: null,
  placeholder: "Bob's Public Relay",
  pattern: ".{3,32}",
  "pattern-description":
    "Must be at least 3 character and no more than 32 characters",
  textarea: null,
});
export const description = Value.string({
  name: "Relay Description",
  default: null,
  description: "A more detailed description for your relay",
  warning: null,
  nullable: true,
  masked: null,
  placeholder: "The best relay in town",
  pattern: ".{6,256}",
  "pattern-description":
    "Must be at least 6 character and no more than 256 characters",
  textarea: null,
});
export const pubkey = Value.string({
  name: "Admin contact pubkey (hex)",
  default: null,
  description: "The Nostr hex (not npub) pubkey of the relay administrator",
  warning: null,
  nullable: true,
  masked: null,
  placeholder: "hex (not npub) pubkey",
  pattern: "[0-9a-fA-F]{64}",
  "pattern-description":
    "Must be a valid 64-digit hexadecimal value (ie a Nostr hex pubkey, not an npub). Go to https://damus.io/key/ to convert npub to hex.",
  textarea: null,
});
export const contact = Value.string({
  name: "Admin contact email",
  default: null,
  description: "The email address of the relay administrator",
  warning: null,
  nullable: true,
  masked: null,
  placeholder: null,
  pattern: "[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+",
  "pattern-description": "Must be a valid email address.",
  textarea: null,
});
export const relayInfoSpec = Config.of({
  name: name,
  description: description,
  pubkey: pubkey,
  contact: contact,
});
export const info = Value.object({
  name: "Relay Info",
  description: "General public info about your relay",
  warning: null,
  default: null,
  "display-as": null,
  "unique-by": null,
  spec: relayInfoSpec,
  "value-names": {},
});
export const messagesPerSec = Value.number({
  name: "Messages Per Second Limit",
  default: 2,
  description:
    "Limit events created per second, averaged over one minute. Note: this is for the server as a whole, not per connection.",
  warning: null,
  nullable: false,
  range: "[1,*)",
  integral: true,
  units: "messages/sec",
  placeholder: null,
});
export const subscriptionsPerMin = Value.number({
  name: "Subscriptions Per Minute Limit",
  default: 10,
  description:
    "Limit client subscriptions created per second, averaged over one minute. Strongly recommended to set this to a low value such as 10 to ensure fair service.",
  warning: null,
  nullable: false,
  range: "[1,*)",
  integral: true,
  units: "subscriptions",
  placeholder: null,
});
export const maxBlockingThreads = Value.number({
  name: "Max Blocking Threads",
  default: 16,
  description:
    "Maximum number of blocking threads used for database connections.",
  warning: null,
  nullable: false,
  range: "[0,*)",
  integral: true,
  units: "threads",
  placeholder: null,
});
export const maxEventBytes = Value.number({
  name: "Max Event Size",
  default: 131072,
  description:
    "Limit the maximum size of an EVENT message. Set to 0 for unlimited",
  warning: null,
  nullable: false,
  range: "[0,*)",
  integral: true,
  units: "bytes",
  placeholder: null,
});
export const maxWsMessageBytes = Value.number({
  name: "Max Websocket Message Size",
  default: 131072,
  description: "Maximum WebSocket message in bytes.",
  warning: null,
  nullable: false,
  range: "[0,*)",
  integral: true,
  units: "bytes",
  placeholder: null,
});
export const maxWsFrameBytes = Value.number({
  name: "Max Websocket Frame Size",
  default: 131072,
  description: "Maximum WebSocket frame size in bytes.",
  warning: null,
  nullable: false,
  range: "[0,*)",
  integral: true,
  units: "bytes",
  placeholder: null,
});
export const eventKindBlacklistList = List.number({
  name: "Event Kind Blacklist",
  range: "[0,*)",
  spec: {
    range: "(0,100000]",
    integral: true,
    units: null,
    placeholder: "30023",
  },
  default: [],
  description:
    "Events with these kinds will be discarded. For a list of event kinds, see here: https://github.com/nostr-protocol/nips#event-kinds",
  warning: null,
});
export const eventKindBlacklist = Value.list(eventKindBlacklistList);
export const limitsSpec = Config.of({
  messages_per_sec: messagesPerSec,
  subscriptions_per_min: subscriptionsPerMin,
  max_blocking_threads: maxBlockingThreads,
  max_event_bytes: maxEventBytes,
  max_ws_message_bytes: maxWsMessageBytes,
  max_ws_frame_bytes: maxWsFrameBytes,
  event_kind_blacklist: eventKindBlacklist,
});
export const limits = Value.object({
  name: "Limits",
  description:
    "Data limits to protect your relay from using too many resources",
  warning: null,
  default: null,
  "display-as": null,
  "unique-by": null,
  spec: limitsSpec,
  "value-names": {},
});
export const publicConfig = Config.of({ info: info, limits: limits });
export const relayTypeVariants = Variants.of({
  private: personalConfig,
  public: publicConfig,
});
export const relayType = Value.union({
  name: "Relay Type",
  description: null,
  warning:
    "Running a public relay carries risk. Your relay can be spammed, resulting in large amounts of disk usage.",
  default: "private",
  variants: relayTypeVariants,
  tag: {
    id: "type",
    name: "Relay Type",
    description:
      "Personal or Public. A personal relay (highly recommended) restricts write access to specific pubkeys. Anyone can write to a public relay.",
    warning: null,
    "variant-names": { private: "Personal", public: "Public" },
  },
  "display-as": null,
  "unique-by": null,
  "variant-names": null,
});
export const configSpec = Config.of({
  "relay-type": relayType,
});
export const matchConfigSpec = configSpec.validator();
export type ConfigSpec = typeof matchConfigSpec._TYPE;
