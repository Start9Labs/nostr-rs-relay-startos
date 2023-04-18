import { DependenciesFn } from "start-sdk/lib/config/setupConfigExports";
import { WriteReturn } from "./write";
import { ConfigType } from ".";

export const dependencies: DependenciesFn<ConfigType, WriteReturn> = async () => {};
