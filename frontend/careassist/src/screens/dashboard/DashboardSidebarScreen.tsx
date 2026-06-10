import { NavLink } from 'react-router-dom'
import type { Medication, Person, Reminder, User } from '../../services/api'

type DashboardSidebarScreenProps = {
  users: User[]
  persons: Person[]
  medications: Medication[]
  reminders: Reminder[]
  selectedUser: User | null
  selectedPerson: Person | null
  selectedMedication: Medication | null
  currentUser: User | null
  onLogout: () => void
}

export function DashboardSidebarScreen({
  users,
  persons,
  medications,
  reminders,
  selectedUser,
  selectedPerson,
  selectedMedication,
  currentUser,
  onLogout,
}: DashboardSidebarScreenProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">C</div>
        <div>
          <p className="eyebrow">CareAssist</p>
          <h1>Medication tracking, made calmer.</h1>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Primary">
        <NavLink to="/dashboard" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          Overview
        </NavLink>
        <NavLink to="/people" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          People
        </NavLink>
        <NavLink to="/medications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          Medications
        </NavLink>
        <NavLink to="/reminders" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          Reminders
        </NavLink>
      </nav>

      <div className="stack">
        <StatCard label="Users" value={users.length} />
        <StatCard label="People" value={persons.length} />
        <StatCard label="Meds" value={medications.length} />
        <StatCard label="Today" value={reminders.length} />
      </div>

      <section className="panel sidebar-panel">
        <h2>Quick context</h2>
        <p className="muted">
          Signed in as <strong>{currentUser?.name ?? 'Guest'}</strong>
        </p>
        <p className="muted">
          Selected user: <strong>{selectedUser?.name ?? 'None'}</strong>
        </p>
        <p className="muted">
          Selected person: <strong>{selectedPerson?.name ?? 'None'}</strong>
        </p>
        <p className="muted">
          Selected medication: <strong>{selectedMedication?.name ?? 'None'}</strong>
        </p>
        <button type="button" className="ghost-button sidebar-logout" onClick={onLogout}>
          Logout
        </button>
      </section>
    </aside>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}
