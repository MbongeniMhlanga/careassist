import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  careAssistApi,
  careAssistQueryKeys,
  type CreateMedicationPayload,
  type CreatePersonPayload,
  type CreateUserPayload,
  type Medication,
  type Person,
  type Reminder,
  type User,
} from '../services/api'

type CareAssistWorkspaceContextValue = {
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
  selectedUserPeople: Person[]
  setSelectedUserId: (id: number | null) => void
  setSelectedPersonId: (id: number | null) => void
  setSelectedMedicationId: (id: number | null) => void
  createUser: (payload: CreateUserPayload) => void
  createPerson: (payload: CreatePersonPayload) => void
  createMedication: (payload: CreateMedicationPayload) => void
  addSchedule: (medicationId: number, scheduledTime: string) => void
  updateSchedule: (medicationId: number, scheduleId: number, scheduledTime: string) => void
  markReminderTaken: (reminder: Reminder) => void
  isCreatingUser: boolean
  isCreatingPerson: boolean
  isCreatingMedication: boolean
  isAddingSchedule: boolean
  isUpdatingSchedule: boolean
  isMarkingReminderTaken: boolean
  createUserError: unknown
  createPersonError: unknown
  createMedicationError: unknown
  addScheduleError: unknown
  updateScheduleError: unknown
  usersLoading: boolean
  personsLoading: boolean
  medicationsLoading: boolean
  remindersLoading: boolean
}

const CareAssistWorkspaceContext = createContext<CareAssistWorkspaceContextValue | null>(null)

export function CareAssistWorkspaceProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null)
  const [selectedMedicationId, setSelectedMedicationId] = useState<number | null>(null)

  const usersQuery = useQuery({
    queryKey: careAssistQueryKeys.users,
    queryFn: careAssistApi.listUsers,
  })

  const personsQuery = useQuery({
    queryKey: careAssistQueryKeys.persons(null),
    queryFn: () => careAssistApi.listPersons(),
  })

  const remindersQuery = useQuery({
    queryKey: careAssistQueryKeys.remindersToday,
    queryFn: careAssistApi.listTodayReminders,
    refetchInterval: 60_000,
  })

  const selectedUserPeople = useMemo(() => {
    if (!personsQuery.data?.length) {
      return []
    }

    if (selectedUserId === null) {
      return personsQuery.data
    }

    return personsQuery.data.filter((person) => person.userId === selectedUserId)
  }, [personsQuery.data, selectedUserId])

  const medicationsQuery = useQuery({
    queryKey: careAssistQueryKeys.medications(selectedPersonId),
    queryFn: () => careAssistApi.listMedicationsForPerson(selectedPersonId ?? 0),
    enabled: selectedPersonId !== null,
  })

  useEffect(() => {
    if (!usersQuery.data?.length) {
      setSelectedUserId(null)
      return
    }

    if (selectedUserId === null || !usersQuery.data.some((user) => user.id === selectedUserId)) {
      setSelectedUserId(usersQuery.data[0].id)
    }
  }, [selectedUserId, usersQuery.data])

  useEffect(() => {
    if (!selectedUserPeople.length) {
      setSelectedPersonId(null)
      setSelectedMedicationId(null)
      return
    }

    if (selectedPersonId === null || !selectedUserPeople.some((person) => person.id === selectedPersonId)) {
      setSelectedPersonId(selectedUserPeople[0].id)
      setSelectedMedicationId(null)
    }
  }, [selectedPersonId, selectedUserPeople])

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
      await queryClient.invalidateQueries({ queryKey: careAssistQueryKeys.persons(null) })
      setSelectedUserId(createdPerson.userId)
      setSelectedPersonId(createdPerson.id)
      setSelectedMedicationId(null)
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

  const updateScheduleMutation = useMutation({
    mutationFn: ({
      medicationId,
      scheduleId,
      scheduledTime,
    }: {
      medicationId: number
      scheduleId: number
      scheduledTime: string
    }) => careAssistApi.updateSchedule(medicationId, scheduleId, { scheduledTime }),
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

  const value: CareAssistWorkspaceContextValue = {
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
    selectedUserPeople,
    setSelectedUserId,
    setSelectedPersonId,
    setSelectedMedicationId,
    createUser: (payload) => createUserMutation.mutate(payload),
    createPerson: (payload) => createPersonMutation.mutate(payload),
    createMedication: (payload) => createMedicationMutation.mutate(payload),
    addSchedule: (medicationId, scheduledTime) =>
      addScheduleMutation.mutate({ medicationId, scheduledTime }),
    updateSchedule: (medicationId, scheduleId, scheduledTime) =>
      updateScheduleMutation.mutate({ medicationId, scheduleId, scheduledTime }),
    markReminderTaken: (reminder) => {
      if (reminder.id !== null) {
        markTakenMutation.mutate({
          reminderId: reminder.id,
          note: 'Taken from dashboard',
        })
      }
    },
    isCreatingUser: createUserMutation.isPending,
    isCreatingPerson: createPersonMutation.isPending,
    isCreatingMedication: createMedicationMutation.isPending,
    isAddingSchedule: addScheduleMutation.isPending,
    isUpdatingSchedule: updateScheduleMutation.isPending,
    isMarkingReminderTaken: markTakenMutation.isPending,
    createUserError: createUserMutation.error,
    createPersonError: createPersonMutation.error,
    createMedicationError: createMedicationMutation.error,
    addScheduleError: addScheduleMutation.error,
    updateScheduleError: updateScheduleMutation.error,
    usersLoading: usersQuery.isLoading,
    personsLoading: personsQuery.isLoading,
    medicationsLoading: medicationsQuery.isLoading,
    remindersLoading: remindersQuery.isLoading,
  }

  return (
    <CareAssistWorkspaceContext.Provider value={value}>
      {children}
    </CareAssistWorkspaceContext.Provider>
  )
}

export function useCareAssistWorkspace() {
  const context = useContext(CareAssistWorkspaceContext)

  if (!context) {
    throw new Error('useCareAssistWorkspace must be used within CareAssistWorkspaceProvider')
  }

  return context
}
