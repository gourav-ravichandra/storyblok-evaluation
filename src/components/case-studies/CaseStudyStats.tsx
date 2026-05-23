interface Stat {
  value: string
  label: string
}

export function CaseStudyStats({stats}: {stats: Stat[]}) {
  if (stats.length === 0) return null

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <article
            key={`${stat.value}-${stat.label}`}
            className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center"
          >
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
