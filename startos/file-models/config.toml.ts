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

const clnNodeUrl = 'c-lightning.startos'
const lnbitsNodeUrl = 'lnbits.startos'
const clnRunePath = ''

const shape = object({
  info: object({
    relay_url: string
      .nullable()
      .optional()
      .map((a) => a || undefined)
      .onMismatch(undefined), // used. not exposed. @TODO expose this, but how?
    name: string.optional().onMismatch(undefined),
    description: string.optional().onMismatch(undefined),
    pubkey: string.optional().onMismatch(undefined),
    contact: string.optional().onMismatch(undefined),
    favicon: string.optional().onMismatch(undefined), // @TODO implement with file upload
    relay_icon: string.optional().onMismatch(undefined),
    relay_page: string.optional().onMismatch(undefined), // @TODO implement with file upload
  }),
  network: object({
    address: literal('0.0.0.0').onMismatch('0.0.0.0'), // used. not exposed
    port: literal(8080).onMismatch(8080), // used. not exposed
  }),
  options: object({
    reject_future_seconds: natural.optional().onMismatch(1600), // used. not exposed.
  }),
  limits: allOf(
    object({
      messages_per_sec: natural.optional().onMismatch(undefined),
      subscriptions_per_min: natural.optional().onMismatch(undefined),
      max_blocking_threads: natural.optional().onMismatch(undefined),
      max_event_bytes: natural.optional().onMismatch(undefined),
      max_ws_message_bytes: natural.optional().onMismatch(undefined),
      max_ws_frame_bytes: natural.optional().onMismatch(undefined),
      broadcast_buffer: natural.optional().onMismatch(undefined),
      event_persist_buffer: natural.optional().onMismatch(undefined),
      limit_scrapers: boolean.optional().onMismatch(undefined), // not used. not exposed.
    }),
    anyOf(
      object({
        event_kind_allowlist: literal(undefined),
        event_kind_blacklist: literal(undefined),
      }),
      object({
        event_kind_allowlist: array(natural).onMismatch([]),
        event_kind_blacklist: literal(undefined),
      }),
      object({
        event_kind_allowlist: literal(undefined),
        event_kind_blacklist: array(natural).onMismatch([]),
      }),
    ),
  ),
  authorization: object({
    pubkey_whitelist: array(string).optional().onMismatch(undefined),
    nip42_auth: boolean.optional().onMismatch(undefined), // not used. not exposed.
    nip42_dms: boolean.optional().onMismatch(undefined), // not used. not exposed.
  }),
  verified_users: allOf(
    object({
      mode: literals('enabled', 'disabled', 'passive')
        .optional()
        .onMismatch(undefined),
      verify_expiration: string.optional().onMismatch(undefined),
      verify_update_frequency: string.optional().onMismatch(undefined),
      max_consecutive_failures: natural.optional().onMismatch(undefined),
    }),
    anyOf(
      object({
        domain_whitelist: literal(undefined),
        domain_blacklist: literal(undefined),
      }),
      object({
        domain_whitelist: array(string).onMismatch([]),
        domain_blacklist: literal(undefined),
      }),
      object({
        domain_whitelist: literal(undefined),
        domain_blacklist: array(string).onMismatch([]),
      }),
    ),
  ),
  pay_to_relay: allOf(
    anyOf(
      object({
        enabled: literal(true),
        sign_ups: boolean.optional().onMismatch(undefined),
        processor: literals('ClnRest', 'LNBits')
          .optional()
          .onMismatch(undefined),
        admission_cost: natural.optional().onMismatch(undefined),
        cost_per_event: natural.optional().onMismatch(undefined),
      }),
      object({
        enabled: literal(false),
      }),
    ),
    anyOf(
      object({
        direct_message: literal(true),
        terms_message: string.optional().onMismatch(undefined),
        secret_key: string.onMismatch(''),
      }),
      object({
        direct_message: literal(false),
      }),
    ),
    anyOf(
      object({
        processor: literal('ClnRest'),
        node_url: literal(clnNodeUrl).onMismatch(clnNodeUrl),
        rune_path: literal(clnRunePath).onMismatch(clnRunePath),
      }),
      object({
        processor: literal('LNBits'),
        node_url: literal(lnbitsNodeUrl).onMismatch(lnbitsNodeUrl),
        api_secret: string.optional().onMismatch(undefined),
      }),
    ),
  ),
})

export const configToml = FileHelper.toml('config.toml', shape)
