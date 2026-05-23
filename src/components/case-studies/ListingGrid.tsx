'use client'

import {useDeferredValue, useEffect, useMemo, useState} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import {Search} from 'lucide-react'

import type {CaseStudy} from '@/lib/content/types'
import {emptyFilters, filterCaseStudies, type FilterState} from '@/lib/content/search'
import {CaseStudyCard} from './CaseStudyCard'

interface Props {
  caseStudies: CaseStudy[]
}

export function ListingGrid({caseStudies}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...emptyFilters(),
    query: searchParams.get('q') ?? '',
  }))

  const deferredQuery = useDeferredValue(filters.query)

  useEffect(() => {
    const params = new URLSearchParams()
    if (deferredQuery) params.set('q', deferredQuery)
    const newUrl = params.toString() ? `?${params.toString()}` : '/case-studies'
    router.replace(newUrl, {scroll: false})
  }, [deferredQuery, router])

  const filtered = useMemo(
    () => filterCaseStudies(caseStudies, {...filters, query: deferredQuery}),
    [caseStudies, filters, deferredQuery],
  )

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search case studies..."
            value={filters.query}
            onChange={(event) => setFilters((current) => ({...current, query: event.target.value}))}
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <p className="whitespace-nowrap text-sm text-slate-500">
          {filtered.length} of {caseStudies.length}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-12 text-center">
          <p className="text-slate-600">No case studies match your search.</p>
          <button
            type="button"
            onClick={() => setFilters(emptyFilters())}
            className="mt-2 text-sm font-medium text-blue-600 hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((caseStudy) => (
            <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} />
          ))}
        </div>
      )}
    </div>
  )
}
