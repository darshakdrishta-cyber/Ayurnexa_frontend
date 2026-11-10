import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Upload,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from 'lucide-react'
import { Button } from '../common/Button'
import { Card } from '../common/Card'
import { Reveal } from '../common/Reveal'
import {
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  uploadOfferImage,
} from '../../services/offers'

export function AdminOffers() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [editingOffer, setEditingOffer] = useState(null)
  const [offername, setOffername] = useState('')
  const [offerlink, setOfferlink] = useState('')
  const [additionallink, setAdditionallink] = useState('')
  const [isActive, setIsActive] = useState(true)

  // Upload image state
  const [file, setFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)

  const loadOffers = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getOffers(true)
      setOffers(data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load offers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOffers()
  }, [])

  const resetForm = () => {
    setEditingOffer(null)
    setOffername('')
    setOfferlink('')
    setAdditionallink('')
    setIsActive(true)
    setFile(null)
    setImagePreview('')
    setShowForm(false)
  }

  const handleEdit = (offer) => {
    setEditingOffer(offer)
    setOffername(offer.offername || '')
    setOfferlink(offer.offerlink || '')
    setAdditionallink(offer.additionallink || '')
    setIsActive(offer.is_active !== false)
    setImagePreview(offer.offerlink || '')
    setShowForm(true)
  }

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setImagePreview(URL.createObjectURL(selected))
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!offername.trim()) {
      setError('Offer name is required.')
      return
    }

    try {
      let finalOfferLink = offerlink

      // If user uploaded a new image file, upload to folder 'offerScreens'
      if (file) {
        setUploading(true)
        const res = await uploadOfferImage(file)
        finalOfferLink = res.url
        setUploading(false)
      }

      const payload = {
        offername,
        offerlink: finalOfferLink,
        additionallink,
        is_active: isActive,
      }

      if (editingOffer) {
        const id = editingOffer.offerId || editingOffer.id
        await updateOffer(id, payload)
        setSuccess('Offer updated successfully!')
      } else {
        await createOffer(payload)
        setSuccess('Offer created successfully!')
      }

      resetForm()
      await loadOffers()
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save offer')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (offerId) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return
    try {
      await deleteOffer(offerId)
      setSuccess('Offer deleted successfully!')
      await loadOffers()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete offer')
    }
  }

  const handleToggleActive = async (offer) => {
    const id = offer.offerId || offer.id
    try {
      await updateOffer(id, {
        is_active: !offer.is_active,
      })
      await loadOffers()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update offer')
    }
  }

  return (
    <div className="container py-8">
      <Reveal className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            Offers & Promotions
          </h1>
          <p className="text-muted-foreground">
            Manage promotional popups displayed to visitors on the home page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={loadOffers} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" /> Refresh
          </Button>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" /> Create Offer
            </Button>
          )}
        </div>
      </Reveal>

      {/* Alert Messages */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-destructive-200 bg-destructive-50 p-4 text-sm text-destructive dark:border-destructive-900/50 dark:bg-destructive-950/50">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-success-200 bg-success-50 p-4 text-sm text-success dark:border-success-900/50 dark:bg-success-950/50">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Form Drawer / Card */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-6 border-primary-200 dark:border-primary-900">
            <h2 className="text-xl font-bold text-foreground mb-4">
              {editingOffer ? 'Edit Offer' : 'Create New Offer'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Offer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwali 20% Off"
                  value={offername}
                  onChange={(e) => setOffername(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary-600 focus:outline-hidden"
                />
              </div>

              {/* Promotional Image / Banner Upload */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Banner Image (Folder: offerScreens)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-4 hover:border-primary-500 transition w-full">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {file ? file.name : 'Select Banner / Image to upload'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {imagePreview && (
                    <div className="relative h-20 w-32 rounded-lg overflow-hidden border border-border shrink-0 bg-muted">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Offer Link or Destination URL
                </label>
                <input
                  type="text"
                  placeholder="https://ayurnexa.com/products or custom URL"
                  value={offerlink}
                  onChange={(e) => setOfferlink(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Additional / Terms Link (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://ayurnexa.com/terms"
                  value={additionallink}
                  onChange={(e) => setAdditionallink(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary-600 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-foreground cursor-pointer">
                  Active (show to visitors)
                </label>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <Button type="submit" disabled={uploading}>
                  {uploading ? 'Uploading…' : editingOffer ? 'Update Offer' : 'Create Offer'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Offers Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Banner</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Offer Name</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Link</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Status</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    <span className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary-600 inline-block mr-2" />
                    Loading offers…
                  </td>
                </tr>
              ) : offers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    No offers found. Create one above to display on the home screen!
                  </td>
                </tr>
              ) : (
                offers.map((offer) => {
                  const id = offer.offerId || offer.id
                  const isDeleted = !!offer.offerdeleted
                  const active = offer.is_active && !isDeleted

                  return (
                    <tr
                      key={id}
                      className="border-b border-border hover:bg-muted/30 transition"
                    >
                      <td className="py-4 px-6">
                        {offer.offerlink ? (
                          <div className="h-12 w-20 rounded-lg overflow-hidden border border-border bg-muted">
                            <img
                              src={offer.offerlink}
                              alt={offer.offername}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-20 rounded-lg border border-border bg-muted flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6 font-medium text-foreground">
                        {offer.offername}
                        {offer.additionallink && (
                          <span className="block text-xs text-muted-foreground truncate max-w-xs">
                            Terms: {offer.additionallink}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-xs text-muted-foreground max-w-xs truncate">
                        {offer.offerlink ? (
                          <a
                            href={offer.offerlink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 hover:text-primary-600 hover:underline"
                          >
                            <span className="truncate">{offer.offerlink}</span>
                            <ExternalLink className="h-3 w-3 shrink-0" />
                          </a>
                        ) : (
                          '—'
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                            active
                              ? 'text-success border-success-200 bg-success-50'
                              : 'text-muted-foreground border-border bg-muted'
                          }`}
                        >
                          {active ? 'Active' : isDeleted ? 'Deleted' : 'Inactive'}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleToggleActive(offer)}
                            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground transition"
                            title={offer.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {offer.is_active ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={() => handleEdit(offer)}
                            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground transition"
                            title="Edit offer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(id)}
                            className="p-1.5 rounded-lg border border-border hover:bg-destructive-50 text-destructive transition"
                            title="Delete offer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
export default AdminOffers
