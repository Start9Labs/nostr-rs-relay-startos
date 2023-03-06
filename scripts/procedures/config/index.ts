import { configSpec } from "./configSpec";
import { write } from "./write";
import { read } from "./read";
import { setupConfigExports } from "start-sdk/config";

export const { getConfig, setConfig } = setupConfigExports({
  spec: configSpec,
  dependsOn: {},
  write,
  read,
});
