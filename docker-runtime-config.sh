#!/bin/sh
set -eu

jq -n -r \
  --arg apiBaseUrl "${VITE_API_BASE_URL:-}" \
  --arg apiKey "${VITE_API_KEY:-}" \
  --arg googleClientId "${VITE_GOOGLE_CLIENT_ID:-}" \
  --arg supabaseUrl "${VITE_SUPABASE_URL:-${SUPABASE_URL:-}}" \
  --arg supabasePublishableKey "${VITE_SUPABASE_PUBLISHABLE_KEY:-${SUPABASE_PUBLISHABLE_KEY:-${VITE_SUPABASE_ANON_KEY:-}}}" \
  --arg supabaseSecretKey "${VITE_SUPABASE_SECRET_KEY:-}" \
  --arg supabaseBucket "${VITE_SUPABASE_BUCKET:-${SUPABASE_BUCKET:-}}" \
  '"window.__AYURNEXA_CONFIG__ = window.__AyurnexaA_CONFIG__ = " + ({apiBaseUrl: $apiBaseUrl, apiKey: $apiKey, googleClientId: $googleClientId, supabaseUrl: $supabaseUrl, supabasePublishableKey: $supabasePublishableKey, supabaseSecretKey: $supabaseSecretKey, supabaseBucket: $supabaseBucket} | tojson) + ";"' \
  > /usr/share/nginx/html/runtime-config.js
