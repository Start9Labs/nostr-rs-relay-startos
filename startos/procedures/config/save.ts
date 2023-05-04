import { ConfigSpec } from './spec'
import { WrapperData } from '../../wrapperData'
import { Save } from '@start9labs/start-sdk/lib/config/setupConfig'
import { tomlFile } from './file-models/config.toml'
import { Manifest } from '../../manifest'

/**
 * This function executes on config save
 *
 * Use it to persist config data to various files and to establish any resulting dependencies
 */
export const save: Save<WrapperData, ConfigSpec, Manifest> = async ({
  effects,
  utils,
  input,
  dependencies,
}) => {
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
    dependenciesReceipt,
    restart: true,
  }
}
