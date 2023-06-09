import { sdk } from '../sdk'
import { setInterfaces } from './interfaces'
import { migrations } from './migrations'

const install = sdk.setupInstall(async ({ effects, utils }) => {
  await utils.childProcess.exec('chown -R $APP_USER:$APP_USER $APP_DATA')
})

const uninstall = sdk.setupUninstall(async ({ effects, utils }) => {})

const exportedValues = sdk.setupExports(({ effects, utils }) => {
  return {
    ui: [],
    services: [],
  }
})

export const { init, uninit } = sdk.setupInit(
  migrations,
  install,
  uninstall,
  setInterfaces,
  exportedValues,
)
