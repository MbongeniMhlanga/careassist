import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RegisterScreen } from '../screens/auth/RegisterScreen'
import { authApi } from '../services/api'

export function RegisterAuthPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | undefined>()
  const [errorTrigger, setErrorTrigger] = useState(0)

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
          setErrorTrigger((value) => value + 1)
          return
        }

        if (payload.password !== payload.confirmPassword) {
          setError('Passwords do not match')
          setErrorTrigger((value) => value + 1)
          return
        }

        setError(undefined)
        registerMutation.mutate(payload, {
          onError: (cause) => {
            setError(cause instanceof Error ? cause.message : 'Unable to create account')
            setErrorTrigger((value) => value + 1)
          },
        })
      }}
      onGoToLogin={() => navigate('/login')}
      loading={registerMutation.isPending}
      error={error}
      errorTrigger={errorTrigger}
    />
  )
}
