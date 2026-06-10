type RegisterScreenProps = {
  onSubmit: (payload: {
    name: string
    email: string
    password: string
    confirmPassword: string
  }) => void
  onGoToLogin: () => void
  loading?: boolean
  error?: string
}

export function RegisterScreen({
  onSubmit,
  onGoToLogin,
  loading,
  error,
}: RegisterScreenProps) {
  return (
    <main className="auth-shell auth-shell--reverse">
      <section className="auth-hero">
        <div className="auth-hero-copy">
          <p className="eyebrow">CareAssist</p>
          <h1>Create your account and set up the family care workspace.</h1>
          <p className="auth-lede">
            Register on a spacious, responsive screen that feels comfortable on phones, tablets,
            and desktops.
          </p>

          <div className="auth-pills">
            <span className="status-chip">Full-height</span>
            <span className="status-chip">Responsive form</span>
            <span className="status-chip">Clean spacing</span>
          </div>
        </div>

        <div className="auth-hero-card">
          <div className="hero-card-top">
            <p>Setup</p>
            <span className="status-badge pending">Step 1</span>
          </div>
          <strong>Start with the account holder, then add people and reminders.</strong>
          <span className="muted-on-dark">
            The layout expands to fit the screen instead of staying in a tiny centered box.
          </span>
          <div className="hero-card-footer">
            <span className="hero-pulse">
              <span className="hero-pulse-dot" />
              Responsive registration screen
            </span>
            <span className="hero-card-note">Register</span>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="form-heading auth-form-heading">
          <div>
            <p className="form-badge">Register</p>
            <h3>Create account</h3>
            <p>Start managing medication reminders for your family.</p>
          </div>
          <button type="button" className="ghost-button" onClick={onGoToLogin}>
            Login
          </button>
        </div>

        <form
          className="form-grid auth-form"
          onSubmit={(event) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)

            onSubmit({
              name: String(formData.get('name') ?? ''),
              email: String(formData.get('email') ?? ''),
              password: String(formData.get('password') ?? ''),
              confirmPassword: String(formData.get('confirmPassword') ?? ''),
            })
          }}
        >
          <label className="field">
            <span>Name</span>
            <input name="name" type="text" placeholder="Mbongeni" required />
          </label>

          <label className="field">
            <span>Email</span>
            <input name="email" type="email" placeholder="you@example.com" required />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              name="password"
              type="password"
              placeholder="Choose a password"
              required
              minLength={6}
            />
          </label>

          <label className="field">
            <span>Confirm password</span>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Repeat password"
              required
              minLength={6}
            />
          </label>

          {error ? <p className="error-message">{error}</p> : null}

          <button type="submit" className="primary-button auth-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </section>
    </main>
  )
}
