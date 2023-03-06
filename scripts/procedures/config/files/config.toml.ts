import { matches } from "start-sdk";
import { FileHelper } from "start-sdk/util/index";
import { publicConfig } from "../configSpec";

const { object, array, string, number, boolean, anyOf, allOf, literals } =
  matches;
// todo Move things into sdk of health, and get the types
// new effect health, getTorAddress
// Raw file update
// Move location of that helper
// ConfigFiles uses shape instead of validator
// FileHelper instead of configFile

// Raw toFile fromFile
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

/**
 * This is a TOML file that is used to configure the relay.
 */
export const tomlFile = FileHelper.toml("config.toml", "main", tomlShape);
