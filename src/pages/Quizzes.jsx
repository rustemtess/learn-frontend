import { useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle2, Target } from 'lucide-react'
import { quizAPI } from '../services/api'

function Quizzes() {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [activeQuiz, setActiveQuiz] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [quizScore, setQuizScore] = useState(0)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    loadQuizzes()
  }, [])

  const loadQuizzes = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await quizAPI.list()
      setQuizzes(data)
    } catch (err) {
      setError(err.message)
      console.error('Error loading quizzes:', err)
    } finally {
      setLoading(false)
    }
  }

  const startQuiz = async (quizId) => {
    try {
      const quizData = await quizAPI.getById(quizId)
      setActiveQuiz(quizData)
      setCurrentQuestion(0)
      setSelectedAnswer(null)
      setQuizScore(0)
      setShowResult(false)
    } catch (err) {
      alert('Failed to load quiz: ' + err.message)
    }
  }

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer)
  }

  const handleBackToOverview = () => {
    setActiveQuiz(null)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setQuizScore(0)
    setShowResult(false)
  }

  const submitAnswer = () => {
    const question = activeQuiz.questions[currentQuestion]
    const selectedChoice = question.choices[selectedAnswer]
    
    // Check if the selected choice matches the correct answer
    if (selectedChoice === question.correct_answer) {
      setQuizScore(prev => prev + 1)
    }
    
    if (currentQuestion < activeQuiz.questions.length - 1) {
      // Move to next question
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(null)
    } else {
      // Show results
      setShowResult(true)
    }
  }

  if (activeQuiz && !showResult) {
    const question = activeQuiz.questions[currentQuestion]
    return (
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleBackToOverview}
            className="inline-flex items-center gap-2 text-sm text-js-text-muted transition hover:text-js-text"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Quizzes
          </button>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-js-text-soft">
            Question {currentQuestion + 1} of {activeQuiz.questions.length}
          </p>
        </div>

        <div className="surface-card space-y-6 p-8">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-js-text-soft">{activeQuiz.title}</p>
            <h2 className="mt-2 text-2xl font-semibold text-js-text">{question.prompt}</h2>
          </div>

          <div className="flex flex-col gap-3">
            {question.choices.map((choice, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleAnswer(index)}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                  selectedAnswer === index
                    ? 'border-js-blue bg-white text-js-blue'
                    : 'border-gray-200 text-js-text hover:border-gray-300'
                }`}
              >
                {choice}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={submitAnswer}
            disabled={selectedAnswer === null}
            className="glass-button w-full justify-center disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-300"
          >
            {currentQuestion < activeQuiz.questions.length - 1 ? 'Next Question' : 'Submit Quiz'}
          </button>
        </div>
      </div>
    )
  }

  if (showResult) {
    const percentage = Math.round((quizScore / activeQuiz.questions.length) * 100)
    return (
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="surface-card flex flex-col items-center gap-6 p-10 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-js-text-soft">Result</p>
          <h2 className="text-3xl font-semibold text-js-text">Quiz Complete</h2>
          <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full bg-gradient-to-br from-js-blue/15 via-js-purple/15 to-js-aqua/15 text-js-blue">
            <span className="text-4xl font-semibold">{percentage}%</span>
            <span className="text-xs uppercase tracking-[0.3em] text-js-text-muted">score</span>
          </div>
          <p className="text-sm text-js-text-muted">
            {quizScore} / {activeQuiz.questions.length} correct answers
          </p>
          <button type="button" className="glass-button" onClick={handleBackToOverview}>
            Back to Quizzes
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="surface-card p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-js-blue border-r-transparent"></div>
          <p className="mt-4 text-js-text-muted">Loading quizzes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="surface-card p-8 text-center">
          <p className="text-red-500">Error: {error}</p>
          <button onClick={loadQuizzes} className="glass-button mt-4">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10">
      <header className="space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-js-text-soft">JS Academy Assessments</p>
        <h1 className="text-4xl font-semibold text-js-text">Interactive Quizzes</h1>
        <p className="text-base text-js-text-muted">Micro-challenges to validate every concept and reinforce long-term retention.</p>
      </header>

      {quizzes.length === 0 ? (
        <div className="surface-card p-8 text-center">
          <p className="text-js-text-muted">No quizzes available yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="surface-card flex flex-col gap-4 p-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-js-purple">
                  <Target className="h-3.5 w-3.5" />
                  Quiz
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-js-text">{quiz.title}</h3>
                {quiz.description && (
                  <p className="mt-2 text-sm text-js-text-muted">{quiz.description}</p>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-js-text-muted">
                <span>{quiz.questions?.length || 0} questions</span>
                <span>{quiz.duration_minutes} minutes</span>
              </div>
              <button type="button" className="glass-button w-full justify-center" onClick={() => startQuiz(quiz.id)}>
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Quizzes

