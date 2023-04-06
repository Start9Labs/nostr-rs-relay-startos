import { Types } from "start-sdk";
import { InputSpec } from "./inputSpec";
import { tomlFile } from "./file-models/config.toml";

export async function read(
  effects: Types.Effects
): Promise<Partial<InputSpec>> {
  const data = await tomlFile.read(effects);
  if (data == null) return {};
  if ("authorization" in data) {
    return {
      relayType: {
        unionSelectKey: 'private',
        unionValueKey: {
          pubkey_whitelist: data.authorization.pubkey_whitelist,
        }
      },
    };
  }

  return {
    relayType: {
      unionSelectKey: 'public',
      unionValueKey: {
        info: data.info,
        limits: data.limits,
      }
    },
  };
}
