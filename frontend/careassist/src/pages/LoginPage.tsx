import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginScreen } from '../screens/auth/LoginScreen'
import { authApi } from '../services/api'

export function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | undefined>()
  const [errorTrigger, setErrorTrigger] = useState(0)

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: () => {
      navigate('/dashboard')
    },
  })

  return (
    <LoginScreen
      onSubmit={(payload) => {
        setError(undefined)
        loginMutation.mutate(payload, {
          onError: (cause) => {
            setError(cause instanceof Error ? cause.message : 'Incorrect email or password')
            setErrorTrigger((value) => value + 1)
          },
        })
      }}
      onGoToRegister={() => navigate('/register')}
      loading={loginMutation.isPending}
      error={error}
      errorTrigger={errorTrigger}
    />
  )
}
