import { AddScheduleForm, CreateMedicationForm } from '../components/forms/CareAssistForms'
import { useCareAssistWorkspace } from '../context/CareAssistWorkspaceContext'

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
    isCreatingMedication,
    isAddingSchedule,
    createMedicationError,
    addScheduleError,
    medicationsLoading,
  } = useCareAssistWorkspace()

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
              <span>Current user</span>
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
