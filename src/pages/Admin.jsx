import { useState, useEffect } from 'react'
import { Users, BookOpen, Award, TrendingUp, Eye, CheckCircle } from 'lucide-react'
import { adminAPI, userAPI } from '../services/api'

function Admin() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [lessonsStats, setLessonsStats] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [userProgress, setUserProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [activeTab, setActiveTab] = useState('overview') // overview, users, lessons

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if user is admin
      const user = await userAPI.me()
      setCurrentUser(user)
      
      if (user.role !== 'admin') {
        setError('Access denied. Admin role required.')
        setLoading(false)
        return
      }

      // Load stats
      const statsData = await adminAPI.getStats()
      setStats(statsData)

      // Load users
      const usersData = await adminAPI.listUsers()
      setUsers(usersData)

      // Load lessons stats
      const lessonsData = await adminAPI.getLessonsStats()
      setLessonsStats(lessonsData)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleViewUserProgress = async (userId) => {
    try {
      const progress = await adminAPI.getUserProgress(userId)
      setUserProgress(progress)
      setSelectedUser(userId)
    } catch (err) {
      alert('Failed to load user progress: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <div className="surface-card p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-js-blue border-r-transparent"></div>
          <p className="mt-4 text-js-text-muted">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <div className="surface-card p-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <p className="text-sm text-js-text-muted">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-js-text">Admin Dashboard</h1>
        <p className="text-js-text-muted">
          Manage users, lessons, and view platform statistics
        </p>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'text-js-blue border-b-2 border-js-blue'
              : 'text-js-text-muted hover:text-js-text'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'users'
              ? 'text-js-blue border-b-2 border-js-blue'
              : 'text-js-text-muted hover:text-js-text'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('lessons')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'lessons'
              ? 'text-js-blue border-b-2 border-js-blue'
              : 'text-js-text-muted hover:text-js-text'
          }`}
        >
          Lessons
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="surface-card p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="h-8 w-8 text-js-blue" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-js-text">{stats.total_users}</p>
                <p className="text-sm text-js-text-muted">Total Users</p>
              </div>
            </div>

            <div className="surface-card p-6">
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="h-8 w-8 text-js-purple" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-js-text">{stats.total_lessons}</p>
                <p className="text-sm text-js-text-muted">Total Lessons</p>
              </div>
            </div>

            <div className="surface-card p-6">
              <div className="flex items-center justify-between mb-4">
                <Award className="h-8 w-8 text-js-aqua" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-js-text">{stats.total_quizzes}</p>
                <p className="text-sm text-js-text-muted">Total Quizzes</p>
              </div>
            </div>

            <div className="surface-card p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-js-text">{stats.total_enrollments}</p>
                <p className="text-sm text-js-text-muted">Total Enrollments</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="surface-card p-6">
            <h2 className="text-xl font-semibold text-js-text mb-4">Platform Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-js-text-muted">Average enrollments per user</span>
                <span className="font-semibold text-js-text">
                  {stats.total_users > 0 ? (stats.total_enrollments / stats.total_users).toFixed(1) : 0}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-js-text-muted">Quizzes per lesson</span>
                <span className="font-semibold text-js-text">
                  {stats.total_lessons > 0 ? (stats.total_quizzes / stats.total_lessons).toFixed(1) : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="surface-card p-6">
            <h2 className="text-xl font-semibold text-js-text mb-4">All Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-js-text-muted">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-js-text-muted">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-js-text-muted">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-js-text-muted">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-js-text-muted">Enrollments</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-js-text-muted">Joined</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-js-text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-js-text">{user.id}</td>
                      <td className="py-3 px-4 text-sm text-js-text">{user.full_name}</td>
                      <td className="py-3 px-4 text-sm text-js-text-muted">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          user.role === 'admin' ? 'bg-red-100 text-red-700' :
                          user.role === 'mentor' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-js-text">{user.enrollments_count}</td>
                      <td className="py-3 px-4 text-sm text-js-text-muted">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleViewUserProgress(user.id)}
                          className="text-xs text-js-blue hover:underline flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          View Progress
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Progress Modal */}
          {userProgress && (
            <div className="surface-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-js-text">
                  User Progress: {userProgress.user.full_name}
                </h2>
                <button
                  onClick={() => setUserProgress(null)}
                  className="text-sm text-js-text-muted hover:text-js-text"
                >
                  Close
                </button>
              </div>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-js-text-muted">Email:</span>
                    <span className="ml-2 text-js-text">{userProgress.user.email}</span>
                  </div>
                  <div>
                    <span className="text-js-text-muted">Role:</span>
                    <span className="ml-2 text-js-text">{userProgress.user.role}</span>
                  </div>
                  <div>
                    <span className="text-js-text-muted">Total Enrollments:</span>
                    <span className="ml-2 text-js-text">{userProgress.total_enrollments}</span>
                  </div>
                  <div>
                    <span className="text-js-text-muted">Average Progress:</span>
                    <span className="ml-2 text-js-text">{userProgress.average_progress.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {userProgress.enrollments.map(enrollment => (
                  <div key={enrollment.enrollment_id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-js-text">{enrollment.lesson_title}</h3>
                      <span className="text-sm font-medium text-js-blue">
                        {enrollment.progress_percent.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 mb-2">
                      <div
                        className="h-full bg-gradient-to-r from-js-blue via-js-purple to-js-aqua"
                        style={{ width: `${enrollment.progress_percent}%` }}
                      />
                    </div>
                    <p className="text-xs text-js-text-muted">
                      Last accessed: {new Date(enrollment.last_accessed).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lessons Tab */}
      {activeTab === 'lessons' && (
        <div className="surface-card p-6">
          <h2 className="text-xl font-semibold text-js-text mb-4">Lessons Statistics</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-js-text-muted">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-js-text-muted">Title</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-js-text-muted">Level</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-js-text-muted">Duration</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-js-text-muted">Enrollments</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-js-text-muted">Avg Progress</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-js-text-muted">Quizzes</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-js-text-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {lessonsStats.map(lesson => (
                  <tr key={lesson.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-js-text">{lesson.id}</td>
                    <td className="py-3 px-4 text-sm text-js-text font-medium">{lesson.title}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        lesson.level === 'beginner' ? 'bg-green-100 text-green-700' :
                        lesson.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {lesson.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-js-text-muted">{lesson.duration_minutes} min</td>
                    <td className="py-3 px-4 text-sm text-js-text">{lesson.enrollments_count}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-js-blue"
                            style={{ width: `${lesson.average_progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-js-text-muted">{lesson.average_progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-js-text">{lesson.quizzes_count}</td>
                    <td className="py-3 px-4">
                      {lesson.is_published ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <span className="text-xs text-gray-500">Draft</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
