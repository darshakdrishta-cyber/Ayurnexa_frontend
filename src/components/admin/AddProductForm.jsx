import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Plus,
  ShieldCheck,
  Truck,
  RotateCcw,
  X,
  Upload,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Button, LinkButton } from '../common/Button'
import { Card } from '../common/Card'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { uploadImageThunk, createProductThunk } from '../../store/slices/productSlice'

const CATEGORIES = ['Oil', 'Capsule', 'Tablet', 'Drops', 'Serum', 'Powder']
const FORMS = ['Liquid', 'Capsule', 'Tablet', 'Drops', 'Powder']

export function AddProductForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { upload } = useAppSelector((state) => state.products)

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploadedUrl, setUploadedUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [copied, setCopied] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      productName: '',
      productDescription: '',
      productCategory: 'Oil',
      productWeight: '',
      form: 'Liquid',
      productPrice: '',
      productImage: '',
      isActive: true,
    },
  })

  const currentImageUrl = watch('productImage')

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setUploadedUrl('')
    setUploadError('')
    setPreview(URL.createObjectURL(f))
  }

  const handleClearImage = () => {
    setFile(null)
    setPreview(null)
    setUploadedUrl('')
    setUploadError('')
    setValue('productImage', '', { shouldValidate: true })
  }

  const handleUploadToSupabase = async () => {
    if (!file) return
    setIsUploading(true)
    setUploadError('')

    try {
      const res = await dispatch(uploadImageThunk(file)).unwrap()
      if (!res?.url) {
        throw new Error('Upload succeeded but no public URL was returned from Supabase.')
      }
      setUploadedUrl(res.url)
      setValue('productImage', res.url, { shouldValidate: true })
    } catch (err) {
      setUploadError(
        typeof err === 'string'
          ? err
          : err?.message || 'Failed to upload image to Supabase Storage.'
      )
    } finally {
      setIsUploading(false)
    }
  }

  const handleCopyUrl = async () => {
    const url = uploadedUrl || currentImageUrl
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const onSubmit = async (data) => {
    setSubmitError('')

    try {
      let finalImageUrl = uploadedUrl || data.productImage || ''

      // If file chosen but user didn't click "Upload to Supabase" button before saving
      if (file && !uploadedUrl) {
        setIsUploading(true)
        const uploadedImage = await dispatch(uploadImageThunk(file)).unwrap()
        if (!uploadedImage?.url) {
          throw new Error('Image upload did not return a public image URL.')
        }
        finalImageUrl = uploadedImage.url
        setUploadedUrl(finalImageUrl)
        setValue('productImage', finalImageUrl)
      }

      const payload = {
        productName: data.productName,
        productDescription: data.productDescription,
        productCategory: data.productCategory,
        productWeight: data.productWeight,
        form: data.form,
        productImage: finalImageUrl,
        isActive: data.isActive,
        productPrice: Number(data.productPrice),
      }

      await dispatch(createProductThunk({ payload })).unwrap()
      navigate('/admin/products')
    } catch (error) {
      setSubmitError(
        typeof error === 'string'
          ? error
          : error?.message || 'Could not save the product. Please try again.'
      )
    } finally {
      setIsUploading(false)
    }
  }

  const isBusy = isSubmitting || isUploading || upload.loading

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to products
          </Link>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground">
            Add new product
          </h1>
        </div>
        <LinkButton to="/admin/products" variant="outline">
          Cancel
        </LinkButton>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-8">
        <Card className="p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Product name</label>
              <input
                {...register('productName', { required: 'Product name is required.' })}
                placeholder="e.g. Shilajit Gold Oil"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
              />
              {errors.productName && <p className="text-xs text-destructive">{errors.productName.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Category</label>
              <select
                {...register('productCategory')}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Form</label>
              <select
                {...register('form')}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
              >
                {FORMS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Weight / size</label>
              <input
                {...register('productWeight')}
                placeholder="e.g. 30 ml"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Price (₹)</label>
              <input
                {...register('productPrice', {
                  required: 'Price is required.',
                  valueAsNumber: true,
                  min: { value: 0.01, message: 'Price must be greater than zero.' },
                })}
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
              />
              {errors.productPrice && <p className="text-xs text-destructive">{errors.productPrice.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Active on store</label>
              <div className="flex items-center gap-3">
                <input
                  {...register('isActive')}
                  type="checkbox"
                  className="rounded border-border text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-foreground">List product publicly</span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <label className="block text-sm font-semibold text-foreground">Description</label>
            <textarea
              {...register('productDescription')}
              rows={4}
              placeholder="Describe benefits, usage and ingredients…"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
            />
            {errors.productDescription && (
              <p className="text-xs text-destructive">{errors.productDescription.message}</p>
            )}
          </div>

          {/* Product Image Section with direct Supabase upload */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-foreground">Product image</label>
              <span className="text-xs text-muted-foreground">Direct Supabase Storage integration</span>
            </div>

            <div className="relative flex flex-col items-center gap-4 border-2 border-dashed border-border rounded-2xl bg-muted/40 p-6 text-center hover:border-primary-500 transition-colors group">
              {preview ? (
                <div className="w-full flex flex-col items-center gap-4">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative"
                  >
                    <img
                      src={preview}
                      alt="Product preview"
                      className="max-w-[260px] max-h-[220px] rounded-xl object-cover shadow-md border border-border"
                    />
                    <button
                      type="button"
                      onClick={handleClearImage}
                      disabled={isBusy}
                      className="absolute -right-2.5 -top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-destructive text-white text-xs shadow-md hover:bg-destructive/90 transition"
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>

                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="font-medium text-foreground">{file?.name}</span>
                    {file?.size && <span>({(file.size / 1024).toFixed(1)} KB)</span>}
                  </div>

                  {/* Extra Upload Button for Supabase Upload */}
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-1">
                    {!uploadedUrl ? (
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={handleUploadToSupabase}
                        disabled={isBusy}
                        className="gap-2 shadow-sm"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Uploading to Supabase…
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            Upload image now
                          </>
                        )}
                      </Button>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                        <CheckCircle2 className="h-4 w-4" />
                        Uploaded to Supabase
                      </div>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleClearImage}
                      disabled={isBusy}
                    >
                      Change image
                    </Button>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-3 py-4 text-sm text-muted-foreground hover:text-foreground">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition">
                    <Plus className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="font-semibold text-primary-600 hover:underline">Choose image</span> or drag and drop
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                    disabled={isBusy}
                  />
                </label>
              )}
            </div>

            {uploadError && (
              <p role="alert" className="text-xs text-destructive bg-destructive/10 border border-destructive/20 p-2.5 rounded-xl">
                {uploadError}
              </p>
            )}

            {/* Display / edit the generated or entered image URL */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-muted-foreground">
                Product image URL (saved with product)
              </label>
              <div className="flex items-center gap-2">
                <input
                  {...register('productImage')}
                  placeholder="https://...supabase.co/storage/v1/object/public/Ayurnexa/products/..."
                  className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 font-mono"
                  onChange={(e) => {
                    setValue('productImage', e.target.value)
                    if (!file && e.target.value) {
                      setPreview(e.target.value)
                    }
                  }}
                />
                {(uploadedUrl || currentImageUrl) && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopyUrl}
                      title="Copy public link"
                      className="px-3"
                    >
                      {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <a
                      href={uploadedUrl || currentImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground transition"
                      title="Open image in new tab"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                This Supabase URL will be stored in MongoDB and loaded directly when customers view the product.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 p-4 rounded-xl border border-primary-100 bg-primary-50 text-sm text-primary-800">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <span>Images are delivered directly via Supabase CDN with discreet packaging guaranteed.</span>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="col-span-2">
            <div className="flex gap-3">
              <ul className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4" /> Discreet packaging
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" /> Batch tested
                </li>
                <li className="flex items-center gap-1.5">
                  <RotateCcw className="h-4 w-4" /> Easy returns
                </li>
              </ul>
            </div>
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto"
            disabled={isBusy}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving product…
              </>
            ) : isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Uploading image…
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Save product
              </>
            )}
          </Button>
        </div>
        {submitError && (
          <p role="alert" className="rounded-xl border border-destructive/25 bg-destructive-50 px-4 py-3 text-sm text-destructive dark:bg-destructive-950/40">
            {submitError}
          </p>
        )}
      </form>
    </div>
  )
}
