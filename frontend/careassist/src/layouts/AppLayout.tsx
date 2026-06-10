import { NavLink, Outlet } from 'react-router-dom'
import { useCareAssistWorkspace } from '../context/CareAssistWorkspaceContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/register', label: 'Register' },
  { to: '/people', label: 'People' },
  { to: '/medications', label: 'Medications' },
  { to: '/reminders', label: 'Reminders' },
] as const

export function AppLayout() {
  const { users, persons, medications, reminders, selectedUser, selectedPerson } = useCareAssistWorkspace()

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
              <span>Users</span>
              <strong>{users.length}</strong>
            </div>
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
          <p className="eyebrow">Active selection</p>
          <h2>{selectedUser?.name ?? 'No user selected'}</h2>
          <p className="muted">
            {selectedPerson?.name ?? 'No person selected'} is currently in focus.
          </p>
        </section>
      </aside>

      <div className="workspace">
        <header className="workspace-topbar">
          <div>
            <p className="eyebrow">CareAssist workspace</p>
            <h2>Less clutter. More care. One screen for each task.</h2>
          </div>
          <div className="workspace-badge">
            <span className="status-badge sent">Backend live</span>
            <span className="muted">TanStack Query is syncing the data</span>
          </div>
        </header>

        <main className="workspace-body">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
