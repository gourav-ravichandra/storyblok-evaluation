import Image from 'next/image'
import Link from 'next/link'

import type {CaseStudy} from '@/lib/content/types'
import {PlaceholderImage} from '@/components/ui/PlaceholderImage'
import {formatDate} from '@/lib/utils/format-date'

function isSvg(url: string) {
  return url.toLowerCase().includes('.svg')
}

import type {EditableAttrs} from '@/lib/storyblok-preview'

interface Props {
  caseStudy: CaseStudy
  editable?: {
    featuredImage?: EditableAttrs
    title?: EditableAttrs
    excerpt?: EditableAttrs
    companyName?: EditableAttrs
  }
}

export function CaseStudyHero({caseStudy, editable}: Props) {
  const logo = caseStudy.companyLogo ?? caseStudy.featuredImage
  const logoAlt = logo?.alt || `${caseStudy.companyName} logo`
  const published = formatDate(caseStudy.publishedAt)

  return (
    <section className="border-b border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/40">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:gap-12 lg:px-8 lg:py-16">
        <div
          className="flex shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 lg:w-72"
          {...(editable?.featuredImage ?? {})}
        >
          {logo?.url ? (
            isSvg(logo.url) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo.url} alt={logoAlt} className="max-h-24 w-full object-contain" />
            ) : (
              <Image
                src={logo.url}
                alt={logoAlt}
                width={240}
                height={96}
                className="max-h-24 w-auto object-contain"
              />
            )
          ) : (
            <PlaceholderImage text={caseStudy.companyName} className="h-32 w-full rounded-xl" />
          )}
        </div>

        <div className="flex-1">
          <Link
            href="/case-studies"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← All case studies
          </Link>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-blue-600">
            Case study
          </p>
          <h1
            className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            {...(editable?.title ?? {})}
          >
            {caseStudy.title}
          </h1>
          <p
            className="mt-4 max-w-2xl text-lg text-slate-600"
            {...(editable?.excerpt ?? {})}
          >
            {caseStudy.excerpt}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span className="font-medium text-slate-700" {...(editable?.companyName ?? {})}>
              {caseStudy.companyName}
            </span>
            {published && <span>· Published {published}</span>}
            <span>· {caseStudy.readingTimeMinutes} min read</span>
          </div>
        </div>
      </div>
    </section>
  )
}
