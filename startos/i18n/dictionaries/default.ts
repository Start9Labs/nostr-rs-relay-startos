export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Nostr RS Relay!': 0,
  Relay: 1,
  'Relay is ready': 2,
  'Relay is unreachable': 3,

  // interfaces.ts
  'Relay websocket': 4,
  'Nostr clients use this interface to connect to the relay': 5,

  // dependencies.ts
  'Must enable CLNRest to use Core Lightning for payments': 6,

  // configure/info.ts
  Name: 7,
  "Your relay's human-readable name": 8,
  Description: 9,
  'A detailed description for your relay': 10,
  'Admin Pubkey': 11,
  'The Nostr hex pubkey (not npub) of the relay administrator': 12,
  'Must be a valid 64-digit hexadecimal value (ie a Nostr hex pubkey, not an npub). Go to https://damus.io/key/ to convert npub to hex': 13,
  'Admin Contact URI': 14,
  'Contact URI of the relay administrator': 15,
  'Must be a valid "mailto" contact URI, e.g. mailto:contact@example.com': 16,
  'General Information': 17,
  'Provide basic information about your Nostr relay': 18,
  'External Address': 19,
  "Address at which your node can be reached by peers. Select 'None' if you do not want your node to be reached by peers.": 20,
  None: 21,

  // configure/events.ts
  'Permitted Events': 22,
  'These events will be permitted. All others will be prohibited and discarded. For a list of event kinds, see here: https://github.com/nostr-protocol/nips#event-kinds': 23,
  'Event kinds must only contain numbers': 24,
  'Prohibited Events': 25,
  'These events will be prohibited and discarded. All others will be permitted. For a list of event kinds, see here: https://github.com/nostr-protocol/nips#event-kinds': 26,
  'Permitted Event Types': 27,
  'Permit all event kinds, or create a whitelist or blacklist certain event kinds. For a list of event kinds, see here: https://github.com/nostr-protocol/nips#event-kinds': 28,
  'Permit all Event Types': 29,
  'Event Type Whitelist': 30,
  'A list of event types to permit. All others will be prohibited': 31,
  'Event Type Blacklist': 32,
  'A list of event types to prohibit. All others will be permitted': 33,
  'Decide which events are permitted or prohibited': 34,

  // configure/restrict.ts
  'Permitted Domains': 35,
  'Domain names that are allowed to publish events. If defined, only events NIP-05 verified authors at these domains are persisted': 36,
  'Prohibited Domains': 37,
  'Domain names that will be prevented from publishing events': 38,
  'Verified Users (NIP-05)': 39,
  Mode: 40,
  'NIP-05 verification of users. Can be "enabled" to require NIP-05 metadata for event authors, "passive" to perform validation but never block publishing, or "disabled" to do nothing': 41,
  Disabled: 42,
  Enabled: 43,
  Passive: 44,
  'Domain Permissions': 45,
  'Permit all domains, or whitelist/blacklist certain domains': 46,
  'Permit all Domains': 47,
  'Domain Whitelist': 48,
  'Create a list of permitted domains. All others will be prohibited': 49,
  'Domain Blacklist': 50,
  'Create a list of prohibited domains. All others will be permitted': 51,
  'Verify Expiration': 52,
  'Consider an pubkey "verified" if we have a successful validation from the NIP-05 domain within this amount of time. Note, if the domain provides a successful response that omits the account, verification is immediately revoked. Value must be in the form of "1 week" or "2 days" or "12 hours"': 53,
  'Verify Update Frequency': 54,
  'How long to wait between verification attempts for a specific author. Value must be in the form of "1 week" or "2 days" or "12 hours"': 55,
  'Max Consecutive Failures': 56,
  'How many consecutive failed checks before we give up on verifying an author': 57,
  'Authorized Pubkeys': 58,
  'A list of public keys (in hex format) that are permitted to publish to the relay. Go to https://damus.io/key/ to convert from npub to hex': 59,
  'Hexadecimal format required. Go to https://damus.io/key/ to convert an npub to hex': 60,
  'Restrict Access': 61,
  'Limit relay usage to verified or authorized users': 62,

  // configure/limits.ts
  'Messages Per Second Limit': 63,
  'Limit events created per second, averaged over one minute. Note: this is for the server as a whole, not per connection': 64,
  'Subscriptions Per Minute Limit': 65,
  'Limit client subscriptions created per second, averaged over one minute. Strongly recommended to set this to a low value such as 10 to ensure fair service': 66,
  'Max Blocking Threads': 67,
  'Maximum number of blocking threads used for database connections': 68,
  'Max Event Size': 69,
  'Limit the maximum size of an EVENT message. Set to 0 for unlimited': 70,
  'Max Websocket Message Size': 71,
  'Maximum WebSocket message in bytes.': 72,
  'Max Websocket Frame Size': 73,
  'Maximum WebSocket frame size in bytes.': 74,
  'Broadcast Buffer Size': 75,
  'Broadcast buffer size, in number of events. This prevents slow readers from consuming memory': 76,
  'Event Persistence Buffer': 77,
  'Event persistence buffer size, in number of events. This provides backpressure to senders if writes are slow': 78,
  'Set Data Limits': 79,
  'Establish limits to optimize performance and protect your relay from abuse': 80,

  // configure/payments.ts
  'Whether or not to make this a paid relay. If enabled, users must pay according to your setting here. If disabled, none of your setting here will take effect.': 81,
  'Allow New Sign Ups': 82,
  'Whether or not new sign ups should be allowed': 83,
  Processor: 84,
  'API Secret': 85,
  'Your LNBits API secret': 86,
  'Admission Cost': 87,
  'The cost to be admitted to the relay': 88,
  'Cost Per Event': 89,
  'The cost per post': 90,
  'Send Message on Signup': 91,
  'Optionally send a welcome message to new customers when they sign up': 92,
  'Secret Key (nsec)': 93,
  'The Nostr private key (nsec) from which to send the direct message': 94,
  'Terms of Service': 95,
  'The message to send to new customers on signup': 96,
  'Paid Relay Settings': 97,
  'Require payment to use this relay': 98,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
