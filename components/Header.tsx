import { signOut } from '@/auth'
import SignIn from './SignIn'
import type { User } from 'next-auth'

export default function Header({ user }: { user?: User | null }) {
  return (
    <header className="navbar bg-base-100 shadow-sm flex-col sm:flex-row">
      <div className="flex-1 w-full sm:w-auto">
        <a className="btn btn-ghost text-xl w-full sm:w-auto justify-center sm:justify-start">Posty</a>
      </div>
      <div className="flex-none w-full sm:w-auto">
        {user?.email ? (
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end">
            <span className="hidden sm:inline text-sm truncate max-w-[150px]">{user.email}</span>
            <form
              action={async () => {
                'use server'
                await signOut()
              }}
            >
              <button className="btn btn-ghost btn-sm sm:btn-md">Sign Out</button>
            </form>
          </div>
        ) : (
          <SignIn className="flex-row w-full sm:w-auto justify-center sm:justify-end" />
        )}
      </div>
    </header>
  )
}
