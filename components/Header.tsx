import { signOut } from '@/auth'
import SignIn from './SignIn'
import type { User } from 'next-auth'

export default function Header({ user }: { user?: User | null }) {
  return (
    <header className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Posty</a>
      </div>
      <div className="flex-none">
        {user?.email ? (
          <div className="flex items-center gap-4">
            <span className="text-sm">{user.email}</span>
            <form
              action={async () => {
                'use server'
                await signOut()
              }}
            >
              <button className="btn btn-ghost">Sign Out</button>
            </form>
          </div>
        ) : (
          <SignIn className="flex-row" />
        )}
      </div>
    </header>
  )
}
