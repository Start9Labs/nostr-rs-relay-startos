# Instructions

These instructions assume you have already created a Nostr public key (npub) and have backed up your private key (nsec).

## Initial Config

### Running a private relay

It is highly recommended that you run a _private_ relay, not a public one. Private relays act as a personal backup for your posts, follows, messages, settings, etc. Without a private relay, there is no guaranteeing these things will be saved anywhere, and they could disappear at any time.

With a private relay, only the whitelisted pubkeys will be permitted to post and save content to your relay. So, at minimum, you must whitelist your own pubkey in hex format. Various Nostr clients will allow you to copy your hex pubkey. If not, you can visit https://damus.io/key to convert your npub to hex.

### Running a public relay

It is not recommended to run a public relay unless you understand the risks and configure it with the proper protections. Youa are on your own here.

## Using your relay

### All platforms

1. Follow instructions to ensure your computer or phone is running Tor: https://docs.start9.com/latest/user-manual/connecting/connecting-tor/tor-os/
2. Go into Properties, copy your `Nostr Relay Websocket URL` (e.g. `ws://<address>.onion`), and paste it into your Nostr client

### Using Firefox with a web client

1. Follow instructions to ensure Firefox is configured to use Tor: https://docs.start9.com/latest/user-manual/connecting/connecting-tor/tor-firefox/
2. Go to `about:config` and set `network.websocket.allowInsecureFromHTTPS` to "True"

## More

For more information about the Nostr protocol, relays, and clients, visit
https://github.com/nostr-protocol/nostr
