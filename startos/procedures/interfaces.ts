import { sdk } from '../sdk'
import { configSpec } from './config/spec'

export const relayPort = 8080
export const relayInterfaceId = 'relay'

/**
 * ======================== Interfaces ========================
 *
 * In this section, you will decide how the service will be exposed to the outside world
 */
export const setInterfaces = sdk.setupInterfaces(
  configSpec,
  async ({ effects, utils, input }) => {
    const multi = utils.host.multi('multi')
    const multiOrigin = await multi.bindPort(relayPort, { protocol: 'ws' })
    const multiInterface = utils.createInterface({
      name: 'Relay Websocket',
      id: relayInterfaceId,
      description: 'Nostr clients use this interface to connect to the relay',
      ui: false,
      username: null,
      path: '',
      search: {},
    })

    const multiReceipt = await multiInterface.export([multiOrigin])

    return [multiReceipt]
  },
)
