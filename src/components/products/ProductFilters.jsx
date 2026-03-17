import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCategories, filterProducts } from '../../api/products'
import Spinner from '../common/Spinner'

export default function ProductFilters({ onFiltersChange, onCategoryChange }) {
  const [searchParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 })

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories()
        setCategories(data || [])
      } catch { /* fail silently */ }
    }
    loadCategories()
  }, [])

  // Handle category change
  function handleCategorySelect(catId) {
    setSelectedCategory(catId)
    onCategoryChange?.(catId)
  }

  // Handle filter apply
  async function handleApplyFilters() {
    setLoading(true)
    try {
      const params = {
        ...(selectedCategory !== 'all' && { categoryId: selectedCategory }),
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
      }
      if (searchParams.get('q')) params.name = searchParams.get('q')

      const data = await filterProducts(params)
      onFiltersChange?.(data)
    } catch { /* fail silently */ }
    finally { setLoading(false) }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-5">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Categories</h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => handleCategorySelect('all')}
              className={`text-sm hover:text-indigo-600 transition-colors ${
                selectedCategory === 'all' ? 'text-indigo-600 font-semibold' : 'text-gray-600'
              }`}
            >
              All Categories
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => handleCategorySelect(cat.id)}
                className={`text-sm hover:text-indigo-600 transition-colors ${
                  selectedCategory === cat.id ? 'text-indigo-600 font-semibold' : 'text-gray-600'
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Price Range</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500">Min (Rs)</label>
            <input
              type="number"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Max (Rs)</label>
            <input
              type="number"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={handleApplyFilters}
        disabled={loading}
        className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && <Spinner className="h-4 w-4" />}
        Apply Filters
      </button>
    </div>
  )
}
