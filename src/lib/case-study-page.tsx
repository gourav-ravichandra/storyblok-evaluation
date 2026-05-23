import {notFound} from 'next/navigation'
import type {Metadata} from 'next'

import {CaseStudyHero} from '@/components/case-studies/CaseStudyHero'
import {CaseStudyQuote} from '@/components/case-studies/CaseStudyQuote'
import {CaseStudyStats} from '@/components/case-studies/CaseStudyStats'
import {PortableTextRenderer} from '@/components/case-studies/PortableTextRenderer'
import {content} from '@/lib/content/adapter'
import type {CaseStudy} from '@/lib/content/types'

const SUPPORTED_LANGUAGES = ['en', 'es', 'fr'] as const
export type CaseStudyLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export function isCaseStudyLanguage(value: string): value is CaseStudyLanguage {
  return SUPPORTED_LANGUAGES.includes(value as CaseStudyLanguage)
}

export async function fetchCaseStudy(
  slug: string,
  language: CaseStudyLanguage = 'en',
): Promise<CaseStudy | null> {
  return content.getCaseStudyBySlug(slug, {language})
}

export function CaseStudyPageView({caseStudy}: {caseStudy: CaseStudy}) {
  return (
    <>
      <CaseStudyHero caseStudy={caseStudy} />
      {caseStudy.stats.length > 0 && <CaseStudyStats stats={caseStudy.stats} />}
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-slate max-w-none">
          <PortableTextRenderer value={caseStudy.body} />
        </div>
        {caseStudy.customerQuote && (
          <div className="mt-12">
            <CaseStudyQuote quote={caseStudy.customerQuote} />
          </div>
        )}
      </article>
    </>
  )
}

export async function renderCaseStudyPage(
  slug: string,
  language: CaseStudyLanguage = 'en',
): Promise<React.ReactNode> {
  const caseStudy = await fetchCaseStudy(slug, language)
  if (!caseStudy) notFound()
  return <CaseStudyPageView caseStudy={caseStudy} />
}

export function buildCaseStudyMetadata(caseStudy: CaseStudy): Metadata {
  return {
    title: caseStudy.seo.metaTitle ?? `${caseStudy.title} | Modulr`,
    description: caseStudy.seo.metaDescription ?? caseStudy.excerpt,
    robots: caseStudy.seo.noindex ? {index: false, follow: false} : undefined,
    openGraph: {
      title: caseStudy.seo.metaTitle ?? caseStudy.title,
      description: caseStudy.seo.metaDescription ?? caseStudy.excerpt,
      images: caseStudy.seo.ogImage
        ? [{url: caseStudy.seo.ogImage.url, alt: caseStudy.seo.ogImage.alt}]
        : caseStudy.featuredImage
          ? [{url: caseStudy.featuredImage.url, alt: caseStudy.featuredImage.alt}]
          : [],
    },
  }
}
