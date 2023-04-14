import { configBuilder } from "start-sdk/lib";
const { Config, Value, List, Variants } = configBuilder;

export const pubkeyWhitelistHexList = List.string(
  {
    name: "Pubkey Whitelist (hex)",
    range: "[1,*)",
    description:
      "A list of pubkeys that are permitted to publish through your relay. A minimum, you need to enter your own Nostr hex (not npub) pubkey. Go to https://damus.io/key/ to convert from npub to hex.",
  },
  {
    placeholder: "hex (not npub) pubkey",
    pattern: "[0-9a-fA-F]{64}",
    patternDescription:
      "Must be a valid 64-digit hexadecimal value (ie a Nostr hex pubkey, not an npub). Go to https://damus.io/key/ to convert npub to hex.",
  }
);
export const pubkeyWhitelist = Value.list(pubkeyWhitelistHexList);
export const privateConfig = Config.of({
  pubkey_whitelist: pubkeyWhitelist,
});
export const name = Value.string({
  name: "Relay Name",
  description: "Your relay's human-readable identifier",
  required: false,
  placeholder: "Bob's Public Relay",
  pattern: ".{3,32}",
  patternDescription: "Must be at least 3 character and no more than 32 characters",
});
export const description = Value.string({
  name: "Relay Description",
  description: "A more detailed description for your relay",
  required: false,
  placeholder: "The best relay in town",
  pattern: ".{6,256}",
  patternDescription: "Must be at least 6 character and no more than 256 characters",
});
export const pubkey = Value.string({
  name: "Admin contact pubkey (hex)",
  description: "The Nostr hex (not npub) pubkey of the relay administrator",
  required: false,
  placeholder: "hex (not npub) pubkey",
  pattern: "[0-9a-fA-F]{64}",
  patternDescription:
    "Must be a valid 64-digit hexadecimal value (ie a Nostr hex pubkey, not an npub). Go to https://damus.io/key/ to convert npub to hex.",
});
export const contact = Value.string({
  name: "Admin contact email",
  description: "The email address of the relay administrator",
  required: false,
  pattern: "[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+",
  patternDescription: "Must be a valid email address.",
  inputmode: "email",
});
export const relayInfoSpec = Config.of({
  name,
  description,
  pubkey,
  contact,
});
export const info = Value.object(
  {
    name: "Relay Info",
    description: "General public info about your relay",
  },
  relayInfoSpec
);
export const messagesPerSec = Value.number({
  name: "Messages Per Second Limit",
  default: 2,
  description:
    "Limit events created per second, averaged over one minute. Note: this is for the server as a whole, not per connection.",
  required: true,
  range: "[1,*)",
  integral: true,
  units: "msgs/sec",
});
export const subscriptionsPerMin = Value.number({
  name: "Subscriptions Per Minute Limit",
  default: 10,
  description:
    "Limit client subscriptions created per second, averaged over one minute. Strongly recommended to set this to a low value such as 10 to ensure fair service.",
  required: true,
  range: "[1,*)",
  integral: true,
  units: "subs/min",
});
export const maxBlockingThreads = Value.number({
  name: "Max Blocking Threads",
  default: 16,
  description: "Maximum number of blocking threads used for database connections.",
  required: true,
  range: "[0,*)",
  integral: true,
  units: "threads",
});
export const maxEventBytes = Value.number({
  name: "Max Event Size",
  default: 131072,
  description: "Limit the maximum size of an EVENT message. Set to 0 for unlimited",
  required: true,
  range: "[0,*)",
  integral: true,
  units: "bytes",
});
export const maxWsMessageBytes = Value.number({
  name: "Max Websocket Message Size",
  default: 131072,
  description: "Maximum WebSocket message in bytes.",
  required: true,
  range: "[0,*)",
  integral: true,
  units: "bytes",
});
export const maxWsFrameBytes = Value.number({
  name: "Max Websocket Frame Size",
  default: 131072,
  description: "Maximum WebSocket frame size in bytes.",
  required: true,
  range: "[0,*)",
  integral: true,
  units: "bytes",
});
export const eventKindBlacklistList = List.number(
  {
    name: "Event Kind Blacklist",
    range: "[0,*)",
    description:
      "Events with these kinds will be discarded. For a list of event kinds, see here: https://github.com/nostr-protocol/nips#event-kinds",
  },
  {
    range: "(0,100000]",
    integral: true,
    placeholder: "30023",
  }
);
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
export const limits = Value.object(
  {
    name: "Limits",
    description: "Data limits to protect your relay from using too many resources",
  },
  limitsSpec
);
export const publicConfig = Config.of({ info, limits });
export const relayTypeVariants = Variants.of({
  private: { name: "Private", spec: privateConfig },
  public: { name: "Public", spec: publicConfig },
});
export const relayType = Value.union(
  {
    name: "Relay Type",
    description:
      "Private or public. A private relay (highly recommended) restricts write access to specific pubkeys. Anyone can write to a public relay.",
    warning:
      "Running a public relay carries risk. Your relay can be spammed, resulting in large amounts of disk usage.",
    required: false,
  },
  relayTypeVariants
);
export const inputSpec = Config.of({
  relayType,
});
export const matchConfigSpec = inputSpec.validator();
export type InputSpec = typeof matchConfigSpec._TYPE;
