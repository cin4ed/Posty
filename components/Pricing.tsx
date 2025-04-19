'use client'

import { useState } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { CheckIcon } from './CheckIcon'

export const plans = {
  monthly: {
    link: process.env.NODE_ENV === 'development' ? 'https://buy.stripe.com/test_cN2aF6aTg48s86c9AC' : '',
    priceId: process.env.NODE_ENV === 'development' ? 'price_1RBmwDK1AC1xWavseSCFpk0S' : '',
    monthlyPrice: 10,
    duration: '/month',
  },
  yearly: {
    link: process.env.NODE_ENV === 'development' ? 'https://buy.stripe.com/test_3cs4gI6D06gA1HOcMP' : '',
    priceId: process.env.NODE_ENV === 'development' ? 'price_1RBn36K1AC1xWavsrCHIZuEa' : '',
    monthlyPrice: 5,
    duration: '/yearly',
  },
}
price_1RBmwDK1AC1xWavseSCFpk0S

export default function Pricing({ className }: { className?: string }) {
  const [isYearly, setIsYearly] = useState(true)
  const plan = isYearly ? plans.yearly : plans.monthly
  const { data: session } = useSession()
  return (
    <div className={clsx('flex flex-col items-center gap-8 border border-accent rounded-box', className)}>
      <div className="card w-full md:w-96 bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex justify-between h-14">
            <div className="flex flex-col">
              <h2 className="text-3xl font-bold">Premium</h2>
              <span className="text-sm text-base-content/70">{isYearly ? 'Yearly Plan' : 'Monthly Plan'}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl">${plan.monthlyPrice}/month</span>
              {isYearly && <span>${plan.monthlyPrice * 12} Billed Annually</span>}
              {isYearly && <span className="badge mt-1 badge-xs badge-warning">Most Popular</span>}
            </div>
          </div>

          <div className="flex justify-center items-center gap-2 mt-4">
            <span className={clsx('text-sm', !isYearly && 'font-bold')}>Monthly</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={isYearly}
              onChange={(e) => setIsYearly(e.target.checked)}
            />
            <span className={clsx('text-sm', isYearly && 'font-bold')}>Yearly</span>
          </div>

          <ul className="mt-6 flex flex-col gap-2 text-xs">
            <li>
              <CheckIcon />
              <span>Edit your posts</span>
            </li>
            <li>
              <CheckIcon />
              <span>Customizable style templates</span>
            </li>
            <li>
              <CheckIcon />
              <span>Batch processing capabilities</span>
            </li>
            <li>
              <CheckIcon />
              <span>AI-driven image enhancements</span>
            </li>
            <li className="opacity-50">
              <CheckIcon opacity={0.5} />
              <span className="line-through">Seamless cloud integration</span>
            </li>
            <li className="opacity-50">
              <CheckIcon opacity={0.5} />
              <span className="line-through">Real-time collaboration tools</span>
            </li>
          </ul>
          <div className="mt-6">
            {session?.user ? (
              <Link
                target="_blank"
                href={plan.link + '?prefilled_email=' + session.user.email}
                className="btn btn-primary btn-block"
              >
                Subscribe {isYearly ? 'Yearly' : 'Monthly'}
              </Link>
            ) : (
              <Link href="/login" className="btn btn-primary btn-block">
                Login to Subscribe
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
