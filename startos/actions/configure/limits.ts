import { configToml } from '../../file-models/config.toml'
import { sdk } from '../../sdk'

const { InputSpec, Value } = sdk

// input spec
export const inputSpec = InputSpec.of({
  messages_per_sec: Value.number({
    name: 'Messages Per Second Limit',
    description:
      'Limit events created per second, averaged over one minute. Note: this is for the server as a whole, not per connection',
    required: false,
    default: 2,
    min: 1,
    integer: true,
    units: 'msgs/sec',
  }),
  subscriptions_per_min: Value.number({
    name: 'Subscriptions Per Minute Limit',
    description:
      'Limit client subscriptions created per second, averaged over one minute. Strongly recommended to set this to a low value such as 10 to ensure fair service',
    required: false,
    default: 10,
    min: 1,
    integer: true,
    units: 'subs/min',
  }),
  max_blocking_threads: Value.number({
    name: 'Max Blocking Threads',
    description:
      'Maximum number of blocking threads used for database connections',
    required: false,
    default: 16,
    integer: true,
    min: 1,
    units: 'threads',
  }),
  max_event_bytes: Value.number({
    name: 'Max Event Size',
    description:
      'Limit the maximum size of an EVENT message. Set to 0 for unlimited',
    required: false,
    default: 131072,
    integer: true,
    min: 1,
    units: 'bytes',
  }),
  max_ws_message_bytes: Value.number({
    name: 'Max Websocket Message Size',
    description: 'Maximum WebSocket message in bytes',
    required: false,
    default: 131072,
    integer: true,
    min: 1,
    units: 'bytes',
  }),
  max_ws_frame_bytes: Value.number({
    name: 'Max Websocket Frame Size',
    description: 'Maximum WebSocket frame size in bytes',
    required: false,
    default: 131072,
    integer: true,
    min: 1,
    units: 'bytes',
  }),
  broadcast_buffer: Value.number({
    name: 'Broadcast Buffer Size',
    description:
      'Broadcast buffer size, in number of events. This prevents slow readers from consuming memory',
    required: false,
    default: 16384,
    integer: true,
    min: 1,
    units: 'events',
  }),
  event_persist_buffer: Value.number({
    name: 'Event Persistence Buffer',
    description:
      'Event persistence buffer size, in number of events. This provides backpressure to senders if writes are slow',
    required: false,
    default: 4096,
    integer: true,
    min: 1,
    units: 'events',
  }),
})

export const configureLimits = sdk.Action.withInput(
  // id
  'configure-limits',

  // metadata
  async ({ effects }) => ({
    name: 'Data Limits',
    description:
      'Establish limits to optimize performance and protect your relay from abuse',
    warning: null,
    allowedStatuses: 'any',
    group: 'configure',
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => configToml.read.const(effects)?.then((d) => d?.limits),

  // the execution function
  async ({ effects, input }) => configToml.merge({ limits: input }),
)
