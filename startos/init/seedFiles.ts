import { sdk } from '../sdk'
import { configToml } from '../fileModels/config.toml'

export const seedFiles = sdk.setupOnInit(async (effects) => {
  await configToml.merge(effects, {})
})
