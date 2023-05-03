import { matches } from 'start-sdk'
import FileHelper from 'start-sdk/lib/util/fileHelper'

const { object, array, string, natural, anyOf, allOf } = matches

const tomlShape = allOf(
  object({
    network: object({
      address: string,
      port: natural,
    }),
    options: object({
      reject_future_seconds: natural,
    }),
    info: object({
      relay_url: string,
    }),
  }),
  anyOf(
    object({
      authorization: object({
        pubkey_whitelist: array(string),
      }),
    }),
    object({
      info: object({
        name: string.optional(),
        description: string.optional(),
        pubkey: string.optional(),
        contact: string.optional(),
      }),
      limits: object({
        messages_per_sec: natural,
        subscriptions_per_min: natural,
        max_blocking_threads: natural,
        max_event_bytes: natural,
        max_ws_message_bytes: natural,
        max_ws_frame_bytes: natural,
        event_kind_blacklist: array(natural),
      }),
    }),
  ),
)

export const tomlFile = FileHelper.toml('config.toml', 'main', tomlShape)
