import { configToml } from '../fileModels/config.toml'
import { sdk } from '../sdk'
import { configDefaults } from '../utils'
import { i18n } from '../i18n'

const {
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
} = configDefaults

const { InputSpec, Value } = sdk

// input spec
export const inputSpec = InputSpec.of({
  messages_per_sec: Value.number({
    name: i18n('Messages Per Second Limit'),
    description: i18n(
      'Limit events created per second, averaged over one minute. Note: this is for the server as a whole, not per connection',
    ),
    required: false,
    default: messages_per_sec,
    min: 1,
    integer: true,
    units: 'msgs/sec',
  }),
  subscriptions_per_min: Value.number({
    name: i18n('Subscriptions Per Minute Limit'),
    description: i18n(
      'Limit client subscriptions created per second, averaged over one minute. Strongly recommended to set this to a low value such as 10 to ensure fair service',
    ),
    required: false,
    default: subscriptions_per_min,
    min: 1,
    integer: true,
    units: 'subs/min',
  }),
  max_blocking_threads: Value.number({
    name: i18n('Max Blocking Threads'),
    description: i18n(
      'Maximum number of blocking threads used for database connections',
    ),
    required: false,
    default: max_blocking_threads,
    integer: true,
    min: 1,
    units: 'threads',
  }),
  max_event_bytes: Value.number({
    name: i18n('Max Event Size'),
    description: i18n(
      'Limit the maximum size of an EVENT message. Set to 0 for unlimited',
    ),
    required: false,
    default: max_event_bytes,
    integer: true,
    min: 1024,
    units: 'bytes',
  }),
  max_ws_message_bytes: Value.number({
    name: i18n('Max Websocket Message Size'),
    description: i18n('Maximum WebSocket message in bytes.'),
    required: false,
    default: max_ws_message_bytes,
    integer: true,
    min: 1024,
    units: 'bytes',
  }),
  max_ws_frame_bytes: Value.number({
    name: i18n('Max Websocket Frame Size'),
    description: i18n('Maximum WebSocket frame size in bytes.'),
    required: false,
    default: max_ws_frame_bytes,
    integer: true,
    min: 1024,
    units: 'bytes',
  }),
  broadcast_buffer: Value.number({
    name: i18n('Broadcast Buffer Size'),
    description: i18n(
      'Broadcast buffer size, in number of events. This prevents slow readers from consuming memory',
    ),
    required: false,
    default: broadcast_buffer,
    integer: true,
    min: 128,
    units: 'events',
  }),
  event_persist_buffer: Value.number({
    name: i18n('Event Persistence Buffer'),
    description: i18n(
      'Event persistence buffer size, in number of events. This provides backpressure to senders if writes are slow',
    ),
    required: false,
    default: event_persist_buffer,
    integer: true,
    min: 64,
    units: 'events',
  }),
})

export const configureLimits = sdk.Action.withInput(
  // id
  'configure-limits',

  // metadata
  async ({ effects }) => ({
    name: i18n('Set Data Limits'),
    description: i18n(
      'Establish limits to optimize performance and protect your relay from abuse',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: 'configure',
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => configToml.read((c) => c.limits).once(),

  // the execution function
  async ({ effects, input }) =>
    configToml.merge(effects, {
      limits: Object.fromEntries(
        Object.entries(input).map(([key, value]) => [
          key,
          value === null ? undefined : value,
        ]),
      ),
    }),
)
