# Instructions

To use your Nostr relay, go into Properties and copy your
`Nostr Relay Websocket URL` and paste it into any Nostr client that supports
connecting over Tor.

For more information about the Nostr protocol, relays, and clients, visit
https://github.com/nostr-protocol/nostr

# Getting your Hex Pubkey

Various Nostr clients will allow you to copy your pubkey in hex. If not, you can
visit https://damus.io/key to convert your npub to hex.

# Using a browser-based client with your Tor Nostr Relay

1. Make sure you are using your from a
   [Tor-enabled browser](https://docs.start9.com/latest/user-manual/connecting/connecting-tor/)
2. If you are using Firefox private tabs or Tor Browser, input `about:config` in
   the URL bar and set `dom.indexedDB.privateBrowsing.enabled` to "True"
3. If you are using Firefox, input `about:config` in the URL bar and set
   `network.websocket.allowInsecureFromHTTPS` to "True"
4. Create an Account. This is really just creating a public/private key pair
5. In your client's browser UI, copy your private key and store it somewhere
   safe, like your self-hosted Vaultwarden on embassyOS. You can think of your
   private key as your login password that must remain secret and cannot be
   changed. Your Public key is your public-facing username that you can share
   with others.
6. In your client's browser UI, go to your relay settings and enter you Nostr
   Relay Websocket URL to the list of known relays.
