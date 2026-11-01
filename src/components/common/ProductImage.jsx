import { useState } from 'react'

/**
 * Product image with graceful fallback: if the remote image fails or is missing,
 * a brand-tinted gradient with the product initial is rendered instead.
 */
export function ProductImage({ product, className = '', imgClassName = '' }) {
  const [failed, setFailed] = useState(false)

  const name = product?.name || product?.productName || 'Product'
  const image = product?.image || product?.productImage || product?.imageUrl || ''

  if (failed || !image) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 ${className}`}
        aria-hidden="true"
      >
        <span className="font-display text-3xl font-semibold text-white/90">
          {(name || 'P').slice(0, 1).toUpperCase()}
        </span>
      </div>
    )
  }

  return (
    <div className={className}>
      <img
        src={image}
        alt={name}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  )
}
