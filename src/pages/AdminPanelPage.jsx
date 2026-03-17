import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Box, FolderTree, ShoppingBag, Users } from 'lucide-react'
import Spinner from '../components/common/Spinner'
import { getProducts } from '../api/products'
import { getCategories } from '../api/categories'
import { getAdminOrders, getUsers } from '../api/admin'

export default function AdminPanelPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ products: 0, users: 0, categories: 0, orders: 0 })

  useEffect(() => {
    async function loadStats() {
      setLoading(true)
      try {
        const [products, categories, users, orders] = await Promise.all([
          getProducts(),
          getCategories(),
          getUsers(),
          getAdminOrders(),
        ])
        setStats({
          products: (products || []).length,
          categories: (categories || []).length,
          users: (users || []).length,
          orders: (orders || []).length,
        })
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const statCards = [
    { label: 'Products', value: stats.products, icon: Box },
    { label: 'Users', value: stats.users, icon: Users },
    { label: 'Categories', value: stats.categories, icon: FolderTree },
    { label: 'Orders', value: stats.orders, icon: ShoppingBag },
  ]

  const cards = [
    {
      title: 'Product Management',
      description: 'View products and perform create, update, and delete actions.',
      to: '/admin/products',
      icon: Box,
      action: 'Open Product Manager',
    },
    {
      title: 'User Management',
      description: 'Manage user accounts and role permissions.',
      to: '/admin/users',
      icon: Users,
      action: 'Open User Manager',
    },
    {
      title: 'Category Management',
      description: 'Create, update, and delete product categories.',
      to: '/admin/categories',
      icon: FolderTree,
      action: 'Open Category Manager',
    },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Select a module to manage.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h2 className="text-base font-semibold text-slate-900 mb-3">Overview</h2>
        {loading ? (
          <div className="py-6 flex justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {statCards.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="border border-slate-200 rounded-lg px-3 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">{item.label}</p>
                    <Icon size={16} className="text-slate-500" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.to} className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="h-10 w-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <h2 className="mt-3 text-lg font-semibold text-slate-900">{card.title}</h2>
                <p className="mt-1 text-slate-600 text-sm">{card.description}</p>
                <Link
                  to={card.to}
                  className="mt-4 inline-flex items-center justify-center bg-slate-900 text-white text-sm font-semibold px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  {card.action}
                </Link>
              </div>
            )
          })}
      </div>
    </div>
  )
}
