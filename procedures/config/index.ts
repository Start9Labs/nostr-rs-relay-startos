import { InputSpec, inputSpec } from "./inputSpec";
import { write } from "./write";
import { read } from "./read";
import { setupConfigExports } from "start-sdk/lib/config";
import { utils } from "start-sdk/lib/util";
import { tomlFile } from "./file-models/config.toml";

export const { getConfig, setConfig } = setupConfigExports({
  spec: inputSpec,
  write,
  read,
  async dependencies() {},
});
