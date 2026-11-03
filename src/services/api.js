import axios from 'axios'
import { appConfig } from '../config'
import { logError } from '../utils/errorLog'

export const TOKEN_KEY = 'Ayurnexa-token_009'
export const USER_KEY = 'ayurnexa_user'

function setCookie(name, value, days = 7) {
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString()
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
  } catch {}
}

function getCookie(name) {
  try {
    const cookie = document.cookie
      .split('; ')
      .map((row) => row.split('='))
      .find((row) => row[0] === name)?.[1]
    return cookie ? decodeURIComponent(cookie) : null
  } catch {
    return null
  }
}

function removeCookie(name) {
  try {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`
  } catch {}
}

export function getToken() {
  const cookieVal = getCookie(TOKEN_KEY)
  if (cookieVal) return cookieVal

  try {
    const fromStorage =
      localStorage.getItem(TOKEN_KEY) ||
      localStorage.getItem('token') ||
      localStorage.getItem('ayurnexa_token')
    if (fromStorage) return fromStorage
  } catch {}

  return null
}

export function setToken(value) {
  if (!value) return
  setCookie(TOKEN_KEY, value)
  try {
    localStorage.setItem(TOKEN_KEY, value)
    localStorage.setItem('token', value)
  } catch {}
}

export function removeToken() {
  removeCookie(TOKEN_KEY)
  removeCookie('token')
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem('token')
    localStorage.removeItem('ayurnexa_token')
  } catch {}
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setStoredUser(user) {
  if (!user) return
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch {}
}

export function removeStoredUser() {
  try {
    localStorage.removeItem(USER_KEY)
  } catch {}
}

const baseURL = appConfig.apiBaseUrl
const apiKey = appConfig.apiKey

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey,
    Accept: 'application/json',
  },
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => {
    logError({
      type: 'api',
      method: response?.config?.method?.toUpperCase() || 'REQUEST',
      url: `${response?.config?.baseURL || ''}${response?.config?.url || ''}`,
      status: response?.status || 200,
      message: response?.data?.message || response?.data?.action || 'OK',
      data: response?.data,
    })
    return response
  },
  (error) => {
    const status = error?.response?.status
    const url = error?.config?.url || ''
    const isAuthProbe =
      url.includes('/auth/me') ||
      url.includes('/auth/login') ||
      url.includes('/auth/register')

    logError({
      type: 'api',
      method: error?.config?.method?.toUpperCase() || 'REQUEST',
      url: `${error?.config?.baseURL || ''}${url}`,
      status: status || 0,
      message: apiErrorMessage(error),
      data: error?.response?.data,
    })

    if (status === 401 && !isAuthProbe) {
      removeToken()
      removeStoredUser()
    }
    return Promise.reject(error)
  }
)

/** Extracts a human readable message from an axios error. */
export function apiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return error?.response?.data?.message || error?.response?.data?.error || error?.message || fallback
}

export default api
export { baseURL, apiKey }
