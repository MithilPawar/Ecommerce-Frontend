import client from './client'

export const getCart        = ()                       => client.get('/cart').then(r => r.data)
export const addToCart      = (productId, quantity=1)  => client.post('/cart/add', { productId, quantity }).then(r => r.data)
export const removeFromCart = (productId)              => client.delete(`/cart/remove/${productId}`).then(r => r.data)
export const clearCart      = ()                       => client.delete('/cart/clear').then(r => r.data)
