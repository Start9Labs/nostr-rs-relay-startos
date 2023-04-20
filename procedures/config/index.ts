import { inputSpec } from "./inputSpec";
import { write } from "./write";
import { read } from "./read";
import { setupConfigExports } from "start-sdk/lib/config";
import { dependencies } from "./dependencies";
import { Config } from "start-sdk/lib/config/builder";

export type ConfigType = typeof inputSpec extends Config<infer A> ? A : never;
export const { getConfig, setConfig } = setupConfigExports(inputSpec, write, read, dependencies);
