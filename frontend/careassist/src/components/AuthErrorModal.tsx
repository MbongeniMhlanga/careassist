import { useEffect, useState } from 'react'

type AuthErrorModalProps = {
  message?: string
  title?: string
  trigger?: number
}

export function AuthErrorModal({ message, title = 'Validation issue', trigger }: AuthErrorModalProps) {
  const [isOpen, setIsOpen] = useState(Boolean(message))

  useEffect(() => {
    setIsOpen(Boolean(message))
  }, [message, trigger])

  if (!message || !isOpen) {
    return null
  }

  return (
    <div className="auth-modal-backdrop" role="presentation" onClick={() => setIsOpen(false)}>
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-error-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="auth-modal-header">
          <div>
            <p className="form-badge">Alert</p>
            <h4 id="auth-error-title">{title}</h4>
          </div>
          <button type="button" className="ghost-button" onClick={() => setIsOpen(false)}>
            Close
          </button>
        </div>

        <p className="auth-modal-message">{message}</p>
      </div>
    </div>
  )
}
