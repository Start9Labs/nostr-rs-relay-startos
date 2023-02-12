import { compat, types as T } from "../deps.ts";

export const migration: T.ExpectedExports.migration = compat.migrations
    .fromMapping({
        "0.8.2": {
            up: compat.migrations.updateConfig(
                (config) => {
                    config.info = {};
                    config.limits = { "event_kind_blacklist": [] };
                    config.authorization = { "pubkey_whitelist": [] };
                    return config;
                },
                true,
                { version: "0.8.2", type: "up" },
            ),
            down: compat.migrations.updateConfig(
                (_config) => {
                    return {};
                },
                true,
                { version: "0.8.2", type: "down" },
            ),
      },
        "0.8.2.1": {
            up: compat.migrations.updateConfig(
                (_config) => {
                    return {};
                },
                false,
                { version: "0.8.2.1", type: "up" },
            ),
            down: compat.migrations.updateConfig(
                (_config) => {
                    return {};
                },
                false,
                { version: "0.8.2.1", type: "down" },
            ),
      },
    },
    "0.8.2.1",
);
