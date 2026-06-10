import { DashboardHeroScreen } from './DashboardHeroScreen'
import { useCareAssistDashboard } from '../../app/data/CareAssistDashboardProvider'

export function DashboardOverviewScreen() {
  const { users, persons, medications, reminders, selectedUser, selectedPerson, selectedMedication } =
    useCareAssistDashboard()

  const takenCount = reminders.filter((reminder) => reminder.status === 'TAKEN').length
  const missedCount = reminders.filter((reminder) => reminder.status === 'MISSED').length

  return (
    <section className="screen-stack">
      <DashboardHeroScreen />

      <section className="grid overview-grid">
        <article className="panel stat-summary">
          <h3>Today</h3>
          <p className="muted">Track dose activity from one place.</p>
          <div className="summary-values">
            <span><strong>{reminders.length}</strong> reminders</span>
            <span><strong>{takenCount}</strong> taken</span>
            <span><strong>{missedCount}</strong> missed</span>
          </div>
        </article>

        <article className="panel stat-summary">
          <h3>Current selection</h3>
          <p className="muted">The dashboard remembers what you are working on.</p>
          <div className="summary-values">
            <span><strong>{selectedUser?.name ?? 'None'}</strong> user</span>
            <span><strong>{selectedPerson?.name ?? 'None'}</strong> person</span>
            <span><strong>{selectedMedication?.name ?? 'None'}</strong> medication</span>
          </div>
        </article>

        <article className="panel stat-summary">
          <h3>Workspace</h3>
          <p className="muted">People, medications, and reminders are split into their own screens.</p>
          <div className="summary-values">
            <span><strong>{users.length}</strong> users</span>
            <span><strong>{persons.length}</strong> people</span>
            <span><strong>{medications.length}</strong> medications</span>
          </div>
        </article>
      </section>
    </section>
  )
}
