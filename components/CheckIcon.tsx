import clsx from 'clsx'

interface CheckIconProps {
  className?: string
  opacity?: number
}

export function CheckIcon({ className, opacity = 1 }: CheckIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={clsx('size-4 me-2 inline-block', opacity === 1 ? 'text-success' : 'text-base-content/50', className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      style={{ opacity }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  )
}
