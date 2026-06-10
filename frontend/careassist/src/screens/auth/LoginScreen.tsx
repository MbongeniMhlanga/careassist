type LoginScreenProps = {
  onSubmit: (payload: { email: string; password: string }) => void
  onGoToRegister: () => void
  loading?: boolean
  error?: string
}

export function LoginScreen({ onSubmit, onGoToRegister, loading, error }: LoginScreenProps) {
  return (
    <main className="content" style={{ minHeight: '100vh', justifyContent: 'center' }}>
      <section className="form-card" style={{ maxWidth: 560, margin: '0 auto' }}>
        <div className="form-heading">
          <div>
            <h3>Login</h3>
            <p>Sign in to manage medication reminders and family members.</p>
          </div>
          <button
            type="button"
            className="primary-button"
            onClick={onGoToRegister}
          >
            Register
          </button>
        </div>

        <form
          className="form-grid"
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

          {error ? <p className="error-message">{error}</p> : null}

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  )
}
