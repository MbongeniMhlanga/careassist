import {
  CreatePersonForm,
  CreateUserForm,
} from '../../components/forms/CareAssistForms'
import { useCareAssistDashboard } from '../../app/data/CareAssistDashboardProvider'

export function PeopleScreen() {
  const {
    users,
    persons,
    selectedUserId,
    createUser,
    createUserPending,
    createUserError,
    createPerson,
    createPersonPending,
    createPersonError,
    selectedUser,
    selectedPerson,
    setSelectedUserId,
    setSelectedPersonId,
  } = useCareAssistDashboard()

  return (
    <section className="screen-stack">
      <header className="screen-header">
        <div>
          <p className="eyebrow">People</p>
          <h2>Manage users and family members</h2>
          <p className="lede">Keep the account holder and the people taking medication separate and clear.</p>
        </div>
      </header>

      <section className="grid">
        <CreateUserForm
          actionLabel={createUserPending ? 'Saving...' : 'Save user'}
          onSubmit={createUser}
          error={createUserError}
        />

        <CreatePersonForm
          actionLabel={createPersonPending ? 'Saving...' : 'Save person'}
          users={users}
          selectedUserId={selectedUserId}
          onSubmit={createPerson}
          error={createPersonError}
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
          onSelect={setSelectedUserId}
        />

        <ListPanel
          title="People"
          emptyText={selectedUser ? 'No people for this user yet.' : 'Select a user first.'}
          items={persons.map((person) => ({
            id: person.id,
            title: person.name,
            subtitle: person.relationshipType,
          }))}
          activeId={selectedPerson?.id ?? null}
          onSelect={setSelectedPersonId}
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
