import { useRef, useState, type FormEvent } from 'react'
import { Upload } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { Input, Textarea } from '@/components/ui/Input'
import { readImageFile } from '@/lib/file'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { toast } from '@/store/toast.store'
import { roleBadge } from '@/pages/users/user-meta'
import { SettingsSection } from './SettingsSection'

export function ProfileTab() {
  const user = useAuthStore((s) => s.user)!
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const onAvatar = async (file?: File) => {
    if (!file) return
    try {
      const avatar = await readImageFile(file, 256)
      await authService.updateProfile({ avatar })
      toast.success('Profile photo updated')
    } catch (err) {
      toast.error('Upload failed', (err as Error).message)
    }
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid name and email')
      return
    }
    setSaving(true)
    try {
      await authService.updateProfile({ name: name.trim(), email: email.trim() })
      toast.success('Profile saved')
    } catch (err) {
      toast.error('Could not save profile', (err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <SettingsSection title="Photo" description="Shown in the top bar and on your activity.">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} src={user.avatar} size="lg" />
          <div className="flex flex-wrap gap-2">
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onAvatar(e.target.files?.[0])} />
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              <Upload />
              Upload
            </Button>
            {user.avatar && (
              <Button variant="ghost" size="sm" onClick={() => authService.updateProfile({ avatar: null })}>
                Remove
              </Button>
            )}
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Personal information"
        description={`Signed in as ${roleBadge[user.role].label.toLowerCase()}.`}
        onSubmit={onSubmit}
        footer={
          <Button type="submit" loading={saving}>
            Save changes
          </Button>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" htmlFor="profile-name">
            <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Email" htmlFor="profile-email">
            <Input id="profile-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
        </div>
        <Field label="Bio" htmlFor="profile-bio" hint="A short description, visible to your team.">
          <Textarea
            id="profile-bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell your team about yourself"
          />
        </Field>
      </SettingsSection>
    </>
  )
}
