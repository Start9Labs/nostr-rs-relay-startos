import { Types, util } from "start-sdk";
import relayAvailable from "./health/relayAvailable";

export const main: Types.ExpectedExports.main = async ({ effects }) => {
  // args defaulted to [] - not necessary to include if empty
  await effects.runDaemon({ command: "docker_entrypoint.sh", args: [] }).wait();
  const runningHealth = relayAvailable.create(effects, 60).start();

  runningHealth.stop();
  await effects.runCommand({
    command: "chown",
    args: ["-R", "nostr:nostr", "/data"],
  });
  //   #!/bin/sh

  // chown -R $APP_USER:$APP_USER $APP_DATA

  // su - $APP_USER > /dev/null 2>&1

  // cp $APP_DATA/config.toml.tmp $APP/config.toml

  // exec tini ./nostr-rs-relay -- --db /data

  return util.ok;
};
