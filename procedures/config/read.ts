import { InputSpec } from "./inputSpec";
import { tomlFile } from "./file-models/config.toml";
import { utils } from "start-sdk/lib/util";
import { Read } from "start-sdk/lib/config/setupConfigExports";
import { ConfigType } from ".";

export const read: Read<ConfigType> = async ({ effects }) => {
  const { readFile } = utils(effects);
  const data = await readFile(tomlFile);

  if (data == null) return {} as InputSpec;

  if ("authorization" in data) {
    return {
      relayType: {
        unionSelectKey: "private",
        unionValueKey: {
          pubkey_whitelist: data.authorization.pubkey_whitelist,
        },
      },
    };
  }

  return {
    relayType: {
      unionSelectKey: "public",
      unionValueKey: {
        info: data.info,
        limits: data.limits,
      },
    },
  };
};
