# Instructions

PLEASE READ THESE INSTRUCTIONS CAREFULLY BEFORE USE. Nostr is a new protocol and
there is quite a lot of uncertainty as to how to use it properly. Below you'll
find important information to help you get started without undue confusion and
risk.

## Creating an account pubkey

Before using your relay, you will need a Nostr account. This is achieved by
creating a private/public keypair on a Nostr client. There are several to choose
from. Here are some clients you may want to try:

- Damus (iOS/Mac)
- Amethyst (Android)
- Iris.to (Browser)

Once you have your Nostr pubkey, you can proceed to configure your self-hosted
Nostr relay.

## Initial Config

It is highly recommended that you run a _private_ relay, not a public one.
Private will be the default option when you open the config for the first time.
You will not be able to save the config until you follow the instructions below.

### Running a private relay

Private relays act as a personal backup for your posts, follows, messages,
settings, etc. Without a private relay, there is no guaranteeing these things
will be saved anywhere, and they could disappear at any time.

With a private relay, only the whitelisted pubkeys will be permitted to post and
save content to your relay. So, at minimum, you must whitelist your own pubkey
in hex format. The config will refuse to save until there is at least one pubkey
in the whitelist.

Some Nostr clients will allow you to copy your hex pubkey. If not, you can visit
https://damus.io/key to convert your npub to hex.

### Running a public relay

In contrast to a private relay, a public relay does not include a whitelist, so
it allows any pubkey to post. It is not recommended to run a public relay unless
you understand the risks and configure it with the proper protections. The main
risk you need to avoid is malicious clients spamming your relay and causing your
storage drive to full up. We've inlcuded fairly restrictive defaults in your
config so that you have the best chance of avoiding this risk, but you are on
your own here.

## Using your relay

### All platforms

1. Follow instructions to ensure your computer or phone is running Tor:
   https://docs.start9.com/latest/user-manual/connecting/connecting-tor/tor-os/
2. Go into Properties, copy your `Nostr Relay Websocket URL` (e.g.
   `ws://<address>.onion`), and paste it into your Nostr client.

(Note, the `wss://<address>.local` URL is included in Properties as well. We
don't recommend using this interface for anything other than sanity checking
that your relay works and is listening for events. Obvioulsy no one will be able
to access your .local URL except yourself and anyone else connected to the same
LAN. But, it's your server, and we don't want to tell our users what to do.)

### Using Firefox with a web client

1. Follow instructions to ensure Firefox is configured to use Tor:
   https://docs.start9.com/latest/user-manual/connecting/connecting-tor/tor-firefox/
2. Go to `about:config` and set `network.websocket.allowInsecureFromHTTPS` to
   "True"

### Testing your relay (requires SSH)

Once you've connected a client to your relay, any events created by your client
will be stored on your relay, assuming the pubkey that created the event is
whitelisted (or the relay is set to "public"). You can check that your relay is
indeed storing events by going into your client relay settings and eliminating
all relays except your own, sending some events, then SSHing into your Embassy
and entering the following command:

```
`sqlite3 /embassy-data/package-data/volumes/nostr/data/main/nostr.db 'select count(*) from event;'`
```

If this displays a number greater than 0, your relay is working.

## More

For more information about the Nostr protocol, relays, and clients, visit
https://github.com/nostr-protocol/nostr
