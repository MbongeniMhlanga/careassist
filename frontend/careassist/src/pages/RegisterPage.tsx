import { CreateUserForm } from '../components/forms/CareAssistForms'
import { useCareAssistWorkspace } from '../context/CareAssistWorkspaceContext'

export function RegisterPage() {
  const { createUser, isCreatingUser, createUserError, users, selectedUser } = useCareAssistWorkspace()

  return (
    <div className="page page-auth">
      <section className="panel page-panel page-panel--hero">
        <p className="eyebrow">Register</p>
        <h3>Create the account holder first.</h3>
        <p className="section-copy">
          Every care plan starts with a user. Once the account exists, you can attach people,
          medications, and reminder schedules from the other screens.
        </p>
        <div className="dashboard-metrics">
          <div className="mini-stat">
            <span>Registered users</span>
            <strong>{users.length}</strong>
          </div>
          <div className="mini-stat">
            <span>Selected user</span>
            <strong>{selectedUser?.name ?? 'None yet'}</strong>
          </div>
        </div>
      </section>

      <CreateUserForm
        actionLabel={isCreatingUser ? 'Saving...' : 'Save user'}
        onSubmit={createUser}
        error={createUserError}
      />
    </div>
  )
}
