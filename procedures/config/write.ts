import { Types } from "start-sdk";
import { InputSpec } from "./inputSpec";
import { tomlFile } from "./file-models/config.toml";

export async function write(effects: Types.Effects, inputSpec: InputSpec) {
  const toSave = {
    network: {
      address: "0.0.0.0",
      port: 8080,
    },
    options: {
      reject_future_seconds: 1800,
    },
    info: {
      relay_url: await effects.getInterface('websocket').getTorAddress('wss'),
    },
  };

  const relayType = inputSpec.relayType

  if (relayType.unionSelectKey === 'private') {
    await tomlFile.write(
      {
        ...toSave,
        authorization: {
          pubkey_whitelist: relayType.pubkey_whitelist,
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
        ...relayType.info,
      },
      limits: relayType.limits,
    },
    effects
  );
}
