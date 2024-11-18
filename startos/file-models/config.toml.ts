import { FileHelper, matches } from '@start9labs/start-sdk'

const {
  object,
  array,
  string,
  natural,
  boolean,
  literal,
  literals,
  allOf,
  anyOf,
} = matches

const shape = object({
  info: matches.partial({
    relay_url: string.optional(), // used. not exposed. @TODO expose this, but how?
    name: string.optional().onMismatch('hello'),
    description: string.optional(),
    pubkey: string.optional(),
    contact: string.optional(),
    favicon: string.optional(), // @TODO implement with file upload
    relay_icon: string.optional(),
    relay_page: string.optional(), // @TODO implement with file upload
  }),
  network: object({
    address: string.defaultTo('0.0.0.0'), // used. not exposed.
    port: natural.defaultTo(8080), // used. not exposed.
  }),
  options: object({
    reject_future_seconds: natural.defaultTo(1800), // used. not exposed.
  }),
  limits: allOf(
    object({
      messages_per_sec: natural.optional().onMismatch(0),
      subscriptions_per_min: natural.optional(),
      max_blocking_threads: natural.optional(),
      max_event_bytes: natural.optional(),
      max_ws_message_bytes: natural.optional(),
      max_ws_frame_bytes: natural.optional(),
      broadcast_buffer: natural.optional(),
      event_persist_buffer: natural.optional(),
      limit_scrapers: boolean.optional(), // not used. not exposed.
    }),
    anyOf(
      object({
        event_kind_allowlist: literal(undefined),
        event_kind_blacklist: literal(undefined),
      }),
      object({
        event_kind_allowlist: array(natural),
        event_kind_blacklist: literal(undefined),
      }),
      object({
        event_kind_allowlist: literal(undefined),
        event_kind_blacklist: array(natural),
      }),
    ),
  ),
  authorization: object({
    pubkey_whitelist: array(string).defaultTo([]),
    nip42_auth: boolean.defaultTo(false), // not used. not exposed.
    nip42_dms: boolean.defaultTo(false), // not used. not exposed.
  }),
  verified_users: allOf(
    object({
      mode: literals('enabled', 'disabled', 'passive').defaultTo(
        'disabled' as const,
      ),
      verify_expiration: string.optional(),
      verify_update_frequency: string.optional(),
      max_consecutive_failures: natural.optional(),
    }),
    anyOf(
      object({
        domain_whitelist: literal(undefined),
        domain_blacklist: literal(undefined),
      }),
      object({
        domain_whitelist: array(string).defaultTo([]),
        domain_blacklist: literal(undefined),
      }),
      object({
        domain_whitelist: literal(undefined),
        domain_blacklist: array(string).defaultTo([]),
      }),
    ),
  ),
  pay_to_relay: allOf(
    object({
      enabled: boolean.onMismatch(false),
      sign_ups: boolean.onMismatch(false),
      processor: literals('ClnRest', 'LNBits').onMismatch('ClnRest'),
      admission_cost: natural.optional(),
      cost_per_event: natural.optional(),
      node_url: string.optional(),
    }),
    anyOf(
      object({
        direct_message: literal(true),
        terms_message: string,
        secret_key: string,
      }),
      object({
        direct_message: literal(false),
      }),
    ),
    anyOf(
      object({
        processor: literal('ClnRest').optional(),
        rune_path: string.optional(),
      }),
      object({
        processor: literal('LNBits').optional(),
        api_secret: string.optional(),
      }),
    ),
  ),
})

export const configToml = FileHelper.toml('config.toml', shape)
