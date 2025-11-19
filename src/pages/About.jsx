import { GraduationCap, Bot, Lightbulb, BarChart3 } from 'lucide-react'

function About() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-10">
      <header className="space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-js-text-soft">About JS Academy</p>
        <h1 className="text-4xl font-semibold text-js-text">Purpose-built for modern JavaScript education.</h1>
        <p className="text-base text-js-text-muted">
          We craft premium learning experiences that feel like polished products—minimal, intentional, and deeply focused on outcomes.
        </p>
      </header>

      <section className="surface-card space-y-4 p-8">
        <h2 className="text-2xl font-semibold text-js-text">Our Mission</h2>
        <p className="text-sm leading-relaxed text-js-text-muted">
          JS Academy exists to remove friction from learning. No cluttered dashboards, no scattered tools—just a calm, AI-assisted learning environment where you can explore JavaScript with intention and clarity.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-js-text">What we offer</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: GraduationCap,
              title: 'Curriculum',
              description: 'A sequenced path from fundamentals to advanced async flows.'
            },
            {
              icon: Bot,
              title: 'AI Mentorship',
              description: 'Personalized recommendations and instant commentary on your work.'
            },
            {
              icon: Lightbulb,
              title: 'Practice Layer',
              description: 'Compiler, quizzes, and modules live within the same minimal interface.'
            },
            {
              icon: BarChart3,
              title: 'Progress Radar',
              description: 'Transparent tracking that highlights momentum, not vanity metrics.'
            }
          ].map(({ icon: Icon, title, description }) => (
            <div key={title} className="surface-card flex items-start gap-4 p-6">
              <div className="rounded-full bg-js-gradient-soft p-3 text-js-blue">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-js-text">{title}</h3>
                <p className="text-sm text-js-text-muted">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-card space-y-4 p-8">
        <h2 className="text-2xl font-semibold text-js-text">Why JS Academy</h2>
        <p className="text-sm leading-relaxed text-js-text-muted">
          We obsess over every detail—from typography to interaction—to ensure learning feels premium, calm, and current. The product is
          engineered for builders who value craft: clean UI, instant feedback, and tools that stay out of the way.
        </p>
      </section>
    </div>
  )
}

export default About

