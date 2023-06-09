import { sdk } from '../../sdk'
import { configSpec } from './spec'
import { tomlFile } from './file-models/config.toml'

export const read = sdk.setupConfigRead(
  configSpec,
  async ({ effects, utils }) => {
    const data = await tomlFile.read(effects)

    if (data == null) return

    if ('authorization' in data) {
      return {
        relayType: {
          unionSelectKey: 'private' as const,
          unionValueKey: {
            pubkey_whitelist: data.authorization.pubkey_whitelist,
          },
        },
      }
    }

    return {
      relayType: {
        unionSelectKey: 'public' as const,
        unionValueKey: {
          info: data.info,
          limits: data.limits,
        },
      },
    }
  },
)
