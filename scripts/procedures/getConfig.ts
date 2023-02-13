import { C, compat } from "../deps.ts";

export const [getConfig, setConfigMatcher] = compat.getConfigAndMatcher(
  C.Config.withValue(
    "tor-address",
    C.Value.pointer(C.Pointer.packageTorAddress(
      {
        name: "Tor Address",
        description: "The Tor address for the websocket server.",
        warning: null,
        "package-id": "nostr",
        interface: "websocket",
      },
    )),
  ).addValue(
    "lan-address",
    C.Value.pointer(C.Pointer.packageLanAddress(
      {
        name: "LAN Address",
        description: "The LAN address for the websocket server.",
        warning: null,
        "package-id": "nostr",
        interface: "websocket",
      },
    )),
  ).addValue(
    "relay-type",
    C.Value.union(
      {
        "display-as": null,
        "unique-by": null,
        default: "private",
        description:
          "Private or public. A private relay (highly recommended) restricts write access to specific pubkeys. Anyone can write to a public relay.",
        name: "Relay Type",
        warning: null,
        "tag": {
          "id": "type",
          "name": "Relay Type",
          "description":
            "Private or public. A private relay (highly recommended) restricts write access to specific pubkeys. Anyone can write to a public relay.",
          "variant-names": {
            "private": "Private",
            "public": "Public",
          },
        },
        variants: C.Variants.withVariant(
          "private",
          C.Config.withValue(
            "pubkey_whitelist",
            C.Value.list(C.List.string({
              name: "Pubkey Whitelist (Hex)",
              description:
                "A list of pubkeys that are permitted to publish through your relay. A minimum, you need to enter your own Nostr hex (not npub) pubkey. Go to https://damus.io/key/ to convert from npub to hex.",
              warning: null,
              default: [],
              range: "[1,*)",
              spec: {
                copyable: null,
                masked: null,
                placeholder: "hex (not npub) pubkey",
                pattern: "[0-9a-fA-F]{64}",
                "pattern-description":
                  "Must be a valid 64-digit hexadecimal value (ie a Nostr hex pubkey, not an npub). Go to https://damus.io/key/ to convert npub to hex.",
              },
            })),
          ),
        ).withVariant(
          "public",
          C.Config.withValue(
            "info",
            C.Value.string({
              name: "",
              description: null,
              warning: null,
              nullable: false,
              copyable: null,
              masked: null,
              placeholder: null,
            }),
          ),
        ),
      },
    ),
  ).build(),
  // .addValue(

  // ).build(),
);

export type SetConfig = typeof setConfigMatcher._TYPE;
