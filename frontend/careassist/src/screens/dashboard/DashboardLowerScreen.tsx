import { AddScheduleForm } from '../../components/forms/CareAssistForms'
import type { Medication, Person, Reminder, User } from '../../services/api'

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

type DashboardLowerScreenProps = {
  users: User[]
  persons: Person[]
  medications: Medication[]
  reminders: Reminder[]
  selectedUserId: number | null
  selectedPersonId: number | null
  selectedMedicationId: number | null
  addSchedulePending: boolean
  addScheduleError: unknown
  remindersLoading: boolean
  onSelectUser: (id: number) => void
  onSelectPerson: (id: number) => void
  onSelectMedication: (id: number | null) => void
  onAddSchedule: (medicationId: number, scheduledTime: string) => void
  onMarkTaken: (reminder: Reminder) => void
}

export function DashboardLowerScreen({
  users,
  persons,
  medications,
  reminders,
  selectedUserId,
  selectedPersonId,
  selectedMedicationId,
  addSchedulePending,
  addScheduleError,
  remindersLoading,
  onSelectUser,
  onSelectPerson,
  onSelectMedication,
  onAddSchedule,
  onMarkTaken,
}: DashboardLowerScreenProps) {
  const hasSelectedUser = selectedUserId !== null
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
    <section className="section-block">
      <div className="section-intro section-intro--tight">
        <div>
          <p className="eyebrow">Daily workspace</p>
          <h3>Keep the active family, medication, and reminders in view.</h3>
          <p className="section-copy">
            Select a person, attach medication, and keep reminders moving without losing context.
          </p>
        </div>
        <div className="status-strip">
          <span className="status-chip">Users {users.length}</span>
          <span className="status-chip">People {persons.length}</span>
          <span className="status-chip">Due today {reminders.length}</span>
        </div>
      </div>

      <div className="grid lower">
        <ListPanel
          title="Users"
          emptyText="No users yet."
          items={users.map((user) => ({
            id: user.id,
            title: user.name,
            subtitle: user.email,
          }))}
          activeId={selectedUserId}
          onSelect={(id) => {
            onSelectUser(id)
          }}
        />

        <ListPanel
          title="People"
          emptyText={hasSelectedUser ? 'No people for this user yet.' : 'Select a user first.'}
          items={persons.map((person) => ({
            id: person.id,
            title: person.name,
            subtitle: person.relationshipType,
          }))}
          activeId={selectedPersonId}
          onSelect={onSelectPerson}
        />

        <MedicationPanel
          medications={medications}
          selectedMedicationId={selectedMedicationId}
          onSelectMedication={onSelectMedication}
        />

        <AddScheduleForm
          medications={medications}
          selectedMedicationId={selectedMedicationId}
          pending={addSchedulePending}
          error={addScheduleError}
          onSubmit={onAddSchedule}
        />

        <ReminderPanel
          reminders={reminders}
          loading={remindersLoading}
          statusCounts={statusCounts}
          onMarkTaken={onMarkTaken}
        />
      </div>
    </section>
  )
}

function ListPanel({
  title,
  items,
  activeId,
  onSelect,
  emptyText,
}: {
  title: string
  items: Array<{ id: number; title: string; subtitle: string }>
  activeId: number | null
  onSelect: (id: number) => void
  emptyText: string
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h3>{title}</h3>
        <span>{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="empty">{emptyText}</p>
      ) : (
        <div className="list">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`list-item ${activeId === item.id ? 'active' : ''}`}
              onClick={() => onSelect(item.id)}
            >
              <strong>{item.title}</strong>
              <span>{item.subtitle}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

function MedicationPanel({
  medications,
  selectedMedicationId,
  onSelectMedication,
}: {
  medications: Medication[]
  selectedMedicationId: number | null
  onSelectMedication: (medicationId: number | null) => void
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h3>Medications</h3>
        <span>{medications.length}</span>
      </div>
      {medications.length === 0 ? (
        <p className="empty">Select a person to see medications.</p>
      ) : (
        <div className="medication-list">
          {medications.map((medication) => (
            <article
              key={medication.id}
              className={`medication-card ${selectedMedicationId === medication.id ? 'active' : ''}`}
            >
              <div className="medication-top">
                <div>
                  <strong>{medication.name}</strong>
                  <p>
                    {medication.dosageAmount} {medication.dosageUnit}
                  </p>
                </div>
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => onSelectMedication(medication.id)}
                >
                  {medication.personName}
                </button>
              </div>
              {medication.instructions ? <p className="muted">{medication.instructions}</p> : null}
              <div className="chips">
                {medication.schedules.length === 0 ? (
                  <span className="chip">No schedules yet</span>
                ) : (
                  medication.schedules.map((schedule) => (
                    <span key={schedule.id} className="chip">
                      {schedule.scheduledTime}
                    </span>
                  ))
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function ReminderPanel({
  reminders,
  loading,
  statusCounts,
  onMarkTaken,
}: {
  reminders: Reminder[]
  loading: boolean
  statusCounts: Record<'PENDING' | 'SENT' | 'TAKEN' | 'MISSED', number>
  onMarkTaken: (reminder: Reminder) => void
}) {
  return (
    <section className="panel panel-wide">
      <div className="panel-header">
        <div>
          <h3>Today&apos;s reminders</h3>
          <p className="panel-kicker">The live queue of what needs attention now.</p>
        </div>
        <span>{reminders.length}</span>
      </div>
      <div className="status-strip status-strip--compact">
        <span className="status-chip">Pending {statusCounts.PENDING}</span>
        <span className="status-chip">Sent {statusCounts.SENT}</span>
        <span className="status-chip">Taken {statusCounts.TAKEN}</span>
        <span className="status-chip">Missed {statusCounts.MISSED}</span>
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
                <button
                  type="button"
                  className="primary-button secondary"
                  onClick={() => onMarkTaken(reminder)}
                >
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
