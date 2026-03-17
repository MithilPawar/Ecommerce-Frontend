import client from './client'

export const getAdminOrders = () => client.get('/admin/orders').then((r) => r.data)

export const getUsers = () => client.get('/admin/users').then((r) => r.data)

export const updateUserRole = (id, role) =>
  client.put(`/admin/users/${id}/role`, null, { params: { role } }).then((r) => r.data)

export const deleteUser = (id) => client.delete(`/admin/users/${id}`).then((r) => r.data)
