import { sdk } from './sdk'
import { configToml } from './file-models/config.toml'
import { T } from '@start9labs/start-sdk'
import { manifest } from './manifest'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const processor = (await configToml.read.const(effects))?.pay_to_relay
    .processor

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
