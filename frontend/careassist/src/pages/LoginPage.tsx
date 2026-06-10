import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginScreen } from '../screens/auth/LoginScreen'
import { authApi } from '../services/api'

function resolveLoginErrorMessage(cause: unknown) {
  const fallback = 'Incorrect email or password. Please check your details and try again.'

  if (!(cause instanceof Error)) {
    return fallback
  }

  const message = cause.message.trim()

  if (!message) {
    return fallback
  }

  if (/invalid email or password/i.test(message) || /incorrect email or password/i.test(message)) {
    return fallback
  }

  return message
}

export function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | undefined>()

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: () => {
      navigate('/dashboard')
    },
  })

  return (
    <LoginScreen
      onSubmit={(payload) => {
        const email = payload.email.trim()
        const password = payload.password.trim()

        if (!email) {
          setError('Please enter your email address.')
          return
        }

        if (!password) {
          setError('Please enter your password.')
          return
        }

        setError(undefined)
        loginMutation.mutate(payload, {
          onError: (cause) => {
            setError(resolveLoginErrorMessage(cause))
          },
        })
      }}
      onGoToRegister={() => navigate('/register')}
      loading={loginMutation.isPending}
      error={error}
    />
  )
}
