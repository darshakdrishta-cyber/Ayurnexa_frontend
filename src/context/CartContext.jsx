import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CART_KEY = 'Ayurnexaa_cart'
const CartContext = createContext(null)

function normalizeCartItem(product, qty = 1) {
  const id = String(product?.id || product?.productId || product?._id || '')
  const name = product?.name || product?.productName || 'Product'
  const price = Number(product?.price ?? product?.productPrice ?? 0) || 0
  const image = product?.image || product?.productImage || product?.imageUrl || ''
  const category = product?.category || product?.productCategory || 'wellness'
  const weight = product?.weight || product?.productWeight || ''
  const form = product?.form || ''
  const safeQty = Math.max(1, Math.min(Number(qty) || 1, 99))

  return {
    id,
    name,
    price,
    image,
    category,
    weight,
    form,
    qty: safeQty,
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_KEY)
      if (!stored) return []
      const parsed = JSON.parse(stored)
      return Array.isArray(parsed)
        ? parsed.map((item) => normalizeCartItem(item, item.qty))
        : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items))
    } catch {
      // storage unavailable or full
    }
  }, [items])

  const add = (product, qty = 1) => {
    if (!product) return
    const id = String(product.id || product.productId || product._id || '')
    if (!id) return

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => String(i.id) === id)
      if (existingIndex > -1) {
        const copy = [...prev]
        const current = copy[existingIndex]
        const newQty = Math.min(current.qty + (Number(qty) || 1), 99)
        copy[existingIndex] = { ...current, qty: newQty }
        return copy
      }

      return [...prev, normalizeCartItem(product, qty)]
    })
  }

  const updateQty = (id, qty) => {
    const stringId = String(id)
    const num = Number(qty)
    setItems((prev) =>
      num <= 0
        ? prev.filter((i) => String(i.id) !== stringId)
        : prev.map((i) =>
            String(i.id) === stringId ? { ...i, qty: Math.min(num, 99) } : i
          )
    )
  }

  const remove = (id) => {
    const stringId = String(id)
    setItems((prev) => prev.filter((i) => String(i.id) !== stringId))
  }

  const clear = () => {
    setItems([])
    try {
      localStorage.removeItem(CART_KEY)
    } catch {}
  }

  const hasItem = (id) => items.some((i) => String(i.id) === String(id))

  const getItemQty = (id) => {
    const found = items.find((i) => String(i.id) === String(id))
    return found ? found.qty : 0
  }

  const { count, subtotal } = useMemo(() => {
    return items.reduce(
      (acc, i) => {
        const qty = Number(i.qty) || 0
        const price = Number(i.price) || 0
        return {
          count: acc.count + qty,
          subtotal: acc.subtotal + qty * price,
        }
      },
      { count: 0, subtotal: 0 }
    )
  }, [items])

  const value = {
    items,
    add,
    updateQty,
    remove,
    clear,
    hasItem,
    getItemQty,
    count,
    subtotal: Math.round(subtotal * 100) / 100,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
