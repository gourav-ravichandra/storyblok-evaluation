import {cn} from '@/lib/utils/cn'

interface Props {
  text?: string
  className?: string
}

export function PlaceholderImage({text, className}: Props) {
  const initials = (text ?? 'M').slice(0, 2).toUpperCase()

  return (
    <div
      className={cn(
        'flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200',
        className,
      )}
    >
      <span className="text-3xl font-bold text-blue-700/40">{initials}</span>
    </div>
  )
}
