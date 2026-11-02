const runtimeConfig = window.__AYURNEXA_CONFIG__ || {}

export const appConfig = {
  apiBaseUrl:
    runtimeConfig.apiBaseUrl || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  apiKey: runtimeConfig.apiKey || import.meta.env.VITE_API_KEY || 'dev_api_key',
  googleClientId: runtimeConfig.googleClientId || import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
}
