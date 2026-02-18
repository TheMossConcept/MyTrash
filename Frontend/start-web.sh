#!/usr/bin/env bash
# Start the MyTrash web frontend locally with mock auth and API data.
# Requires Node 18 via nvm.

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

nvm use 18

export NODE_OPTIONS=--openssl-legacy-provider
export APPLICATION_ENVIRONMENT=local

npx expo-cli@4.13.0 start --web
