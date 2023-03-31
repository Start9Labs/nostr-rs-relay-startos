import { Types } from "start-sdk";
import relayAvailable from "./health-checks/relayAvailable";

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

  await effects.shell("chown -R $APP_USER:$APP_USER $APP_DATA");

  await effects.shell("su - $APP_USER > /dev/null 2>&1");

  await effects.shell("cp $APP_DATA/config.toml.tmp $APP/config.toml");

  await effects.shell("./nostr-rs-relay --db /data");
};
