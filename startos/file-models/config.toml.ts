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
  info: object(
    {
      relay_url: string, // used. not exposed. @TODO expose this, but how?
      name: string,
      description: string,
      pubkey: string,
      contact: string,
      favicon: string, // @TODO implement with file upload
      relay_icon: string,
      relay_page: string, // @TODO implement with file upload
    },
    [
      'name',
      'description',
      'pubkey',
      'contact',
      'favicon',
      'relay_icon',
      'relay_page',
    ],
  ),
  network: object({
    address: string.defaultTo('0.0.0.0'), // used. not exposed.
    port: natural.defaultTo(8080), // used. not exposed.
  }),
  options: object({
    reject_future_seconds: natural.defaultTo(1800), // used. not exposed.
  }),
  limits: allOf(
    object(
      {
        messages_per_sec: natural,
        subscriptions_per_min: natural,
        max_blocking_threads: natural,
        max_event_bytes: natural,
        max_ws_message_bytes: natural,
        max_ws_frame_bytes: natural,
        broadcast_buffer: natural,
        event_persist_buffer: natural,
        limit_scrapers: boolean.defaultTo(false), // not used. not exposed.
      },
      [
        'messages_per_sec',
        'subscriptions_per_min',
        'max_blocking_threads',
        'max_event_bytes',
        'max_ws_message_bytes',
        'max_ws_frame_bytes',
        'broadcast_buffer',
        'event_persist_buffer',
      ],
    ),
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
    object(
      {
        mode: literals('enabled', 'disabled', 'passive').defaultTo(
          'disabled' as const,
        ),
        verify_expiration: string,
        verify_update_frequency: string,
        max_consecutive_failures: natural,
      },
      [
        'verify_expiration',
        'verify_update_frequency',
        'max_consecutive_failures',
      ],
    ),
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
    object(
      {
        enabled: boolean,
        admission_cost: natural,
        cost_per_event: natural,
        node_url: string,
        sign_ups: boolean,
      },
      ['enabled', 'admission_cost', 'cost_per_event', 'node_url', 'sign_ups'],
    ),
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
      object(
        {
          processor: literal('ClnRest'),
          rune_path: string,
        },
        ['processor', 'rune_path'],
      ),
      object(
        {
          processor: literal('LNBits'),
          api_secret: string,
        },
        ['processor', 'api_secret'],
      ),
    ),
  ),
})

export const configToml = FileHelper.toml('config.toml', shape)
