# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (architecture, for developers and LLMs) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `nostr-rs-relay`.** Exposes a single `relay` WebSocket interface (`ws`, host id `websocket`) that Nostr clients connect to. Config lives in a TOML file model (`config.toml`) driven entirely by actions; there are no service dependencies.

## Inspecting a running install

To run a command inside the service's container (read its generated config, grep app logs), use `start-cli package attach nostr-rs-relay -n nostr-rs-relay-sub -- <cmd>`. Select the subcontainer by **name** with `-n` (the name passed to `SubContainer.of` in `main.ts` — here `nostr-rs-relay-sub`) or by image with `-i`. Note: `-s/--subcontainer` matches the internal **Guid**, not the name, so passing a name to `-s` fails with "no matching subcontainers".
