#!/bin/sh
set -eu

jq -n -r \
  --arg apiBaseUrl "${VITE_API_BASE_URL:-}" \
  --arg apiKey "${VITE_API_KEY:-}" \
  --arg googleClientId "${VITE_GOOGLE_CLIENT_ID:-}" \
  '"window.__AYURNEXA_CONFIG__ = " + ({apiBaseUrl: $apiBaseUrl, apiKey: $apiKey, googleClientId: $googleClientId} | tojson) + ";"' \
  > /usr/share/nginx/html/runtime-config.js
