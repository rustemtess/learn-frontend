import { Sparkles, LogOut } from 'lucide-react'

function Navigation({ currentPage, setCurrentPage, isAuthenticated, onLogout }) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'lessons', label: 'Lessons' },
    { id: 'quizzes', label: 'Quizzes' },
    { id: 'compiler', label: 'Compiler' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ]

  // Determine if current page is active (including lesson-detail as part of lessons)
  const isActive = (itemId) => {
    if (itemId === 'lessons' && currentPage === 'lesson-detail') return true
    return currentPage === itemId
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-gray-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-js-text"
          onClick={() => setCurrentPage('home')}
        >
          <Sparkles className="h-5 w-5 text-js-blue" />
          <span>JS Academy</span>
        </button>

        <div className="flex items-center gap-3">
          <ul className="flex items-center gap-1 text-sm text-js-text-muted">
            {navItems.map(item => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setCurrentPage(item.id)}
                  className={`relative rounded-full px-3 py-1.5 font-medium transition hover:text-js-text ${
                    isActive(item.id) ? 'text-js-text' : ''
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-3 -bottom-1 h-[2px] origin-center rounded-full transition ${
                      isActive(item.id)
                        ? 'bg-gradient-to-r from-js-blue via-js-purple to-js-aqua'
                        : 'bg-transparent'
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 sm:flex">
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  className="glass-button border-gray-200 px-4 py-1.5 text-sm font-semibold"
                  onClick={() => setCurrentPage('admin')}
                >
                  Admin
                </button>
                <button
                  type="button"
                  className="glass-button border-gray-200 px-4 py-1.5 text-sm font-semibold"
                  onClick={() => setCurrentPage('profile')}
                >
                  Profile
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-js-text-muted hover:text-js-text transition-colors"
                  onClick={onLogout}
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button
                type="button"
                className="glass-button border-gray-200 px-4 py-1.5 text-sm font-semibold"
                onClick={() => setCurrentPage('login')}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation

