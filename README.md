# Nostr RS Relay for StartOS

This repository packages [nostr-rs-relay](https://sr.ht/~gheartsfield/nostr-rs-relay/) for StartOS. nostr-rs-relay is a Nostr relay written in Rust that supports the entire relay protocol.

For general information about nostr-rs-relay and the Nostr protocol, see the [upstream documentation](https://github.com/scsibug/nostr-rs-relay/blob/master/README.md).

This document describes what is **unique** to the StartOS package.

## Container Runtime

Single container running the upstream `chekist32/nostr-rs-relay` image.

**Supported architectures:** x86_64, aarch64

## Volumes

| Volume ID | Container Mount Point | Purpose |
|-----------|----------------------|---------|
| `db` | `/usr/src/app/db` | SQLite database for relay data |
| `config` | `/usr/src/app/config.toml` | Configuration file (mounted as file) |

## Install Flow

- Writes default `config.toml` with restrictive limits suitable for private relay operation

## Configuration Management

Configuration is managed entirely through Actions (no traditional config UI). The relay uses a TOML config file at `/usr/src/app/config.toml`.

**Managed settings:**
- `info.*` - Relay metadata (name, description, pubkey, contact)
- `network.*` - Network binding (fixed: `0.0.0.0:8080`)
- `options.*` - Protocol options (fixed defaults)
- `limits.*` - Rate limits and buffer sizes
- `authorization.pubkey_whitelist` - Authorized pubkeys for private relay
- `verified_users.*` - NIP-05 verification settings

**Fixed defaults (not exposed to user):**
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

## Network Interfaces

| Interface | Port | Protocol | Purpose |
|-----------|------|----------|---------|
| Relay Websocket | 8080 | `ws://` | Nostr client connections |

Clients connect using standard Nostr websocket protocol. The interface is exposed via:
- Tor (.onion) - Recommended for public use
- LAN (.local) - For local testing only

**Note:** Tor uses `ws://` (not `wss://`). Firefox users connecting to web clients like noStrudel must set `network.websocket.allowInsecureFromHTTPS` to `true` in `about:config`.

## Actions

All actions are in the `configure` group:

| Action ID | Name | Purpose |
|-----------|------|---------|
| `configure-info` | General Information | Set relay name, description, admin pubkey, contact URI, and external address |
| `configure-events` | Permitted Events | Whitelist or blacklist event kinds by number |
| `configure-restrict` | Restrict Access | Configure NIP-05 verification and pubkey whitelist for private relay |
| `configure-limits` | Set Data Limits | Adjust rate limits, buffer sizes, and max message sizes |

### General Information Action

Configures relay metadata exposed to clients:
- **Name**: Human-readable relay name
- **Description**: Detailed relay description
- **Admin Pubkey**: Relay operator's Nostr hex pubkey (not npub)
- **Admin Contact URI**: mailto: URI for contact
- **External Address**: Public URL for relay (selects from available interfaces)

### Permitted Events Action

Control which Nostr event kinds are accepted:
- **Permit all**: Accept all event kinds (default)
- **Whitelist**: Only accept specified event kinds
- **Blacklist**: Reject specified event kinds, accept all others

### Restrict Access Action

Configure who can publish to the relay:
- **NIP-05 Verification**: Enable/disable/passive verification of user identities
- **Domain Permissions**: Whitelist or blacklist NIP-05 domains
- **Pubkey Whitelist**: List of authorized hex pubkeys (for private relay operation)

### Set Data Limits Action

Adjust performance and protection limits:
- Messages per second (server-wide)
- Subscriptions per minute
- Max blocking threads
- Max event/websocket message/frame sizes
- Broadcast and event persistence buffer sizes

## Dependencies

None.

## Backups

Backs up volumes: `db`, `config`

**Backup includes:**
- SQLite database with all relay data
- Configuration file

## Health Checks

| Check | Method | Success Condition |
|-------|--------|-------------------|
| Relay | Port listening | Port 8080 accepting connections |

## Limitations

Compared to upstream nostr-rs-relay:

1. **No payment support** - Pay-to-relay functionality has been removed from this package
2. **Fixed network binding** - Always binds to `0.0.0.0:8080`
3. **No favicon/relay_page upload** - File upload for custom branding not yet implemented
4. **WebSocket over Tor** - Uses `ws://` not `wss://`, requiring browser configuration for web clients

## What's Unchanged from Upstream

- Full Nostr relay protocol support
- SQLite database backend
- NIP-05 verification
- Event kind filtering
- Rate limiting and abuse protection
- All relay information fields (NIP-11)

---

## Quick Reference (YAML)

```yaml
package_id: nostr-rs-relay

containers:
  - name: nostr-rs-relay
    image: chekist32/nostr-rs-relay
    arch: [x86_64, aarch64]

volumes:
  - id: db
    mount: /usr/src/app/db
    purpose: SQLite database
  - id: config
    mount: /usr/src/app/config.toml
    type: file
    purpose: Configuration

interfaces:
  - id: relay
    name: Relay Websocket
    port: 8080
    protocol: ws

actions:
  - id: configure-info
    group: configure
    has_input: true
  - id: configure-events
    group: configure
    has_input: true
  - id: configure-restrict
    group: configure
    has_input: true
  - id: configure-limits
    group: configure
    has_input: true

dependencies: []

health_checks:
  - id: primary
    type: port_listening
    port: 8080

backup_volumes: [db, config]

config_file: /usr/src/app/config.toml
config_format: toml
```
