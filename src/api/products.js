import client from './client'

export const getProducts      = ()       => client.get('/product').then(r => r.data)
export const getProductById   = (id)     => client.get(`/product/${id}`).then(r => r.data)
export const getCategories    = ()       => client.get('/category').then(r => r.data)
export const filterProducts   = (params) => client.get('/product/filter', { params }).then(r => r.data)
