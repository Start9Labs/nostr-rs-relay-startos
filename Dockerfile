FROM docker.io/library/rust:1.66.0@sha256:359949280cebefe93ccb33089fe25111a3aadfe99eac4b6cbe8ec3e1b571dacb as builder

RUN USER=root cargo install cargo-auditable
RUN USER=root cargo new --bin nostr-rs-relay
WORKDIR ./nostr-rs-relay
COPY ./nostr-rs-relay/Cargo.toml ./Cargo.toml
COPY ./nostr-rs-relay/Cargo.lock ./Cargo.lock
# build dependencies only (caching)
RUN cargo auditable build --release --locked
# get rid of starter project code
RUN rm src/*.rs

# copy project source code
COPY ./nostr-rs-relay/src ./src

# build auditable release using locked deps
RUN rm ./target/release/deps/nostr*relay*
RUN cargo auditable build --release --locked

FROM docker.io/library/debian:bullseye-20221205-slim@sha256:25f10b4f1ded5341a3ca0a30290ff3cd5639415f0c5a2222d5e7d5dd72952aa1

ARG APP=/usr/src/app
ARG APP_DATA=/usr/src/app/db
RUN apt-get update \
    && apt-get install -y ca-certificates tzdata sqlite3 libc6 \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 8080

ENV TZ=Etc/UTC \
    APP_USER=appuser

RUN groupadd $APP_USER \
    && useradd -g $APP_USER $APP_USER \
    && mkdir -p ${APP} \
    && mkdir -p ${APP_DATA}

COPY --from=builder /nostr-rs-relay/target/release/nostr-rs-relay ${APP}/nostr-rs-relay

RUN chown -R $APP_USER:$APP_USER ${APP}

# ----
RUN apt update && apt install -y bash curl tini wget

ARG PLATFORM
ARG ARCH
RUN wget -qO /usr/local/bin/yq https://github.com/mikefarah/yq/releases/latest/download/yq_linux_${PLATFORM} && chmod +x /usr/local/bin/yq

# ADD ./configurator/target/${ARCH}-unknown-linux-musl/release/configurator /usr/local/bin/configurator
ADD ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
RUN chmod a+x /usr/local/bin/docker_entrypoint.sh
# ADD ./check-electrum.sh /usr/local/bin/check-electrum.sh
# RUN chmod a+x /usr/local/bin/check-electrum.sh
# ADD ./check-synced.sh /usr/local/bin/check-synced.sh
# RUN chmod a+x /usr/local/bin/check-synced.sh


# ----

USER $APP_USER
WORKDIR ${APP}

ENV RUST_LOG=info,nostr_rs_relay=info
ENV APP_DATA=${APP_DATA}

# CMD ./nostr-rs-relay --db ${APP_DATA}
