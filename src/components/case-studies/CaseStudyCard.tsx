import Link from 'next/link'
import Image from 'next/image'

import type {CaseStudy} from '@/lib/content/types'
import {PlaceholderImage} from '@/components/ui/PlaceholderImage'

function isSvg(url: string) {
  return url.toLowerCase().includes('.svg')
}

export function CaseStudyCard({caseStudy}: {caseStudy: CaseStudy}) {
  const imageAlt = caseStudy.featuredImage?.alt || `${caseStudy.companyName} logo`

  return (
    <Link
      href={`/case-studies/en/${caseStudy.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-lg"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        {caseStudy.featuredImage?.url ? (
          isSvg(caseStudy.featuredImage.url) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={caseStudy.featuredImage.url}
              alt={imageAlt}
              className="absolute inset-0 h-full w-full object-contain p-8 transition group-hover:scale-105"
            />
          ) : (
            <Image
              src={caseStudy.featuredImage.url}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain p-8 transition group-hover:scale-105"
            />
          )
        ) : (
          <PlaceholderImage text={caseStudy.companyName} className="absolute inset-0" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        {caseStudy.taxonomy.industries.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {caseStudy.taxonomy.industries.slice(0, 2).map((industry) => (
              <span
                key={industry}
                className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
              >
                {industry}
              </span>
            ))}
          </div>
        )}

        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-slate-900 group-hover:text-blue-600">
          {caseStudy.title}
        </h3>

        <p className="mb-4 line-clamp-3 flex-1 text-sm text-slate-600">{caseStudy.excerpt}</p>

        {caseStudy.stats.length > 0 && (
          <div className="border-t border-slate-100 pt-4">
            <p className="text-2xl font-bold text-slate-900">{caseStudy.stats[0].value}</p>
            <p className="text-xs text-slate-500">{caseStudy.stats[0].label}</p>
          </div>
        )}
      </div>
    </Link>
  )
}
