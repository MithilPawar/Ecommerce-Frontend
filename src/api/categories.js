import client from './client'

export const getCategories = () => client.get('/category').then(r => r.data)

export const createCategory = (category) =>
  client.post('/category', {
    name: category.name,
    description: category.description || '',
  }).then(r => r.data)

export const updateCategory = (id, category) =>
  client.put(`/category/${id}`, {
    name: category.name,
    description: category.description || '',
  }).then(r => r.data)

export const deleteCategory = (id) => client.delete(`/category/${id}`).then(r => r.data)
