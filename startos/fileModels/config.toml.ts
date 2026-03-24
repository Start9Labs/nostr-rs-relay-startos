import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { relayInterfacePort } from '../utils'

export const shape = z.object({
  info: z
    .object({
      relay_url: z.string().optional().catch(undefined),
      name: z.string().optional().catch(undefined),
      description: z.string().optional().catch(undefined),
      pubkey: z.string().optional().catch(undefined),
      contact: z.string().optional().catch(undefined),
      favicon: z.string().optional().catch(undefined),
      relay_icon: z.string().optional().catch(undefined),
      relay_page: z.string().optional().catch(undefined),
    })
    .optional()
    .catch(undefined),
  network: z
    .object({
      address: z.literal('0.0.0.0').catch('0.0.0.0'),
      port: z.literal(relayInterfacePort).catch(relayInterfacePort),
    })
    .catch({ address: '0.0.0.0', port: relayInterfacePort }),
  options: z
    .object({
      reject_future_seconds: z.literal(1600).catch(1600),
    })
    .catch({ reject_future_seconds: 1600 }),
  limits: z
    .object({
      messages_per_sec: z.number().optional().catch(undefined),
      subscriptions_per_min: z.number().optional().catch(undefined),
      max_blocking_threads: z.number().optional().catch(undefined),
      max_event_bytes: z.number().optional().catch(undefined),
      max_ws_message_bytes: z.number().optional().catch(undefined),
      max_ws_frame_bytes: z.number().optional().catch(undefined),
      broadcast_buffer: z.number().optional().catch(undefined),
      event_persist_buffer: z.number().optional().catch(undefined),
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
      mode: z.enum(['enabled', 'disabled', 'passive']).optional().catch(undefined),
      verify_expiration: z.string().optional().catch(undefined),
      verify_update_frequency: z.string().optional().catch(undefined),
      max_consecutive_failures: z.number().optional().catch(undefined),
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
