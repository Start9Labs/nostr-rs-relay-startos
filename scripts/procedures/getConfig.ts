import { types as T, compat } from "../deps.ts";

export const getConfig: T.ExpectedExports.getConfig = compat.getConfig({
  "tor-address": {
    "name": "Tor Address",
    "description": "The Tor address for the websocket server.",
    "type": "pointer",
    "subtype": "package",
    "package-id": "nostr",
    "target": "tor-address",
    "interface": "websocket"
  },
  "lan-address": {
    "name": "Tor Address",
    "description": "The LAN address for the websocket server.",
    "type": "pointer",
    "subtype": "package",
    "package-id": "nostr",
    "target": "lan-address",
    "interface": "websocket"
  },
})
