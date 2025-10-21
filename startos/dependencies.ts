import { sdk } from './sdk'
import { configToml } from './fileModels/config.toml'
import { T } from '@start9labs/start-sdk'
import { manifest } from './manifest'
import { plugins } from 'c-lightning-startos/startos/actions/config/plugins'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const processor = await configToml
    .read((c) => c.pay_to_relay?.processor)
    .const(effects)

  if (processor === 'ClnRest') {
    await sdk.action.createTask(effects, 'c-lightning', plugins, 'critical', {
      input: { kind: 'partial', value: { clnrest: true } },
      reason: 'Must enable CLNRest to use Core Lightning for payments',
      when: { condition: 'input-not-matches', once: false },
      replayId: 'enable-clnrest',
    })

    return {
      'c-lightning': {
        kind: 'running',
        versionRange: '>=25.9.0:1-beta.0',
        healthChecks: ['lightningd', 'check-synced'],
      },
    } as T.CurrentDependenciesResult<typeof manifest>
  } else if (processor === 'LNBits') {
    return {
      lnbits: {
        kind: 'running',
        versionRange: '>=1.2.1:1-alpha.1 ',
        healthChecks: ['primary'],
      },
    }
  } else {
    return {}
  }
})
