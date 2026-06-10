import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../app/auth/AuthProvider'
import { useCareAssistDashboard } from '../app/data/CareAssistDashboardProvider'
import { DashboardSidebarScreen } from '../screens/dashboard/DashboardSidebarScreen'
import '../App.css'

export function DashboardRoute() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const {
    users,
    persons,
    medications,
    reminders,
    selectedUser,
    selectedPerson,
    selectedMedication,
  } = useCareAssistDashboard()

  return (
    <div className="shell">
      <DashboardSidebarScreen
        users={users}
        persons={persons}
        medications={medications}
        reminders={reminders}
        selectedUser={selectedUser}
        selectedPerson={selectedPerson}
        selectedMedication={selectedMedication}
        currentUser={user}
        onLogout={() => {
          logout()
          navigate('/login', { replace: true })
        }}
      />

      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
