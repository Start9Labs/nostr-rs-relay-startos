#!/bin/sh

chown -R $APP_USER:$APP_USER $APP_DATA

su - $APP_USER > /dev/null 2>&1

exec tini ./nostr-rs-relay -- --db /data
