import { Star, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/currency'
import Button from '../common/Button'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { isLoggedIn, openAuthModal } = useAuth()
  const { addToCart } = useCart()

  async function handleAddToCart() {
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      {/* Image */}
      <Link to={`/products/${product.id}`}>
        <div className="relative w-full h-40 bg-gray-100 overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <span>No image</span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 p-3 flex flex-col">
        <Link to={`/products/${product.id}`} className="mb-1">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Category */}
        {product.category && (
          <p className="text-xs text-gray-500 mb-2">{product.category.name}</p>
        )}

        {/* Desc */}
        <p className="text-xs text-gray-600 line-clamp-1 mb-auto">{product.description}</p>

        {/* Price & Stock */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-indigo-600">{formatPrice(product.price)}</span>
          <span className={`text-xs font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
          </span>
        </div>

        {/* Rating placeholder */}
        <div className="flex items-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className="text-yellow-400 fill-current" />
          ))}
          <span className="text-xs text-gray-500 ml-1">(0)</span>
        </div>

        {/* Button */}
        <Button
          onClick={handleAddToCart}
          className="w-full mt-3"
          size="sm"
          variant={product.quantity > 0 ? 'primary' : 'secondary'}
          disabled={product.quantity <= 0}
        >
          <ShoppingCart size={14} />
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
