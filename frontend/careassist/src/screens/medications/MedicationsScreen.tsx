import {
  AddScheduleForm,
  CreateMedicationForm,
} from '../../components/forms/CareAssistForms'
import { useCareAssistDashboard } from '../../app/data/CareAssistDashboardProvider'
import type { Medication } from '../../services/api'

export function MedicationsScreen() {
  const {
    persons,
    medications,
    selectedPersonId,
    selectedMedicationId,
    createMedication,
    createMedicationPending,
    createMedicationError,
    addSchedule,
    addSchedulePending,
    addScheduleError,
    selectedPerson,
    setSelectedPersonId,
    setSelectedMedicationId,
  } = useCareAssistDashboard()

  return (
    <section className="screen-stack">
      <header className="screen-header">
        <div>
          <p className="eyebrow">Medications</p>
          <h2>Attach medicines and reminder times</h2>
          <p className="lede">Choose a person first, then create medication and schedule its doses.</p>
        </div>
      </header>

      <section className="grid">
        <CreateMedicationForm
          actionLabel={createMedicationPending ? 'Saving...' : 'Save medication'}
          persons={persons}
          selectedPersonId={selectedPersonId}
          onSubmit={createMedication}
          error={createMedicationError}
        />

        <AddScheduleForm
          medications={medications}
          selectedMedicationId={selectedMedicationId}
          pending={addSchedulePending}
          error={addScheduleError}
          onSubmit={addSchedule}
        />
      </section>

      <section className="grid lower">
        <ListPanel
          title="People"
          emptyText="Select a person first."
          items={persons.map((person) => ({
            id: person.id,
            title: person.name,
            subtitle: person.relationshipType,
          }))}
          activeId={selectedPersonId}
          onSelect={setSelectedPersonId}
        />

        <MedicationPanel
          medications={medications}
          selectedMedicationId={selectedMedicationId}
          onSelectMedication={setSelectedMedicationId}
        />
      </section>
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
        <p className="empty">No medications yet. Create one after choosing a person.</p>
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
