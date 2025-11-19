import { useState, useEffect } from 'react'
import { ArrowLeft, Clock, Layers, BookOpen, CheckCircle, Play, Award } from 'lucide-react'
import { lessonAPI, enrollmentAPI, quizAPI } from '../services/api'
import MarkdownRenderer from '../components/MarkdownRenderer'

function LessonDetail({ lessonId, onNavigate }) {
  const [lesson, setLesson] = useState(null)
  const [enrollment, setEnrollment] = useState(null)
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEnrolling, setIsEnrolling] = useState(false)

  useEffect(() => {
    loadLessonData()
  }, [lessonId])

  const loadLessonData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load lesson details
      const lessonData = await lessonAPI.getById(lessonId)
      setLesson(lessonData)

      // Try to load enrollment data (if user is authenticated)
      try {
        const enrollments = await enrollmentAPI.myEnrollments()
        const currentEnrollment = enrollments.find(e => e.lesson_id === lessonId)
        setEnrollment(currentEnrollment)
      } catch (err) {
        // User might not be authenticated, continue without enrollment data
        console.log('No enrollment data:', err)
      }

      // Load quizzes for this lesson
      try {
        const quizzesData = await quizAPI.getByLesson(lessonId)
        setQuizzes(quizzesData)
      } catch (err) {
        console.log('Error loading quizzes:', err)
        setQuizzes([])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    try {
      setIsEnrolling(true)
      const newEnrollment = await enrollmentAPI.enroll(lessonId)
      setEnrollment(newEnrollment)
    } catch (err) {
      alert('Failed to enroll: ' + err.message)
    } finally {
      setIsEnrolling(false)
    }
  }

  const handleUpdateProgress = async (newProgress) => {
    if (!enrollment) return

    try {
      const updated = await enrollmentAPI.updateProgress(enrollment.id, newProgress)
      setEnrollment(updated)
    } catch (err) {
      console.error('Failed to update progress:', err)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="surface-card p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-js-blue border-r-transparent"></div>
          <p className="mt-4 text-js-text-muted">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="surface-card p-8 text-center">
          <p className="text-red-500">Error: {error}</p>
          <button onClick={() => onNavigate('lessons')} className="glass-button mt-4">
            Back to Lessons
          </button>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="surface-card p-8 text-center">
          <p className="text-js-text-muted">Lesson not found</p>
          <button onClick={() => onNavigate('lessons')} className="glass-button mt-4">
            Back to Lessons
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Back Button */}
      <button
        onClick={() => onNavigate('lessons')}
        className="flex items-center gap-2 text-sm text-js-text-muted hover:text-js-text transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Lessons
      </button>

      {/* Lesson Header */}
      <div className="surface-card p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-js-blue">
                <Layers className="h-3 w-3" />
                {lesson.level}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-js-text-muted">
                <Clock className="h-4 w-4" />
                {lesson.duration_minutes} minutes
              </span>
            </div>
            <h1 className="text-3xl font-semibold text-js-text mb-3">{lesson.title}</h1>
            <p className="text-base text-js-text-muted leading-relaxed">{lesson.description}</p>
          </div>
        </div>

        {/* Tags */}
        {lesson.tags && lesson.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {lesson.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Progress Bar (if enrolled) */}
        {enrollment && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-js-text-muted">Your Progress</span>
              <span className="font-medium text-js-text">{Math.round(enrollment.progress_percent)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-gradient-to-r from-js-blue via-js-purple to-js-aqua transition-all"
                style={{ width: `${enrollment.progress_percent}%` }}
              />
            </div>
          </div>
        )}

        {/* Enrollment Button */}
        {!enrollment ? (
          <button
            onClick={handleEnroll}
            disabled={isEnrolling}
            className="glass-button w-full flex items-center justify-center gap-2"
          >
            <Play className="h-4 w-4" />
            {isEnrolling ? 'Enrolling...' : 'Enroll in This Lesson'}
          </button>
        ) : (
          <button
            onClick={() => handleUpdateProgress(Math.min(enrollment.progress_percent + 10, 100))}
            className="glass-button w-full flex items-center justify-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Continue Learning
          </button>
        )}
      </div>

      {/* Lesson Content */}
      <div className="surface-card p-8 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-js-blue" />
          <h2 className="text-xl font-semibold text-js-text">Lesson Content</h2>
        </div>
        <MarkdownRenderer content={lesson.content} />
      </div>

      {/* Quizzes Section */}
      {quizzes.length > 0 && (
        <div className="surface-card p-8 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-js-blue" />
            <h2 className="text-xl font-semibold text-js-text">Quizzes</h2>
          </div>
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="p-4 rounded-lg border border-gray-200/70 hover:border-js-blue/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-js-text mb-1">{quiz.title}</h3>
                    {quiz.description && (
                      <p className="text-sm text-js-text-muted mb-2">{quiz.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-js-text-soft">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {quiz.duration_minutes} min
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        {quiz.questions.length} questions
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onNavigate('quizzes')}
                    className="glass-button px-4 py-2 text-sm"
                  >
                    Take Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Progress Actions (if enrolled) */}
      {enrollment && (
        <div className="surface-card p-6">
          <h3 className="text-sm font-medium text-js-text mb-3">Quick Progress Update</h3>
          <div className="flex gap-2">
            <button
              onClick={() => handleUpdateProgress(25)}
              className="flex-1 glass-button text-xs py-2"
              disabled={enrollment.progress_percent >= 25}
            >
              25%
            </button>
            <button
              onClick={() => handleUpdateProgress(50)}
              className="flex-1 glass-button text-xs py-2"
              disabled={enrollment.progress_percent >= 50}
            >
              50%
            </button>
            <button
              onClick={() => handleUpdateProgress(75)}
              className="flex-1 glass-button text-xs py-2"
              disabled={enrollment.progress_percent >= 75}
            >
              75%
            </button>
            <button
              onClick={() => handleUpdateProgress(100)}
              className="flex-1 glass-button text-xs py-2"
              disabled={enrollment.progress_percent >= 100}
            >
              Complete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LessonDetail
