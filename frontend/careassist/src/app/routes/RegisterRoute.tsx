import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { RegisterScreen } from '../../screens/auth/RegisterScreen'
import { useAuth } from '../auth/AuthProvider'

export function RegisterRoute() {
  const navigate = useNavigate()
  const { register, isAuthenticated } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <RegisterScreen
      loading={loading}
      error={error}
      onGoToLogin={() => navigate('/login')}
      onSubmit={async (payload) => {
        if (payload.password !== payload.confirmPassword) {
          setError('Passwords do not match')
          return
        }

        setError('')
        setLoading(true)
        try {
          await register(payload)
          navigate('/dashboard', { replace: true })
        } catch (cause) {
          setError(cause instanceof Error ? cause.message : 'Unable to create account')
        } finally {
          setLoading(false)
        }
      }}
    />
  )
}
