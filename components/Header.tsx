import { auth } from '@/auth'
import Link from 'next/link'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

export default async function Header() {
  const session = await auth()
  const isUserLoggedIn = session?.user

  return (
    <header className="navbar border-b border-accent px-4">
      <div className="container mx-auto max-w-5xl flex justify-between items-center">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <PaperAirplaneIcon className="w-6 h-6" />
            <span className="font-semibold">Posty</span>
          </Link>
        </div>
        <div>
          {isUserLoggedIn ? (
            <Link href="/profile">
              <div className="avatar">
                <div className="w-8 rounded ring-primary ring-offset-base-100 ring ring-offset-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    alt="Tailwind-CSS-Avatar-component"
                  />
                </div>
              </div>
            </Link>
          ) : (
            <Link href="/login">
              <button className="btn btn-primary">Login</button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
