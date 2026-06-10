import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  careAssistApi,
  careAssistQueryKeys,
  type Medication,
  type Reminder,
  type ReminderStatus,
} from '../services/api'
import {
  AddScheduleForm,
  CreateMedicationForm,
  CreatePersonForm,
  CreateUserForm,
} from '../components/forms/CareAssistForms'
import '../App.css'

const statusLabels: Record<ReminderStatus, string> = {
  PENDING: 'Pending',
  SENT: 'Sent',
  TAKEN: 'Taken',
  MISSED: 'Missed',
}

const statusTone: Record<ReminderStatus, string> = {
  PENDING: 'pending',
  SENT: 'sent',
  TAKEN: 'taken',
  MISSED: 'missed',
}

export function DashboardRoute() {
  const queryClient = useQueryClient()
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null)
  const [selectedMedicationId, setSelectedMedicationId] = useState<number | null>(null)

  const usersQuery = useQuery({
    queryKey: careAssistQueryKeys.users,
    queryFn: careAssistApi.listUsers,
  })

  const personsQuery = useQuery({
    queryKey: careAssistQueryKeys.persons(selectedUserId),
    queryFn: () => careAssistApi.listPersons(selectedUserId ?? undefined),
    enabled: selectedUserId !== null,
  })

  const medicationsQuery = useQuery({
    queryKey: careAssistQueryKeys.medications(selectedPersonId),
    queryFn: () => careAssistApi.listMedicationsForPerson(selectedPersonId ?? 0),
    enabled: selectedPersonId !== null,
  })

  const remindersQuery = useQuery({
    queryKey: careAssistQueryKeys.remindersToday,
    queryFn: careAssistApi.listTodayReminders,
    refetchInterval: 60_000,
  })

  useEffect(() => {
    if (selectedUserId === null && usersQuery.data?.length) {
      setSelectedUserId(usersQuery.data[0].id)
    }
  }, [selectedUserId, usersQuery.data])

  useEffect(() => {
    if (!personsQuery.data?.length) {
      setSelectedPersonId(null)
      setSelectedMedicationId(null)
      return
    }

    if (selectedPersonId === null || !personsQuery.data.some((person) => person.id === selectedPersonId)) {
      setSelectedPersonId(personsQuery.data[0].id)
      setSelectedMedicationId(null)
    }
  }, [personsQuery.data, selectedPersonId])

  useEffect(() => {
    if (!medicationsQuery.data?.length) {
      setSelectedMedicationId(null)
      return
    }

    if (
      selectedMedicationId === null ||
      !medicationsQuery.data.some((medication) => medication.id === selectedMedicationId)
    ) {
      setSelectedMedicationId(medicationsQuery.data[0].id)
    }
  }, [medicationsQuery.data, selectedMedicationId])

  const createUserMutation = useMutation({
    mutationFn: careAssistApi.createUser,
    onSuccess: async (createdUser) => {
      await queryClient.invalidateQueries({ queryKey: careAssistQueryKeys.users })
      setSelectedUserId(createdUser.id)
    },
  })

  const createPersonMutation = useMutation({
    mutationFn: careAssistApi.createPerson,
    onSuccess: async (createdPerson) => {
      await queryClient.invalidateQueries({ queryKey: ['persons'] })
      setSelectedPersonId(createdPerson.id)
    },
  })

  const createMedicationMutation = useMutation({
    mutationFn: careAssistApi.createMedication,
    onSuccess: async (createdMedication) => {
      await queryClient.invalidateQueries({ queryKey: ['medications'] })
      await queryClient.invalidateQueries({ queryKey: careAssistQueryKeys.remindersToday })
      setSelectedMedicationId(createdMedication.id)
    },
  })

  const addScheduleMutation = useMutation({
    mutationFn: ({ medicationId, scheduledTime }: { medicationId: number; scheduledTime: string }) =>
      careAssistApi.addSchedule(medicationId, { scheduledTime }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['medications'] })
      await queryClient.invalidateQueries({ queryKey: careAssistQueryKeys.remindersToday })
    },
  })

  const markTakenMutation = useMutation({
    mutationFn: ({ reminderId, note }: { reminderId: number; note?: string }) =>
      careAssistApi.markReminderTaken(reminderId, note),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: careAssistQueryKeys.remindersToday })
    },
  })

  const users = usersQuery.data ?? []
  const persons = personsQuery.data ?? []
  const medications = medicationsQuery.data ?? []
  const reminders = remindersQuery.data ?? []

  const selectedUser = users.find((user) => user.id === selectedUserId) ?? null
  const selectedPerson = persons.find((person) => person.id === selectedPersonId) ?? null
  const selectedMedication = medications.find((medication) => medication.id === selectedMedicationId) ?? null

  const takenCount = reminders.filter((reminder) => reminder.status === 'TAKEN').length
  const missedCount = reminders.filter((reminder) => reminder.status === 'MISSED').length

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">C</div>
          <div>
            <p className="eyebrow">CareAssist</p>
            <h1>Medication tracking, made calmer.</h1>
          </div>
        </div>

        <div className="stack">
          <StatCard label="Users" value={users.length} />
          <StatCard label="People" value={persons.length} />
          <StatCard label="Meds" value={medications.length} />
          <StatCard label="Today" value={reminders.length} />
        </div>

        <section className="panel">
          <h2>Quick context</h2>
          <p className="muted">
            Selected user: <strong>{selectedUser?.name ?? 'None'}</strong>
          </p>
          <p className="muted">
            Selected person: <strong>{selectedPerson?.name ?? 'None'}</strong>
          </p>
          <p className="muted">
            Selected medication: <strong>{selectedMedication?.name ?? 'None'}</strong>
          </p>
          <p className="muted">
            Taken: <strong>{takenCount}</strong> | Missed: <strong>{missedCount}</strong>
          </p>
        </section>
      </aside>

      <main className="content">
        <header className="hero">
          <div>
            <p className="eyebrow">CareAssist </p>
            <h2>Build reminders for people, not just medicines.</h2>
            <p className="lede">
              Create users, assign family members, add medications, attach reminder times, and mark
              doses as taken from one dashboard.
            </p>
          </div>
         
        </header>

        <section className="grid">
          <CreateUserForm
            actionLabel={createUserMutation.isPending ? 'Saving...' : 'Save user'}
            onSubmit={(payload) => createUserMutation.mutate(payload)}
            error={createUserMutation.error}
          />

          <CreatePersonForm
            actionLabel={createPersonMutation.isPending ? 'Saving...' : 'Save person'}
            users={users}
            selectedUserId={selectedUserId}
            onSubmit={(payload) => createPersonMutation.mutate(payload)}
            error={createPersonMutation.error}
          />

          <CreateMedicationForm
            actionLabel={createMedicationMutation.isPending ? 'Saving...' : 'Save medication'}
            persons={persons}
            selectedPersonId={selectedPersonId}
            onSubmit={(payload) => createMedicationMutation.mutate(payload)}
            error={createMedicationMutation.error}
          />
        </section>

        <section className="grid lower">
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
              setSelectedUserId(id)
              setSelectedPersonId(null)
              setSelectedMedicationId(null)
            }}
          />

          <ListPanel
            title="People"
            emptyText={selectedUser ? 'No people for this user yet.' : 'Select a user first.'}
            items={persons.map((person) => ({
              id: person.id,
              title: person.name,
              subtitle: person.relationshipType,
            }))}
            activeId={selectedPersonId}
            onSelect={(id) => {
              setSelectedPersonId(id)
              setSelectedMedicationId(null)
            }}
          />

          <MedicationPanel
            medications={medications}
            selectedMedicationId={selectedMedicationId}
            onSelectMedication={setSelectedMedicationId}
          />

          <AddScheduleForm
            medications={medications}
            selectedMedicationId={selectedMedicationId}
            pending={addScheduleMutation.isPending}
            error={addScheduleMutation.error}
            onSubmit={(medicationId, scheduledTime) => addScheduleMutation.mutate({ medicationId, scheduledTime })}
          />

          <ReminderPanel
            reminders={reminders}
            loading={remindersQuery.isLoading}
            onMarkTaken={(reminder) => {
              if (reminder.id !== null) {
                markTakenMutation.mutate({
                  reminderId: reminder.id,
                  note: 'Taken from dashboard',
                })
              }
            }}
          />
        </section>
      </main>
    </div>
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
  onSelectMedication: (medicationId: number) => void
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
  onMarkTaken,
}: {
  reminders: Reminder[]
  loading: boolean
  onMarkTaken: (reminder: Reminder) => void
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
                <button type="button" className="primary-button secondary" onClick={() => onMarkTaken(reminder)}>
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
