import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RegisterScreen } from '../screens/auth/RegisterScreen'
import { authApi } from '../services/api'

export function RegisterAuthPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | undefined>()

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      navigate('/dashboard')
    },
  })

  return (
    <RegisterScreen
      onSubmit={(payload) => {
        if (payload.password.length < 6) {
          setError('Password must be at least 6 characters long')
          return
        }

        if (payload.password !== payload.confirmPassword) {
          setError('Passwords do not match')
          return
        }

        setError(undefined)
        registerMutation.mutate(payload, {
          onError: (cause) => {
            setError(cause instanceof Error ? cause.message : 'Unable to create account')
          },
        })
      }}
      onGoToLogin={() => navigate('/login')}
      loading={registerMutation.isPending}
      error={error}
    />
  )
}
