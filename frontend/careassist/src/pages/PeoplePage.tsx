import { CreatePersonForm } from '../components/forms/CareAssistForms'
import { useCareAssistWorkspace } from '../context/CareAssistWorkspaceContext'
import { useNavigate } from 'react-router-dom'

export function PeoplePage() {
  const navigate = useNavigate()
  const {
    users,
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
              Pick an account, add the people attached to it, then open reminders for anyone
              directly from here.
            </p>
          </div>
          <div className="people-header-actions">
            <div className="section-note">
              <strong>Current account</strong>
              <span>{selectedUser?.name ?? 'No account selected'}</span>
            </div>
            <button
              type="button"
              className="primary-button secondary"
              onClick={() => navigate('/reminders?scope=all')}
            >
              View all reminders
            </button>
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
                <h3>Accounts</h3>
                <p className="panel-kicker">Choose which care circle you want to manage.</p>
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
              <span>People attached to this account</span>
              <strong>{selectedUserPeople.length}</strong>
            </div>
          </article>
        </div>

        <article className="panel page-panel">
          <div className="panel-header">
            <div>
              <h3>People</h3>
              <p className="panel-kicker">
                Tap a person to open that person&apos;s reminders screen.
              </p>
            </div>
            <span>{selectedUserPeople.length}</span>
          </div>

          {personsLoading ? (
            <p className="empty">Loading people...</p>
          ) : selectedUserPeople.length === 0 ? (
            <p className="empty">
              {selectedUser
                ? 'No people added for this account yet.'
                : 'Select an account to see people.'}
            </p>
          ) : (
            <div className="people-card-list">
              {selectedUserPeople.map((person) => (
                <article
                  key={person.id}
                  className={`people-card ${selectedPersonId === person.id ? 'active' : ''}`}
                >
                  <div className="people-card__top">
                    <div>
                      <strong>{person.name}</strong>
                      <p>{person.relationshipType}</p>
                    </div>
                    <span className="person-card__badge">Care member</span>
                  </div>
                  <div className="people-card__meta">
                    <span>{person.userName}</span>
                    <span>{person.userEmail}</span>
                  </div>
                  <div className="people-card__footer">
                    <span>Open that person&apos;s reminders in a focused screen.</span>
                    <div className="people-card__actions">
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => {
                          setSelectedPersonId(person.id)
                          navigate(`/reminders?personId=${person.id}`)
                        }}
                      >
                        View reminders
                      </button>
                    </div>
                  </div>
                </article>
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
