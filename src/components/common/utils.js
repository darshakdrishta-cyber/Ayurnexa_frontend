export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(price)
}

export function generateId() {
  return Math.random().toString(36).slice(2, 11)
}
