import { sdk } from './sdk'
import { exposedStore, initStore } from './store'
import { setDependencies } from './dependencies'
import { setInterfaces } from './interfaces'
import { versions } from './versions'
import { actions } from './actions'

// **** Pre Install ****
const preInstall = sdk.setupPreInstall(async ({ effects }) => {
  // @TODO is this necessary? If so, is this the place/way to do it?
  await sdk.runCommand(
    effects,
    { imageId: 'nostr-rs-relay' },
    'chown -R $APP_USER:$APP_USER $APP_DATA',
    { mounts: null },
    'chown',
  )
})

// **** Post Install ****
const postInstall = sdk.setupPostInstall(async ({ effects }) => {})

// **** Uninstall ****
const uninstall = sdk.setupUninstall(async ({ effects }) => {})

/**
 * Plumbing. DO NOT EDIT.
 */
export const { packageInit, packageUninit, containerInit } = sdk.setupInit(
  versions,
  preInstall,
  postInstall,
  uninstall,
  setInterfaces,
  setDependencies,
  actions,
  initStore,
  exposedStore,
)
