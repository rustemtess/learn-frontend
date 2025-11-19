import { useState, useEffect } from 'react'
import { Clock, Layers, ArrowUpRight, Search } from 'lucide-react'
import { lessonAPI, enrollmentAPI } from '../services/api'

function Lessons({ onNavigate }) {
  const [lessons, setLessons] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState('')

  useEffect(() => {
    loadLessons()
  }, [searchTerm, levelFilter])

  const loadLessons = async () => {
    try {
      setLoading(true)
      
      // Load lessons with filters
      const filters = {}
      if (searchTerm) filters.search = searchTerm
      if (levelFilter) filters.level = levelFilter
      
      const lessonsData = await lessonAPI.list(filters)
      setLessons(lessonsData)

      // Try to load enrollments if user is authenticated
      try {
        const enrollmentsData = await enrollmentAPI.myEnrollments()
        setEnrollments(enrollmentsData)
      } catch (err) {
        // User not authenticated, continue without enrollment data
        setEnrollments([])
      }
    } catch (error) {
      console.error('Failed to load lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  const getEnrollmentForLesson = (lessonId) => {
    return enrollments.find(e => e.lesson_id === lessonId)
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <div className="surface-card p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-js-blue border-r-transparent"></div>
          <p className="mt-4 text-js-text-muted">Loading lessons...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <header className="mb-12 space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-js-text-soft">JS Academy Curriculum</p>
        <h1 className="text-4xl font-semibold text-js-text">JavaScript Lesson Tracks</h1>
        <p className="text-base text-js-text-muted">
          Progress through curated modules with transparent timings and momentum tracking for every skill level.
        </p>
      </header>

      {/* Filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-js-text-muted" />
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200/70 bg-white/50 backdrop-blur-sm text-js-text placeholder-js-text-muted focus:outline-none focus:border-js-blue/50 transition-colors"
          />
        </div>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200/70 bg-white/50 backdrop-blur-sm text-js-text focus:outline-none focus:border-js-blue/50 transition-colors"
        >
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Lessons Grid */}
      {lessons.length === 0 ? (
        <div className="surface-card p-8 text-center">
          <p className="text-js-text-muted">No lessons found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {lessons.map(lesson => {
            const enrollment = getEnrollmentForLesson(lesson.id)
            const progress = enrollment ? enrollment.progress_percent : 0

            return (
              <div 
                key={lesson.id} 
                className="surface-card flex flex-col gap-4 p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onNavigate('lesson-detail', { lessonId: lesson.id })}
              >
                <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.25em] text-js-text-soft">
                  <span className="inline-flex items-center gap-2 rounded-full border border-gray-200/70 px-3 py-1 text-[10px] text-js-blue">
                    <Layers className="h-3 w-3" />
                    {lesson.level}
                  </span>
                  <span className="flex items-center gap-1 text-js-text-muted">
                    <Clock className="h-3.5 w-3.5" />
                    {lesson.duration_minutes} min
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-js-text">{lesson.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-js-text-muted">{lesson.description}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-js-text-soft flex-shrink-0 ml-2" />
                </div>
                {enrollment && (
                  <div className="space-y-2">
                    <div className="h-[2px] w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-gradient-to-r from-js-blue via-js-purple to-js-aqua transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-js-text-muted">{Math.round(progress)}% complete</p>
                  </div>
                )}
                <button 
                  className="glass-button w-full text-center"
                  onClick={(e) => {
                    e.stopPropagation()
                    onNavigate('lesson-detail', { lessonId: lesson.id })
                  }}
                >
                  {enrollment && progress > 0 ? 'Continue Lesson' : 'Start Lesson'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Lessons

