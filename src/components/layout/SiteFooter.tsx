export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm text-slate-600">
          © {new Date().getFullYear()} Modulr. Resource Centre · powered by Storyblok.
        </p>
      </div>
    </footer>
  )
}
