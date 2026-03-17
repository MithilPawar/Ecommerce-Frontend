import client from './client'

export const placeOrder   = (data) => client.post('/order/place',     data).then(r => r.data)
export const getMyOrders  = ()     => client.get('/order/my-orders').then(r => r.data)
