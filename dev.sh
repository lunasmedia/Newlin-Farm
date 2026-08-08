#!/bin/bash
set -e
cd "$(dirname "$0")"

# Increase file descriptor limit
ulimit -n 4096 2>/dev/null || true

# Clear Metro cache
rm -rf node_modules/.cache .expo .expo-shared 2>/dev/null || true

# Run expo start with all necessary flags
exec npx expo start --max-workers=1 --reset-cache "$@"
