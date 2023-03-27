import { inputSpec } from "./inputSpec";
import { write } from "./write";
import { read } from "./read";
import { setupConfigExports } from "start-sdk/lib/config";

export const { getConfig, setConfig } = setupConfigExports({
  spec: inputSpec,
  dependsOn: {},
  write,
  read,
});
