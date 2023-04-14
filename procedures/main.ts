import { Daemons, NetworkBuilder, NetworkInterfaceBuilder, runningMain } from "start-sdk/lib/mainFn";
import exportInterfaces from "start-sdk/lib/mainFn/exportInterfaces";
import { ExpectedExports } from "start-sdk/lib/types";
import { utils } from "start-sdk/lib/util";

export const main: ExpectedExports.main = runningMain(async ({ effects, started }) => {
  const { checkPortListening } = utils(effects);
  // **** Setup ***

  await effects.runCommand("chown -R $APP_USER:$APP_USER $APP_DATA");
  await effects.runCommand("su - $APP_USER > /dev/null 2>&1");
  await effects.runCommand("cp $APP_DATA/config.toml.tmp $APP/config.toml");

  // **** Interface ****

  const networkBuilder = NetworkBuilder.of(effects);
  const torHostname = networkBuilder.getTorHostName("torHostname");
  const registeredPort = networkBuilder.getPort("port");
  const torBinding = await torHostname.bindTor(8080, 80);
  const torOrigin = torBinding.createOrigin("ws");
  const lanBinding = await registeredPort.bindLan(8080);
  const lanOrigins = lanBinding.createOrigins("wss");

  let iface = new NetworkInterfaceBuilder({
    effects,
    name: "Websocket",
    id: "websocket",
    description: "Nostr clients use this interface for connecting to the relay",
    ui: false,
    basic: null,
    path: "",
    search: {},
  });

  const ifaceAddresses = await iface.exportAddresses([torOrigin, lanOrigins.local]);

  const interfaceReceipt = exportInterfaces(ifaceAddresses);

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
      fn: () => checkPortListening(8080, {}),
    },
  });
});
