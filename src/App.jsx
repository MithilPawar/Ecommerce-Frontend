import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE = '/api'

function App() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' })
  const [orderForm, setOrderForm] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pinCode: '',
    phoneNumber: ''
  })
  const [cart, setCart] = useState({ items: [], totalPrice: 0 })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const authHeaders = token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' }

  async function request(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, options)
    const text = await response.text()
    const payload = text ? JSON.parse(text) : null

    if (!response.ok) {
      const serverMessage = payload?.message || payload?.error || `Request failed: ${response.status}`
      throw new Error(typeof serverMessage === 'string' ? serverMessage : 'Request failed')
    }
    return payload
  }

  async function loadCatalog() {
    try {
      const [productData, categoryData] = await Promise.all([
        request('/product'),
        request('/category')
      ])
      setProducts(productData || [])
      setCategories(categoryData || [])
    } catch (err) {
      setMessage(err.message)
    }
  }

  async function loadCart() {
    if (!token) return
    try {
      const cartData = await request('/cart', {
        headers: authHeaders
      })
      setCart(cartData || { items: [], totalPrice: 0 })
    } catch (err) {
      setMessage(err.message)
    }
  }

  useEffect(() => {
    loadCatalog()
  }, [])

  useEffect(() => {
    if (token) {
      loadCart()
      return
    }
    setCart({ items: [], totalPrice: 0 })
  }, [token])

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const categoryOk = selectedCategory === 'all' || String(item.category?.id) === selectedCategory
      const nameOk = item.name.toLowerCase().includes(query.toLowerCase())
      return categoryOk && nameOk
    })
  }, [products, selectedCategory, query])

  async function handleAuthSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    const path = authMode === 'login' ? '/auth/login' : '/auth/register'
    const body =
      authMode === 'login'
        ? { email: authForm.email, password: authForm.password }
        : { name: authForm.name, email: authForm.email, password: authForm.password }

    try {
      const data = await request(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (data?.token) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
      }
      setMessage(data?.message || 'Authentication successful')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function addToCart(product) {
    if (!token) {
      setMessage('Login or register first to add items to cart.')
      return
    }
    try {
      await request('/cart/add', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ productId: product.id, productName: product.name, quantity: 1, price: product.price })
      })
      await loadCart()
      setMessage('Item added to cart')
    } catch (err) {
      setMessage(err.message)
    }
  }

  async function removeFromCart(productId) {
    try {
      await request(`/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: authHeaders
      })
      await loadCart()
    } catch (err) {
      setMessage(err.message)
    }
  }

  async function clearCart() {
    try {
      await request('/cart/clear', {
        method: 'DELETE',
        headers: authHeaders
      })
      await loadCart()
    } catch (err) {
      setMessage(err.message)
    }
  }

  async function placeOrder(event) {
    event.preventDefault()
    try {
      await request('/order/place', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(orderForm)
      })
      await loadCart()
      setMessage('Order placed successfully')
      setOrderForm({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pinCode: '',
        phoneNumber: ''
      })
    } catch (err) {
      setMessage(err.message)
    }
  }

  function logout() {
    localStorage.removeItem('token')
    setToken('')
    setMessage('Logged out')
  }

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Streetline Commerce</p>
          <h1>Shop the newest drops</h1>
          <p className="subtitle">Backend-connected storefront for products, cart, and orders.</p>
        </div>
        <div className="authBox">
          <div className="modeSwitch" role="tablist" aria-label="Authentication mode">
            <button className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>
              Login
            </button>
            <button className={authMode === 'register' ? 'active' : ''} onClick={() => setAuthMode('register')}>
              Register
            </button>
            {token ? <button onClick={logout}>Logout</button> : null}
          </div>

          <form onSubmit={handleAuthSubmit} className="authForm">
            {authMode === 'register' ? (
              <input
                value={authForm.name}
                onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })}
                placeholder="Name"
                required
              />
            ) : null}
            <input
              type="email"
              value={authForm.email}
              onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={authForm.password}
              onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
              placeholder="Password"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Create account'}
            </button>
          </form>
        </div>
      </header>

      <main className="layout">
        <section className="catalog">
          <div className="toolbar">
            <input
              placeholder="Search products"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={String(category.id)}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid">
            {filteredProducts.map((product) => (
              <article key={product.id} className="card">
                <img src={product.imageUrl} alt={product.name} onError={(event) => { event.currentTarget.style.display = 'none' }} />
                <h3>{product.name}</h3>
                <p>{product.description || 'No description available.'}</p>
                <div className="meta">
                  <strong>Rs {Number(product.price).toFixed(2)}</strong>
                  <span>Stock: {product.quantity}</span>
                </div>
                <button onClick={() => addToCart(product)}>Add to cart</button>
              </article>
            ))}
          </div>
        </section>

        <aside className="cart">
          <h2>Your Cart</h2>
          {!token ? <p className="hint">Authenticate first to use cart and order features.</p> : null}

          <ul>
            {cart.items.map((item) => (
              <li key={item.productId}>
                <div>
                  <p>{item.productName}</p>
                  <small>Qty: {item.quantity}</small>
                </div>
                <div>
                  <strong>Rs {Number(item.price).toFixed(2)}</strong>
                  <button onClick={() => removeFromCart(item.productId)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>

          <p className="total">Total: Rs {Number(cart.totalPrice || 0).toFixed(2)}</p>
          <button onClick={clearCart} disabled={!token || !cart.items.length}>Clear Cart</button>

          <form className="orderForm" onSubmit={placeOrder}>
            <h3>Place Order</h3>
            <input
              placeholder="Address line 1"
              value={orderForm.addressLine1}
              onChange={(event) => setOrderForm({ ...orderForm, addressLine1: event.target.value })}
              required
            />
            <input
              placeholder="Address line 2"
              value={orderForm.addressLine2}
              onChange={(event) => setOrderForm({ ...orderForm, addressLine2: event.target.value })}
            />
            <input
              placeholder="City"
              value={orderForm.city}
              onChange={(event) => setOrderForm({ ...orderForm, city: event.target.value })}
              required
            />
            <input
              placeholder="State"
              value={orderForm.state}
              onChange={(event) => setOrderForm({ ...orderForm, state: event.target.value })}
              required
            />
            <input
              placeholder="Pincode"
              value={orderForm.pinCode}
              onChange={(event) => setOrderForm({ ...orderForm, pinCode: event.target.value })}
              required
            />
            <input
              placeholder="Phone"
              value={orderForm.phoneNumber}
              onChange={(event) => setOrderForm({ ...orderForm, phoneNumber: event.target.value })}
              required
            />
            <button type="submit" disabled={!token || !cart.items.length}>Confirm Order</button>
          </form>
        </aside>
      </main>

      {message ? (
        <div className="toast" role="status" aria-live="polite">
          {message}
        </div>
      ) : null}
    </div>
  )
}

export default App
