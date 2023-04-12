import { InputSpec } from "./inputSpec";
import { tomlFile } from "./file-models/config.toml";
import { Effects } from "start-sdk/lib/types";

export async function read({ effects }: { effects: Effects }): Promise<InputSpec> {
  const data = await tomlFile.read(effects);

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
}
