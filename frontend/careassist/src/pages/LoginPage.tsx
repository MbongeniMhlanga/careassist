import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { LoginScreen } from '../screens/auth/LoginScreen'
import { authApi } from '../services/api'

export function LoginPage() {
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: () => {
      navigate('/dashboard')
    },
  })

  return (
    <LoginScreen
      onSubmit={(payload) => loginMutation.mutate(payload)}
      onGoToRegister={() => navigate('/register')}
      loading={loginMutation.isPending}
      error={loginMutation.error instanceof Error ? loginMutation.error.message : undefined}
    />
  )
}
