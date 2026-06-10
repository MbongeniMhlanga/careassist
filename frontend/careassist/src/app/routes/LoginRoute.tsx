import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { LoginScreen } from '../../screens/auth/LoginScreen'
import { useAuth } from '../auth/AuthProvider'

export function LoginRoute() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <LoginScreen
      loading={loading}
      error={error}
      onGoToRegister={() => navigate('/register')}
      onSubmit={async (payload) => {
        setError('')
        setLoading(true)
        try {
          await login(payload)
          navigate('/dashboard', { replace: true })
        } catch (cause) {
          setError(cause instanceof Error ? cause.message : 'Unable to sign in')
        } finally {
          setLoading(false)
        }
      }}
    />
  )
}
