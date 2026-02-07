export const relayInterfacePort = 8080
export const relayInterfaceId = 'relay'

export const configDefaults = {
  network: {
    address: '0.0.0.0',
    port: relayInterfacePort,
  },
  options: {
    reject_future_seconds: 1600,
  },
  limits: {
    messages_per_sec: 10,
    subscriptions_per_min: 10,
    max_blocking_threads: 16,
    max_event_bytes: 131072,
    max_ws_message_bytes: 131072,
    max_ws_frame_bytes: 131072,
    broadcast_buffer: 16384,
    event_persist_buffer: 4096,
  },
  verified_users: {
    mode: 'disabled',
    max_consecutive_failures: 20,
  },
} as const
