<p align="center">
  <img src="icon.svg" alt="Nostr RS Relay Logo" width="21%">
</p>

# Nostr RS Relay on StartOS

> **Upstream docs:** <https://github.com/scsibug/nostr-rs-relay/blob/master/README.md>
>
> Everything not listed in this document should behave the same as upstream
> Nostr RS Relay. If a feature, setting, or behavior is not mentioned
> here, the upstream documentation is accurate and fully applicable.

[Nostr RS Relay](https://sr.ht/~gheartsfield/nostr-rs-relay/) is a Nostr relay written in Rust that supports the entire relay protocol.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Dependencies](#dependencies)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

Single container running the `chekist32/nostr-rs-relay` image (third-party Docker build of the upstream source).

**Architectures:** x86_64, aarch64

**Startup order:** A `chown` one-shot sets ownership of the app directory to `appuser`, then the relay daemon starts.

---

## Volume and Data Layout

| Volume | Mount Point | Purpose |
|--------|-------------|---------|
| `main` | N/A (host) | StartOS metadata (migration use only) |
| `db` | `/usr/src/app/db` | SQLite database for relay data |
| `config` | `/usr/src/app/config.toml` (file mount) | TOML configuration file |

---

## Installation and First-Run Flow

| Step | Upstream | StartOS |
|------|----------|---------|
| Installation | Build from source or run Docker image | Install from marketplace or sideload `.s9pk` |
| Configuration | Edit `config.toml` manually | Writes default `config.toml` with restrictive limits suitable for private relay operation |
| Network binding | User configures address/port | Fixed to `0.0.0.0:8080`, managed by StartOS |

---

## Configuration Management

Configuration is managed entirely through Actions — there is no traditional config UI. The relay uses a TOML config file at `/usr/src/app/config.toml`.

### StartOS-Managed Settings

| Category | Settings |
|----------|----------|
| `info.*` | Relay metadata (name, description, pubkey, contact) |
| `network.*` | Network binding (fixed: `0.0.0.0:8080`) |
| `options.*` | Protocol options (fixed defaults) |
| `limits.*` | Rate limits, buffer sizes, event kind filtering |
| `authorization.pubkey_whitelist` | Authorized pubkeys for private relay |
| `verified_users.*` | NIP-05 verification settings |

### Fixed Defaults (not exposed to user)

```toml
[network]
address = "0.0.0.0"
port = 8080

[options]
reject_future_seconds = 1600

[limits]
messages_per_sec = 10
subscriptions_per_min = 10
max_blocking_threads = 16
max_event_bytes = 131072
max_ws_message_bytes = 131072
max_ws_frame_bytes = 131072
broadcast_buffer = 16384
event_persist_buffer = 4096

[verified_users]
mode = "disabled"
max_consecutive_failures = 20
```

---

## Network Access and Interfaces

| Interface | Port | Protocol | Type | Description |
|-----------|------|----------|------|-------------|
| Relay Websocket | 8080 | `ws://` | api | Nostr client connections |

Clients connect using standard Nostr websocket protocol. The interface is exposed via Tor (.onion) and LAN (.local).

**Note:** Tor uses `ws://` (not `wss://`). Firefox users connecting to web clients like noStrudel must set `network.websocket.allowInsecureFromHTTPS` to `true` in `about:config`.

---

## Actions (StartOS UI)

All actions are in the `configure` group, have visibility `enabled`, and are available at any service status (running or stopped).

### General Information (`configure-info`)

Configures relay metadata exposed to clients:
- **Name**: Human-readable relay name
- **Description**: Detailed relay description
- **Admin Pubkey**: Relay operator's Nostr hex pubkey (not npub)
- **Admin Contact URI**: mailto: URI for contact
- **External Address**: Public URL for relay (selects from available interfaces)

### Permitted Events (`configure-events`)

Control which Nostr event kinds are accepted:
- **Permit all**: Accept all event kinds (default)
- **Whitelist**: Only accept specified event kinds
- **Blacklist**: Reject specified event kinds, accept all others

### Restrict Access (`configure-restrict`)

Configure who can publish to the relay:
- **NIP-05 Verification**: Enable/disable/passive verification of user identities
- **Domain Permissions**: Whitelist or blacklist NIP-05 domains
- **Verify Expiration / Update Frequency**: Timing controls for NIP-05 checks
- **Max Consecutive Failures**: Give up threshold for verification
- **Pubkey Whitelist**: List of authorized hex pubkeys (for private relay operation)

### Set Data Limits (`configure-limits`)

Adjust performance and protection limits:
- Messages per second (server-wide)
- Subscriptions per minute
- Max blocking threads
- Max event/websocket message/frame sizes (bytes)
- Broadcast and event persistence buffer sizes (events)

---

## Backups and Restore

**Volumes backed up:** `db`, `config`

- `db` — SQLite database with all relay data
- `config` — TOML configuration file

**Restore behavior:** All relay data and configuration are restored. No reconfiguration needed.

---

## Health Checks

| Check | Method | Display | Message |
|-------|--------|---------|---------|
| Relay | Port listening (8080) | "Relay" | "Relay is ready" / "Relay is unreachable" |

---

## Dependencies

None.

---

## Limitations and Differences

1. **No payment support** — Pay-to-relay functionality has been removed from this package.
2. **Fixed network binding** — Always binds to `0.0.0.0:8080`; not configurable.
3. **No favicon/relay_page upload** — File upload for custom branding is not implemented.
4. **WebSocket over Tor** — Uses `ws://` not `wss://`, requiring browser configuration for web clients.

---

## What Is Unchanged from Upstream

- Full Nostr relay protocol support
- SQLite database backend
- NIP-05 verification
- Event kind filtering
- Rate limiting and abuse protection
- All relay information fields (NIP-11)

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for build instructions and development workflow.

---

## Quick Reference for AI Consumers

```yaml
package_id: nostr-rs-relay
image: chekist32/nostr-rs-relay
architectures:
  - x86_64
  - aarch64
volumes:
  main: host (StartOS metadata)
  db: /usr/src/app/db
  config: /usr/src/app/config.toml (file mount)
ports:
  relay: 8080
dependencies: none
startos_managed_env_vars: []
actions:
  - configure-info
  - configure-events
  - configure-restrict
  - configure-limits
```
