import { matches } from "start-sdk/lib";
import { FileHelper } from "start-sdk/lib/util";
import { publicConfig } from "../inputSpec";

const { object, array, string, number, anyOf, allOf } = matches;

const tomlShape = allOf(
  object({
    network: object({
      address: string,
      port: number,
    }),
    options: object({
      reject_future_seconds: number,
    }),
    info: object({
      relay_url: string,
    }),
  }),
  anyOf(
    object({
      authorization: object({
        pubkey_whitelist: array(string),
      }),
    }),
    publicConfig.validator()
  )
);

export const tomlFile = FileHelper.toml("config.toml", "main", tomlShape);
