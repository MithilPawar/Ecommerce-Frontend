import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../api/categories'

const EMPTY_FORM = {
  id: null,
  name: '',
  description: '',
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const isEditing = useMemo(() => Boolean(form.id), [form.id])

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const data = await getCategories()
        setCategories(data || [])
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
  }

  function startEdit(category) {
    setForm({
      id: category.id,
      name: category.name || '',
      description: category.description || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    try {
      if (isEditing) {
        const updated = await updateCategory(form.id, form)
        setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
        toast.success('Category updated')
      } else {
        const created = await createCategory(form)
        setCategories((prev) => [created, ...prev])
        toast.success('Category created')
      }

      resetForm()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(categoryId) {
    const confirmed = window.confirm('Delete this category?')
    if (!confirmed) return

    try {
      await deleteCategory(categoryId)
      setCategories((prev) => prev.filter((c) => c.id !== categoryId))
      if (form.id === categoryId) resetForm()
      toast.success('Category deleted')
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="space-y-4">
      <div className="max-w-5xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="text-slate-600 mt-1 text-sm">Create, edit, and delete categories.</p>
        </div>

        <section className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-base font-semibold text-slate-900 mb-4">
            {isEditing ? 'Edit Category' : 'Create Category'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Category name"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
              required
            />

            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Category description"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm min-h-24"
            />

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
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
          <h2 className="text-base font-semibold text-slate-900 mb-4">All Categories</h2>

          {loading ? (
            <div className="flex justify-center py-10">
              <Spinner />
            </div>
          ) : categories.length === 0 ? (
            <p className="text-gray-500">No categories available.</p>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-gray-100 rounded-xl p-4"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{category.description || 'No description'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => startEdit(category)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(category.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
