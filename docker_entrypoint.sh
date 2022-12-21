#!/bin/sh

chown -R $APP_USER:$APP_USER $APP_DATA

su - $APP_USER

exec tini ./nostr-rs-relay -- --db /data
