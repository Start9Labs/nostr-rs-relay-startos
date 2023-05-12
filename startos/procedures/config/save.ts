import { sdk } from '../../sdk'
import { configSpec } from './spec'
import { tomlFile } from './file-models/config.toml'
import { setInterfaces } from '../interfaces'

export const save = sdk.setupConfigSave(
  configSpec,
  async ({ effects, utils, input, dependencies }) => {
    const toSave = {
      network: {
        address: '0.0.0.0',
        port: 8080,
      },
      options: {
        reject_future_seconds: 1800,
      },
      info: {
        relay_url: `ws://${await effects.getServiceTorHostname('torHostname')}`,
      },
    }

    const relayType = input.relayType

    if (relayType.unionSelectKey === 'private') {
      await utils.writeFile(tomlFile, {
        ...toSave,
        authorization: {
          pubkey_whitelist: relayType.unionValueKey.pubkey_whitelist,
        },
      })
    } else {
      const { info, limits } = relayType.unionValueKey
      await utils.writeFile(tomlFile, {
        ...toSave,
        info: {
          ...toSave.info,
          ...info,
        },
        limits,
      })
    }

    const dependenciesReceipt = await effects.setDependencies([])

    return {
      interfacesReceipt: await setInterfaces({ effects, utils, input }),
      dependenciesReceipt,
      restart: true,
    }
  },
)
