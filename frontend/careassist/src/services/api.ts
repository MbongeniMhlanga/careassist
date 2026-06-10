const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:2024/api'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type ApiErrorBody = {
  message?: string
  error?: string
  details?: string[]
}

async function request<T>(path: string, method: HttpMethod = 'GET', body?: unknown): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as ApiErrorBody | null
    const message =
      errorBody?.message ??
      errorBody?.error ??
      errorBody?.details?.join(', ') ??
      `Request failed with status ${response.status}`
    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export const careAssistApi = {
  listUsers: () => request<User[]>('/users'),
  createUser: (payload: CreateUserPayload) => request<User>('/users', 'POST', payload),
  listPersons: (userId?: number) =>
    request<Person[]>(userId ? `/persons?userId=${userId}` : '/persons'),
  createPerson: (payload: CreatePersonPayload) => request<Person>('/persons', 'POST', payload),
  listMedicationsForPerson: (personId: number) =>
    request<Medication[]>(`/medications/person/${personId}`),
  createMedication: (payload: CreateMedicationPayload) =>
    request<Medication>('/medications', 'POST', payload),
  addSchedule: (medicationId: number, payload: CreateSchedulePayload) =>
    request<MedicationSchedule>(`/medications/${medicationId}/schedules`, 'POST', payload),
  updateSchedule: (medicationId: number, scheduleId: number, payload: CreateSchedulePayload) =>
    request<MedicationSchedule>(`/medications/${medicationId}/schedules/${scheduleId}`, 'PUT', payload),
  listSchedules: (medicationId: number) =>
    request<MedicationSchedule[]>(`/medications/${medicationId}/schedules`),
  listTodayReminders: () => request<Reminder[]>('/reminders/today'),
  markReminderTaken: (reminderId: number, note?: string) =>
    request<Reminder>(`/reminders/${reminderId}/taken`, 'POST', note ? { note } : {}),
}

export const authApi = {
  login: (payload: LoginPayload) => request<User>('/auth/login', 'POST', payload),
  register: (payload: RegisterPayload) => request<User>('/auth/register', 'POST', payload),
}

export const careAssistQueryKeys = {
  users: ['users'] as const,
  persons: (userId: number | null) => ['persons', userId ?? 'all'] as const,
  medications: (personId: number | null) => ['medications', personId ?? 'all'] as const,
  remindersToday: ['reminders', 'today'] as const,
}

export type RelationshipType =
  | 'SELF'
  | 'CHILD'
  | 'MOTHER'
  | 'FATHER'
  | 'GRANDMA'
  | 'GRANDPA'
  | 'OTHER'

export type ReminderStatus = 'PENDING' | 'SENT' | 'TAKEN' | 'MISSED'

export type User = {
  id: number
  name: string
  email: string
}

export type Person = {
  id: number
  name: string
  relationshipType: RelationshipType
  userId: number
  userName: string
  userEmail: string
}

export type MedicationSchedule = {
  id: number
  scheduledTime: string
  active: boolean
}

export type Medication = {
  id: number
  personId: number
  personName: string
  name: string
  dosageAmount: number
  dosageUnit: string
  instructions?: string | null
  active: boolean
  schedules: MedicationSchedule[]
}

export type Reminder = {
  id: number | null
  medicationId: number
  medicationName: string
  personId: number
  personName: string
  dosageAmount: number
  dosageUnit: string
  instructions?: string | null
  scheduleId: number
  dueAt: string
  status: ReminderStatus
  sentAt?: string | null
  takenAt?: string | null
  note?: string | null
}

export type CreateUserPayload = {
  name: string
  email: string
  password: string
}

export type CreatePersonPayload = {
  name: string
  relationshipType: RelationshipType
  userId: number
}

export type CreateMedicationPayload = {
  personId: number
  name: string
  dosageAmount: number
  dosageUnit: string
  instructions?: string
  scheduleTimes: string[]
}

export type CreateSchedulePayload = {
  scheduledTime: string
}

export type UpdateSchedulePayload = CreateSchedulePayload

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
  confirmPassword: string
}
