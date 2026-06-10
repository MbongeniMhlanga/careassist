import { useCareAssistWorkspace } from '../context/CareAssistWorkspaceContext'

const statusLabels = {
  PENDING: 'Pending',
  SENT: 'Sent',
  TAKEN: 'Taken',
  MISSED: 'Missed',
} as const

const statusTone = {
  PENDING: 'pending',
  SENT: 'sent',
  TAKEN: 'taken',
  MISSED: 'missed',
} as const

export function RemindersPage() {
  const { reminders, remindersLoading, markReminderTaken } = useCareAssistWorkspace()

  const statusCounts: Record<'PENDING' | 'SENT' | 'TAKEN' | 'MISSED', number> = reminders.reduce(
    (counts, reminder) => {
      counts[reminder.status] += 1
      return counts
    },
    {
      PENDING: 0,
      SENT: 0,
      TAKEN: 0,
      MISSED: 0,
    },
  )

  return (
    <div className="page">
      <section className="section-block">
        <div className="section-intro">
          <div>
            <p className="eyebrow">Reminders</p>
            <h3>Track what needs to be taken now and what was already handled.</h3>
            <p className="section-copy">
              This screen keeps the reminder queue separate so it reads like an operational log,
              not a crowded dashboard widget.
            </p>
          </div>
          <div className="status-strip status-strip--compact">
            <span className="status-chip">Pending {statusCounts.PENDING}</span>
            <span className="status-chip">Sent {statusCounts.SENT}</span>
            <span className="status-chip">Taken {statusCounts.TAKEN}</span>
            <span className="status-chip">Missed {statusCounts.MISSED}</span>
          </div>
        </div>

        <article className="panel page-panel page-panel--wide">
          <div className="panel-header">
            <div>
              <h3>Today&apos;s reminders</h3>
              <p className="panel-kicker">Live entries coming from the scheduler.</p>
            </div>
            <span>{reminders.length}</span>
          </div>

          {remindersLoading ? (
            <p className="empty">Loading reminders...</p>
          ) : reminders.length === 0 ? (
            <p className="empty">No reminders yet. Add schedules from the medications screen.</p>
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
                    <button
                      type="button"
                      className="primary-button secondary"
                      onClick={() => markReminderTaken(reminder)}
                    >
                      Mark taken
                    </button>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </article>
      </section>
    </div>
  )
}
