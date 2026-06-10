import type { ReactNode } from 'react'
import type {
  CreateMedicationPayload,
  CreatePersonPayload,
  CreateUserPayload,
  Medication,
  Person,
  RelationshipType,
  User,
} from '../../services/api'

const relationshipOptions: RelationshipType[] = [
  'SELF',
  'CHILD',
  'MOTHER',
  'FATHER',
  'GRANDMA',
  'GRANDPA',
  'OTHER',
]

type FormCardProps = {
  className?: string
  title: string
  subtitle: string
  actionLabel: string
  onSubmit: (formData: FormData) => void
  children: ReactNode
}

function FormCard({ className, title, subtitle, actionLabel, onSubmit, children }: FormCardProps) {
  return (
    <form
      className={`form-card ${className ?? ''}`.trim()}
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(new FormData(event.currentTarget))
        event.currentTarget.reset()
      }}
    >
      <div className="form-heading">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <button type="submit" className="primary-button">
          {actionLabel}
        </button>
      </div>
      <div className="form-grid">{children}</div>
    </form>
  )
}

function TextField({
  label,
  name,
  type = 'text',
  placeholder,
  help,
  required,
  min,
  defaultValue,
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
  help?: string
  required?: boolean
  min?: number
  defaultValue?: string
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        min={min}
        defaultValue={defaultValue}
      />
      {help ? <small>{help}</small> : null}
    </label>
  )
}

function SelectField({
  label,
  name,
  options,
  fallbackValue,
  placeholder,
}: {
  label: string
  name: string
  options: Array<{ label: string; value: string }>
  fallbackValue?: string
  placeholder?: string
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select name={name} required defaultValue={fallbackValue ?? ''}>
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.length === 0 ? (
          <option value="" disabled>
            No options available
          </option>
        ) : (
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        )}
      </select>
    </label>
  )
}

function FormError({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : 'Something went wrong'
  return <p className="error-message">{message}</p>
}

function normalizeLocalTime(value: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    return ''
  }

  return trimmed.length === 5 ? `${trimmed}:00` : trimmed
}

type CreateUserFormProps = {
  actionLabel: string
  onSubmit: (payload: CreateUserPayload) => void
  error: unknown
}

export function CreateUserForm({ actionLabel, onSubmit, error }: CreateUserFormProps) {
  return (
    <FormCard
      title="Create user"
      subtitle="Start with the account holder."
      actionLabel={actionLabel}
      onSubmit={(formData) => {
        onSubmit({
          name: String(formData.get('name') ?? ''),
          email: String(formData.get('email') ?? ''),
          password: String(formData.get('password') ?? ''),
        })
      }}
    >
      <TextField label="Name" name="name" placeholder="Mbongeni" required />
      <TextField label="Email" name="email" type="email" placeholder="you@example.com" required />
      <TextField
        label="Password"
        name="password"
        type="password"
        placeholder="Choose a password"
        required
      />
      {error ? <FormError error={error} /> : null}
    </FormCard>
  )
}

type CreatePersonFormProps = {
  actionLabel: string
  users: User[]
  selectedUserId: number | null
  onSubmit: (payload: CreatePersonPayload) => void
  error: unknown
}

export function CreatePersonForm({
  actionLabel,
  users,
  selectedUserId,
  onSubmit,
  error,
}: CreatePersonFormProps) {
  return (
    <FormCard
      title="Create person"
      subtitle="Add yourself, a parent, or a child."
      actionLabel={actionLabel}
      onSubmit={(formData) => {
        onSubmit({
          name: String(formData.get('name') ?? ''),
          relationshipType: String(formData.get('relationshipType') ?? 'OTHER') as RelationshipType,
          userId: Number(String(formData.get('userId') ?? '')),
        })
      }}
    >
      <TextField label="Name" name="name" placeholder="Grace" required />
      <SelectField
        label="Relationship"
        name="relationshipType"
        options={relationshipOptions.map((relationship) => ({
          label: relationship,
          value: relationship,
        }))}
      />
      <SelectField
        label="User"
        name="userId"
        options={users.map((user) => ({
          label: `${user.name} (${user.email})`,
          value: String(user.id),
        }))}
        fallbackValue={selectedUserId ? String(selectedUserId) : ''}
        placeholder="Choose a user"
      />
      {error ? <FormError error={error} /> : null}
    </FormCard>
  )
}

