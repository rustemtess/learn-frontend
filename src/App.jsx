import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Lessons from './pages/Lessons'
import LessonDetail from './pages/LessonDetail'
import Quizzes from './pages/Quizzes'
import Compiler from './pages/Compiler'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import { authAPI } from './services/api'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [lessonId, setLessonId] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(authAPI.isAuthenticated())

  const handleNavigate = (page, data = {}) => {
    if (page === 'lesson-detail' && data.lessonId) {
      setLessonId(data.lessonId)
      setCurrentPage(page)
    } else {
      setCurrentPage(page)
      setLessonId(null)
    }
  }

  const handleLogout = () => {
    authAPI.logout()
    setIsAuthenticated(false)
    setCurrentPage('home')
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />
      case 'lessons':
        return <Lessons onNavigate={handleNavigate} />
      case 'lesson-detail':
        return <LessonDetail lessonId={lessonId} onNavigate={handleNavigate} />
      case 'quizzes':
        return <Quizzes />
      case 'compiler':
        return <Compiler />
      case 'about':
        return <About />
      case 'contact':
        return <Contact />
      case 'profile':
        return <Profile onLogout={handleLogout} />
      case 'admin':
        return <Admin />
      case 'login':
        return (
          <Login
            onNavigate={handleNavigate}
            onAuthorize={() => {
              setIsAuthenticated(true)
              setCurrentPage('profile')
            }}
          />
        )
      case 'register':
        return (
          <Register
            onNavigate={handleNavigate}
            onAuthorize={() => {
              setIsAuthenticated(true)
              setCurrentPage('profile')
            }}
          />
        )
      default:
        return <Home />
    }
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Navigation 
        currentPage={currentPage} 
        setCurrentPage={handleNavigate} 
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8">{renderPage()}</main>
    </div>
  )
}

export default App
