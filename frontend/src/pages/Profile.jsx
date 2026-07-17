import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function Profile() {
  const { user, updateProfile } = useAuth()
  const { showToast } = useToast()

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    // client-side checks only — backend re-validates length regardless
    if (newPassword && newPassword.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }
    if (newPassword && newPassword !== confirmNewPassword) {
      setError('New password and confirmation do not match.')
      return
    }

    setSubmitting(true)
    try {
      await updateProfile(name, email, currentPassword, newPassword || undefined)
      showToast('Profile updated')
      // clear password fields after a successful save — name/email stay as-is,
      // they now reflect the saved state anyway
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
   } catch (err) {
        console.log('full error object:', err)
        console.log('response:', err.response)
        console.log('status:', err.response?.status)
        console.log('data:', err.response?.data)
        const message = err.response?.data?.message || 'Failed to update profile. Please try again.'
        setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-form">
        <h1>Profile</h1>
        {error && <p className="error">{error}</p>}

        <label>
          Name
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label>
          Current password
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </label>

        <p>Leave the fields below blank to keep your current password.</p>

        <label>
          New password
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <label>
          Confirm new password
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}

export default Profile