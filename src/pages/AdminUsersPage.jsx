import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import { deleteUser, getUsers, updateUserRole } from '../api/admin'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  async function loadUsers() {
    setLoading(true)
    try {
      const data = await getUsers()
      setUsers(data || [])
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  async function handleRoleChange(userId, role) {
    setUpdatingId(userId)
    try {
      const updated = await updateUserRole(userId, role)
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)))
      toast.success('User role updated')
    } catch (err) {
      toast.error(err.message)
      await loadUsers()
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDelete(userId) {
    const confirmed = window.confirm('Delete this user?')
    if (!confirmed) return

    setUpdatingId(userId)
    try {
      await deleteUser(userId)
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      toast.success('User deleted')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
        <p className="text-slate-600 mt-1 text-sm">Manage users and their roles.</p>
      </div>

      <section className="bg-white border border-slate-200 rounded-xl p-5">
        <h2 className="text-base font-semibold text-slate-900 mb-4">All Users</h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : users.length === 0 ? (
          <p className="text-slate-500">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100">
                    <td className="py-3 pr-4 font-medium text-slate-800">{user.name || '-'}</td>
                    <td className="py-3 pr-4 text-slate-700">{user.email}</td>
                    <td className="py-3 pr-4">
                      <select
                        value={user.role}
                        disabled={updatingId === user.id}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="px-2 py-1.5 border border-slate-300 rounded text-sm"
                      >
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="py-3 pr-4">
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={updatingId === user.id}
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
