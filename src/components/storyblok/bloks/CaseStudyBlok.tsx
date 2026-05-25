import Image from 'next/image'
import Link from 'next/link'
import {StoryblokServerComponent, storyblokEditable} from '@storyblok/react/rsc'
import type {SbBlokData} from '@storyblok/js'

import {CaseStudyRichText} from '@/components/storyblok/CaseStudyRichText'
import {PlaceholderImage} from '@/components/ui/PlaceholderImage'
import {storyblokAsset} from '@/lib/storyblok/asset'
import {formatDate} from '@/lib/utils/format-date'

type CaseStudyBlokData = SbBlokData & {
  title?: string
  excerpt?: string
  company_name?: string
  hero?: SbBlokData[]
  featured_image?: {filename?: string; alt?: string} | string
  featured_image_alt?: string
  body?: {type?: string; content?: unknown[]}
  stats?: SbBlokData[]
  customer_quote?: SbBlokData[]
  published_at?: string
  reading_time_minutes?: number
}

function isSvg(url: string) {
  return url.toLowerCase().includes('.svg')
}

function estimateReadingTimeFromRichtext(doc: unknown): number {
  if (!doc || typeof doc !== 'object') return 5
  const text = JSON.stringify(doc)
  const words = Math.ceil(text.length / 5)
  return Math.max(1, Math.ceil(words / 220))
}

export default function CaseStudyBlok({blok}: {blok: CaseStudyBlokData}) {
  const title = blok.title ?? ''
  const companyName = blok.company_name ?? title
  const featured = storyblokAsset(blok.featured_image, blok.featured_image_alt ?? '')
  const heroBlok = Array.isArray(blok.hero) && blok.hero[0] ? blok.hero[0] : null
  const published = formatDate(blok.published_at ?? null)
  const readingMinutes =
    typeof blok.reading_time_minutes === 'number' && blok.reading_time_minutes > 0
      ? blok.reading_time_minutes
      : estimateReadingTimeFromRichtext(blok.body)
  const stats = blok.stats ?? []
  const quotes = blok.customer_quote ?? []

  return (
    <main>
      <section className="border-b border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/40">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:gap-12 lg:px-8 lg:py-16">
          <div
            className="flex shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 lg:w-72"
            {...storyblokEditable(blok)}
          >
            {heroBlok ? (
              <StoryblokServerComponent blok={heroBlok} />
            ) : featured?.url ? (
              isSvg(featured.url) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featured.url}
                  alt={featured.alt || `${companyName} logo`}
                  className="max-h-24 w-full object-contain"
                />
              ) : (
                <Image
                  src={featured.url}
                  alt={featured.alt || `${companyName} logo`}
                  width={240}
                  height={96}
                  className="max-h-24 w-auto object-contain"
                />
              )
            ) : (
              <PlaceholderImage text={companyName} className="h-32 w-full rounded-xl" />
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
              {...storyblokEditable(blok)}
            >
              {title}
            </h1>
            <p
              className="mt-4 max-w-2xl text-lg text-slate-600"
              {...storyblokEditable(blok)}
            >
              {blok.excerpt}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="font-medium text-slate-700" {...storyblokEditable(blok)}>
                {companyName}
              </span>
              {published && <span>· Published {published}</span>}
              <span>· {readingMinutes} min read</span>
            </div>
          </div>
        </div>
      </section>

      {stats.length > 0 && (
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {stats.map((stat) => (
              <StoryblokServerComponent blok={stat} key={stat._uid} />
            ))}
          </div>
        </section>
      )}

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {blok.body && <CaseStudyRichText doc={blok.body} />}
        {quotes.length > 0 && (
          <div className="mt-12 space-y-8">
            {quotes.map((quote) => (
              <StoryblokServerComponent blok={quote} key={quote._uid} />
            ))}
          </div>
        )}
      </article>
    </main>
  )
}
