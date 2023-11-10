#!/bin/sh

# Handle termination signals
_term() {
    printf "\n\nReceived termination signal!\n\n"
	kill -TERM "$deploy_process" 2>/dev/null
}

chown -R $APP_USER:$APP_USER $APP_DATA

su - $APP_USER > /dev/null 2>&1

cp $APP_DATA/config.toml.tmp $APP/config.toml

printf "\n\n [i] Starting Nostr RS Relay...\n\n" &

./nostr-rs-relay --db /data &
deploy_process=$!

# Set up a signal trap and wait for processes to finish
trap _term TERM
wait $deploy_process