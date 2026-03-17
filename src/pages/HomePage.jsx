import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../api/products'
import ProductCard from '../components/products/ProductCard'
import Spinner from '../components/common/Spinner'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await getProducts()
        setProducts((data || []).slice(0, 8)) // Show first 8
      } catch { /* fail silently */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Welcome to ShopZone</h1>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto">Discover amazing products at great prices. Browse freely or login to checkout.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/products" className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
              Shop Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Featured Products</h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            No products available yet.
          </div>
        )}

        {products.length > 0 && (
          <div className="text-center mt-12">
            <Link to="/products" className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2">
              View All Products
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
