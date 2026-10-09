import { useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { usersService, type UserInput } from '@/services/users.service'
import { toast } from '@/store/toast.store'
import type { User } from '@/types'
import { roleOptions, statusOptions } from './user-meta'

interface UserFormModalProps {
  open: boolean
  onClose: () => void
  /** Pass a user to edit; omit to create. */
  user?: User | null
}

export function UserFormModal({ open, onClose, user }: UserFormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={user ? 'Edit user' : 'Add user'}
      description={user ? 'Update profile details and access.' : 'Invite a new member to your workspace.'}
    >
      <UserForm user={user} onDone={onClose} />
    </Modal>
  )
}

type Errors = Partial<Record<keyof UserInput | 'form', string>>

function UserForm({ user, onDone }: { user?: User | null; onDone: () => void }) {
  const queryClient = useQueryClient()
  const [values, setValues] = useState<UserInput>({
    name: user?.name ?? '',
    email: user?.email ?? '',
    role: user?.role ?? 'viewer',
    status: user?.status ?? 'invited',
  })
  const [errors, setErrors] = useState<Errors>({})

  const mutation = useMutation({
    mutationFn: (input: UserInput) => (user ? usersService.update(user.id, input) : usersService.create(input)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success(user ? 'User updated' : 'User added', values.name)
      onDone()
    },
    onError: (err) => setErrors({ form: err.message }),
  })

  const set = <K extends keyof UserInput>(key: K, value: UserInput[K]) => setValues((v) => ({ ...v, [key]: value }))

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const next: Errors = {}
    if (!values.name.trim()) next.name = 'Name is required'
    if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) next.email = 'Enter a valid email address'
    setErrors(next)
    if (Object.keys(next).length) return
    mutation.mutate({ ...values, name: values.name.trim(), email: values.email.trim() })
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {errors.form && (
        <p role="alert" className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          {errors.form}
        </p>
      )}
      <Field label="Full name" htmlFor="user-name" error={errors.name}>
        <Input
          id="user-name"
          value={values.name}
          onChange={(e) => set('name', e.target.value)}
          aria-invalid={Boolean(errors.name)}
          autoFocus
        />
      </Field>
      <Field label="Email" htmlFor="user-email" error={errors.email}>
        <Input
          id="user-email"
          type="email"
          value={values.email}
          onChange={(e) => set('email', e.target.value)}
          aria-invalid={Boolean(errors.email)}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Role" htmlFor="user-role">
          <Select
            id="user-role"
            value={values.role}
            onChange={(e) => set('role', e.target.value as UserInput['role'])}
            options={roleOptions}
          />
        </Field>
        <Field label="Status" htmlFor="user-status">
          <Select
            id="user-status"
            value={values.status}
            onChange={(e) => set('status', e.target.value as UserInput['status'])}
            options={statusOptions}
          />
        </Field>
      </div>
      <div className="-mx-5 mt-6 flex justify-end gap-2 border-t border-border px-5 pt-4">
        <Button variant="outline" onClick={onDone} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button type="submit" loading={mutation.isPending}>
          {user ? 'Save changes' : 'Add user'}
        </Button>
      </div>
    </form>
  )
}
