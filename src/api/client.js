import axios from 'axios'

const client = axios.create({ baseURL: '/api' })

// Attach JWT to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Normalise error messages from the Spring backend
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const payload = error.response?.data
    let message = payload?.message || payload?.error || error.message || 'Something went wrong'
    if (typeof message !== 'string') message = JSON.stringify(message)
    return Promise.reject(new Error(message))
  }
)

export default client
