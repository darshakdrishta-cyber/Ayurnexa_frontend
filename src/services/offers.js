import api from './api'
import { uploadToSupabase } from './supabaseStorage'

/**
 * Uploads an offer promotional banner/screen to Supabase storage.
 * Bucket: 'Ayurnexa', Folder: 'offerScreens'
 *
 * @param {File|Blob} file
 * @returns {Promise<{ url: string }>}
 */
export async function uploadOfferImage(file) {
  return await uploadToSupabase(file, {
    bucket: 'Ayurnexa',
    folder: 'offerScreens',
  })
}

/**
 * 1. Create Offer: POST /api/offers
 *
 * @param {Object} payload
 * @param {string} payload.offername - Name/title of the offer
 * @param {string} payload.offerlink - Destination link or promotional image URL
 * @param {string} [payload.additionallink] - Terms or additional URL
 * @param {boolean} [payload.is_active=true]
 * @returns {Promise<any>}
 */
export async function createOffer(payload) {
  const { data } = await api.post('/offers', {
    ...payload,
    is_active: payload.is_active ?? true,
  })
  return data
}

/**
 * 2. Get Offers: GET /api/offers
 * Pass all=true to fetch all offers including inactive ones (Admin view)
 *
 * @param {boolean} [all=false]
 * @returns {Promise<Array>}
 */
export async function getOffers(all = false) {
  const { data } = await api.get('/offers', {
    params: all ? { all: true } : {},
  })
  return Array.isArray(data) ? data : data?.content || []
}

/**
 * 3. Get Offer by ID: GET /api/offers/{offerId}
 *
 * @param {string|number} offerId
 * @returns {Promise<any>}
 */
export async function getOfferById(offerId) {
  const { data } = await api.get(`/offers/${offerId}`)
  return data
}

/**
 * 4. Update Offer: PUT /api/offers/{offerId}
 *
 * @param {string|number} offerId
 * @param {Object} payload
 * @returns {Promise<any>}
 */
export async function updateOffer(offerId, payload) {
  const { data } = await api.put(`/offers/${offerId}`, payload)
  return data
}

/**
 * 5. Soft Delete Offer: DELETE /api/offers/{offerId}
 * Sets is_active = false and records offerdeleted timestamp
 *
 * @param {string|number} offerId
 * @returns {Promise<any>}
 */
export async function deleteOffer(offerId) {
  const { data } = await api.delete(`/offers/${offerId}`)
  return data
}

export default {
  uploadOfferImage,
  createOffer,
  getOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
}
