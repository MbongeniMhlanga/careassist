import { CreateUserForm } from '../components/forms/CareAssistForms'
import { useCareAssistWorkspace } from '../context/CareAssistWorkspaceContext'

export function RegisterPage() {
  const { createUser, isCreatingUser, createUserError, selectedUser } = useCareAssistWorkspace()

  return (
    <div className="page page-auth">
      <section className="panel page-panel page-panel--hero">
        <p className="eyebrow">Account</p>
        <h3>Update the account holder.</h3>
        <p className="section-copy">
          Manage the primary account holder details. You can attach people,
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
        defaultValues={{
          name: selectedUser?.name,
          email: selectedUser?.email,
        }}
        error={createUserError}
      />
    </div>
  )
}
