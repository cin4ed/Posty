import Pricing from '@/components/Pricing'
import { SessionProvider } from 'next-auth/react'

export default function PricingPage() {
  return (
    <>
      <main className="flex-1 container mx-auto p-4 flex flex-col gap-10 justify-center items-center h-full">
        <div className="flex flex-col gap-4 max-w-3xl">
          <h2 className="text-4xl sm:text-6xl font-bold text-center text-primary mb-4 text-balance">
            Go premium and unlock all the features you&apos;ve been waiting for
          </h2>
          <p className="text-lg text-center text-base-content/80">Choose the plan that&apos;s right for you.</p>
        </div>
        <div className="flex flex-col gap-4 max-w-3xl">
          <SessionProvider>
            <Pricing />
          </SessionProvider>
        </div>
      </main>
    </>
  )
}
