import { appConfig } from '../config'

/**
 * Uploads an image or file directly to Supabase Storage using the REST API.
 * Bypasses backend /uploads routes and directly stores files in the Supabase bucket.
 *
 * @param {File|Blob} file - The file to upload.
 * @param {Object} [options]
 * @param {string} [options.bucket] - Supabase bucket name.
 * @param {string} [options.folder] - Folder path inside the bucket.
 * @returns {Promise<{ url: string, imageUrl: string, path: string, bucket: string }>}
 */
export async function uploadToSupabase(file, options = {}) {
  if (!file) {
    throw new Error('No file provided for upload.')
  }

  const supabaseUrl = (options.url || appConfig.supabaseUrl || '').replace(/\/$/, '')
  const bucket = options.bucket || appConfig.supabaseBucket || 'Ayurnexaa'
  const folder = options.folder || 'products'

  // Supabase secret key bypasses RLS policies; publishable key is fallback
  const primaryKey = appConfig.supabaseSecretKey || appConfig.supabasePublishableKey
  const fallbackKey = appConfig.supabasePublishableKey

  if (!supabaseUrl || !primaryKey) {
    throw new Error('Supabase URL or API key is missing. Please check your configuration.')
  }

  // Sanitize filename and create a collision-resistant unique path
  const originalName = file.name || 'product.jpg'
  const sanitized = originalName.replace(/[^a-zA-Z0-9._-]/g, '_')
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  const filePath = `${folder}/${timestamp}-${randomSuffix}-${sanitized}`

  async function performUpload(targetBucket, targetKey) {
    const endpoint = `${supabaseUrl}/storage/v1/object/${targetBucket}/${filePath}`
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        apikey: targetKey,
        Authorization: `Bearer ${targetKey}`,
        'Content-Type': file.type || 'image/jpeg',
        'x-upsert': 'true',
      },
      body: file,
    })

    const data = await response.json().catch(() => null)
    return { ok: response.ok, status: response.status, data }
  }

  // Attempt upload with primary key
  let result = await performUpload(bucket, primaryKey)

  // If 403 or 401 and fallback key exists, attempt fallback
  if (!result.ok && (result.status === 401 || result.status === 403) && fallbackKey && fallbackKey !== primaryKey) {
    result = await performUpload(bucket, fallbackKey)
  }

  // If 404 (Bucket not found), try 'products' bucket as fallback
  if (!result.ok && result.status === 404 && bucket.toLowerCase() !== 'products') {
    result = await performUpload('products', primaryKey)
  }

  if (!result.ok) {
    const errorMsg =
      result.data?.message ||
      result.data?.error ||
      `Upload failed with HTTP status ${result.status}`
    throw new Error(`Supabase upload error: ${errorMsg}`)
  }

  // Construct standard Supabase public storage URL
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`

  return {
    url: publicUrl,
    imageUrl: publicUrl,
    path: filePath,
    bucket,
  }
}
