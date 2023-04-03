import { Types } from "start-sdk";
import relayAvailable from "./health-checks/relayAvailable";
import { Effects } from "start-sdk/lib/types";
import * as matches from "ts-matches";
import { matchConfigSpec } from "../config/inputSpec";

export const main: Types.ExpectedExports.main = async ({ effects }) => {
  const runningHealth = relayAvailable.create(effects).start();
  const config = await effects.getServiceConfig();

  // interfaces:
  //   websocket:
  //     name: Websocket Interface
  //     description: Nostr websocket relay interface
  //     tor-config:
  //       port-mapping:
  //         80: "8080"
  //     lan-config:
  //       443:
  //         ssl: true
  //         internal: 8080
  //     ui: false
  //     protocols:
  //       - tcp
  //       - http
  // TODO BLUJ
  // Want ws://onionaddress.onion
  const websocket = await effects.bindTor({
    name: "websocket",
    internalPort: 8080,
    externalPort: 80,
  });
  const ip = await (effects as any).getLocalIp();
  // Want wss://localIp:port
  /** TODO BLUJ rename the bindLocal to bindPort */
  const port = await (effects as any).bindPort({
    name: "websocket",
    internalPort: 8080,
  });

  const constructOrigin = (hostName: string, protocol: "http" | "https" | "wss" | "ws") => `${protocol}://${hostName}`;
  const constructPortOrigin = (port: number, ip: string, protocol: "http" | "https" | "wss" | "ws") =>
    `${protocol}://${ip}:${port}`;

  await effects.exportAddress({
    name: "Onions (websocket)",
    description: "When you want to be able to point your client to a relay",
    href: constructOrigin(websocket, "ws"),
    id: "websocketTor",
  });
  await effects.exportAddress({
    name: "Local Network Address",
    description: "When you want to be able to point your client to a relay",
    href: constructPortOrigin(port, ip, "wss"),
    id: "websocketPort",
  });

  await (effects as any).exportOnion({
    name: "Onions (websocket)",
    description: "When you want to be able to point your client to a relay",
    internalPort: 8080,
    externalPort: 80,
    protocol: "ws",
    hostId: "1",
    id: "websocketTor",
  });
  // Based on the showIp and the showLocal, is what we would send to the ui interfaces screen
  // {
  //   ip: 'https://192.24:65',
  //   local: 'https://smart.local:65',
  // },
  await (effects as any).exportPort({
    name: "Port (websocket)",
    description: "When you want to be able to point your client to a relay",
    internalPort: 8080,
    protocol: "ws",
    hostId: "1",
    id: "websocketTor",
    showType: "both", // default 'both'    // 'both', 'local', 'ip'
  });

  // @Matt suggestions
  const iface = await (effects as any).exportInterface({
    name: "Websocket",
    id: "websocket",
    description: "Nostr clients use this interface for connecting to the relay",
    internalPort: 8080,
    ui: false,
    path: "",
  });
  const torAddress = iface.bindTor({
    id: "tor",
    protocol: "wss",
    externalPort: 443,
  });
  const lanAddresses = iface.bindLan({
    id: "lan",
    protocol: "wss",
  });
  await iface.exportAddresses([torAddress, lanAddresses.ip, lanAddresses.local]);

  await effects.shell("chown -R $APP_USER:$APP_USER $APP_DATA");

  await effects.shell("su - $APP_USER > /dev/null 2>&1");

  await effects.shell("cp $APP_DATA/config.toml.tmp $APP/config.toml");

  await effects.shell("./nostr-rs-relay --db /data");
};

function todo(): any {
  throw new Error("not implemented");
}
type NetworkInterface = any;
class NetworkInterfaceBuilder {
  constructor(readonly value: any) {}
}
type HealthRunner = any;
type Daemon = any;
/**
 * This will deal with setting in the hooks to config
 * During the start of the service it will call
 * 1. initializeInterfaces
 * 2. initializeHealthServices
 * 3. initialize
 * 4. startService
 *
 * During the register restart events (like the config does):
 *  restartService: If this returns restarted, it lets us know we did the restart
 *    if this returns osRestartMe, we are going to do a full restart on the main, and we will call the stop -> start
 *
 * During the shutdown:
 *  shutdown
 */
const mainOf: <
  Config,
  I extends Record<string, NetworkInterface>,
  H extends Record<string, HealthRunner>,
  R extends Record<string, Daemon>
>(options: {
  configValidator: matches.Parser<unknown, Config>;

  initializeInterfaces(options: { effects: Effects; config: Config }): Promise<I>;
  initializeHealthServices(options: { effects: Effects; config: Config }): Promise<H>;

  initialize(options: { effects: Effects; config: Config; interfaces: I; health: H }): Promise<void>;
  startService(options: { effects: Effects; config: Config; interfaces: I; health: H }): Promise<R>;
  shutdownService(options: { effects: Effects; config: Config; interfaces: I; health: H; running: R }): Promise<void>;
  restartService(options: {
    effects: Effects;
    config: Config;
    interfaces: I;
    health: H;
    running: R;
  }): Promise<["osRestartMe"] | ["restarted", R]>;
}) => Types.ExpectedExports.main = todo();
export const main2: Types.ExpectedExports.main = mainOf({
  configValidator: matchConfigSpec,
  async initializeInterfaces({ effects }) {
    let iface = new NetworkInterfaceBuilder({
      name: "Websocket",
      id: "websocket",
      description: "Nostr clients use this interface for connecting to the relay",
      internalPort: 8080,
      ui: false,
      path: "",
      effects,
    }) as any;
    iface = iface.tor("tor").protocol("wss", 443).protocol("https", 443).protocol("http", 80).protocol("ws", 80);

    iface.build("tor", "myLan");

    const torAddress = await iface.bindTor({
      id: "tor",
      // protocols: {}[("wss", "ws")],
      externalPort: [443, 80],
    });
    const torAddress2 = await iface.bindTor({
      id: "tor2",
      protocol: "http",
      externalPort: 80,
    });
    const lanAddresses = await iface.bindLan({
      id: "lan",
      protocol: "wss",
    });
    return { main: await iface.exposeAddresses([torAddress, lanAddresses.ip, lanAddresses.local]) };
  },
  async initializeHealthServices({ effects, config }) {
    if (config.relayType.unionSelectKey == "private") {
      config.relayType.pubkey_whitelist;
    }
    return {
      heal4th: relayAvailable.create(effects).start(),
    };
  },
  async initialize() {},
  async startService({ effects }) {
    await effects.shell("chown -R $APP_USER:$APP_USER $APP_DATA");

    await effects.shell("su - $APP_USER > /dev/null 2>&1");

    await effects.shell("cp $APP_DATA/config.toml.tmp $APP/config.toml");

    return effects.runDaemon({ command: "./nostr-rs-relay", args: "--db /data".split(" ") });
  },
  async shutdownService({ running, health }) {
    health.heal4th.stop();
    await running.term();
  },
  async restartService({ effects, running }) {
    await running.term();

    await effects.shell("cp $APP_DATA/config.toml.tmp $APP/config.toml");

    return ["restarted", effects.runDaemon({ command: "./nostr-rs-relay", args: "--db /data".split(" ") })];
  },
});
