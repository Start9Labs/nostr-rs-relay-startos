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
      relay_url: `ws://${await effects.getServiceTorAddress({
        packageId: "nostr",
        interfaceName: "main",
      })}`,
    },
  };

  const relayType = inputSpec.relayType

  if ("private" in relayType) {
    await tomlFile.write(
      {
        ...toSave,
        authorization: {
          pubkey_whitelist: relayType.private.pubkey_whitelist as string[],
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
        ...relayType.public.info,
      },
      limits: relayType.public.limits,
    },
    effects
  );
}
