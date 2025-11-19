import { BookOpen, Terminal, CheckCircle2, Target } from 'lucide-react'

function Home() {
  const features = [
    {
      icon: BookOpen,
      title: 'Interactive Lessons',
      description: 'Structured JavaScript journeys with guided walkthroughs and live examples.'
    },
    {
      icon: Terminal,
      title: 'Built-in Compiler',
      description: 'Execute code instantly with our in-browser compiler optimized for JS tooling.'
    },
    {
      icon: CheckCircle2,
      title: 'Quizzes & Assignments',
      description: 'Micro-quizzes and async assignments to keep you accountable and confident.'
    },
    {
      icon: Target,
      title: 'Personalized Recommendations',
      description: 'Adaptive practice plans powered by AI to match your goals and schedule.'
    }
  ]

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-20">
      <section className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white/80 px-6 py-16 text-center backdrop-blur-xl sm:px-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-gray-200/80 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-js-text-muted">
            JS Academy
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-js-text sm:text-5xl lg:text-6xl">
            Learn JavaScript with an AI-first, premium tutoring experience.
          </h1>
          <p className="text-base leading-relaxed text-js-text-muted sm:text-lg">
            JS Academy combines interactive lessons, live coding, quizzes, and AI recommendations in one minimal workspace.
            Practice inside your browser with zero setup.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="glass-button bg-white text-js-blue">
              Start Learning
            </button>
            <button className="glass-button">
              Watch Demo
            </button>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(62,123,250,0.18),_transparent_55%)]" />
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-js-text-soft">Capabilities</p>
          <h2 className="text-3xl font-semibold text-js-text">Everything you need to master JavaScript.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="surface-card group flex flex-col gap-3 p-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-js-blue/10 via-js-purple/10 to-js-aqua/10 text-js-blue">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-js-text">{title}</h3>
              <p className="text-sm text-js-text-muted">{description}</p>
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-js-text-soft">
                JS Academy
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home

