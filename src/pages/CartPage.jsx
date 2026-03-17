import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatPrice } from '../utils/currency'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import CartItem from '../components/cart/CartItem'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'
import Spinner from '../components/common/Spinner'
import * as ordersApi from '../api/orders'
import { ShoppingCart } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CartPage() {
  const navigate = useNavigate()
  const { isLoggedIn, openAuthModal } = useAuth()
  const { cart, clearCart, loading } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)
  const [form, setForm] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pinCode: '',
    phoneNumber: '',
  })

  // Block non-logged-in users
  useEffect(() => {
    if (!isLoggedIn) {
      openAuthModal()
      navigate('/')
    }
  }, [isLoggedIn, openAuthModal, navigate])

  if (!isLoggedIn) return null

  const cartItems = cart.items || []
  const totalPrice = cart.totalPrice || 0

  async function handlePlaceOrder(e) {
    e.preventDefault()
    setOrderLoading(true)
    try {
      const data = await ordersApi.placeOrder(form)
      toast.success('Order placed successfully!')
      setShowCheckout(false)
      setForm({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pinCode: '',
        phoneNumber: '',
      })
      await clearCart()
      navigate('/orders')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setOrderLoading(false) }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : cartItems.length === 0 ? (
        <EmptyState
          icon={<ShoppingCart size={48} />}
          title="Your cart is empty"
          description="Start shopping to add items to your cart"
          action={
            <Button onClick={() => navigate('/products')} variant="primary">
              Continue Shopping
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
            </div>
            <Button onClick={() => navigate('/products')} variant="secondary" className="w-full mt-6">
              Continue Shopping
            </Button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-20 space-y-5">
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>

              <div className="space-y-2 py-4 border-y border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span className="text-indigo-600">{formatPrice(totalPrice)}</span>
              </div>

              {showCheckout ? (
                <form onSubmit={handlePlaceOrder} className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Address Line 1"
                    value={form.addressLine1}
                    onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Address Line 2"
                    value={form.addressLine2}
                    onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Pin Code"
                    value={form.pinCode}
                    onChange={(e) => setForm({ ...form, pinCode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={form.phoneNumber}
                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Button type="submit" className="w-full" size="lg" disabled={orderLoading}>
                    {orderLoading ? 'Processing...' : 'Confirm Order'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    disabled={orderLoading}
                    onClick={() => setShowCheckout(false)}
                  >
                    Back to Cart
                  </Button>
                </form>
              ) : (
                <>
                  <Button onClick={() => setShowCheckout(true)} className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                  <Button onClick={clearCart} variant="secondary" className="w-full">
                    Clear Cart
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
