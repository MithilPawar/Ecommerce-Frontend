import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/layout/Layout'
import AuthModal from './components/auth/AuthModal'
import ProtectedRoute from './routes/ProtectedRoute'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'
import './App.css'

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>

      <AuthModal />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          success: { style: { background: '#10b981', color: '#fff' } },
          error:   { style: { background: '#ef4444', color: '#fff' } },
        }}
      />
    </Router>
  )
}
