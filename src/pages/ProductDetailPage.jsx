import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ShoppingCart, ArrowLeft } from 'lucide-react'
import { getProductById } from '../api/products'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../utils/currency'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn, openAuthModal } = useAuth()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProduct() {
      setLoading(true)
      try {
        const data = await getProductById(id)
        setProduct(data)
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [id])

  async function handleAddToCart() {
    if (!product) return

    if (!isLoggedIn) {
      toast.error('Please login to add items to cart')
      openAuthModal()
      return
    }

    try {
      await addToCart(product.id, 1)
      toast.success('Added to cart!')
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft size={16} />
          Back
        </Button>
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
          <p className="text-gray-600 mt-2">This product may have been removed.</p>
          <Link to="/products" className="inline-block mt-4 text-indigo-600 font-semibold hover:text-indigo-700">
            Browse products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft size={16} />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white border border-gray-200 rounded-xl p-6 md:p-8">
        <div className="bg-gray-100 rounded-lg overflow-hidden min-h-[280px] flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500">No image available</span>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium text-indigo-600">{product.category?.name || 'Uncategorized'}</p>
          <h1 className="text-3xl font-extrabold text-gray-900">{product.name}</h1>
          <p className="text-gray-600 leading-relaxed">{product.description || 'No description available.'}</p>

          <div className="pt-2">
            <p className="text-3xl font-bold text-indigo-600">{formatPrice(product.price)}</p>
            <p className={`mt-1 text-sm font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
            </p>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleAddToCart}
              className="w-full sm:w-auto"
              disabled={product.quantity <= 0}
              variant={product.quantity > 0 ? 'primary' : 'secondary'}
            >
              <ShoppingCart size={16} />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}