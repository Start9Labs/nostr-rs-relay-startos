import { Types } from "start-sdk";

export const main: Types.ExpectedExports.main = runningMain(async ({ effects, started }) => {
  // **** Interface ****
  const torHostname = (effects as any).getTorHostname('torHostname')
  const torBinding = await (effects as any).bindTor(torHostname, 8080, 80)
  const torOrigin = torBinding.createOrigin("ws")
  const lanBinding = await (effects as any).bindLan(8080);
  const lanOrigins = lanBinding.createOrigins("wss")

  let iface = new NetworkInterfaceBuilder({
    name: "Websocket",
    id: "websocket",
    description: "Nostr clients use this interface for connecting to the relay",
    ui: false,
    basic: null,
    path: "",
    search: {}
  }) as any

  const ifaceAddresses = iface.exportAddresses([torOrigin, lanOrigins.local])

  const ifaceReceipt = exportInterfaces([ifaceAddresses])

  // **** Daemons ***
  await effects.shell("chown -R $APP_USER:$APP_USER $APP_DATA");
  await effects.shell("su - $APP_USER > /dev/null 2>&1");
  await effects.shell("cp $APP_DATA/config.toml.tmp $APP/config.toml");
  const daemonReceipt = effects.runDaemon({
    command: "./nostr-rs-relay",
    args: "--db /data".split(" "),
  });

  // **** Additional Health Checks (optional) ****

  // **** Primary Health Check (required) ****
  const readyReceipt = readyCheck({
    effects,
    started,
    ifaceReceipt,
    healthReceipts: [],
    daemonReceipt,
    name: "Websocket Live",
    trigger?: changeOnFirstSuccess({
      beforeFisrtSuccess: cooldownTrigger(0),
      afterFirstSuccess: cooldownTrigger(30000),
    }),
    fn: () => checkPortListening(effects, 8080),
    onFirstSuccess? () {
      return started(() => daemon.term());
    },
  });

  // Return ready receipt
  return readyReceipt
});
