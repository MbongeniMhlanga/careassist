import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useCareAssistWorkspace } from '../context/CareAssistWorkspaceContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/account', label: 'Account' },
  { to: '/people', label: 'People' },
  { to: '/medications', label: 'Medications' },
  { to: '/reminders', label: 'Reminders' },
] as const

export function AppLayout() {
  const navigate = useNavigate()
  const { persons, medications, reminders, selectedUser } = useCareAssistWorkspace()

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="brand brand--stacked">
          <div className="brand-mark">C</div>
          <div>
            <p className="eyebrow">CareAssist</p>
            <h1>Medication care, split into focused screens.</h1>
          </div>
        </div>

        <nav className="app-nav" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <section className="sidebar-panel">
          <p className="eyebrow">Workspace</p>
          <h2>Current snapshot</h2>
          <div className="sidebar-metrics">
            <div>
              <span>People</span>
              <strong>{persons.length}</strong>
            </div>
            <div>
              <span>Meds</span>
              <strong>{medications.length}</strong>
            </div>
            <div>
              <span>Today</span>
              <strong>{reminders.length}</strong>
            </div>
          </div>
        </section>

        <section className="sidebar-panel sidebar-panel--accent">
          <p className="eyebrow">Active User</p>
          <h2>{selectedUser?.name ?? 'No account selected'}</h2>
          <button
            type="button"
            className="primary-button secondary"
            onClick={() => navigate('/login')}
          >
            Logout
          </button>
        </section>
      </aside>

      <div className="workspace">
        <main className="workspace-body">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
