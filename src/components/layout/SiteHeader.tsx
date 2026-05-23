import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-brand">
          Modulr
        </Link>
        <nav>
          <Link
            href="/case-studies"
            className="text-sm font-medium text-slate-700 hover:text-brand"
          >
            Case studies
          </Link>
        </nav>
      </div>
    </header>
  )
}
