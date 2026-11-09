import api from './api'

/**
 * POST /api/uploads — upload a single file/image to the backend.
 * Returns { url, path, filename, size, mimeType } or similar per backend response.
 * @param {File|Blob} file - The file to upload.
 * @param {Object} [options]
 * @param {string} [options.fieldName] - Form field name (default 'file').
 * @param {string} [options.folder] - Optional folder/category hint sent to backend.
 * @returns {Promise<any>} Backend response data.
 */
export async function uploadImage(file, options = {}) {
  if (!file) throw new Error('No file provided for upload.')

  const fieldName = options.fieldName || 'file'
  const formData = new FormData()
  formData.append(fieldName, file)
  if (options.folder) formData.append('folder', options.folder)

  const { data } = await api.post('/uploads', formData)
  return data
}

/**
 * POST /api/uploads — upload multiple files.
 * @param {File[]|FileList} files
 * @param {Object} [options]
 * @param {string} [options.fieldName] - Form field name (default 'files[]').
 * @returns {Promise<any[]>} Array of backend response data per file.
 */
export async function uploadMultiple(files, options = {}) {
  if (!files || files.length === 0) throw new Error('No files provided for upload.')

  const fieldName = options.fieldName || 'files[]'
  const formData = new FormData()
  Array.from(files).forEach((file) => formData.append(fieldName, file))
  if (options.folder) formData.append('folder', options.folder)

  const { data } = await api.post('/uploads', formData)
  return data
}

/**
 * DELETE /api/uploads/{path} — delete an uploaded file.
 * @param {string} path
 */
export async function deleteUpload(path) {
  if (!path) throw new Error('No path provided for deletion.')
  const { data } = await api.delete(`/uploads/${encodeURIComponent(path)}`)
  return data
}

export { uploadImage as upload }
