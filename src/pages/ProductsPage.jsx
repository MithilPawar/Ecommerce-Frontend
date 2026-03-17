import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { getProducts, filterProducts } from '../api/products'
import ProductCard from '../components/products/ProductCard'
import ProductFilters from '../components/products/ProductFilters'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import { Package } from 'lucide-react'

export default function ProductsPage() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const query = searchParams.get('q')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        if (query) {
          const data = await filterProducts({ name: query })
          setProducts(data || [])
        } else {
          const data = await getProducts()
          setProducts(data || [])
        }
      } catch { /* fail silently */ }
      finally { setLoading(false) }
    }
    load()
  }, [query])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          {query ? `Search Results for "${query}"` : 'All Products'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <aside className="lg:col-span-1">
            <ProductFilters
              onFiltersChange={setProducts}
              onCategoryChange={() => {}}
            />
          </aside>

          {/* Products */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center py-20">
                <Spinner />
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Package size={48} />}
                title="No products found"
                description={query ? `Try different search terms` : 'No products available yet'}
                action={
                  query ? (
                    <Link to="/products" className="text-indigo-600 font-semibold hover:underline">
                      Browse all products
                    </Link>
                  ) : null
                }
              />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
