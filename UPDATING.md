# Updating the upstream version

This package builds **nostr-rs-relay** from source inside the `Dockerfile`, pinned to an upstream release tag. A bump means pointing the build at a newer tag.

Upstream is developed on sourcehut (`git.sr.ht/~gheartsfield/nostr-rs-relay`); `github.com/scsibug/nostr-rs-relay` is a faithful mirror (identical commit SHAs) that the `Dockerfile` clones from and that is easier to query.

## Determining the upstream version

List release tags (sourcehut has no JSON tag API; the GitHub mirror works identically):

```
git ls-remote --tags --sort=-v:refname https://github.com/scsibug/nostr-rs-relay | grep -v '\^{}$' | head
# canonical home: https://git.sr.ht/~gheartsfield/nostr-rs-relay
```

The latest release is the highest semver tag. Do **not** use crates.io — it is frozen at `0.8.12` (Aug 2023) and does not reflect current releases.

## Applying the bump

1. **`Dockerfile`** — set `ARG NRR_VERSION` to the new tag (e.g. `0.10.0`) and `ARG NRR_COMMIT` to the commit that tag points to. Resolve it with:

   ```
   git ls-remote https://github.com/scsibug/nostr-rs-relay refs/tags/<tag>^{}
   ```

   Use the dereferenced (`^{}`) commit. The build fails if the clone's HEAD does not match `NRR_COMMIT`.

### Config compatibility

When bumping, skim the upstream `config.toml` for any renamed or removed keys the file model (`startos/fileModels/config.toml.ts`) writes — additive changes need no action.
