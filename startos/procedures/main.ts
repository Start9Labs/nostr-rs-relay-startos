import { Daemons, NetworkInterfaceBuilder, setupMain } from "start-sdk/lib/mainFn"
import exportInterfaces from "start-sdk/lib/mainFn/exportInterfaces"
import { ExpectedExports } from "start-sdk/lib/types"
import { WrapperData } from "../wrapperData"

export const main: ExpectedExports.main = setupMain<WrapperData>(async ({
  effects,
  utils,
  started
}) => {
  /**
   * ======================== Setup ========================
   *
   * In this section, you will fetch any resources or run any commands necessary to run the service
   */

  await effects.runCommand("chown -R $APP_USER:$APP_USER $APP_DATA")
  await effects.runCommand("su - $APP_USER > /dev/null 2>&1")
  await effects.runCommand("cp $APP_DATA/config.toml.tmp $APP/config.toml")

  /**
   * ======================== Interfaces ========================
   *
   * In this section, you will decide how the service will be exposed to the outside world
   *
   * Naming convention reference: https://developer.mozilla.org/en-US/docs/Web/API/Location
   */

  // ------------ Tor ------------

  // Find or generate a random Tor hostname by ID
  const torHostname = utils.torHostName('torHostname')
  // Create a Tor host with the assigned port mapping
  const torHost = await torHostname.bindTor(8080, 80)
  // Assign the Tor host a web protocol (e.g. "http", "ws")
  const torOrigin = torHost.createOrigin('http')

  // ------------ LAN ------------

  // Find or generate a random port by ID
  const lanPort = utils.localPort('lanPort')
  // Create a LAN host with the assigned internal port
  const lanHost = await lanPort.bindLan(8080)
  // Assign the LAN host a web protocol (e.g. "https", "wss")
  const lanOrigins = lanHost.createOrigins('https')

  // ------------ Interface ----------------

  // An interface is a grouping of addresses that expose the same resource (e.g. a UI or RPC API).
  // Addresses are different "routes" to the same destination

  // Define the Interface for user display and consumption
  let iFace = new NetworkInterfaceBuilder({
    effects,
    name: "Websocket",
    id: "websocket",
    description: "Nostr clients use this interface to connect to the relay",
    ui: false,
    basic: null,
    path: "",
    search: {},
  })

  // Choose which origins to attach to this interface. The resulting addresses will share the attributes of the interface (name, path, search, etc)
  const addressReceipt = await iFace.exportAddresses([
    torOrigin,
    lanOrigins.ip,
  ])

  // Export all address receipts for all interfaces to obtain interface receipt
  const interfaceReceipt = exportInterfaces(addressReceipt)

  // **** Health Checks (optional) ****

  // **** Daemons ****
  return Daemons.of({
    effects,
    started,
    interfaceReceipt,
    healthReceipts: [],
  }).addDaemon({
    id: "ws",
    command: "./nostr-rs-relay --db /data",
    ready: {
      display: {
        name: "Websocket Live",
        message: "The websocket is live",
      },
      fn: () => utils.checkPortListening(8080, {}),
    },
  })
})
