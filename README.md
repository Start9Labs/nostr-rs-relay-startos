<p align="center">
  <img src="icon.svg" alt="Nostr RS Relay Logo" width="21%">
</p>

# Nostr RS Relay on StartOS

> Everything not listed in this document should behave the same as upstream
> nostr-rs-relay. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[nostr-rs-relay](https://sr.ht/~gheartsfield/nostr-rs-relay/) is a Nostr relay: a websocket server that accepts, stores, and serves signed Nostr events. This package builds it from a pinned upstream release, exposes its whole configuration through four forms, and keeps the relay's data and its settings on separate volumes.

- **Upstream repo:** <https://sr.ht/~gheartsfield/nostr-rs-relay/>
- **Wrapper repo:** <https://github.com/Start9Labs/nostr-rs-relay-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

Built from source rather than pulled, because upstream publishes no image this package can use.

| Property      | Value                                                                    |
| ------------- | ------------------------------------------------------------------------ |
| Image         | Built from `Dockerfile` — a Rust build stage, then a slim Debian runtime |
| Architectures | x86_64, aarch64                                                          |
| Command       | `./nostr-rs-relay --db /usr/src/app/db`                                  |

| Subcontainer         | Purpose                                       |
| -------------------- | --------------------------------------------- |
| `nostr-rs-relay-sub` | The `primary` daemon — the one to `attach` to |

**The build is pinned to a release tag _and_ the commit that tag points to**, and the build fails outright if they ever disagree. That guards against a re-pointed tag silently changing what ships. Upstream develops on SourceHut; the build clones GitHub's faithful mirror, which has identical commit hashes and is more reliable to clone from.

The runtime stage deliberately mirrors upstream's own Dockerfile — same working directory, same `appuser`, same database path, same relative config path — so the image contract this package's code depends on stays upstream's rather than becoming a local invention. The command is in exec form so StartOS's SIGTERM reaches the relay directly instead of a shell wrapper.

One oneshot, `chown`, hands the working directory to `appuser` before the daemon starts, since StartOS creates volumes root-owned.

## Volume and Data Layout

Three volumes are declared and two carry data.

| Volume   | Mount Point                                                | Purpose                                                      |
| -------- | ---------------------------------------------------------- | ------------------------------------------------------------ |
| `db`     | `/usr/src/app/db`                                          | The SQLite event database — every event the relay has stored |
| `config` | its `config.toml` at `/usr/src/app/config.toml`, as a file | The relay's configuration                                    |
| `main`   | — (unused)                                                 | Retained only for the 0.10.0:1 migration path                |

**Splitting the database from the config is what makes the config replaceable without touching the data.** The config is mounted as a single file, not a directory, so nothing else on that volume enters the container.

The event database grows with what the relay accepts, and is the only thing here that cannot be rebuilt — events are signed by their authors and cannot be regenerated.

## File Models

One model, holding the relay's whole configuration.

| File          | Format | Modelled                | Written by                                 |
| ------------- | ------ | ----------------------- | ------------------------------------------ |
| `config.toml` | TOML   | Yes — `FileHelper.toml` | Every init, and the four configure actions |

**Enforced** — rewritten whenever the package writes: the listen address and port, so the relay always binds where the interface publishes, and the future-timestamp rejection window.

**Yours** — everything else, and it is the bulk of the file: relay identity and contact details, the event kind allow- and block-lists, the pubkey whitelist, the NIP-05 verification settings with their domain lists, and every rate and size limit. Each of the four actions owns one group.

A key left unset is absent from the file entirely rather than written as a zero or an empty list, so the relay applies its own default. Clearing a field in a form is therefore how you hand a setting back rather than pin it.

## Dependencies

None. The relay bundles its own SQLite database and needs nothing else installed.

## Network Access and Interfaces

One interface. Nostr clients connect to it as a websocket, which is what the relay's whole protocol runs over.

| Interface       | Id      | Type | Port | Description                                 |
| --------------- | ------- | ---- | ---- | ------------------------------------------- |
| Relay websocket | `relay` | api  | 8080 | Nostr clients use this interface to connect |

The port is bound on the `websocket` MultiHost with the `ws` protocol, and is not masked.

**`relay_url` in the config is separate from this**, and is yours to set. It is what the relay advertises about itself to clients querying its metadata — so it should be an address the relay actually publishes, or clients are told to reconnect somewhere that does not answer.

## Installation and First-Run Flow

Install seeds a config and starts the relay. There is no task, no account, and no credential — a fresh relay is **open**: any client that can reach it can publish events to it and read them back.

That is a reasonable default for a relay you have not published an address for, and a poor one for an address you have shared. Before sharing it, decide:

- **Who may publish.** Restrict Access limits writes to a pubkey whitelist, or to users verified by NIP-05.
- **What may be published.** Permitted Events allow-lists or block-lists event kinds.
- **How much.** Set Data Limits caps message rates, event sizes, and subscription counts.

Filling in General Information is worth doing regardless: without it, clients discovering your relay see no name, description, or contact.

## Actions

Four actions, all in one **Configure** group, all available whether or not the service is running, and all applied on the next restart. Each owns one section of the config and pre-fills from the current file.

### General Information

The relay's public identity: name, description, contact, operator pubkey, the advertised relay URL, and the icon, favicon, and landing page.

- **What it changes:** the `info` section.
- **Cost:** seconds, then a restart.
- **Repeat safety:** idempotent.
- **This is what other people see.** Nostr clients read it to describe your relay in their UI.

### Permitted Events

Which event kinds the relay accepts, as an allow-list or a block-list.

- **What it changes:** the kind lists in the `limits` section.
- **Cost:** seconds, then a restart.
- **Repeat safety:** idempotent.
- **It does not delete anything.** Blocking a kind stops new events of that kind being accepted; events already stored stay stored and are still served.

### Restrict Access

Limits who may use the relay — a pubkey whitelist, and NIP-05 verification with its own domain allow- and block-lists.

- **What it changes:** the `authorization` and `verified_users` sections.
- **Cost:** seconds, then a restart.
- **Repeat safety:** idempotent.
- **Verification has three modes**, and `passive` is the one to know: it verifies and records, but does not reject unverified users. Use it to see what a restriction would do before enforcing it.
- **A whitelist applies to writes, not reads.** Restricting who can publish does not make the relay's contents private.

### Set Data Limits

Rate and size caps: messages per second, subscriptions per minute, maximum event and websocket frame sizes, and the internal buffer and thread limits.

- **What it changes:** the `limits` section.
- **Cost:** seconds, then a restart.
- **Repeat safety:** idempotent.
- **Leaving a field blank removes the cap** rather than setting it to zero.
- **These are the abuse controls.** An open relay with no limits will accept whatever is sent to it, at whatever rate.

## Tasks

None. This package raises no tasks, so the service is never held on a prompt and its ordinary controls are always available.

## Health Checks

One check, on the only daemon.

| Check     | Displayed | Method                 |
| --------- | --------- | ---------------------- |
| `primary` | "Relay"   | Port 8080 is listening |

The relay binds quickly, so a failure means it did not start — most often a `config.toml` value it rejects, which it names in the service logs. A relay that is green but refuses events is working as configured: check the event-kind lists and the access restrictions before treating it as a fault.

## Backups and Restore

Two volumes are copied wholesale — `sdk.Backups.ofVolumes('db', 'config')`. No dump step and nothing excluded.

- **Included:** the whole event database, and `config.toml` with the relay's identity and every restriction.
- **Not included:** the unused `main` volume.
- **Size:** the event database is the whole of it, and a busy public relay's grows without bound — there is no retention policy here to trim it.
- **Restore:** complete, and no task is raised. Check `relay_url` afterwards: it is yours rather than derived, so a restore onto a differently-addressed server keeps advertising the old address until you change it.

## Limitations and Differences

1. **A fresh relay is open** to both reads and writes. Every restriction is opt-in.
2. **Restricting writes does not make reads private.** Anything stored is served to anyone who asks.
3. **`relay_url` is not derived from the published addresses** and does not follow a restore.
4. **There is no retention or pruning.** The event database only grows.
5. **Blocking an event kind is not retroactive** — stored events of that kind remain.
6. **The image is built from source**, pinned to a release tag and its commit; a re-pointed tag fails the build rather than shipping silently.
7. **No riscv64 build.** x86_64 and aarch64 only.

---

## Quick Reference for AI Consumers

```yaml
package_id: nostr-rs-relay
image: ./Dockerfile # built from a pinned upstream release tag + commit
architectures:
  - x86_64
  - aarch64
subcontainers:
  - nostr-rs-relay-sub # the only container; also runs the chown oneshot
volumes:
  db: /usr/src/app/db
  config: its config.toml at /usr/src/app/config.toml (file mount)
  main: unused; legacy
file_models:
  - config.toml
startos_managed_env_vars: [] # RUST_LOG and APP_DATA come from the image
dependencies: []
interfaces:
  relay: { type: api, port: 8080 } # websocket
actions:
  - configure-info
  - configure-events
  - configure-restrict
  - configure-limits
tasks: []
health_checks:
  - primary # displayed "Relay"
```
