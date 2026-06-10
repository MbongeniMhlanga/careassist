import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { DashboardPage } from '../pages/DashboardPage'
import { MedicationsPage } from '../pages/MedicationsPage'
import { PeoplePage } from '../pages/PeoplePage'
import { RegisterPage } from '../pages/RegisterPage'
import { RemindersPage } from '../pages/RemindersPage'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="people" element={<PeoplePage />} />
          <Route path="medications" element={<MedicationsPage />} />
          <Route path="reminders" element={<RemindersPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
