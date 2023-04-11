import { Types } from "start-sdk";
import { checkPortListening } from "start-sdk/lib/health/checkFns";
import { Daemons, NetworkBuilder, NetworkInterfaceBuilder, runningMain } from "start-sdk/lib/mainFn";
import exportInterfaces from "start-sdk/lib/mainFn/exportInterfaces";

export const main: Types.ExpectedExports.main = runningMain(async ({ effects, started }) => {
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

  // **** Daemons ***
  await effects.runCommand("chown -R $APP_USER:$APP_USER $APP_DATA");
  await effects.runCommand("su - $APP_USER > /dev/null 2>&1");
  await effects.runCommand("cp $APP_DATA/config.toml.tmp $APP/config.toml");
  const daemonReceipt = effects.runDaemon("./nostr-rs-relay --db /data");

  // **** Additional Health Checks (optional) ****

  // Return ready receipt
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
      fn: () => checkPortListening(effects, 8080, {}),
    },
  });
});
