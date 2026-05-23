interface Props {
  children: React.ReactNode
  className?: string
}

export function Badge({children, className}: Props) {
  return (
    <span
      className={`rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ${className ?? ''}`}
    >
      {children}
    </span>
  )
}
