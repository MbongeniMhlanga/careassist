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

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function RemindersPage() {
  const {
    selectedUser,
    selectedPerson,
    selectedPersonId,
    selectedUserPeople,
    reminders,
    remindersLoading,
    setSelectedPersonId,
    markReminderTaken,
  } = useCareAssistWorkspace()

  const visibleReminders = reminders.filter((reminder) =>
    selectedUserPeople.some((person) => person.id === reminder.personId),
  )

  const remindersByPerson = selectedUserPeople
    .map((person) => {
      const personReminders = visibleReminders
        .filter((reminder) => reminder.personId === person.id)
        .slice()
        .sort((left, right) => new Date(left.dueAt).getTime() - new Date(right.dueAt).getTime())

      return {
        person,
        reminders: personReminders,
        nextReminder: personReminders[0] ?? null,
      }
    })
    .filter(({ reminders: personReminders }) => personReminders.length > 0)

  const selectedPersonReminders = selectedPerson
    ? visibleReminders
        .filter((reminder) => reminder.personId === selectedPerson.id)
        .slice()
        .sort((left, right) => new Date(left.dueAt).getTime() - new Date(right.dueAt).getTime())
    : []

  const statusCounts: Record<'PENDING' | 'SENT' | 'TAKEN' | 'MISSED', number> = visibleReminders.reduce(
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

  const pendingReminders = statusCounts.PENDING

  return (
    <div className="page reminders-page">
      <section className="section-block">
        <div className="section-intro">
          <div>
            <p className="eyebrow">Reminders</p>
            <h3>Pick a person, then scan only the medication reminders that belong to them.</h3>
            <p className="section-copy">
              This page is designed for caregiving moments. The left side helps you choose the
              person, and the right side shows their reminder timeline without clutter.
            </p>
          </div>
          <div className="status-strip status-strip--compact">
            <span className="status-chip">Pending {pendingReminders}</span>
            <span className="status-chip">Taken {statusCounts.TAKEN}</span>
            <span className="status-chip">Missed {statusCounts.MISSED}</span>
            <span className="status-chip">{selectedUser?.name ?? 'Account'}</span>
          </div>
        </div>
      </section>

      <section className="reminders-summary-grid">
        <article className="panel reminders-summary-card">
          <p className="eyebrow">People with reminders</p>
          <strong>{remindersByPerson.length}</strong>
          <span>need medication today</span>
        </article>
        <article className="panel reminders-summary-card">
          <p className="eyebrow">Pending</p>
          <strong>{pendingReminders}</strong>
          <span>awaiting action</span>
        </article>
        <article className="panel reminders-summary-card">
          <p className="eyebrow">Taken</p>
          <strong>{statusCounts.TAKEN}</strong>
          <span>already handled</span>
        </article>
        <article className="panel reminders-summary-card">
          <p className="eyebrow">Missed</p>
          <strong>{statusCounts.MISSED}</strong>
          <span>need follow-up</span>
        </article>
      </section>

      <section className="reminders-workflow">
        <article className="panel reminders-panel">
          <div className="panel-header">
            <div>
              <h3>Who needs medication?</h3>
              <p className="panel-kicker">
                Select a person to reveal their reminders and keep the task focused.
              </p>
            </div>
            <span>{remindersByPerson.length}</span>
          </div>

          {remindersLoading ? (
            <p className="empty">Loading reminders...</p>
          ) : remindersByPerson.length === 0 ? (
            <div className="reminders-empty">
              <strong>No reminders yet</strong>
              <span>Add medication schedules from the Medications screen, then come back here to
                manage the day.</span>
            </div>
          ) : (
            <div className="reminder-person-list">
              {remindersByPerson.map(({ person, reminders: personReminders, nextReminder: personNextReminder }) => {
                const isActive = selectedPersonId === person.id

                return (
                  <button
                    key={person.id}
                    type="button"
                    className={`reminder-person-card ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedPersonId(person.id)}
                  >
                    <div className="reminder-person-card__top">
                      <div>
                        <strong>{person.name}</strong>
                        <p>{person.relationshipType}</p>
                      </div>
                      <span className="reminder-person-card__badge">{personReminders.length} due</span>
                    </div>

                    <div className="reminder-person-card__meta">
                      <span>{person.userName}</span>
                      <span>{person.userEmail}</span>
                    </div>

                    <div className="reminder-person-card__footer">
                      {personNextReminder ? (
                        <>
                          <span>Next at {formatTime(personNextReminder.dueAt)}</span>
                          <strong>{personNextReminder.medicationName}</strong>
                        </>
                      ) : (
                        <>
                          <span>No upcoming reminder</span>
                          <strong>Schedule a medication time</strong>
                        </>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </article>

        <article className="panel reminders-panel reminders-panel--details">
          <div className="panel-header">
            <div>
              <h3>
                {selectedPerson ? `${selectedPerson.name}'s reminders` : 'Selected person reminders'}
              </h3>
              <p className="panel-kicker">
                {selectedPerson
                  ? 'Medication reminders, due times, and quick actions for this person.'
                  : 'Select a person on the left to see their medication timeline.'}
              </p>
            </div>
            <span>{selectedPersonReminders.length}</span>
          </div>

          {selectedPerson ? (
            <div className="selected-person-summary">
              <div>
                <p className="eyebrow">Focus</p>
                <strong>{selectedPerson.name}</strong>
              </div>
              <div>
                <p className="eyebrow">Account</p>
                <strong>{selectedUser?.name ?? selectedPerson.userName}</strong>
              </div>
            </div>
          ) : null}

          {selectedPersonReminders.length === 0 ? (
            <div className="reminders-empty">
              <strong>
                {selectedPerson ? 'No reminders scheduled yet for this person.' : 'Choose a person to begin.'}
              </strong>
              <span>
                {selectedPerson
                  ? 'Add a medication schedule to make this reminder timeline useful.'
                  : 'The reminder timeline appears here once a person is selected.'}
              </span>
            </div>
          ) : (
            <div className="reminder-timeline">
              {selectedPersonReminders.map((reminder) => (
                <article key={`${reminder.scheduleId}-${reminder.dueAt}`} className="reminder-card">
                  <div className="reminder-top">
                    <div>
                      <strong>{reminder.medicationName}</strong>
                      <p>
                        {reminder.dosageAmount} {reminder.dosageUnit}
                      </p>
                    </div>
                    <span className={`status-badge ${statusTone[reminder.status]}`}>
                      {statusLabels[reminder.status]}
                    </span>
                  </div>

                  <div className="reminder-card__meta">
                    <span>Due at {formatTime(reminder.dueAt)}</span>
                    {reminder.instructions ? <span>{reminder.instructions}</span> : null}
                    {reminder.status !== 'TAKEN' ? <span>Tap mark taken once the dose is complete.</span> : null}
                  </div>

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
