import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, ShieldCheck, Truck, RotateCcw, X } from 'lucide-react'
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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
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

  const onSubmit = async (data) => {
    if (file) {
      const res = await dispatch(uploadImageThunk(file))
      if (uploadImageThunk.fulfilled.match(res)) {
        setValue('productImage', res.payload.url)
      }
    }
    const payload = {
      productName: data.productName,
      productDescription: data.productDescription,
      productCategory: data.productCategory,
      productWeight: data.productWeight,
      form: data.form,
      productImage: data.productImage,
      isActive: data.isActive,
      productPrice: Number(data.productPrice),
    }
    const res = await dispatch(createProductThunk({ payload }))
    if (createProductThunk.fulfilled.match(res)) {
      navigate('/admin/products')
    }
  }

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <Link to="/admin/products" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground">
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
                {...register('productName')}
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
                {...register('productPrice')}
                type="number"
                placeholder="0.00"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
              />
              {errors.productPrice && <p className="text-xs text-destructive">{errors.productPrice.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Active on store</label>
              <div className="flex items-center gap-3">
                <input {...register('isActive')} type="checkbox" className="rounded border-border text-primary-600 focus:ring-primary-500" />
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

          <div className="mt-6">
            <label className="block text-sm font-semibold text-foreground mb-3">Product image</label>
            <div className="relative flex flex-col items-center gap-4 border-2 border-dashed border-border rounded-2xl bg-muted/50 p-8 text-center hover:border-primary-500 transition-colors group">
              {preview ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative group relative"
                >
                  <img src={preview} alt="Product preview" className="max-w-[300px] max-h-[300px] rounded-xl object-cover shadow-lg" />
                  <button
                    type="button"
                    onClick={() => { setFile(null); setPreview(null) }}
                    className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-white text-xs shadow-lg hover:bg-destructive/90"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <Plus className="h-6 w-6 text-primary-600 group-hover:text-primary-800" />
                  <span>Choose image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 p-4 rounded-xl border border-primary-100 bg-primary-50 text-sm text-primary-800">
            <ShieldCheck className="h-5 w-5" />
            <span>Images upload to private storage and are delivered with discreet packaging.</span>
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
          <Button type="submit" size="lg" className="w-full md:w-auto" disabled={upload.loading}>
            {upload.loading ? 'Uploading image…' : 'Save product'}
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
