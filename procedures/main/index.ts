import { Types } from "start-sdk";
import { readyCheck } from "start-sdk/lib/health";
import { checkPortListening } from "start-sdk/lib/health/checkFns";
import { changeOnFirstSuccess, cooldownTrigger } from "start-sdk/lib/health/trigger";
import { NetworkBuilder, NetworkInterfaceBuilder, runningMain } from "start-sdk/lib/mainFn";
import exportInterfaces from "start-sdk/lib/mainFn/exportInterfaces";
import { sh } from "start-sdk/lib/util";

// Network
// -------

// Main
// -------

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
  await effects.runCommand(sh("chown -R $APP_USER:$APP_USER $APP_DATA"));
  await effects.runCommand(sh("su - $APP_USER > /dev/null 2>&1"));
  await effects.runCommand(sh("cp $APP_DATA/config.toml.tmp $APP/config.toml"));
  const daemonReceipt = effects.runDaemon({
    command: "./nostr-rs-relay",
    args: "--db /data".split(" "),
  });

  // **** Additional Health Checks (optional) ****

  // **** Primary Health Check (required) ****
  const readyReceipt = readyCheck({
    effects,
    started,
    interfaceReceipt,
    healthReceipts: [],
    daemonReceipt,
    name: "Websocket Live",
    trigger: changeOnFirstSuccess({
      beforeFirstSuccess: cooldownTrigger(0),
      afterFirstSuccess: cooldownTrigger(30000),
    }),
    fn: () => checkPortListening(effects, 8080, {}),
    onFirstSuccess() {
      return () => daemonReceipt.term();
    },
  });

  // Return ready receipt
  return readyReceipt;
});
