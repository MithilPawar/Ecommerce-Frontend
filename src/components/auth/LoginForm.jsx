import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Button from '../common/Button'
import toast from 'react-hot-toast'

export default function LoginForm({ onSuccess, switchToRegister }) {
  const { login } = useAuth()
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form)
      toast.success('Welcome back!')
      onSuccess?.()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="••••••"
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign in'}
      </Button>
      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <button type="button" onClick={switchToRegister} className="text-indigo-600 font-semibold hover:underline">
          Register
        </button>
      </p>
    </form>
  )
}
