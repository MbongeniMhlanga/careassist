import { CreatePersonForm } from '../components/forms/CareAssistForms'
import { useCareAssistWorkspace } from '../context/CareAssistWorkspaceContext'

export function PeoplePage() {
  const {
    users,
    persons,
    selectedUserId,
    selectedPersonId,
    selectedUser,
    selectedPerson,
    selectedUserPeople,
    setSelectedUserId,
    setSelectedPersonId,
    createPerson,
    isCreatingPerson,
    createPersonError,
    personsLoading,
  } = useCareAssistWorkspace()

  return (
    <div className="page">
      <section className="section-block">
        <div className="section-intro">
          <div>
            <p className="eyebrow">People</p>
            <h3>Manage the family members who actually take the medication.</h3>
            <p className="section-copy">
              Pick a user, then add the people attached to that account. This screen keeps that
              relationship focused instead of burying it in the dashboard.
            </p>
          </div>
          <div className="section-note">
            <strong>Current user</strong>
            <span>{selectedUser?.name ?? 'No user selected'}</span>
          </div>
        </div>

        <div className="page-grid">
          <CreatePersonForm
            actionLabel={isCreatingPerson ? 'Saving...' : 'Save person'}
            users={users}
            selectedUserId={selectedUserId}
            onSubmit={createPerson}
            error={createPersonError}
          />

          <article className="panel page-panel">
            <div className="panel-header">
              <div>
                <h3>Users</h3>
                <p className="panel-kicker">Choose whose care circle you want to manage.</p>
              </div>
              <span>{users.length}</span>
            </div>

            <div className="list">
              {users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  className={`list-item ${selectedUserId === user.id ? 'active' : ''}`}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </button>
              ))}
            </div>

            <div className="mini-summary">
              <span>People attached to this user</span>
              <strong>{selectedUserPeople.length}</strong>
            </div>
          </article>
        </div>

        <article className="panel page-panel">
          <div className="panel-header">
            <div>
              <h3>People</h3>
              <p className="panel-kicker">The current care circle for the selected user.</p>
            </div>
            <span>{selectedUserPeople.length}</span>
          </div>

          {personsLoading ? (
            <p className="empty">Loading people...</p>
          ) : selectedUserPeople.length === 0 ? (
            <p className="empty">
              {selectedUser ? 'No people added for this user yet.' : 'Select a user to see people.'}
            </p>
          ) : (
            <div className="list">
              {selectedUserPeople.map((person) => (
                <button
                  key={person.id}
                  type="button"
                  className={`list-item ${selectedPersonId === person.id ? 'active' : ''}`}
                  onClick={() => setSelectedPersonId(person.id)}
                >
                  <strong>{person.name}</strong>
                  <span>{person.relationshipType}</span>
                  <small>
                    {person.userName} - {person.userEmail}
                  </small>
                </button>
              ))}
            </div>
          )}

          {selectedPerson ? (
            <div className="context-row context-row--subtle">
              <span>Selected person</span>
              <strong>{selectedPerson.name}</strong>
            </div>
          ) : null}
        </article>
      </section>
    </div>
  )
}
