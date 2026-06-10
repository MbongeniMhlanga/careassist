import {
  CreateMedicationForm,
  CreatePersonForm,
  CreateUserForm,
} from '../../components/forms/CareAssistForms'
import type {
  CreateMedicationPayload,
  CreatePersonPayload,
  CreateUserPayload,
  Person,
  User,
} from '../../services/api'

type DashboardFormsScreenProps = {
  users: User[]
  persons: Person[]
  selectedUserId: number | null
  selectedPersonId: number | null
  createUserPending: boolean
  createPersonPending: boolean
  createMedicationPending: boolean
  createUserError: unknown
  createPersonError: unknown
  createMedicationError: unknown
  onCreateUser: (payload: CreateUserPayload) => void
  onCreatePerson: (payload: CreatePersonPayload) => void
  onCreateMedication: (payload: CreateMedicationPayload) => void
}

export function DashboardFormsScreen({
  users,
  persons,
  selectedUserId,
  selectedPersonId,
  createUserPending,
  createPersonPending,
  createMedicationPending,
  createUserError,
  createPersonError,
  createMedicationError,
  onCreateUser,
  onCreatePerson,
  onCreateMedication,
}: DashboardFormsScreenProps) {
  return (
    <section className="section-block">
      <div className="section-intro">
        <div>
          <p className="eyebrow">Create records</p>
          <h3>Build the care chain from user to person to medication.</h3>
          <p className="section-copy">
            Each form is designed as a step in the workflow so the dashboard feels guided instead of
            crowded.
          </p>
        </div>
        <div className="section-note">
          <strong>Tip</strong>
          <span>Start with a user, then attach family members, then add medications.</span>
        </div>
      </div>

      <div className="grid">
        <CreateUserForm
          actionLabel={createUserPending ? 'Saving...' : 'Save user'}
          onSubmit={onCreateUser}
          error={createUserError}
        />

        <CreatePersonForm
          actionLabel={createPersonPending ? 'Saving...' : 'Save person'}
          users={users}
          selectedUserId={selectedUserId}
          onSubmit={onCreatePerson}
          error={createPersonError}
        />

        <CreateMedicationForm
          actionLabel={createMedicationPending ? 'Saving...' : 'Save medication'}
          persons={persons}
          selectedPersonId={selectedPersonId}
          onSubmit={onCreateMedication}
          error={createMedicationError}
        />
      </div>
    </section>
  )
}
