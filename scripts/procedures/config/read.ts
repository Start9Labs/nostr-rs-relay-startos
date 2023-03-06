import { Types } from "start-sdk";
import { ConfigSpec } from "./configSpec";
import { tomlFile } from "./files/config.toml";

export async function read(
  effects: Types.Effects
): Promise<Partial<ConfigSpec>> {
  const data = await tomlFile.read(effects);
  if (data == null) return {};
  if ("authorization" in data) {
    return {
      "relay-type": {
        type: "private",
        pubkey_whitelist: data.authorization.pubkey_whitelist,
      },
    };
  }

  return {
    "relay-type": {
      type: "public",
      info: data.info,
      limits: data.limits,
    },
  };
}
