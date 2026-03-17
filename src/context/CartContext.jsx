import { createContext, useState, useCallback, useEffect } from 'react'
import * as cartApi from '../api/cart'
import { useAuth } from '../hooks/useAuth'

export const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth()
  const [cart,    setCart]    = useState({ items: [], totalPrice: 0 })
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) { setCart({ items: [], totalPrice: 0 }); return }
    setLoading(true)
    try {
      const data = await cartApi.getCart()
      setCart(data || { items: [], totalPrice: 0 })
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [isLoggedIn])

  // Re-sync with backend whenever auth state changes
  useEffect(() => { fetchCart() }, [fetchCart])

  const addToCart = useCallback(async (productId, quantity = 1) => {
    const data = await cartApi.addToCart(productId, quantity)
    setCart(data)
  }, [])

  const removeFromCart = useCallback(async (productId) => {
    const data = await cartApi.removeFromCart(productId)
    setCart(data)
  }, [])

  const clearCart = useCallback(async () => {
    await cartApi.clearCart()
    setCart({ items: [], totalPrice: 0 })
  }, [])

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, clearCart, fetchCart, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}