type CreateMedicationFormProps = {
  actionLabel: string
  persons: Person[]
  selectedPersonId: number | null
  onSubmit: (payload: CreateMedicationPayload) => void
  error: unknown
}

export function CreateMedicationForm({
  actionLabel,
  persons,
  selectedPersonId,
  onSubmit,
  error,
}: CreateMedicationFormProps) {
  return (
    <FormCard
      className="panel-wide"
      title="Create medication"
      subtitle="Attach a medicine to a person and seed the first reminder times."
      actionLabel={actionLabel}
      onSubmit={(formData) => {
        const scheduleTimes = String(formData.get('scheduleTimes') ?? '')
          .split(',')
          .map((time) => normalizeLocalTime(time))
          .filter(Boolean)

        onSubmit({
          personId: Number(String(formData.get('personId') ?? '')),
          name: String(formData.get('name') ?? ''),
          dosageAmount: Number(formData.get('dosageAmount') ?? 1),
          dosageUnit: String(formData.get('dosageUnit') ?? 'pills'),
          instructions: String(formData.get('instructions') ?? '').trim() || undefined,
          scheduleTimes,
        })
      }}
    >
      <TextField label="Name" name="name" placeholder="Amoxicillin" required />
      <div className="split">
        <TextField label="Dosage amount" name="dosageAmount" type="number" min={1} defaultValue="1" required />
        <TextField label="Dosage unit" name="dosageUnit" placeholder="pills" required />
      </div>
      <TextField label="Instructions" name="instructions" placeholder="Take after meals" />
      <SelectField
        label="Person"
        name="personId"
        options={persons.map((person) => ({
          label: `${person.name} - ${person.relationshipType}`,
          value: String(person.id),
        }))}
        fallbackValue={selectedPersonId ? String(selectedPersonId) : ''}
        placeholder="Choose a person"
      />
      <TextField
        label="Schedule times"
        name="scheduleTimes"
        placeholder="08:00, 14:00, 20:00"
        help="Comma-separated local times"
        required
      />
      {error ? <FormError error={error} /> : null}
    </FormCard>
  )
}

type AddScheduleFormProps = {
  medications: Medication[]
  selectedMedicationId: number | null
  pending: boolean
  error: unknown
  onSubmit: (medicationId: number, scheduledTime: string) => void
}

export function AddScheduleForm({
  medications,
  selectedMedicationId,
  pending,
  error,
  onSubmit,
}: AddScheduleFormProps) {
  return (
    <form
      className="form-card"
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const medicationId = Number(String(formData.get('medicationId') ?? ''))
        const scheduledTime = normalizeLocalTime(String(formData.get('scheduledTime') ?? ''))

        onSubmit(medicationId, scheduledTime)
        event.currentTarget.reset()
      }}
    >
      <div className="form-heading">
        <div>
          <h3>Add schedule</h3>
          <p>Create one more reminder time for an existing medication.</p>
        </div>
        <button type="submit" className="primary-button" disabled={medications.length === 0}>
          {pending ? 'Saving...' : 'Add time'}
        </button>
      </div>

      <div className="form-grid">
        <SelectField
          label="Medication"
          name="medicationId"
          options={medications.map((medication) => ({
            label: `${medication.name} - ${medication.personName}`,
            value: String(medication.id),
          }))}
          fallbackValue={selectedMedicationId ? String(selectedMedicationId) : ''}
          placeholder="Choose a medication"
        />
        <TextField label="Time" name="scheduledTime" type="time" required />
        {error ? <FormError error={error} /> : null}
      </div>
    </form>
  )
}
