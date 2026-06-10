import { Navigate, Route, Routes } from 'react-router-dom'
import { CareAssistDashboardProvider } from '../data/CareAssistDashboardProvider'
import { RequireAuth } from './RequireAuth'
import { LoginRoute } from '../routes/LoginRoute'
import { RegisterRoute } from '../routes/RegisterRoute'
import { DashboardRoute } from '../../routes/DashboardRoute'
import { DashboardOverviewScreen } from '../../screens/dashboard/DashboardOverviewScreen'
import { PeopleScreen } from '../../screens/people/PeopleScreen'
import { MedicationsScreen } from '../../screens/medications/MedicationsScreen'
import { RemindersScreen } from '../../screens/reminders/RemindersScreen'
import { useAuth } from '../auth/AuthProvider'

function RootRedirect() {
  const { isAuthenticated } = useAuth()
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/register" element={<RegisterRoute />} />

      <Route
        element={
          <RequireAuth>
            <CareAssistDashboardProvider>
              <DashboardRoute />
            </CareAssistDashboardProvider>
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<DashboardOverviewScreen />} />
        <Route path="/people" element={<PeopleScreen />} />
        <Route path="/medications" element={<MedicationsScreen />} />
        <Route path="/reminders" element={<RemindersScreen />} />
      </Route>

      <Route path="*" element={<RootRedirect />} />
    </Routes>
  )
}
