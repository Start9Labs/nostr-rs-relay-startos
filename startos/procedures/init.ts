import { sdk } from '../sdk'
import { migrations } from './migrations'

const install = sdk.setupInstall(async ({ effects, utils }) => {
  const appUser = 'appuser'

  await effects.chown({
    volumeId: 'main',
    path: '/data',
    uid: appUser,
  })
  await effects.runCommand(['su', `- ${appUser} > /dev/null 2>&1`])
})

const uninstall = sdk.setupUninstall(async ({ effects, utils }) => {})

export const { init, uninit } = sdk.setupInit(migrations, install, uninstall)
