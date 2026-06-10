import { AuthErrorModal } from '../../components/AuthErrorModal'

type LoginScreenProps = {
  onSubmit: (payload: { email: string; password: string }) => void
  onGoToRegister: () => void
  loading?: boolean
  error?: string
  errorTrigger?: number
}

export function LoginScreen({ onSubmit, onGoToRegister, loading, error, errorTrigger }: LoginScreenProps) {
  return (
    <main className="auth-shell">
      <section className="auth-hero">
        <div className="auth-hero-copy">
          <p className="eyebrow">CareAssist</p>
          <h1>One calm place for medication reminders on every device.</h1>
          <p className="auth-lede">
            Sign in to keep families, schedules, and daily reminders in one place.
          </p>

         
        </div>

        <div className="auth-hero-card">
          <div className="hero-card-top">
            <p>Focus</p>
            <span className="status-badge sent">Live</span>
          </div>
          <strong>Medication care that feels polished, not crowded.</strong>
          <span className="muted-on-dark">
            Built for a comfortable reading width on large screens and a stacked layout on smaller
            ones.
          </span>
          <div className="hero-card-footer">
         
            <span className="hero-card-note">Login</span>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="form-heading auth-form-heading">
          <div>
            <p className="form-badge">Login</p>
            <h3>Welcome back</h3>
            <p>Sign in to manage medication reminders and family members.</p>
          </div>
          <button type="button" className="ghost-button" onClick={onGoToRegister}>
            Create account
          </button>
        </div>

        <form
          className="form-grid auth-form"
          onSubmit={(event) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)

            onSubmit({
              email: String(formData.get('email') ?? ''),
              password: String(formData.get('password') ?? ''),
            })
          }}
        >
          <label className="field">
            <span>Email</span>
            <input name="email" type="email" placeholder="you@example.com" required />
          </label>

          <label className="field">
            <span>Password</span>
            <input name="password" type="password" placeholder="Your password" required />
          </label>

          <button type="submit" className="primary-button auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <button type="button" className="ghost-button auth-switch" onClick={onGoToRegister}>
            New here? Create an account
          </button>
        </form>
      </section>

      <AuthErrorModal
        title="Login failed"
        message={error && error.trim() ? error : undefined}
        trigger={errorTrigger}
      />
    </main>
  )
}
