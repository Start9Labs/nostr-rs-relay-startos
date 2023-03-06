import { matches, Types, util, YAML } from "start-sdk";

const { shape, string } = matches;

const noPropertiesFound: Types.ResultType<Types.Properties> = {
  result: {
    version: 2,
    data: {
      "Not Ready": {
        type: "string",
        value:
          "Could not find properties. Nostr RS Relay might still be starting...",
        qr: false,
        copyable: false,
        masked: false,
        description: "Properties could not be found",
      },
    },
  },
} as const;

const configMatcher = shape({
  "tor-address": string,
  "lan-address": string,
});

export const properties: Types.ExpectedExports.properties = async ({
  effects,
}) => {
  if (
    (await util.exists(effects, {
      volumeId: "main",
      path: "start9/config.yaml",
    })) === false
  ) {
    return noPropertiesFound;
  }
  const config = configMatcher.unsafeCast(
    YAML.parse(
      await effects.readFile({
        path: "start9/config.yaml",
        volumeId: "main",
      })
    )
  );
  const properties: Types.ResultType<Types.Properties> = {
    result: {
      version: 2,
      data: {
        "Nostr relay websocket URL (Tor, recommended)": {
          type: "string",
          value: `ws://${config["tor-address"]}`,
          description:
            "Share this URL with anyone who wants to connect to your relay over Tor. Remember to enable `network.websocket.allowInsecureFromHTTPS` in `about:config` to be able to access your relay using a client in Firefox or Tor Browser.",
          copyable: true,
          qr: false,
          masked: false,
        },
        "Nostr relay websocket URL (LAN, not recommended)": {
          type: "string",
          value: `wss://${config["lan-address"]}`,
          description:
            "Use this URL to connect to your relay over LAN. Only for testing purposes.",
          copyable: true,
          qr: false,
          masked: false,
        },
      },
    },
  } as const;
  return properties;
};
