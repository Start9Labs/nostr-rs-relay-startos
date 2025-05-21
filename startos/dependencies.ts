import { sdk } from './sdk'
import { configToml } from './fileModels/config.toml'
import { T } from '@start9labs/start-sdk'
import { manifest } from './manifest'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const processor = await configToml
    .read((c) => c.pay_to_relay?.processor)
    .const(effects)

  if (processor === 'ClnRest') {
    return {
      'c-lightning': {
        kind: 'running',
        versionRange: '',
        healthChecks: [],
      },
    } as T.CurrentDependenciesResult<typeof manifest>
  } else if (processor === 'LNBits') {
    return {
      lnbits: {
        kind: 'running',
        versionRange: '',
        healthChecks: [],
      },
    }
  } else {
    return {}
  }
})
