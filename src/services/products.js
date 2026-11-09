import api, { getToken } from './api'

export async function listProducts() {
  const { data } = await api.get('/products')
  return Array.isArray(data) ? data : data?.content || []
}

export async function listAllProducts() {
  const { data } = await api.get('/products/all')
  return Array.isArray(data) ? data : data?.content || []
}

export async function getProduct(productId) {
  const { data } = await api.get(`/products/${productId}`)
  return data
}

export async function searchProducts(name) {
  const { data } = await api.get('/products/search', { params: { name } })
  return Array.isArray(data) ? data : data?.content || []
}

export async function createProduct(payload) {
  const { data } = await api.post('/products', payload)
  return data
}

export async function updateProduct(productId, payload) {
  const { data } = await api.patch(`/products/${productId}`, payload)
  return data
}

export async function deleteProduct(productId) {
  const { data } = await api.delete(`/products/${productId}`)
  return data
}

export async function toggleProduct(productId) {
  const { data } = await api.patch(`/products/${productId}/toggle`)
  return data
}

export async function uploadImage(file) {
  const token = getToken()
  if (!token) {
    throw new Error('You must be signed in to upload product images.')
  }

  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post('/uploads', formData, {
    headers: {
      'Content-Type': undefined, // Let the browser set multipart/form-data with the correct boundary
      Authorization: `Bearer ${token}`,
    },
  })
  const url = data?.url || data?.imageUrl || data?.data?.url || data?.productImage
  return { ...data, url }
}
