import { signIn } from '@/auth'

export default function SignIn() {
  return (
    <form
      action={async (formData) => {
        'use server'
        await signIn('resend', formData)
      }}
    >
      <input type="email" name="email" placeholder="Email" />
      <button type="submit">Sign in</button>
    </form>
  )
}
