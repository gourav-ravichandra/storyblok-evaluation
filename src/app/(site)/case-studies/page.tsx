import {Suspense} from 'react'
import type {Metadata} from 'next'

import {ListingGrid} from '@/components/case-studies/ListingGrid'
import {content} from '@/lib/content/adapter'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Case Studies | Modulr',
  description:
    "Explore Modulr's case studies to see how businesses across industries are streamlining payments, reducing costs, and unlocking growth.",
}

function ListingFallback() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({length: 6}).map((_, index) => (
        <div key={index} className="h-80 animate-pulse rounded-xl bg-slate-100" />
      ))}
    </div>
  )
}

export default async function CaseStudiesPage() {
  const caseStudies = await content.getAllCaseStudies()

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Case studies
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          See how businesses across industries are streamlining payments, reducing costs, and
          unlocking growth with Modulr.
        </p>
      </header>

      <Suspense fallback={<ListingFallback />}>
        <ListingGrid caseStudies={caseStudies} />
      </Suspense>
    </div>
  )
}
