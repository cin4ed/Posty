import { signIn } from '@/auth'
import { clsx } from 'clsx'

export default function SignIn({ className }: { className?: string }) {
  return (
    <form
      className={clsx('flex flex-col gap-2', className)}
      action={async (formData) => {
        'use server'
        await signIn('resend', formData)
      }}
    >
      <input required className="input input-bordered w-full max-w-xs" type="email" name="email" placeholder="Email" />
      <button className="btn btn-primary" type="submit">
        Sign in
      </button>
    </form>
  )
}
