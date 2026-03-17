import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'

export default function Navbar() {
  const { isLoggedIn, isAdmin, user, logout, openAuthModal } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const displayName = user?.name || user?.email?.split('@')[0] || 'Profile'
  

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
      setMobileOpen(false)
    }
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 text-xl font-extrabold text-indigo-600 tracking-tight">
            ShopZone
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden sm:flex">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
              />
            </div>
          </form>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <Link to="/products" className="hover:text-indigo-600 transition-colors">Products</Link>
            {isAdmin && <Link to="/admin/products" className="hover:text-indigo-600 transition-colors">Admin Products</Link>}
            {isAdmin && <Link to="/admin/categories" className="hover:text-indigo-600 transition-colors">Admin Categories</Link>}
          </nav>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 text-xs bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold leading-none">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isLoggedIn ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link to="/orders" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                  <User size={15} />
                  <span>{displayName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="hidden sm:inline-flex bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Login
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 sm:hidden"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-gray-100 py-3 space-y-2">
            <form onSubmit={handleSearch} className="relative mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
              />
            </form>
            <Link to="/" onClick={() => setMobileOpen(false)} className="block px-2 py-1.5 text-sm text-gray-700 hover:text-indigo-600">Home</Link>
            <Link to="/products" onClick={() => setMobileOpen(false)} className="block px-2 py-1.5 text-sm text-gray-700 hover:text-indigo-600">Products</Link>
            {isAdmin && <Link to="/admin/products" onClick={() => setMobileOpen(false)} className="block px-2 py-1.5 text-sm text-gray-700 hover:text-indigo-600">Admin Products</Link>}
            {isAdmin && <Link to="/admin/categories" onClick={() => setMobileOpen(false)} className="block px-2 py-1.5 text-sm text-gray-700 hover:text-indigo-600">Admin Categories</Link>}
            {isLoggedIn ? (
              <>
                <Link to="/orders" onClick={() => setMobileOpen(false)} className="block px-2 py-1.5 text-sm text-gray-700 hover:text-indigo-600">My Orders</Link>
                <button onClick={handleLogout} className="block px-2 py-1.5 text-sm text-red-500">Logout</button>
              </>
            ) : (
              <button onClick={() => { openAuthModal(); setMobileOpen(false) }} className="block w-full text-left px-2 py-1.5 text-sm font-semibold text-indigo-600">
                Login / Register
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
