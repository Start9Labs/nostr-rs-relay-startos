import { Types } from "start-sdk";
import { InputSpec } from "./inputSpec";
import { tomlFile } from "./file-models/config.toml";

export async function write({ effects, input }: { effects: Types.Effects; input: InputSpec }) {
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
    await tomlFile.write(
      {
        ...toSave,
        authorization: {
          pubkey_whitelist: relayType.unionValueKey.pubkey_whitelist,
        },
      },
      effects
    );
    return;
  } else {
    const { info, limits } = relayType.unionValueKey;
    await tomlFile.write(
      {
        ...toSave,
        info: {
          ...toSave.info,
          ...info,
        },
        limits,
      },
      effects
    );
  }
}

export type WriteReturn = ReturnType<typeof write> extends Promise<infer T> ? T : never;
