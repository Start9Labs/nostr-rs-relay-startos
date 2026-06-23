# Builds nostr-rs-relay from source, pinned to an upstream release tag + commit.
# The runtime stage mirrors the upstream Dockerfile so the image contract
# (paths, user, run command) matches what startos/main.ts expects:
# WORKDIR /usr/src/app, USER appuser, db at /usr/src/app/db, config read from
# ./config.toml relative to WORKDIR.
FROM docker.io/library/rust:1-bookworm AS builder

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        cmake \
        protobuf-compiler \
        git \
        ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Pinned to the latest upstream release. Bump NRR_VERSION and NRR_COMMIT to
# update (see UPDATING.md). NRR_COMMIT is the immutable commit the tag points
# to; the guard below fails the build if the tag is ever re-pointed. Upstream is
# developed on sourcehut; github.com/scsibug/nostr-rs-relay is the faithful
# mirror (identical commit SHAs) and is more reliable to clone from.
ARG NRR_VERSION=0.10.0
ARG NRR_COMMIT=b5c1f642e4f4c3b9c54f5d18d66f4c53642076b4
RUN git clone --branch ${NRR_VERSION} --depth 1 \
        https://github.com/scsibug/nostr-rs-relay.git /src \
    && HEAD_SHA="$(git -C /src rev-parse HEAD)" \
    && if [ "${HEAD_SHA}" != "${NRR_COMMIT}" ]; then \
        echo "nostr-rs-relay ${NRR_VERSION} commit mismatch: expected ${NRR_COMMIT}, got ${HEAD_SHA}" && exit 1; \
    fi

WORKDIR /src
RUN cargo build --release --locked

FROM docker.io/library/debian:bookworm-slim

ARG APP=/usr/src/app
ARG APP_DATA=/usr/src/app/db
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        tzdata \
        sqlite3 \
        libc6 \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 8080

ENV TZ=Etc/UTC \
    APP_USER=appuser

RUN groupadd $APP_USER \
    && useradd -g $APP_USER $APP_USER \
    && mkdir -p ${APP} \
    && mkdir -p ${APP_DATA}

COPY --from=builder /src/target/release/nostr-rs-relay ${APP}/nostr-rs-relay

RUN chown -R $APP_USER:$APP_USER ${APP}

USER $APP_USER
WORKDIR ${APP}

ENV RUST_LOG=info,nostr_rs_relay=info \
    APP_DATA=${APP_DATA}

# Exec form so StartOS's stop signal (SIGTERM) reaches the relay directly
# instead of a /bin/sh wrapper. WORKDIR stays ${APP} so the relay finds
# ./config.toml; --db points at the mounted data volume.
CMD ["./nostr-rs-relay", "--db", "/usr/src/app/db"]
