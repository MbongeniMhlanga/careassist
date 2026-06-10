import { useEffect, useState } from 'react'
import { AddScheduleForm, CreateMedicationForm } from '../components/forms/CareAssistForms'
import { useCareAssistWorkspace } from '../context/CareAssistWorkspaceContext'

type EditingSchedule = {
  medicationId: number
  scheduleId: number
  scheduledTime: string
}

function formatTimeForInput(value: string) {
  return value.trim().slice(0, 5)
}

export function MedicationsPage() {
  const {
    persons,
    medications,
    selectedUser,
    selectedPerson,
    selectedPersonId,
    selectedMedicationId,
    setSelectedPersonId,
    setSelectedMedicationId,
    createMedication,
    addSchedule,
    updateSchedule,
    isCreatingMedication,
    isAddingSchedule,
    isUpdatingSchedule,
    createMedicationError,
    addScheduleError,
    updateScheduleError,
    medicationsLoading,
  } = useCareAssistWorkspace()
  const [editingSchedule, setEditingSchedule] = useState<EditingSchedule | null>(null)

  useEffect(() => {
    setEditingSchedule(null)
  }, [selectedMedicationId])

  const handleStartEdit = (medicationId: number, scheduleId: number, scheduledTime: string) => {
    setEditingSchedule({
      medicationId,
      scheduleId,
      scheduledTime: formatTimeForInput(scheduledTime),
    })
  }

  const handleSaveEdit = () => {
    if (!editingSchedule) {
      return
    }

    updateSchedule(
      editingSchedule.medicationId,
      editingSchedule.scheduleId,
      editingSchedule.scheduledTime,
    )
    setEditingSchedule(null)
  }

  return (
    <div className="page">
      <section className="section-block">
        <div className="section-intro">
          <div>
            <p className="eyebrow">Medications</p>
            <h3>Attach medicines to a person and seed their reminder times.</h3>
            <p className="section-copy">
              This screen keeps the dosage, instructions, and schedule together so the care plan
              stays readable.
            </p>
          </div>
          <div className="section-note">
            <strong>Selected person</strong>
            <span>{selectedPerson?.name ?? 'Choose a person first'}</span>
          </div>
        </div>

        <div className="page-grid">
          <CreateMedicationForm
            actionLabel={isCreatingMedication ? 'Saving...' : 'Save medication'}
            persons={persons}
            selectedPersonId={selectedPersonId}
            onSubmit={createMedication}
            error={createMedicationError}
          />

          <article className="panel page-panel">
            <div className="panel-header">
              <div>
                <h3>People</h3>
                <p className="panel-kicker">Choose who this medication belongs to.</p>
              </div>
              <span>{persons.length}</span>
            </div>

            <div className="list">
              {persons.map((person) => (
                <button
                  key={person.id}
                  type="button"
                  className={`list-item ${selectedPersonId === person.id ? 'active' : ''}`}
                  onClick={() => setSelectedPersonId(person.id)}
                >
                  <strong>{person.name}</strong>
                  <span>{person.relationshipType}</span>
                </button>
              ))}
            </div>

            <div className="mini-summary">
              <span>Current account</span>
              <strong>{selectedUser?.name ?? 'None'}</strong>
            </div>
          </article>
        </div>

        <div className="page-grid">
          <article className="panel page-panel page-panel--wide">
            <div className="panel-header">
              <div>
                <h3>Medication list</h3>
                <p className="panel-kicker">All medications for the currently selected person.</p>
              </div>
              <span>{medications.length}</span>
            </div>

            {medicationsLoading ? (
              <p className="empty">Loading medications...</p>
            ) : medications.length === 0 ? (
              <p className="empty">No medications yet. Select a person and create one above.</p>
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
                        onClick={() => setSelectedMedicationId(medication.id)}
                      >
                        {medication.personName}
                      </button>
                    </div>
                    {medication.instructions ? <p className="muted">{medication.instructions}</p> : null}
                    <div className="schedule-box">
                      <p className="panel-kicker">Tap a time to edit it.</p>
                      <div className="schedule-list">
                        {medication.schedules.length === 0 ? (
                          <span className="chip">No schedules yet</span>
                        ) : (
                          medication.schedules.map((schedule) => (
                            <div key={schedule.id} className="schedule-row">
                              {editingSchedule?.scheduleId === schedule.id ? (
                                <>
                                  <input
                                    className="schedule-input"
                                    type="time"
                                    value={editingSchedule.scheduledTime}
                                    onChange={(event) =>
                                      setEditingSchedule((current) =>
                                        current && current.scheduleId === schedule.id
                                          ? {
                                              ...current,
                                              scheduledTime: event.target.value,
                                            }
                                          : current,
                                      )
                                    }
                                  />
                                  <div className="schedule-actions">
                                    <button
                                      type="button"
                                      className="primary-button"
                                      disabled={isUpdatingSchedule}
                                      onClick={handleSaveEdit}
                                    >
                                      {isUpdatingSchedule ? 'Saving...' : 'Save'}
                                    </button>
                                    <button
                                      type="button"
                                      className="ghost-button"
                                      onClick={() => setEditingSchedule(null)}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    className="chip chip-button"
                                    onClick={() =>
                                      handleStartEdit(
                                        medication.id,
                                        schedule.id,
                                        schedule.scheduledTime,
                                      )
                                    }
                                  >
                                    {schedule.scheduledTime}
                                  </button>
                                  <button
                                    type="button"
                                    className="ghost-button schedule-edit-button"
                                    onClick={() =>
                                      handleStartEdit(
                                        medication.id,
                                        schedule.id,
                                        schedule.scheduledTime,
                                      )
                                    }
                                  >
                                    Edit
                                  </button>
                                </>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
            {updateScheduleError ? (
              <p className="error-message">
                {updateScheduleError instanceof Error
                  ? updateScheduleError.message
                  : 'Unable to update medication time'}
              </p>
            ) : null}
          </article>
        </div>

        <AddScheduleForm
          medications={medications}
          selectedMedicationId={selectedMedicationId}
          pending={isAddingSchedule}
          error={addScheduleError}
          onSubmit={addSchedule}
        />
      </section>
    </div>
  )
}
