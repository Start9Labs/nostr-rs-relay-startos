import { compat, TOML, types as T } from "../deps.ts";

export const setConfig: T.ExpectedExports.setConfig = async (
  effects: T.Effects,
  input: T.Config,
) => {
  const config: any = {
    network: {
      address: "0.0.0.0",
      port: 8080
    },
    options: {
      reject_future_seconds: 1800
    },
    info: {
      relay_url: `ws://${input["tor-address"]}`
    }
  };

  const relayTypeUnion = input["relay-type"] as any;
  if (relayTypeUnion.type === "private") {
    config.authorization = {
      "pubkey_whitelist": relayTypeUnion["pubkey_whitelist"]
    };
  } else if (relayTypeUnion.type === "public") {
    config.info = { ...config.info, ...relayTypeUnion.info };
    config.limits = relayTypeUnion.limits;
  }

  const volumeId = "main"

  await effects.createDir({
    path: "start9",
    volumeId,
  });

  await effects.writeFile({
    path: "config.toml.tmp",
    toWrite: TOML.stringify(config),
    volumeId,
  });

  return await compat.setConfig(effects, input);
};
