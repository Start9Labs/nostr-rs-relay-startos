import { Types } from "start-sdk";
import { ConfigSpec } from "./configSpec";
import { tomlFile } from "./files/config.toml";

export async function write(effects: Types.Effects, config: ConfigSpec) {
  const toSave = {
    network: {
      address: "0.0.0.0",
      port: 8080,
    },
    options: {
      reject_future_seconds: 1800,
    },
    info: {
      relay_url: `ws://${await effects.getServiceTorAddress({
        packageId: "nostr",
        interfaceName: "main",
      })}`,
    },
  };
  if (config["relay-type"].type === "private") {
    await tomlFile.write(
      {
        ...toSave,
        authorization: {
          pubkey_whitelist: config["relay-type"].pubkey_whitelist as string[],
        },
      },
      effects
    );
    return;
  }
  await tomlFile.write(
    {
      ...toSave,
      info: {
        ...toSave.info,
        ...config["relay-type"].info,
      },
      limits: config["relay-type"].limits,
    },
    effects
  );
}
