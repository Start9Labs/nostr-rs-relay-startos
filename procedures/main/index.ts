import { Types } from "start-sdk";
import relayAvailable from "./health-checks/relayAvailable";

export const main: Types.ExpectedExports.main = async ({ effects }) => {
  const runningHealth = relayAvailable.create(effects).start();
  const config = await effects.getServiceConfig()
  await effects.runCommand({
    command: "chown",
    args: ["-R", "$APP_USER:$APP_USER", "$APP_DATA"],
  });

  await effects.runCommand({
    command: "su",
    args: ["-", "$APP_USER", ">", "/dev/null", "2>&1"],
  });

  await effects.runCommand({
    command: "cp",
    args: ["$APP_DATA/config.toml.tmp", "$APP/config.toml"],
  });

  const relay = effects.runDaemon({
    command: "./nostr-rs-relay",
    args: ["--db", "/data"],
  });

  return await relay.wait();
};
