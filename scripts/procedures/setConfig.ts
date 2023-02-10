import { compat, matches, types as T, TOML } from "../deps.ts";
import { SetConfig, setConfigMatcher } from "./getConfig.ts";

// const { string, boolean, shape } = matches;

export const setConfig: T.ExpectedExports.setConfig = async (
  effects: T.Effects,
  input: T.Config,
) => {
  const config = setConfigMatcher.unsafeCast(input);
//   await checkConfigRules(config);
  const configToml = config as any;
  configToml.network = { address:"0.0.0.0", port: 8080 };
  configToml.options = { reject_future_seconds: 1800 };
  configToml.info.relay_url = `ws://${config["tor-address"]}`;
  delete configToml["lan-address"];
  delete configToml["tor-address"];
  if (typeof configToml.authorization["pubkey_whitelist"] !== 'undefined' && configToml.authorization["pubkey_whitelist"].length === 0) {
    delete configToml.authorization["pubkey_whitelist"];
  }

  await effects.createDir({
    path: "start9",
    volumeId: "main",
  });

  await effects.writeFile({
    path: "config.toml.tmp",
    toWrite: TOML.stringify(configToml),
    volumeId: "main",
  });

  return await compat.setConfig(effects, input);
};
