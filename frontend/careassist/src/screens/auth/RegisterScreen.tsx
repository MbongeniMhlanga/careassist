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
          <h1>Set up care for the people you love.</h1>
          <p className="auth-lede">
            Create your account, then add you and your family members, their medication details,
            and reminder times.
          </p>
        </div>

        <div className="auth-hero-card">
          <div className="hero-card-top">
            <p>CareAssist</p>
            <span className="status-badge pending">Step 1</span>
          </div>
          <strong>Start a calm, family-focused setup for medication reminders and tracking.</strong>
          <span className="muted-on-dark">
            Begin with one account and grow into a simple care space for children, parents, and
            grandparents.
          </span>
          <div className="hero-card-footer">
            <span className="hero-card-note">Register</span>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="form-heading auth-form-heading">
          <div>
            <p className="auth-app-name">CareAssist</p>
            <h3>Create account</h3>
            <p>Start managing you and your family in one place.</p>
          </div>
          <button type="button" className="ghost-button" onClick={onGoToLogin}>
            Login
          </button>
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

          <button type="submit" className="primary-button auth-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </section>
    </main>
  )
}
