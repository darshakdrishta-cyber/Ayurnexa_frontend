const runtimeConfig = window.__AYURNEXA_CONFIG__ || {}

export const appConfig = {
  apiBaseUrl:
    runtimeConfig.apiBaseUrl || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  apiKey: runtimeConfig.apiKey || import.meta.env.VITE_API_KEY || 'dev_api_key',
  googleClientId: runtimeConfig.googleClientId || import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  supabaseUrl:
    runtimeConfig.supabaseUrl ||
    import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.SUPABASE_URL ||
    'https://lcvgnjdisjtjzneyhwcj.supabase.co',
  supabasePublishableKey:
    runtimeConfig.supabasePublishableKey ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.SUPABASE_PUBLISHABLE_KEY ||
    '',
  supabaseSecretKey:
    runtimeConfig.supabaseSecretKey ||
    import.meta.env.VITE_SUPABASE_SECRET_KEY ||
    import.meta.env.SUPABASE_SECRET_KEY ||
    '',
  supabaseBucket:
    runtimeConfig.supabaseBucket ||
    import.meta.env.VITE_SUPABASE_BUCKET ||
    import.meta.env.SUPABASE_BUCKET ||
    'Ayurnexa',
}
