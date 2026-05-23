interface Quote {
  quote: string
  attributionName: string
  attributionRole: string
}

export function CaseStudyQuote({quote}: {quote: Quote}) {
  return (
    <blockquote className="relative rounded-2xl border border-blue-100 bg-blue-50/60 p-8">
      <span
        aria-hidden
        className="absolute left-6 top-4 text-6xl leading-none text-blue-200"
      >
        “
      </span>
      <p className="relative z-10 text-lg italic leading-relaxed text-slate-800">
        {quote.quote}
      </p>
      <footer className="relative z-10 mt-6 border-t border-blue-100 pt-4">
        <cite className="not-italic">
          <span className="block font-semibold text-slate-900">{quote.attributionName}</span>
          <span className="text-sm text-slate-600">{quote.attributionRole}</span>
        </cite>
      </footer>
    </blockquote>
  )
}
