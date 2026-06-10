import type {
  CreateMedicationPayload,
  CreatePersonPayload,
  CreateUserPayload,
  Medication,
  Person,
  Reminder,
  User,
} from '../../services/api'
import { DashboardFormsScreen } from './DashboardFormsScreen'
import { DashboardHeroScreen } from './DashboardHeroScreen'
import { DashboardLowerScreen } from './DashboardLowerScreen'
import { DashboardSidebarScreen } from './DashboardSidebarScreen'

type DashboardScreenProps = {
  users: User[]
  persons: Person[]
  medications: Medication[]
  reminders: Reminder[]
  selectedUser: User | null
  selectedPerson: Person | null
  selectedMedication: Medication | null
  selectedUserId: number | null
  selectedPersonId: number | null
  selectedMedicationId: number | null
  onSelectUser: (id: number) => void
  onSelectPerson: (id: number) => void
  onSelectMedication: (id: number | null) => void
  onCreateUser: (payload: CreateUserPayload) => void
  onCreatePerson: (payload: CreatePersonPayload) => void
  onCreateMedication: (payload: CreateMedicationPayload) => void
  onAddSchedule: (medicationId: number, scheduledTime: string) => void
  onMarkTaken: (reminder: Reminder) => void
  createUserPending: boolean
  createPersonPending: boolean
  createMedicationPending: boolean
  addSchedulePending: boolean
  createUserError: unknown
  createPersonError: unknown
  createMedicationError: unknown
  addScheduleError: unknown
  remindersLoading: boolean
}

export function DashboardScreen({
  users,
  persons,
  medications,
  reminders,
  selectedUser,
  selectedPerson,
  selectedMedication,
  selectedUserId,
  selectedPersonId,
  selectedMedicationId,
  onSelectUser,
  onSelectPerson,
  onSelectMedication,
  onCreateUser,
  onCreatePerson,
  onCreateMedication,
  onAddSchedule,
  onMarkTaken,
  createUserPending,
  createPersonPending,
  createMedicationPending,
  addSchedulePending,
  createUserError,
  createPersonError,
  createMedicationError,
  addScheduleError,
  remindersLoading,
}: DashboardScreenProps) {
  return (
    <div className="shell">
      <DashboardSidebarScreen
        users={users}
        persons={persons}
        medications={medications}
        reminders={reminders}
        selectedUser={selectedUser}
        selectedPerson={selectedPerson}
        selectedMedication={selectedMedication}
      />

      <main className="content">
        <DashboardHeroScreen />

        <DashboardFormsScreen
          users={users}
          persons={persons}
          selectedUserId={selectedUserId}
          selectedPersonId={selectedPersonId}
          createUserPending={createUserPending}
          createPersonPending={createPersonPending}
          createMedicationPending={createMedicationPending}
          createUserError={createUserError}
          createPersonError={createPersonError}
          createMedicationError={createMedicationError}
          onCreateUser={onCreateUser}
          onCreatePerson={onCreatePerson}
          onCreateMedication={onCreateMedication}
        />

        <DashboardLowerScreen
          users={users}
          persons={persons}
          medications={medications}
          reminders={reminders}
          selectedUserId={selectedUserId}
          selectedPersonId={selectedPersonId}
          selectedMedicationId={selectedMedicationId}
          addSchedulePending={addSchedulePending}
          addScheduleError={addScheduleError}
          remindersLoading={remindersLoading}
          onSelectUser={onSelectUser}
          onSelectPerson={onSelectPerson}
          onSelectMedication={onSelectMedication}
          onAddSchedule={onAddSchedule}
          onMarkTaken={onMarkTaken}
        />
      </main>
    </div>
  )
}
