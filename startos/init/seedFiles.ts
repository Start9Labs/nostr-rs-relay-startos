import { sdk } from '../sdk'
import { configToml } from '../fileModels/config.toml'
import { configDefaults } from '../utils'

export const seedFiles = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  await configToml.write(effects, configDefaults)
})
