import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { CareAssistWorkspaceProvider } from '../context/CareAssistWorkspaceContext'
import { DashboardPage } from '../pages/DashboardPage'
import { LoginPage } from '../pages/LoginPage'
import { MedicationsPage } from '../pages/MedicationsPage'
import { PeoplePage } from '../pages/PeoplePage'
import { RegisterAuthPage } from '../pages/RegisterAuthPage'
import { RegisterPage } from '../pages/RegisterPage'
import { RemindersPage } from '../pages/RemindersPage'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterAuthPage />} />
        <Route
          element={
            <CareAssistWorkspaceProvider>
              <AppLayout />
            </CareAssistWorkspaceProvider>
          }
        >
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="account" element={<RegisterPage />} />
          <Route path="people" element={<PeoplePage />} />
          <Route path="medications" element={<MedicationsPage />} />
          <Route path="reminders" element={<RemindersPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
