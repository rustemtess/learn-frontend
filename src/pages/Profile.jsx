import { useState, useEffect } from 'react'
import { userAPI, enrollmentAPI } from '../services/api'
import { LogOut } from 'lucide-react'

function Profile({ onLogout }) {
  const [user, setUser] = useState(null)
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    try {
      setLoading(true)
      const userData = await userAPI.me()
      setUser(userData)

      const enrollmentsData = await enrollmentAPI.myEnrollments()
      setEnrollments(enrollmentsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const calculateAverageProgress = () => {
    if (enrollments.length === 0) return 0
    const total = enrollments.reduce((sum, e) => sum + e.progress_percent, 0)
    return Math.round(total / enrollments.length)
  }

  const getStreak = () => {
    // Placeholder for streak calculation
    return enrollments.length > 0 ? `${enrollments.length} lessons` : 'Start learning'
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div className="surface-card p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-js-blue border-r-transparent"></div>
          <p className="mt-4 text-js-text-muted">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div className="surface-card p-8 text-center">
          <p className="text-red-500">Error: {error}</p>
          <button onClick={onLogout} className="glass-button mt-4">
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div className="surface-card p-8 text-center">
          <p className="text-js-text-muted">User not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <section className="surface-card flex flex-col gap-6 p-8">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-js-text-soft">Profile</p>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold text-js-text">{user.full_name}</h1>
              <p className="text-sm text-js-text-muted">
                {user.email} · {user.role.charAt(0).toUpperCase() + user.role.slice(1)} · Joined {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
              {user.bio && <p className="text-sm text-js-text-muted mt-2">{user.bio}</p>}
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-js-text-muted hover:text-js-text transition-colors"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Enrolled Lessons', value: enrollments.length.toString() },
            { label: 'Average Progress', value: `${calculateAverageProgress()}%` },
            { label: 'Activity', value: getStreak() },
          ].map(item => (
            <div key={item.label} className="rounded-xl border border-gray-200/80 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-js-text-soft">{item.label}</p>
              <p className="mt-2 text-sm font-medium text-js-text">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-js-text-soft">My Learning</p>
            <h2 className="text-2xl font-semibold text-js-text">Enrolled Lessons</h2>
          </div>
          <span className="text-xs text-js-text-muted">Last accessed</span>
        </div>

        {enrollments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-js-text-muted">You haven't enrolled in any lessons yet.</p>
            <p className="text-sm text-js-text-soft mt-2">Start exploring our curriculum to begin your learning journey!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map(enrollment => (
              <div key={enrollment.id} className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-js-text">Lesson #{enrollment.lesson_id}</p>
                    <p className="text-xs text-js-text-muted mt-1">
                      Last accessed: {new Date(enrollment.last_accessed).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-js-text">{Math.round(enrollment.progress_percent)}%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-js-blue via-js-purple to-js-aqua transition-all"
                    style={{ width: `${enrollment.progress_percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="surface-card grid gap-6 p-8 md:grid-cols-2">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-js-text-soft">Schedule</p>
          <h2 className="text-2xl font-semibold text-js-text">Weekly focus</h2>
          <div className="space-y-3 text-sm text-js-text-muted">
            <p>Monday · Async practice (compiler sessions)</p>
            <p>Wednesday · Objects & Patterns recap</p>
            <p>Saturday · Quiz sprint + reflections</p>
          </div>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-js-text-soft">
              Preferred study window
            </label>
            <input
              type="text"
              placeholder="Evenings, 7-9 PM"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-js-text outline-none transition focus:border-js-blue focus:ring-1 focus:ring-js-blue/30"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-js-text-soft">
              Accountability note
            </label>
            <textarea
              rows="4"
              placeholder="Remind me to review DOM manipulation concepts every Thursday."
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-js-text outline-none transition focus:border-js-blue focus:ring-1 focus:ring-js-blue/30"
            />
          </div>
          <button type="button" className="glass-button justify-center">
            Save Preferences
          </button>
        </form>
      </section>
    </div>
  )
}

export default Profile

