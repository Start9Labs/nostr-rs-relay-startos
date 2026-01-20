import { i18n } from './i18n'
import { sdk } from './sdk'
import { relayInterfacePort, relayInterfaceId } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const apiMulti = sdk.MultiHost.of(effects, 'websocket')
  const apiMultiOrigin = await apiMulti.bindPort(relayInterfacePort, {
    protocol: 'ws',
  })
  const api = sdk.createInterface(effects, {
    name: i18n('Relay websocket'),
    id: relayInterfaceId,
    description: i18n(
      'Nostr clients use this interface to connect to the relay',
    ),
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const apiReceipt = await apiMultiOrigin.export([api])

  return [apiReceipt]
})
