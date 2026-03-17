import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-extrabold text-lg mb-2 tracking-tight">ShopZone</h3>
            <p className="text-sm leading-relaxed">Your one-stop shop for everything you need, delivered fast.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-widest">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/cart"     className="hover:text-white transition-colors">My Cart</Link></li>
              <li><Link to="/orders"   className="hover:text-white transition-colors">My Orders</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-widest">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="cursor-pointer hover:text-white transition-colors">Login</span></li>
              <li><span className="cursor-pointer hover:text-white transition-colors">Register</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-xs">
          © {new Date().getFullYear()} ShopZone. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
