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
    <main className="content" style={{ minHeight: '100vh', justifyContent: 'center' }}>
      <section className="form-card" style={{ maxWidth: 560, margin: '0 auto' }}>
        <div className="form-heading">
          <div>
            <h3>Create account</h3>
            <p>Register to start managing medication reminders for your family.</p>
          </div>
          <button type="button" className="primary-button" onClick={onGoToLogin}>
            Login
          </button>
        </div>

        <form
          className="form-grid"
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
            <input name="password" type="password" placeholder="Choose a password" required />
          </label>

          <label className="field">
            <span>Confirm password</span>
            <input name="confirmPassword" type="password" placeholder="Repeat password" required />
          </label>

          {error ? <p className="error-message">{error}</p> : null}

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </section>
    </main>
  )
}
