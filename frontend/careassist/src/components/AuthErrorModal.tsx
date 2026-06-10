type AuthErrorModalProps = {
  message?: string
  title?: string
}

export function AuthErrorModal({ message, title = 'Validation issue' }: AuthErrorModalProps) {
  if (!message) {
    return null
  }

  return (
    <div className="auth-alert" role="alert" aria-live="polite">
      <div className="auth-alert-header">
        <div>
          <p className="form-badge">Alert</p>
          <h4 id="auth-error-title">{title}</h4>
        </div>
      </div>

      <p className="auth-alert-message">{message}</p>
    </div>
  )
}
