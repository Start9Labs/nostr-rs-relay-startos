import { FileHelper, matches } from '@start9labs/start-sdk'
import { configDefaults } from '../utils'
import { sdk } from '../sdk'

const { object, arrayOf, string, natural, literal, literals } = matches

const {
  network,
  options,
  limits: {
    messages_per_sec,
    subscriptions_per_min,
    max_blocking_threads,
    max_event_bytes,
    max_ws_message_bytes,
    max_ws_frame_bytes,
    broadcast_buffer,
    event_persist_buffer,
  },
  verified_users: { mode, max_consecutive_failures },
} = configDefaults

export const shape = object({
  info: object({
    relay_url: string.optional().onMismatch(undefined),
    name: string.optional().onMismatch(undefined),
    description: string.optional().onMismatch(undefined),
    pubkey: string.optional().onMismatch(undefined),
    contact: string.optional().onMismatch(undefined),
    favicon: string.optional().onMismatch(undefined), // @TODO implement with file upload
    relay_icon: string.optional().onMismatch(undefined),
    relay_page: string.optional().onMismatch(undefined), // @TODO implement with file upload
  }).optional(),
  network: literal(network).onMismatch(network),
  options: literal(options).onMismatch(options),
  limits: object({
    messages_per_sec: natural.optional().onMismatch(messages_per_sec),
    subscriptions_per_min: natural.optional().onMismatch(subscriptions_per_min),
    max_blocking_threads: natural.optional().onMismatch(max_blocking_threads),
    max_event_bytes: natural.optional().onMismatch(max_event_bytes),
    max_ws_message_bytes: natural.optional().onMismatch(max_ws_message_bytes),
    max_ws_frame_bytes: natural.optional().onMismatch(max_ws_frame_bytes),
    broadcast_buffer: natural.optional().onMismatch(broadcast_buffer),
    event_persist_buffer: natural.optional().onMismatch(event_persist_buffer),
    event_kind_allowlist: arrayOf(natural).optional().onMismatch(undefined),
    event_kind_blacklist: arrayOf(natural).optional().onMismatch(undefined),
  }).optional(),
  authorization: object({
    pubkey_whitelist: arrayOf(string).optional().onMismatch(undefined),
  }).optional(),
  verified_users: object({
    mode: literals('enabled', 'disabled', 'passive')
      .optional()
      .onMismatch(mode),
    verify_expiration: string.optional().onMismatch(undefined),
    verify_update_frequency: string.optional().onMismatch(undefined),
    max_consecutive_failures: natural
      .optional()
      .onMismatch(max_consecutive_failures),
    domain_whitelist: arrayOf(string).optional().onMismatch(undefined),
    domain_blacklist: arrayOf(string).optional().onMismatch(undefined),
  }).optional(),
})

export const configToml = FileHelper.toml(
  {
    base: sdk.volumes.config,
    subpath: '/config.toml',
  },
  shape,
)
