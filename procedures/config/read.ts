import { InputSpec } from "./inputSpec";
import { tomlFile } from "./file-models/config.toml";
import { Effects } from "start-sdk/lib/types";
import { WriteReturn } from "./write";
import { utils } from "start-sdk/lib/util";

export async function read({ effects }: { effects: Effects; config: WriteReturn }): Promise<InputSpec> {
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
}
