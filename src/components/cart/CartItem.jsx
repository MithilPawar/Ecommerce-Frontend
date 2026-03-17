import { X } from 'lucide-react'
import { formatPrice } from '../../utils/currency'
import Button from '../common/Button'
import { useCart } from '../../hooks/useCart'
import toast from 'react-hot-toast'

export default function CartItem({ item, onRemove }) {
  const { removeFromCart } = useCart()

  async function handleRemove() {
    try {
      await removeFromCart(item.productId)
      toast.success('Removed from cart')
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="flex gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
      {/* Placeholder for image */}
      <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0" />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{item.productName}</p>
        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
        <p className="text-lg font-bold text-indigo-600 mt-1">{formatPrice(item.price)}</p>
      </div>

      {/* Remove */}
      <Button
        onClick={handleRemove}
        variant="ghost"
        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        <X size={18} />
      </Button>
    </div>
  )
}
