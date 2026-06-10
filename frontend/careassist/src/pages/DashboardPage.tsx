import { DashboardHeroScreen } from '../screens/dashboard/DashboardHeroScreen'
import { useCareAssistWorkspace } from '../context/CareAssistWorkspaceContext'

export function DashboardPage() {
  const { persons, medications, reminders, selectedUser, selectedPerson, selectedMedication } =
    useCareAssistWorkspace()

  const stats = [
    { label: 'People', value: persons.length },
    { label: 'Meds', value: medications.length },
    { label: 'Today', value: reminders.length },
  ]

  return (
    <div className="page">
      <DashboardHeroScreen />

      <section className="page-grid">
        <article className="panel page-panel">
          <div className="panel-header">
            <div>
              <h3>At a glance</h3>
              <p className="panel-kicker">The whole workspace in one calm snapshot.</p>
            </div>
          </div>
          <div className="dashboard-metrics">
            {stats.map((stat) => (
              <div key={stat.label} className="mini-stat">
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="panel page-panel">
          <div className="panel-header">
            <div>
              <h3>Active context</h3>
              <p className="panel-kicker">What you are currently focused on.</p>
            </div>
          </div>
          <div className="stack">
            <div className="context-row">
              <span>Account</span>
              <strong>{selectedUser?.name ?? 'No account selected'}</strong>
            </div>
            <div className="context-row">
              <span>Person</span>
              <strong>{selectedPerson?.name ?? 'No person selected'}</strong>
            </div>
            <div className="context-row">
              <span>Medication</span>
              <strong>{selectedMedication?.name ?? 'No medication selected'}</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="panel page-panel">
        <div className="panel-header">
          <div>
            <h3>Today&apos;s reminders</h3>
            <p className="panel-kicker">A lightweight preview of what is due now.</p>
          </div>
          <span>{reminders.length}</span>
        </div>

        {reminders.length === 0 ? (
          <p className="empty">No reminders yet. Add a medication schedule to start seeing activity.</p>
        ) : (
          <div className="reminder-list">
            {reminders.slice(0, 4).map((reminder) => (
              <article key={`${reminder.scheduleId}-${reminder.dueAt}`} className="reminder-card">
                <div className="reminder-top">
                  <div>
                    <strong>{reminder.medicationName}</strong>
                    <p>
                      {reminder.personName} - {reminder.dosageAmount} {reminder.dosageUnit}
                    </p>
                  </div>
                  <span className={`status-badge ${reminder.status.toLowerCase()}`}>{reminder.status}</span>
                </div>
                <p className="muted">
                  Due at{' '}
                  {new Date(reminder.dueAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
