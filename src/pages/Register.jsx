import { useState } from 'react'
import { userAPI, authAPI } from '../services/api'

function Register({ onNavigate, onAuthorize }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setLoading(true)
    setStatus('Creating your JS Academy profile…')
    setError('')

    try {
      // Create user account
      await userAPI.create({
        email: formData.email,
        full_name: formData.name,
        password: formData.password,
        role: 'student',
        bio: null
      })
      
      setStatus('Account created! Logging you in...')
      
      // Automatically log in
      await authAPI.login(formData.email, formData.password)
      
      setStatus('Welcome to JS Academy!')
      setTimeout(() => {
        onAuthorize?.()
      }, 500)
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
      setStatus('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-js-text-soft">Onboard</p>
        <h1 className="text-3xl font-semibold text-js-text">Create your JS Academy account</h1>
        <p className="text-sm text-js-text-muted">Set your learning goal and unlock the entire AI-assisted curriculum.</p>
      </div>

      <form onSubmit={handleSubmit} className="surface-card grid gap-4 p-8">
        {['name', 'email'].map(field => (
          <div key={field} className="space-y-2">
            <label htmlFor={`register-${field}`} className="text-xs font-semibold uppercase tracking-[0.3em] text-js-text-soft">
              {field}
            </label>
            <input
              id={`register-${field}`}
              name={field}
              type={field === 'email' ? 'email' : 'text'}
              required
              value={formData[field]}
              onChange={handleChange}
              placeholder={field === 'email' ? 'you@company.com' : 'Your name'}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-js-text outline-none transition focus:border-js-blue focus:ring-1 focus:ring-js-blue/30"
            />
          </div>
        ))}

        <div className="space-y-2">
          <label htmlFor="register-password" className="text-xs font-semibold uppercase tracking-[0.3em] text-js-text-soft">
            Password
          </label>
          <input
            id="register-password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a secure password"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-js-text outline-none transition focus:border-js-blue focus:ring-1 focus:ring-js-blue/30"
          />
        </div>

        {status && (
          <p className="text-xs text-js-blue">
            {status}
          </p>
        )}
        {error && (
          <p className="text-xs text-red-500">
            {error}
          </p>
        )}

        <button type="submit" className="glass-button justify-center" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="text-center text-xs text-js-text-muted">
          Already a member?{' '}
          <button
            type="button"
            className="text-js-blue underline-offset-4 hover:underline"
            onClick={() => onNavigate?.('login')}
          >
            Sign in instead
          </button>
        </div>
      </form>
    </div>
  )
}

export default Register

