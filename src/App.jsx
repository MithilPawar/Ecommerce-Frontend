import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'
import AuthModal from './components/auth/AuthModal'
import ProtectedRoute from './routes/ProtectedRoute'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'
import AdminPanelPage from './pages/AdminPanelPage'
import AdminProductsPage from './pages/AdminProductsPage'
import AdminCategoriesPage from './pages/AdminCategoriesPage'
import AdminUsersPage from './pages/AdminUsersPage'
import './App.css'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/products"
          element={
            <Layout>
              <ProductsPage />
            </Layout>
          }
        />
        <Route
          path="/products/:id"
          element={
            <Layout>
              <ProductDetailPage />
            </Layout>
          }
        />
        <Route
          path="/cart"
          element={
            <Layout>
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/orders"
          element={
            <Layout>
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout>
                <AdminPanelPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout>
                <AdminProductsPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout>
                <AdminUsersPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout>
                <AdminCategoriesPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>

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
