type LoginScreenProps = {
  onSubmit: (payload: { email: string; password: string }) => void
  onGoToRegister: () => void
  loading?: boolean
  error?: string
}

export function LoginScreen({ onSubmit, onGoToRegister, loading, error }: LoginScreenProps) {
  return (
    <main className="auth-shell">
      <section className="auth-hero">
        <div className="auth-hero-copy">
          <p className="eyebrow">CareAssist</p>
          <h1>Medication tracking for reliable daily care.</h1>
          <p className="auth-lede">
            Sign in to manage you and your family&apos;s medication schedules, dosage details, and
            reminder logs in one system.
          </p>
        </div>

        <div className="auth-hero-card">
          <div className="hero-card-top">
            <p>CareAssist</p>
            <span className="status-badge sent">Live</span>
          </div>
          <strong>Monitor medication times, dosage details, and reminder status with clarity.</strong>
          <span className="muted-on-dark">
            Built for consistent medication management across self care, parents, children, and
            grandparents.
          </span>
          <div className="hero-card-footer">
            <span className="hero-card-note">Login</span>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="form-heading auth-form-heading">
          <div>
            <p className="auth-app-name">CareAssist</p>
            <h3>Welcome back</h3>
            <p>Sign in to manage you and your family in one place.</p>
          </div>
        </div>

        {error ? (
          <p className="auth-inline-error" role="alert">
            {error}
          </p>
        ) : null}

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
    </main>
  )
}
