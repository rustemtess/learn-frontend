import { useState } from 'react'
import { Mail, MessageSquare, Users } from 'lucide-react'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate form submission
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10">
      <header className="space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-js-text-soft">Contact JS Academy</p>
        <h1 className="text-4xl font-semibold text-js-text">We’d love to hear from you.</h1>
        <p className="text-base text-js-text-muted">
          Whether you have questions about curriculum, partnerships, or onboarding teams, we respond within one business day.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr,1.2fr]">
        <div className="space-y-4">
          {[
            { icon: Mail, title: 'Email', description: 'support@jsacademy.com' },
            { icon: MessageSquare, title: 'Live Support', description: 'Dedicated channel 24/7 for members' },
            { icon: Users, title: 'Community', description: 'Join 8,000+ builders in the forum' }
          ].map(({ icon: Icon, title, description }) => (
            <div key={title} className="surface-card flex items-center gap-4 p-5">
              <div className="rounded-full bg-js-gradient-soft p-3 text-js-blue">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-js-text">{title}</h3>
                <p className="text-sm text-js-text-muted">{description}</p>
              </div>
            </div>
          ))}
        </div>

        <form className="surface-card space-y-4 p-8" onSubmit={handleSubmit}>
          {submitted && (
            <div className="rounded-xl border border-green-200/70 bg-green-50/70 px-4 py-3 text-sm text-green-700">
              ✓ Thank you! Your message has been sent.
            </div>
          )}
          {['name', 'email', 'subject'].map(field => (
            <div key={field} className="space-y-2">
              <label htmlFor={field} className="text-xs font-semibold uppercase tracking-[0.3em] text-js-text-soft">
                {field}
              </label>
              <input
                id={field}
                name={field}
                type={field === 'email' ? 'email' : 'text'}
                value={formData[field]}
                onChange={handleChange}
                required
                placeholder={
                  field === 'email' ? 'you@company.com' : field === 'subject' ? 'How can we help?' : 'Your name'
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-js-text outline-none transition focus:border-js-blue focus:ring-1 focus:ring-js-blue/30"
              />
            </div>
          ))}
          <div className="space-y-2">
            <label htmlFor="message" className="text-xs font-semibold uppercase tracking-[0.3em] text-js-text-soft">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Tell us about your goals or challenges..."
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-js-text outline-none transition focus:border-js-blue focus:ring-1 focus:ring-js-blue/30"
            />
          </div>
          <button type="submit" className="glass-button w-full justify-center">
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}

export default Contact

