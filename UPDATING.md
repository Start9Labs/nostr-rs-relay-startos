# Updating the upstream version

Upstream Nostr RS Relay is developed on sourcehut; this package consumes it via the third-party `chekist32/nostr-rs-relay` Docker image, not by building from source. A bump here requires the desired version to be published as a tag on the Docker image — track sourcehut to see what exists upstream, then confirm the chekist32 tag before bumping.

## Determining the upstream version

- **nostr-rs-relay** ([git.sr.ht/~gheartsfield/nostr-rs-relay](https://git.sr.ht/~gheartsfield/nostr-rs-relay)) — sourcehut has no JSON tag API; use `git ls-remote` to list tags:

  ```
  git ls-remote --tags --sort=-v:refname https://git.sr.ht/~gheartsfield/nostr-rs-relay | grep -v '\^{}$' | head
  ```

  The latest release is the highest semver tag. Currently pinned indirectly via the Docker tag in `startos/manifest/index.ts` (the `dockerTag` field).

- **chekist32/nostr-rs-relay** ([hub.docker.com/r/chekist32/nostr-rs-relay](https://hub.docker.com/r/chekist32/nostr-rs-relay/tags)) — confirm the upstream version has been republished as a Docker tag:

  ```
  curl -fsSL "https://hub.docker.com/v2/repositories/chekist32/nostr-rs-relay/tags?page_size=20&ordering=last_updated" | jq -r '.results[].name'
  ```

  If the matching tag isn't there yet, you can't bump until it is. The Docker tag is the pin — set in `startos/manifest/index.ts` as `dockerTag: 'chekist32/nostr-rs-relay:<version>'`.

## Applying the bump

- `startos/manifest/index.ts` — update `images['nostr-rs-relay'].source.dockerTag` to `chekist32/nostr-rs-relay:<new version>`.
