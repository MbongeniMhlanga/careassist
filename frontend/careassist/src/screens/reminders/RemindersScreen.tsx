import { useCareAssistDashboard } from '../../app/data/CareAssistDashboardProvider'
import type { Reminder } from '../../services/api'

const statusLabels: Record<Reminder['status'], string> = {
  PENDING: 'Pending',
  SENT: 'Sent',
  TAKEN: 'Taken',
  MISSED: 'Missed',
}

const statusTone: Record<Reminder['status'], string> = {
  PENDING: 'pending',
  SENT: 'sent',
  TAKEN: 'taken',
  MISSED: 'missed',
}

export function RemindersScreen() {
  const { reminders, remindersLoading, markReminderTaken } = useCareAssistDashboard()

  return (
    <section className="screen-stack">
      <header className="screen-header">
        <div>
          <p className="eyebrow">Reminders</p>
          <h2>Track today&apos;s medication reminders</h2>
          <p className="lede">Mark doses as taken and review which reminders are still pending.</p>
        </div>
      </header>

      <ReminderPanel reminders={reminders} loading={remindersLoading} onMarkTaken={markReminderTaken} />
    </section>
  )
}

function ReminderPanel({
  reminders,
  loading,
  onMarkTaken,
}: {
  reminders: Reminder[]
  loading: boolean
  onMarkTaken: (reminderId: number, note?: string) => void
}) {
  return (
    <section className="panel panel-wide">
      <div className="panel-header">
        <h3>Today&apos;s reminders</h3>
        <span>{reminders.length}</span>
      </div>
      {loading ? (
        <p className="empty">Loading reminders...</p>
      ) : reminders.length === 0 ? (
        <p className="empty">No reminders generated yet. Add a medication schedule first.</p>
      ) : (
        <div className="reminder-list">
          {reminders.map((reminder) => (
            <article key={`${reminder.scheduleId}-${reminder.dueAt}`} className="reminder-card">
              <div className="reminder-top">
                <div>
                  <strong>{reminder.medicationName}</strong>
                  <p>
                    {reminder.personName} - {reminder.dosageAmount} {reminder.dosageUnit}
                  </p>
                </div>
                <span className={`status-badge ${statusTone[reminder.status]}`}>
                  {statusLabels[reminder.status]}
                </span>
              </div>
              <p className="muted">
                Due at{' '}
                {new Date(reminder.dueAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              {reminder.instructions ? <p className="muted">{reminder.instructions}</p> : null}
              {reminder.status !== 'TAKEN' && reminder.id !== null ? (
                <button type="button" className="primary-button secondary" onClick={() => onMarkTaken(reminder.id, 'Taken from reminders screen')}>
                  Mark taken
                </button>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
