import { ConfigSpec } from './spec'
import { WrapperData } from '../../wrapperData'
import { Read } from 'start-sdk/lib/config/setupConfig'
import { tomlFile } from './file-models/config.toml'

/**
 * This function executes on config get
 *
 * Use this function to gather data from various files and assemble into a valid config to display to the user
 */
export const read: Read<WrapperData, ConfigSpec> = async ({ effects, utils }) => {
  const data = await utils.readFile(tomlFile)

  if (data == null) return {}

  if ('authorization' in data) {
    return {
      relayType: {
        unionSelectKey: 'private',
        unionValueKey: {
          pubkey_whitelist: data.authorization.pubkey_whitelist,
        },
      },
    }
  }

  return {
    relayType: {
      unionSelectKey: 'public',
      unionValueKey: {
        info: data.info,
        limits: data.limits,
      },
    },
  }
}
