import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
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
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

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
          <div className="pw-field">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <button type="button" className="pw-toggle" onClick={() => setShowCurrent((v) => !v)} tabIndex={-1} aria-label={showCurrent ? 'Hide password' : 'Show password'}>
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>

        <p>Leave the fields below blank to keep your current password.</p>

        <label>
          New password
          <div className="pw-field">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="button" className="pw-toggle" onClick={() => setShowNew((v) => !v)} tabIndex={-1} aria-label={showNew ? 'Hide password' : 'Show password'}>
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>
        <label>
          Confirm new password
          <div className="pw-field">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <button type="button" className="pw-toggle" onClick={() => setShowConfirm((v) => !v)} tabIndex={-1} aria-label={showConfirm ? 'Hide password' : 'Show password'}>
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}

export default Profile