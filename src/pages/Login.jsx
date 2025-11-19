import { useState } from 'react'
import { authAPI } from '../services/api'

function Login({ onNavigate, onAuthorize }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setStatus('Signing you in...')
    setError('')

    try {
      await authAPI.login(formData.email, formData.password)
      setStatus('Welcome back to JS Academy!')
      setTimeout(() => {
        onAuthorize?.()
      }, 500)
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
      setStatus('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      <div className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-js-text-soft">Access</p>
        <h1 className="text-3xl font-semibold text-js-text">Sign in to JS Academy</h1>
        <p className="text-sm text-js-text-muted">Use your email to continue. No passwords to remember—just secure access.</p>
      </div>

      <form onSubmit={handleSubmit} className="surface-card space-y-4 p-8">
        <div className="space-y-2">
          <label htmlFor="login-email" className="text-xs font-semibold uppercase tracking-[0.3em] text-js-text-soft">
            Email
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="you@company.com"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-js-text outline-none transition focus:border-js-blue focus:ring-1 focus:ring-js-blue/30"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="login-password" className="text-xs font-semibold uppercase tracking-[0.3em] text-js-text-soft">
            Password
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-js-text outline-none transition focus:border-js-blue focus:ring-1 focus:ring-js-blue/30"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-js-text-muted">
          <input
            type="checkbox"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-js-blue focus:ring-js-blue/30"
          />
          Keep me signed in
        </label>

        {status && <p className="text-xs text-js-blue">{status}</p>}
        {error && <p className="text-xs text-red-500">{error}</p>}

        <button type="submit" className="glass-button w-full justify-center" disabled={loading}>
          {loading ? 'Signing in...' : 'Continue'}
        </button>

        <div className="text-center text-xs text-js-text-muted">
          Need an account?{' '}
          <button
            type="button"
            className="text-js-blue underline-offset-4 hover:underline"
            onClick={() => onNavigate?.('register')}
          >
            Register here
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login

