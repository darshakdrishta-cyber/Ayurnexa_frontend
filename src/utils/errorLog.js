const KEY = 'ayurnexa_error_log'
const MAX = 100

export function getErrorLog() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function logError(entry) {
  try {
    const list = getErrorLog()
    list.unshift({ id: `${Date.now()}-${Math.random()}`, time: new Date().toISOString(), ...entry })
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)))
  } catch {
    /* ignore */
  }
  try { window.dispatchEvent(new CustomEvent('ayurnexa:error-log')) } catch {
    /* ignore */
  }
}

export function clearErrorLog() {
  try { localStorage.removeItem(KEY) } catch {
    /* ignore */
  }
  try { window.dispatchEvent(new CustomEvent('ayurnexa:error-log')) } catch {
    /* ignore */
  }
}
