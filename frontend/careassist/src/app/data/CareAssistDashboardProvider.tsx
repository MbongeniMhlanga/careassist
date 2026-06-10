import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { careAssistApi, careAssistQueryKeys, type Medication, type Person, type Reminder, type User } from '../../services/api'
import { useAuth } from '../auth/AuthProvider'

type DashboardContextValue = {
  users: User[]
  persons: Person[]
  medications: Medication[]
  reminders: Reminder[]
  selectedUserId: number | null
  selectedPersonId: number | null
  selectedMedicationId: number | null
  selectedUser: User | null
  selectedPerson: Person | null
  selectedMedication: Medication | null
  setSelectedUserId: (id: number | null) => void
  setSelectedPersonId: (id: number | null) => void
  setSelectedMedicationId: (id: number | null) => void
  createUser: ReturnType<typeof useMutation<User, Error, { name: string; email: string; password: string }>>['mutate']
  createUserPending: boolean
  createUserError: unknown
  createPerson: ReturnType<typeof useMutation<Person, Error, { name: string; relationshipType: Person['relationshipType']; userId: number }>>['mutate']
  createPersonPending: boolean
  createPersonError: unknown
  createMedication: ReturnType<typeof useMutation<Medication, Error, { personId: number; name: string; dosageAmount: number; dosageUnit: string; instructions?: string; scheduleTimes: string[] }>>['mutate']
  createMedicationPending: boolean
  createMedicationError: unknown
  addSchedule: (medicationId: number, scheduledTime: string) => void
  addSchedulePending: boolean
  addScheduleError: unknown
  markReminderTaken: (reminderId: number, note?: string) => void
  remindersLoading: boolean
}

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined)

export function CareAssistDashboardProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const { user: authUser } = useAuth()
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
    if (selectedUserId === null && authUser?.id) {
      setSelectedUserId(authUser.id)
      return
    }

    if (selectedUserId === null && usersQuery.data?.length) {
      setSelectedUserId(usersQuery.data[0].id)
    }
  }, [authUser?.id, selectedUserId, usersQuery.data])

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

  return (
    <DashboardContext.Provider
      value={{
        users,
        persons,
        medications,
        reminders,
        selectedUserId,
        selectedPersonId,
        selectedMedicationId,
        selectedUser,
        selectedPerson,
        selectedMedication,
        setSelectedUserId,
        setSelectedPersonId,
        setSelectedMedicationId,
        createUser: createUserMutation.mutate,
        createUserPending: createUserMutation.isPending,
        createUserError: createUserMutation.error,
        createPerson: createPersonMutation.mutate,
        createPersonPending: createPersonMutation.isPending,
        createPersonError: createPersonMutation.error,
        createMedication: createMedicationMutation.mutate,
        createMedicationPending: createMedicationMutation.isPending,
        createMedicationError: createMedicationMutation.error,
        addSchedule: (medicationId, scheduledTime) => addScheduleMutation.mutate({ medicationId, scheduledTime }),
        addSchedulePending: addScheduleMutation.isPending,
        addScheduleError: addScheduleMutation.error,
        markReminderTaken: (reminderId, note) => markTakenMutation.mutate({ reminderId, note }),
        remindersLoading: remindersQuery.isLoading,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useCareAssistDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useCareAssistDashboard must be used inside CareAssistDashboardProvider')
  }

  return context
}
