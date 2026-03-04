import { FileHelper, z } from '@start9labs/start-sdk'
import { configDefaults } from '../utils'
import { sdk } from '../sdk'

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

export const shape = z.object({
  info: z
    .object({
      relay_url: z.string().optional().catch(undefined),
      name: z.string().optional().catch(undefined),
      description: z.string().optional().catch(undefined),
      pubkey: z.string().optional().catch(undefined),
      contact: z.string().optional().catch(undefined),
      favicon: z.string().optional().catch(undefined), // @TODO implement with file upload
      relay_icon: z.string().optional().catch(undefined),
      relay_page: z.string().optional().catch(undefined), // @TODO implement with file upload
    })
    .optional()
    .catch(undefined),
  network: z
    .object({
      address: z.string(),
      port: z.number(),
    })
    .catch(network),
  options: z
    .object({
      reject_future_seconds: z.number(),
    })
    .catch(options),
  limits: z
    .object({
      messages_per_sec: z.number().optional().catch(messages_per_sec),
      subscriptions_per_min: z.number().optional().catch(subscriptions_per_min),
      max_blocking_threads: z.number().optional().catch(max_blocking_threads),
      max_event_bytes: z.number().optional().catch(max_event_bytes),
      max_ws_message_bytes: z
        .number()
        .optional()
        .catch(max_ws_message_bytes),
      max_ws_frame_bytes: z.number().optional().catch(max_ws_frame_bytes),
      broadcast_buffer: z.number().optional().catch(broadcast_buffer),
      event_persist_buffer: z.number().optional().catch(event_persist_buffer),
      event_kind_allowlist: z.array(z.number()).optional().catch(undefined),
      event_kind_blacklist: z.array(z.number()).optional().catch(undefined),
    })
    .optional()
    .catch(undefined),
  authorization: z
    .object({
      pubkey_whitelist: z.array(z.string()).optional().catch(undefined),
    })
    .optional()
    .catch(undefined),
  verified_users: z
    .object({
      mode: z.enum(['enabled', 'disabled', 'passive']).optional().catch(mode),
      verify_expiration: z.string().optional().catch(undefined),
      verify_update_frequency: z.string().optional().catch(undefined),
      max_consecutive_failures: z
        .number()
        .optional()
        .catch(max_consecutive_failures),
      domain_whitelist: z.array(z.string()).optional().catch(undefined),
      domain_blacklist: z.array(z.string()).optional().catch(undefined),
    })
    .optional()
    .catch(undefined),
})

export const configToml = FileHelper.toml(
  {
    base: sdk.volumes.config,
    subpath: '/config.toml',
  },
  shape,
)
