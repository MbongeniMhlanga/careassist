import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const {
    selectedUser,
    selectedPersonId,
    selectedUserPeople,
    reminders,
    remindersLoading,
    setSelectedPersonId,
    markReminderTaken,
  } = useCareAssistWorkspace()

  const personIdParam = searchParams.get('personId')
  const scopeParam = searchParams.get('scope')
  const focusPersonId = personIdParam ? Number(personIdParam) : null
  const hasValidFocusPerson = Number.isFinite(focusPersonId) && focusPersonId !== null
  const focusPerson = hasValidFocusPerson
    ? selectedUserPeople.find((person) => person.id === focusPersonId) ?? null
    : null
  const showAllReminders = scopeParam === 'all' || !focusPerson

  useEffect(() => {
    if (focusPerson && selectedPersonId !== focusPerson.id) {
      setSelectedPersonId(focusPerson.id)
    }
  }, [focusPerson, selectedPersonId, setSelectedPersonId])

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

  const activeReminders = showAllReminders
    ? visibleReminders.slice().sort((left, right) => new Date(left.dueAt).getTime() - new Date(right.dueAt).getTime())
    : visibleReminders
        .filter((reminder) => reminder.personId === focusPerson?.id)
        .slice()
        .sort((left, right) => new Date(left.dueAt).getTime() - new Date(right.dueAt).getTime())

  const statusCounts: Record<'PENDING' | 'SENT' | 'TAKEN' | 'MISSED', number> = activeReminders.reduce(
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
  const peopleCount = showAllReminders ? remindersByPerson.length : focusPerson ? 1 : 0
  const pageTitle = showAllReminders
    ? `All reminders for ${selectedUser?.name ?? 'this account'}`
    : `${focusPerson?.name ?? 'Selected person'}'s reminders`
  const pageCopy = showAllReminders
    ? 'Review everyone attached to this account in one clean reminders screen.'
    : 'Medication reminders, due times, and quick actions for this person.'

  return (
    <div className="page reminders-page">
      <section className="section-block">
        <div className="section-intro">
          <div>
            <p className="eyebrow">Reminders</p>
            <h3>{pageTitle}</h3>
            <p className="section-copy">{pageCopy}</p>
          </div>

          <div className="reminders-page-actions">
            <div className="status-strip status-strip--compact">
              <span className="status-chip">Pending {pendingReminders}</span>
              <span className="status-chip">Taken {statusCounts.TAKEN}</span>
              <span className="status-chip">Missed {statusCounts.MISSED}</span>
              <span className="status-chip">{selectedUser?.name ?? 'Account'}</span>
            </div>

            {showAllReminders ? (
              <button
                type="button"
                className="primary-button secondary"
                onClick={() => navigate('/people')}
              >
                Pick a person
              </button>
            ) : (
              <button
                type="button"
                className="primary-button secondary"
                onClick={() => navigate('/reminders?scope=all')}
              >
                Show all reminders
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="reminders-summary-grid">
        <article className="panel reminders-summary-card">
          <p className="eyebrow">People with reminders</p>
          <strong>{peopleCount}</strong>
          <span>{showAllReminders ? 'need medication today' : 'focused person only'}</span>
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

      <section className="panel reminders-panel reminders-panel--single">
        <div className="panel-header">
          <div>
            <h3>{showAllReminders ? 'All reminders' : `${focusPerson?.name ?? 'Person'} reminders`}</h3>
            <p className="panel-kicker">
              {showAllReminders
                ? 'Grouped by person so you can scan the whole care circle without switching pages.'
                : 'Focused reminders for one person, with a quick action for each dose.'}
            </p>
          </div>
          <span>{activeReminders.length}</span>
        </div>

        {remindersLoading ? (
          <p className="empty">Loading reminders...</p>
        ) : activeReminders.length === 0 ? (
          <div className="reminders-empty">
            <strong>No reminders yet</strong>
            <span>
              {showAllReminders
                ? 'Add medication schedules from the Medications screen, then return here to manage the day.'
                : 'This person has no reminders yet. Use the view all button to scan the full care circle.'}
            </span>
          </div>
        ) : showAllReminders ? (
          <div className="reminders-group-list">
            {remindersByPerson.map(({ person, reminders: personReminders, nextReminder }) => (
              <article key={person.id} className="reminders-group-card">
                <div className="reminders-group-card__header">
                  <div>
                    <strong>{person.name}</strong>
                    <p>
                      {person.relationshipType} - {person.userName}
                    </p>
                  </div>
                  <div className="reminders-group-card__actions">
                    <span className="reminder-person-card__badge">{personReminders.length} due</span>
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => navigate(`/reminders?personId=${person.id}`)}
                    >
                      Open
                    </button>
                  </div>
                </div>

                <div className="reminders-group-card__meta">
                  {nextReminder ? (
                    <span>Next at {formatTime(nextReminder.dueAt)}: {nextReminder.medicationName}</span>
                  ) : (
                    <span>No upcoming reminder</span>
                  )}
                </div>

                <div className="reminder-timeline">
                  {personReminders.map((reminder) => (
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
                        {reminder.status !== 'TAKEN' ? (
                          <span>Tap mark taken once the dose is complete.</span>
                        ) : null}
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
              </article>
            ))}
          </div>
        ) : (
          <div className="selected-person-summary selected-person-summary--stacked">
            <div>
              <p className="eyebrow">Focus</p>
              <strong>{focusPerson?.name ?? 'Selected person'}</strong>
            </div>
            <div>
              <p className="eyebrow">Account</p>
              <strong>{selectedUser?.name ?? focusPerson?.userName}</strong>
            </div>
          </div>
        )}

        {!showAllReminders && activeReminders.length > 0 ? (
          <div className="reminder-timeline">
            {activeReminders.map((reminder) => (
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
                  {reminder.status !== 'TAKEN' ? (
                    <span>Tap mark taken once the dose is complete.</span>
                  ) : null}
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
        ) : null}
      </section>
    </div>
  )
}
