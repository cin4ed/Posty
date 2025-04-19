import clsx from 'clsx'
import Link from 'next/link'
import { HomeIcon, MagnifyingGlassIcon, BellIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

export default function MobileBottomNavBar({ className }: { className?: string }) {
  return (
    <div className={clsx('dock md:hidden', className)}>
      <Link href="/">
        <HomeIcon className="h-7 w-7" />
      </Link>
      <Link href="/">
        <MagnifyingGlassIcon className="h-7 w-7" />
      </Link>
      <Link href="/">
        <BellIcon className="h-7 w-7" />
      </Link>
      <Link href="/">
        <EnvelopeIcon className="h-7 w-7" />
      </Link>
    </div>
  )
}
