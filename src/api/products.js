import client from './client'

export const getProducts      = ()       => client.get('/product').then(r => r.data)
export const getProductById   = (id)     => client.get(`/product/${id}`).then(r => r.data)
export const getCategories    = ()       => client.get('/category').then(r => r.data)
export const filterProducts   = (params) => client.get('/product/filter', { params }).then(r => r.data)

export const createProduct = (product, imageFile) => {
	const formData = new FormData()
	formData.append('name', product.name)
	formData.append('description', product.description || '')
	formData.append('price', String(product.price))
	formData.append('quantity', String(product.quantity))
	formData.append('categoryId', String(product.categoryId))
	if (imageFile) formData.append('image', imageFile)

	return client.post('/product', formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	}).then(r => r.data)
}

export const updateProduct = (id, product) => {
	const payload = {
		name: product.name,
		description: product.description || '',
		price: Number(product.price),
		quantity: Number(product.quantity),
		category: product.categoryId ? { id: Number(product.categoryId) } : null,
		imageUrl: product.imageUrl || null,
	}
	return client.put(`/product/${id}`, payload).then(r => r.data)
}

export const deleteProduct = (id) => client.delete(`/product/${id}`).then(r => r.data)
