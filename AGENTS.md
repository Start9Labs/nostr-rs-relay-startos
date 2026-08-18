# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

**Start every task at the recipe index** — `../start-technologies/projects/start-sdk/docs/src/recipes.md`
(or <https://docs.start9.com/packaging/recipes.html>). It maps an intent ("prompt the user to create
admin credentials", "expose a web UI") to the constructs, the reference pages, and a named production
package to copy. Find the recipe before you read this package's neighbours: a package you reach by
grepping may be non-conformant, and the recipe outranks it.

Freshly scaffolded? Work the
[New Package Checklist](../start-technologies/projects/start-sdk/docs/src/new-package-checklist.md)
(or <https://docs.start9.com/packaging/new-package-checklist.html>) from top to bottom. It is a
guide page, not a file in this repo — read it, don't copy it in.

Keep `README.md` (technical reference for an AI support or administering agent) and
`instructions.md` (end-user docs) in sync with your changes.

**Bugs and feature requests are GitHub issues on this repo** — file them as you find them.
Don't record work in the repo instead: no `TODO.md`, no `NOTES.md`, no `PLAN.md`. What you
verified, tried, and decided belongs in the commit message and the PR body.

## This repo

- **The runtime stage mirrors upstream's own Dockerfile on purpose** — same `WORKDIR`, `appuser`, `db` path, and relative `config.toml`. `startos/main.ts` depends on that contract, so a change here has to be matched there.
- **Clone from the GitHub mirror, not SourceHut.** Upstream develops on SourceHut; `scsibug/nostr-rs-relay` carries identical commit hashes and is more reliable to clone from in CI.
- **`CMD` must stay in exec form** so StartOS's SIGTERM reaches the relay directly rather than a `/bin/sh` wrapper.
- **The `main` volume is retained solely for the `0.10.0:1` migration path**, which moves the old data directory into `db` and converts the 0.3.x `config.yaml`. Don't reuse it for new data, and don't drop it from the manifest.
- **An unset config key must be absent from the file, not written as a zero or empty list.** The relay applies its own default for an absent key; a written zero pins the value — which is how a cleared form field would silently become a hard cap.
- **`config` is mounted as a single file, not a directory**, so the relay never sees anything else on that volume.
