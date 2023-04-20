import { InputSpec } from "./inputSpec";
import { tomlFile } from "./file-models/config.toml";
import { utils } from "start-sdk/lib/util";
import { Effects } from "start-sdk/lib/types";
import { Write } from "start-sdk/lib/config/setupConfigExports";
import { ConfigType } from ".";

export const write: Write<ConfigType> = async ({ effects, input }) => {
  const { writeFile } = utils(effects);
  const toSave = {
    network: {
      address: "0.0.0.0",
      port: 8080,
    },
    options: {
      reject_future_seconds: 1800,
    },
    info: {
      relay_url: `ws://${await effects.getServiceTorHostname("torHostname")}`,
    },
  };

  const relayType = input.relayType;

  if (relayType.unionSelectKey === "private") {
    await writeFile(tomlFile, {
      ...toSave,
      authorization: {
        pubkey_whitelist: relayType.unionValueKey.pubkey_whitelist,
      },
    });
  } else {
    const { info, limits } = relayType.unionValueKey;
    await writeFile(tomlFile, {
      ...toSave,
      info: {
        ...toSave.info,
        ...info,
      },
      limits,
    });
  }
};
