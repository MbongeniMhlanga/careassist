import { CreateUserForm } from '../components/forms/CareAssistForms'
import { useCareAssistWorkspace } from '../context/CareAssistWorkspaceContext'

export function RegisterPage() {
  const { createUser, isCreatingUser, createUserError, selectedUser } = useCareAssistWorkspace()

  return (
    <div className="page page-auth">
      <section className="panel page-panel page-panel--hero">
        <p className="eyebrow">Register</p>
        <h3>Create the account holder first.</h3>
        <p className="section-copy">
          Every care plan starts with an account. Once it exists, you can attach people,
          medications, and reminder schedules from the other screens.
        </p>
        <div className="section-note">
          <strong>Selected account</strong>
          <span>{selectedUser?.name ?? 'None yet'}</span>
        </div>
      </section>

      <CreateUserForm
        actionLabel={isCreatingUser ? 'Saving...' : 'Save account'}
        onSubmit={createUser}
        error={createUserError}
      />
    </div>
  )
}
