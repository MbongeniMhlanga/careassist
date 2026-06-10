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
        if (payload.password !== payload.confirmPassword) {
          setError('Passwords do not match')
          return
        }

        setError(undefined)
        registerMutation.mutate(payload)
      }}
      onGoToLogin={() => navigate('/login')}
      loading={registerMutation.isPending}
      error={error ?? (registerMutation.error instanceof Error ? registerMutation.error.message : undefined)}
    />
  )
}
