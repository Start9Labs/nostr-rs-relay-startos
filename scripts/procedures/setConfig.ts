import { compat, matches, types as T, TOML } from "../deps.ts";
import { SetConfig, setConfigMatcher } from "./getConfig.ts";

// const { string, boolean, shape } = matches;

export const setConfig: T.ExpectedExports.setConfig = async (
  effects: T.Effects,
  input: T.Config,
) => {
  const config = setConfigMatcher.unsafeCast(input) as any;
  // await checkConfigRules(config);

  config.network = { address:"0.0.0.0", port: 8080 };
  config.options = { reject_future_seconds: 1800 };
  config.info = { relay_url: `ws://${config["tor-address"]}` };

  const relayTypeUnion = config["relay-type"];
  if (relayTypeUnion.type === 'private') {
    config.authorization = { "pubkey_whitelist": relayTypeUnion["pubkey_whitelist"] };
  } else if (relayTypeUnion.type === 'public') {
    config.info = { ...config.info, ...relayTypeUnion.info }
    config.limits = relayTypeUnion.limits
  }

  delete config["lan-address"];
  delete config["tor-address"];
  delete config["relay-type"];

  await effects.createDir({
    path: "start9",
    volumeId: "main",
  });

  await effects.writeFile({
    path: "config.toml.tmp",
    toWrite: TOML.stringify(config),
    volumeId: "main",
  });

  return await compat.setConfig(effects, input);
};
