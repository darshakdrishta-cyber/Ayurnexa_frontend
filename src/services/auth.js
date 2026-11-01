import api, {
  USER_KEY,
  TOKEN_KEY,
  setToken,
  removeToken,
  getToken,
  getStoredUser,
  setStoredUser,
  removeStoredUser,
} from './api'

export {
  USER_KEY,
  TOKEN_KEY,
  setToken,
  removeToken,
  getToken,
  getStoredUser,
  setStoredUser,
  removeStoredUser,
}

/**
 * Normalizes user object to ensure consistent structure across all endpoints.
 */
export function normalizeUser(raw) {
  if (!raw) return null
  const user = raw.user || raw.data?.user || raw
  if (!user || typeof user !== 'object') return null

  const role =
    user.role ||
    (Array.isArray(user.roles)
      ? user.roles.includes('ROLE_ADMIN') || user.roles.includes('ADMIN')
        ? 'ADMIN'
        : user.roles[0]
      : 'USER')

  return {
    ...user,
    id: user.id || user.userId || user._id,
    userId: user.userId || user.id || user._id,
    username: user.username || user.name || (user.email ? user.email.split('@')[0] : 'User'),
    email: user.email || '',
    role: role === 'ROLE_ADMIN' ? 'ADMIN' : role === 'ROLE_USER' ? 'USER' : role,
    roles: Array.isArray(user.roles)
      ? user.roles
      : [role === 'ADMIN' ? 'ROLE_ADMIN' : 'ROLE_USER'],
    picture: user.picture || user.avatar || user.image || null,
  }
}

/**
 * Extracts token & user from various API response shapes (bearer JWT or HttpOnly cookie responses).
 */
export function extractAuthData(data) {
  if (!data) return { token: null, user: null, raw: null }

  const token =
    data.token ||
    data.accessToken ||
    data.jwt ||
    data.data?.token ||
    data.data?.accessToken ||
    null

  const rawUser = data.user || data.data?.user || (data.email ? data : null)
  const user = rawUser ? normalizeUser(rawUser) : null

  return { token, user, raw: data }
}


export async function register({ username, email, password }) {
  const { data } = await api.post('/auth/register', { username, email, password })
  const { token, user } = extractAuthData(data)
  if (token) setToken(token)
  if (user) setStoredUser(user)
  return { token, user, ...data }
}

export async function login({ email, password }) {
  const { data } = await api.post('/auth/login', { email, password })
  const { token, user } = extractAuthData(data)
  if (token) setToken(token)
  if (user) setStoredUser(user)   
  return { token, user, ...data }
}

export async function googleLogin({ credential }) {
  const { data } = await api.post('/auth/google', { credential })
  const { token, user } = extractAuthData(data)
  if (token) setToken(token)
  if (user) setStoredUser(user)
  return { token, user, ...data }
}

export async function me() {
  const { data } = await api.get('/auth/me')
  const { user } = extractAuthData(data)
  const normalized = user || normalizeUser(data)
  if (normalized) {
    setStoredUser(normalized)
  }
  return normalized
}

export async function logout() {
  try {
    await api.post('/auth/logout')
  } catch {
    // If backend doesn't provide a logout route or is stateless, catch gracefully
  } finally {
    clearSession()
  }
}

export function clearSession() {
  removeToken()
  removeStoredUser()
}
