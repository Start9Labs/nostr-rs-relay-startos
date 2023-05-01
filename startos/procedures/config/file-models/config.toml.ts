import { matches } from 'start-sdk/lib'
import { FileHelper } from 'start-sdk/lib/util'
import { publicConfig } from '../spec'

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
    publicConfig.validator(),
  ),
)

export const tomlFile = FileHelper.toml('config.toml', 'main', tomlShape)
