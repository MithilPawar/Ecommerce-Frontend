import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatPrice } from '../utils/currency'
import { useAuth } from '../hooks/useAuth'
import * as ordersApi from '../api/orders'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import { Package } from 'lucide-react'

export default function OrdersPage() {
  const navigate = useNavigate()
  const { isLoggedIn, openAuthModal } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Block non-logged-in users
  useEffect(() => {
    if (!isLoggedIn) {
      openAuthModal()
      navigate('/')
    }
  }, [isLoggedIn, openAuthModal, navigate])

  // Fetch orders
  useEffect(() => {
    async function load() {
      if (!isLoggedIn) return
      setLoading(true)
      try {
        const data = await ordersApi.getMyOrders()
        setOrders(data || [])
      } catch { /* fail silently */ }
      finally { setLoading(false) }
    }
    load()
  }, [isLoggedIn])

  if (!isLoggedIn) return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Orders</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<Package size={48} />}
          title="No orders yet"
          description="Start shopping to place your first order"
        />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Order ID</p>
                    <p className="font-mono font-semibold text-gray-900">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(order.orderDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <p
                      className={`font-semibold ${
                        order.status === 'PENDING'
                          ? 'text-yellow-600'
                          : order.status === 'CONFIRMED'
                            ? 'text-blue-600'
                            : 'text-green-600'
                      }`}
                    >
                      {order.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="font-semibold text-indigo-600 text-lg">{formatPrice(order.totalPrice)}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="px-6 py-4 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">Items</p>
                <ul className="space-y-2 text-sm">
                  {order.items?.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-gray-600">
                      <span>{item.productName} × {item.quantity}</span>
                      <span>{formatPrice(item.price)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Delivery Address */}
              <div className="px-6 py-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Delivery Address</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {order.addressLine1}{order.addressLine2 ? `, ${order.addressLine2}` : ''}
                  <br />
                  {order.city}, {order.state} {order.pinCode}
                  <br />
                  Phone: {order.phoneNumber}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
