#!/bin/sh

chown -R $APP_USER:$APP_USER $APP_DATA

su - $APP_USER > /dev/null 2>&1

cp $APP_DATA/config.toml.tmp $APP/config.toml

exec tini ./nostr-rs-relay -- --db /data
