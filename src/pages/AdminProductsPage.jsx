import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import {
  createProduct,
  deleteProduct,
  getCategories,
  getProducts,
  updateProduct,
} from '../api/products'
import { formatPrice } from '../utils/currency'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'

const EMPTY_FORM = {
  id: null,
  name: '',
  description: '',
  price: '',
  quantity: '',
  categoryId: '',
  imageUrl: '',
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [imageFile, setImageFile] = useState(null)

  const isEditing = useMemo(() => Boolean(form.id), [form.id])

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [productData, categoryData] = await Promise.all([
          getProducts(),
          getCategories(),
        ])
        setProducts(productData || [])
        setCategories(categoryData || [])
      } catch (err) {
        toast.error(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  function resetForm() {
    setForm(EMPTY_FORM)
    setImageFile(null)
  }

  function startEdit(product) {
    setForm({
      id: product.id,
      name: product.name || '',
      description: product.description || '',
      price: product.price ?? '',
      quantity: product.quantity ?? '',
      categoryId: product.category?.id ? String(product.category.id) : '',
      imageUrl: product.imageUrl || '',
    })
    setImageFile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    try {
      if (isEditing) {
        const updated = await updateProduct(form.id, form)
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
        toast.success('Product updated')
      } else {
        const created = await createProduct(form, imageFile)
        setProducts((prev) => [created, ...prev])
        toast.success('Product created')
      }
      resetForm()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(productId) {
    const confirmed = window.confirm('Delete this product?')
    if (!confirmed) return

    try {
      await deleteProduct(productId)
      setProducts((prev) => prev.filter((p) => p.id !== productId))
      toast.success('Product deleted')
      if (form.id === productId) resetForm()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="space-y-4">
      <div className="max-w-6xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-600 mt-1 text-sm">Create, edit, and delete products.</p>
        </div>

        <section className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-base font-semibold text-slate-900 mb-4">
            {isEditing ? 'Edit Product' : 'Create Product'}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Product name"
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
              required
            />

            <select
              value={form.categoryId}
              onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <input
              type="number"
              min="0"
              step="1"
              value={form.quantity}
              onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))}
              placeholder="Quantity"
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
              required
            />

            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
              placeholder="Price"
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
              required
            />

            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Description"
              className="md:col-span-2 px-3 py-2.5 border border-gray-300 rounded-lg text-sm min-h-24"
            />

            {!isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="md:col-span-2 text-sm"
              />
            )}

            <div className="md:col-span-2 flex items-center gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
              </Button>
              {isEditing && (
                <Button type="button" variant="secondary" onClick={resetForm}>
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-base font-semibold text-slate-900 mb-4">All Products</h2>

          {loading ? (
            <div className="flex justify-center py-10">
              <Spinner />
            </div>
          ) : products.length === 0 ? (
            <p className="text-gray-500">No products available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Category</th>
                    <th className="py-2 pr-4">Price</th>
                    <th className="py-2 pr-4">Qty</th>
                    <th className="py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100">
                      <td className="py-3 pr-4 font-medium text-gray-800">{product.name}</td>
                      <td className="py-3 pr-4 text-gray-600">{product.category?.name || '-'}</td>
                      <td className="py-3 pr-4 text-gray-700">{formatPrice(product.price)}</td>
                      <td className="py-3 pr-4 text-gray-700">{product.quantity}</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="secondary" onClick={() => startEdit(product)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => handleDelete(product.id)}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
