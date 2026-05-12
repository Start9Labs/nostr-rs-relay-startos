# Nostr RS Relay

## Documentation

- [Nostr RS Relay README](https://github.com/scsibug/nostr-rs-relay/blob/master/README.md) — upstream overview and operator notes for the relay.
- [Nostr RS Relay `config.toml` reference](https://github.com/scsibug/nostr-rs-relay/blob/master/config.toml) — the full upstream configuration file, with every setting documented inline.

## What you get on StartOS

- A **Nostr RS Relay** daemon backed by a SQLite database — your own Nostr relay that clients connect to over websocket.
- A **Relay websocket** interface exposing the relay at port 8080 over Tor and LAN.
- Configuration entirely through StartOS Actions — there is no separate config UI, and you do not edit `config.toml` by hand.

## Using Nostr RS Relay

### Connecting clients

The **Relay websocket** interface holds the URLs your clients use. Copy a Tor or LAN address from that interface and add it to your Nostr client of choice (Damus, Amethyst, noStrudel, etc.) as a relay.

The relay speaks plain `ws://` rather than `wss://`. If you connect from a web client served over HTTPS (e.g. noStrudel in Firefox), set `network.websocket.allowInsecureFromHTTPS` to `true` in `about:config` so the browser will open the websocket.

### Actions

All four actions live under the **Configure** group and can be run whether the relay is running or stopped. Changes take effect on the next start.

- **General Information** — set the relay's display **Name**, **Description**, **Admin Pubkey** (Nostr hex, not npub — use [damus.io/key/](https://damus.io/key/) to convert), **Admin Contact URI** (e.g. `mailto:you@example.com`), and the **External Address** that the relay advertises to clients. These fields are what other Nostr clients see when they query your relay for its NIP-11 information.
- **Permitted Events** — choose between **Permit all event types** (default), a **whitelist** of allowed Nostr event kinds, or a **blacklist** of prohibited ones. Event kinds are the numeric NIP types (see the [NIP event-kinds list](https://github.com/nostr-protocol/nips#event-kinds)).
- **Restrict Access** — run this to turn your relay into a private or partially-private relay:
  - **Verified Users (NIP-05)** — `disabled` (default), `enabled` (require NIP-05 to publish), or `passive` (verify but don't block). Optionally restrict to a **whitelist** or **blacklist** of NIP-05 domains, and tune verification expiration, refresh frequency, and max consecutive failures.
  - **Authorized Pubkeys** — a whitelist of hex pubkeys allowed to publish. Leave empty to permit all pubkeys.
- **Set Data Limits** — tune the relay's throughput and resource caps: messages per second (server-wide), subscriptions per minute (per connection), max blocking threads, max event / websocket message / websocket frame sizes, broadcast buffer, and event-persist buffer.

## Limitations

- **Pay-to-relay is not supported.** The upstream payment / invoicing flow is intentionally disabled in this package; the relay cannot charge for posting.
