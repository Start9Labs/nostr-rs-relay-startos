import { FileHelper, matches } from '@start9labs/start-sdk'
import { clnMountpoint, configDefaults } from '../utils'
import { sdk } from '../sdk'

const { object, arrayOf, string, natural, boolean, literal, literals } = matches

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

const clnNodeUrl = 'c-lightning.startos:3010'
const lnbitsNodeUrl = 'lnbits.startos'
const clnRunePath = `${clnMountpoint}/.commando-env`

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
  pay_to_relay: object({
    enabled: boolean.onMismatch(false),
    sign_ups: boolean.onMismatch(false),
    processor: literals('ClnRest', 'LNBits').optional().onMismatch(undefined),
    admission_cost: natural.optional().onMismatch(undefined),
    cost_per_event: natural.optional().onMismatch(undefined),
    // message on signup
    direct_message: boolean.onMismatch(false),
    terms_message: string.optional().onMismatch(undefined),
    secret_key: string.optional().onMismatch(undefined),
    // dependencies
    node_url: literals(clnNodeUrl, lnbitsNodeUrl)
      .optional()
      .onMismatch(undefined),
    rune_path: literal(clnRunePath).onMismatch(clnRunePath), // ClnRest only
    api_secret: string.optional().onMismatch(undefined), // LNBits only
  }).optional(),
})

export const configToml = FileHelper.toml(
  {
    base: sdk.volumes.config,
    subpath: '/config.toml',
  },
  shape,
)
