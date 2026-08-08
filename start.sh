#!/bin/bash
# Increase file descriptor limit and start expo dev server
ulimit -n 4096
# Clear Metro cache to avoid corruption
rm -rf /tmp/metro-cache-* 2>/dev/null || true
# Run expo with optimized settings
exec npx expo start --max-workers=1 "$@"
