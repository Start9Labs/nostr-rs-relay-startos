import { Types } from "start-sdk";
import relayAvailable from "./health-checks/relayAvailable";
import { Effects } from "start-sdk/lib/types";
import * as matches from "ts-matches";
import { matchConfigSpec } from "../config/inputSpec";

// --------------------------------------------------------------
// Library Code for main
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
const mainOf:<
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

// --------------------------------------------------------------
// This is the main 2 which uses a single builder to make the main instead of a single giant function
export const main: Types.ExpectedExports.main = mainOf({
  configValidator: matchConfigSpec,
  async initializeInterfaces({ effects }) {
    /**
     * returns a random Tor hostname
     */
    const torHostname = (effects as any).getTorHostname('torHostname')
    /**
     * initializes a Tor host with the chosen internal and external ports
     * e.g. "privacy34kn4ez3y3nijweec6w4g54i3g54sdv7r5mr6soma3w4begyd.onion"
     */
    const torBinding = (effects as any).bindTor(torHostname, 8080, 80)
    /**
     * creates a Tor origin with the given protocol
     * e.g. "https://privacy34kn4ez3y3nijweec6w4g54i3g54sdv7r5mr6soma3w4begyd.onion"
     */
    const torOrigin = torBinding.createOrigin("ws")
    /**
     * initializes a LAN host with the given internal port at a random external port
     * e.g. 192.168.1.9:5959
     */
    const lanBinding = (effects as any).bindLan(8080);
    /**
     * creates LAN origins (IP and .local) with the given protocol
     * 
     * e.g. { ip: https://192.168.1.9:5959, local: https://adjective-noun.local:5959 }
     */
    const lanOrigins = lanBinding.createOrigins("wss")
    /**
     * initializes an interface, aka a collection of web addresses that all return the same resource
     */
    let iface = new NetworkInterfaceBuilder({
      name: "Websocket",
      id: "websocket",
      description: "Nostr clients use this interface for connecting to the relay",
      ui: false,
      basic: null,
      path: "",
      search: {}
    }) as any;
    /**
     * creates addresses and makes them available to the end user. Order matters.
     * 
     * e.g. [https://useranme:password@privacy34kn4ez3y3nijweec6w4g54i3g54sdv7r5mr6soma3w4begyd.onion/admin?queryparam=1234, https://username:password@192.168.1.9:5959/admin?queryparam=1234]
     */
    iface.exportAddresses([torOrigin, lanOrigins.local])

    // return the created interfaces
    return [iface]
  },
  async initializeHealthServices({ effects, config }) {
    if (config.relayType.unionSelectKey == "private") {
      config.relayType.pubkey_whitelist;
    }
    return {
      health: relayAvailable.create(effects).start(),
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
    health.health.stop();
    await running.term();
  },
  async restartService({ effects, running }) {
    await running.term();

    await effects.shell("cp $APP_DATA/config.toml.tmp $APP/config.toml");

    return ["restarted", effects.runDaemon({ command: "./nostr-rs-relay", args: "--db /data".split(" ") })];
  },
});

// --------------------------------------------------------------
// Library Code for main 2
class Builder<T> {
  static of<T>(t: T) {
    return new Builder(t);
  }
  constructor(readonly value: T) {}

  build(): T {
    return this.value;
  }
}

/** Used as indicating what the initialization of the interfaces does */
class MainInitializeInterface {
  static of<C, I extends Record<string, NetworkInterface>>(
    _validator: matches.Parser<unknown, C>,
    fn: (options: { effects: Effects; config: C }) => Promise<I>
  ) {
    return Builder.of([new MainInitializeInterface(), fn] as const);
  }
}

/** Health daemons ran during the initialization to know the health of the service */
class MainInitializeHealthDaemons {
  static of<C, H extends Record<string, HealthRunner>>(
    _validator: matches.Parser<unknown, C>,
    fn: (options: { effects: Effects; config: C }) => Promise<H>
  ) {
    return Builder.of([new MainInitializeHealthDaemons(), fn] as const);
  }
}

type ReturnTypePromise<A> = A extends (...args: any) => Promise<infer B> ? B : [A];

class MainInitialize {
  static of<C, D, I>(
    _validator: matches.Parser<unknown, C>,
    _healthDaemons: Builder<readonly [MainInitializeHealthDaemons, D]>,
    _interfaces: Builder<readonly [MainInitializeInterface, I]>,
    fn: (options: {
      effects: Effects;
      config: C;
      interfaces: ReturnTypePromise<I>;
      health: ReturnTypePromise<D>;
    }) => Promise<void>
  ) {
    return Builder.of([new MainInitialize(), fn] as const);
  }
}
class MainStartService {
  static of<C, H, I, R>(
    _validator: matches.Parser<unknown, C>,
    _healthDaemons: Builder<readonly [MainInitializeHealthDaemons, H]>,
    _interfaces: Builder<readonly [MainInitializeInterface, I]>,
    fn: (options: {
      effects: Effects;
      config: C;
      interfaces: ReturnTypePromise<I>;
      health: ReturnTypePromise<H>;
    }) => Promise<R>
  ) {
    return Builder.of([new MainStartService(), fn] as const);
  }
}
class MainShutdownService {
  static of<C, H, I, R>(
    _validator: matches.Parser<unknown, C>,
    _healthDaemons: Builder<readonly [MainInitializeHealthDaemons, H]>,
    _interfaces: Builder<readonly [MainInitializeInterface, I]>,
    _running: Builder<readonly [MainStartService, R]>,
    fn: (options: {
      effects: Effects;
      config: C;
      interfaces: ReturnTypePromise<I>;
      health: ReturnTypePromise<H>;
      running: ReturnTypePromise<R>;
    }) => Promise<void>
  ) {
    return Builder.of([new MainShutdownService(), fn] as const);
  }
}
class MainRestartService {
  static of<C, H, I, R>(
    _validator: matches.Parser<unknown, C>,
    _healthDaemons: Builder<readonly [MainInitializeHealthDaemons, H]>,
    _interfaces: Builder<readonly [MainInitializeInterface, I]>,
    _running: Builder<readonly [MainStartService, R]>,
    fn: (options: {
      effects: Effects;
      config: C;
      interfaces: ReturnTypePromise<I>;
      health: ReturnTypePromise<H>;
      running: ReturnTypePromise<R>;
    }) => Promise<["osRestartMe"] | ["restarted", ReturnTypePromise<R>]>
  ) {
    return Builder.of([new MainRestartService(), fn] as const);
  }
}

function mainOf2(
  validator: matches.Parser<unknown, unknown>,
  healthDaemons: Builder<readonly [MainInitializeHealthDaemons, unknown]>,
  interfaces: Builder<readonly [MainInitializeInterface, unknown]>,
  initialize: Builder<readonly [MainInitialize, unknown]>,
  running: Builder<readonly [MainStartService, unknown]>,
  shutdown: Builder<readonly [MainShutdownService, unknown]>,
  restart: Builder<readonly [MainRestartService, unknown]>
): Types.ExpectedExports.main {
  return todo();
}

// --------------------------------------------------------------
// The is the implementation of main 3, which uses smaller builders to then compose into a final main builder

const initializeInterfaces = MainInitializeInterface.of(matchConfigSpec, async ({ effects, config }) => {
  let iface = new NetworkInterfaceBuilder({
    name: "Websocket",
    id: "websocket",
    description: "Nostr clients use this interface for connecting to the relay",
    internalPort: 8080,
    ui: false,
    path: "",
    effects,
  }) as any;
  /**
   * finds or creates a random Tor hostname by ID and returns the hostname builder
   */
  const torHostname1 = iface.getTorHostname("torHost1");
  /**
   * initializes a Tor host with the chosen protocol, hostname, and external port and returns the address string
   *
   * e.g. http://privacy34kn4ez3y3nijweec6w4g54i3g54sdv7r5mr6soma3w4begyd.onion
   *
   * the ID can be used to later retrieve the address
   */
  const torAddress = await torHostname1.bindTor({
    id: "torAddress",
    protocol: "wss",
    externalPort: 443,
  });
  /**
   * initializes a LAN host with the chosen protocol and random port and returns both LAN addresses (IP and .local)
   *
   * e.g. { ip: https://192.168.1.9:5959, local: https://adjective-noun.local:5959 }
   *
   * the ID can be used to later retrieve the address record
   */
  const lanAddresses = await iface.bindLan({
    id: "lanAddresses",
    protocol: "wss",
  });
  /**
   * determines addresses that will be exposed to the user for this interface. Order is preserved.
   */
  iface.exposeAddresses([torAddress, lanAddresses.ip, lanAddresses.local]);

  return [iface];
});

const initializeHealthDaemons = MainInitializeHealthDaemons.of(matchConfigSpec, async ({ effects, config }) => {
  if (config.relayType.unionSelectKey == "private") {
    config.relayType.pubkey_whitelist;
  }
  return {
    health: relayAvailable.create(effects).start(),
  };
});

const initialize = MainInitialize.of(matchConfigSpec, initializeHealthDaemons, initializeInterfaces, async () => {});
const startService = MainStartService.of(
  matchConfigSpec,
  initializeHealthDaemons,
  initializeInterfaces,
  async ({ effects }) => {
    await effects.shell("chown -R $APP_USER:$APP_USER $APP_DATA");

    await effects.shell("su - $APP_USER > /dev/null 2>&1");

    await effects.shell("cp $APP_DATA/config.toml.tmp $APP/config.toml");

    return effects.runDaemon({ command: "./nostr-rs-relay", args: "--db /data".split(" ") });
  }
);

const initializeShutdownService = MainShutdownService.of(
  matchConfigSpec,
  initializeHealthDaemons,
  initializeInterfaces,
  startService,
  async ({ health, running }) => {
    health.health.stop();
    await running.term();
  }
);

const initializeRestartService = MainRestartService.of(
  matchConfigSpec,
  initializeHealthDaemons,
  initializeInterfaces,
  startService,
  async ({ effects, running }) => {
    await running.term();

    await effects.shell("cp $APP_DATA/config.toml.tmp $APP/config.toml");

    return ["restarted", effects.runDaemon({ command: "./nostr-rs-relay", args: "--db /data".split(" ") })];
  }
);

export const main2 = mainOf2(
  matchConfigSpec,
  initializeHealthDaemons,
  initializeInterfaces,
  initialize,
  startService,
  initializeShutdownService,
  initializeRestartService
);

export const main3: Types.ExpectedExports.main = async (
  { effects, started },
) => {
  initializeInterface(effects, "websocket")
    .bindTor({ internal: 8080, external: 80 })
    .bindLanPortForward({ internal: 8080 })
    .exportAll({
      name: "Websocket",
      description:
        "Nostr clients use this interface for connecting to the relay",
      ui: false,
      address: ({ hostname, type }) => {
        if (type == "tor") {
          return `ws://${hostname}`;
        } else {
          return `wss://${hostname}`;
        }
      },
    });

  await effects.shell("chown -R $APP_USER:$APP_USER $APP_DATA");
  await effects.shell("su - $APP_USER > /dev/null 2>&1");
  await effects.shell("cp $APP_DATA/config.toml.tmp $APP/config.toml");
  const daemon = effects.runDaemon({
    command: "./nostr-rs-relay",
    args: "--db /data".split(" "),
  });

  healthCheck(effects, {
    name: "Websocket Live",
    trigger: cooldownTrigger(0), // emits 0 ms after previous fn completes
    fn: checkPortIsListening(8080),
    onFirstSuccess: () => {
      this.trigger = cooldownTrigger(30000); // emits 30s after previous fn completes
      started(() => daemon.term());
    }, // optional
  });

  healthCheck(effects, {
    name: "Relay is Private",
    trigger: configTrigger(), // emits every time config is changed
    fn: (config) => {
      if (!config.private) throw new Error("Relay is not Private");
      else return "Relay is Private";
    }, // input type here is determined by trigger
  });
};


